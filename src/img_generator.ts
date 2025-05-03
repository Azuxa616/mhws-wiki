import * as puppeteer from 'puppeteer-core'
import * as path from 'path'
import * as fs from 'fs'

//通过怪物数据生成图片
const outputPath=``

async function htmlToImage(ChromePath: string, htmlContent: string, outputPath: string) {
  // 寻找可用的Chrome路径
  let executablePath = null
  if(fs.existsSync(ChromePath)){
    executablePath = ChromePath
  }else{
    console.log(ChromePath)
    console.log(fs.existsSync(ChromePath))
  }

  //找不到路径抛出异常
  if (!executablePath) {
    throw new Error('找不到Chrome可执行文件，请在配置中指定正确的路径')
  }

  // 启动浏览器，指定executablePath
  const browser = await puppeteer.launch({
    executablePath,
    headless: true, // 使用无头模式
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // 直接渲染HTML内容
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0', // 等待所有资源加载完成
  });
  
  // 截图保存为图片
  const imageBuffer = await page.screenshot({
    path: outputPath,
    fullPage: true, // 截取完整页面
    type: 'png'
  });
  
  await browser.close();
  return imageBuffer;
}
//生成怪物卡片
export async function formatMonsterDataToImage(ChromePath: string, monsterData?: any) {
  const outputDir = path.resolve('data/mhws-wiki/pic');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'monster_card.png');
  
  try {
    // 如果传入了怪物数据，则根据数据生成HTML
    let htmlContent = null;
    if (monsterData) {
      htmlContent = generateMonsterHtml(monsterData);
    }
    
    // 生成图片
    const imageBuffer = await htmlToImage(ChromePath, htmlContent, outputPath);
    return imageBuffer;
  } catch (error) {
    console.error('生成图片时出错:', error);
    throw error;
  }
}


// 根据怪物数据生成HTML内容
function generateMonsterHtml(monsterData: any): string {
  const name = monsterData.name || '未知怪物';
  const description = monsterData.description || '';
  const baseData = monsterData.base_data || {};
  
  // 获取怪物头像
  let avatar_img = '';
  try {
    // 从monster_list.json中读取怪物数据
    const monsterListPath = path.resolve('data/mhws-wiki/monster_list.json');
    if (fs.existsSync(monsterListPath)) {
      const monsterListData = JSON.parse(fs.readFileSync(monsterListPath, 'utf8'));
      // 查找当前怪物的数据
      const monsterInfo = monsterListData.find((monster: any) => monster.name === name);
      if (monsterInfo && monsterInfo.image) {
        avatar_img = monsterInfo.image;
      }
    }
  } catch (error) {
    console.error('获取怪物头像失败:', error);
  }
  
  // 处理弱点部位数据
  let hitzoneRows = '';
  if (monsterData.hitzone_data && monsterData.hitzone_data.length > 0) {
    // 过滤掉列1包含"伤口"或"弱点"的行，以及列1为空的行中最多保留4个主要部位
    const mainParts = monsterData.hitzone_data
      .filter(hz => !hz.列1 || (hz.列1 !== '伤口' && hz.列1 !== '弱点' && hz.列1 !== 'State_1'))
      .slice(0, 4);
      
    hitzoneRows = mainParts.map(hz => `
      <tr>
        <td>${hz.部位 || ''}</td>
        <td>${hz.列2 || '0'}</td>
        <td>${hz.列3 || '0'}</td>
        <td>${hz.列4 || '0'}</td>
        <td>${hz.列5 || '0'}</td>
        <td>${hz.列6 || '0'}</td>
        <td>${hz.列7 || '0'}</td>
        <td>${hz.列8 || '0'}</td>
        <td>${hz.列9 || '0'}</td>
        <td>${hz.列10 || '0'}</td>
      </tr>
    `).join('');
  }
  
  // 处理状态异常数据
  let statusRows = '';
  if (monsterData.status_effects && monsterData.status_effects.length > 0) {
    // 只显示前5个状态异常
    const mainStatus = monsterData.status_effects.slice(0, 5);
    
    statusRows = mainStatus.map(status => `
      <tr>
        <td>${status.状态 || ''}</td>
        <td>${status.BuildUp || ''}</td>
        <td>${status.Damage || '0'}</td>
        <td>${status.Decay || ''}</td>
      </tr>
    `).join('');
  }
  
  // 处理素材掉落数据
  let materialItems = '';
  if (monsterData.materials && monsterData.materials.length > 0) {
    // 过滤出掉落率较高的素材（最多999个）
    const mainMaterials = monsterData.materials
      .filter(m => m.rate && !isNaN(parseInt(m.rate)))
      .sort((a, b) => {
        const rateA = parseInt(a.rate);
        const rateB = parseInt(b.rate);
        return rateB - rateA;
      })
      .slice(0, 999);
      
    materialItems = mainMaterials.map(mat => `
      <div class="material-item">
        <div class="material-name">${mat.name || ''}</div>
        <div class="material-desc">${mat.description || ''}</div>
        <div class="material-rate">${mat.rate || ''}</div>
      </div>
    `).join('');
  }
  
  // 生成完整的HTML
  return `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - 魔物图鉴</title>
    <style>
        :root {
            --main-color: #333;
            --accent-color: #721c24;
            --bg-color: #f8f9fa;
            --card-bg: #fff;
            --border-color: #ddd;
        }
        
        body {
            font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
            background-color: var(--bg-color);
            margin: 0;
            padding: 20px;
            color: var(--main-color);
            width: 900px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        
        .card {
            background-color: var(--card-bg);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .card-header {
            background-color: var(--accent-color);
            color: white;
            padding: 15px 20px;
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .card-body {
            padding: 20px;
        }
        
        .head-box {
            display: flex;
            margin-bottom: 20px;
        }
        
        .avatar {
            width: 80px;
            height: 80px;
            margin-right: 20px;
            flex-shrink: 0;
        }
        
        .avatar img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 4px;
        }
        
        .description {
            flex: 1;
            line-height: 1.6;
            text-align: justify;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .materials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .material-item {
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 10px;
        }
        
        .material-name {
            font-weight: bold;
        }
        
        .material-rate {
            color: var(--accent-color);
            font-weight: bold;
        }
        
        .hitzone-table {
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 基本信息卡片 -->
        <div class="card">
            <div class="card-header">${name}</div>
            <div class="card-body">
                <div class="head-box">
                    <div class="avatar">
                        <img id="avatar" src=${avatar_img} alt="">
                    </div>
                    <div class="description">
                        ${description}
                    </div>
                </div>
                
                <table>
                    <tr>
                        <th>种类</th>
                        <td>${baseData['Species'] || ''}</td>
                    </tr>
                    <tr>
                        <th>基础生命值</th>
                        <td>${baseData['BaseHealth'] || ''}</td>
                    </tr>
                    <tr>
                        <th>猎人等级点数</th>
                        <td>${baseData['HunterRankPoint'] || ''}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <!-- 弱点部位卡片 -->
        <div class="card">
            <div class="card-header">弱点部位</div>
            <div class="card-body">
                <div class="hitzone-table">
                    <table>
                        <tr>
                            <th>部位</th>
                            <th><img alt="斩击" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/hit_slash.png" style="color: transparent;"></th>
                            <th><img alt="锤击" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/hit_strike.png"></th>
                            <th><img alt="远程" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/hit_shell.png"></th>
                            <th><img alt="火" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/element_fire.png"></th>
                            <th><img alt="水" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/element_water.png"></th>
                            <th><img alt="雷" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/element_thunder.png"></th>
                            <th><img alt="冰" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/element_ice.png"></th>
                            <th><img alt="龙" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/element_dragon.png"></th>
                            <th><img alt="击晕" loading="lazy" width="16" height="16" decoding="async" data-nimg="1" class="w-4 h-4 inline-block " style="color:transparent" src="https://cdn.kiranico.net/file/kiranico/mhrise-web/images/ui/element_stun.png"></th>
                        </tr>
                        ${hitzoneRows}
                    </table>
                </div>
            </div>
        </div>
        
        <!-- 状态异常卡片 -->
        <div class="card">
            <div class="card-header">状态异常有效性</div>
            <div class="card-body">
                <table>
                    <tr>
                        <th>状态</th>
                        <th>累积值</th>
                        <th>伤害</th>
                        <th>衰减</th>
                    </tr>
                    ${statusRows}
                </table>
            </div>
        </div>
        
        <!-- 素材掉落卡片 -->
        <div class="card">
            <div class="card-header">素材掉落</div>
            <div class="card-body">
                <div class="materials-grid">
                    ${materialItems}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
} 
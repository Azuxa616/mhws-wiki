import { Context, Schema, Command, h } from 'koishi'
import * as path from 'path'
import * as fs from 'fs'
import { runCrawler } from './crawler_runner'
import { getMonsterData } from './data_loader'
import { formatMonsterData, formatMonsterDataToImage } from './reply_generator'

// 扩展Context类型
declare module 'koishi' {
  interface Context {
    canvas?: any // 使用any类型以兼容不同的canvas实现
  }
}

export const name = 'mhws-wiki'

export interface Config {
  pythonPath: string
  dataDir: string
  replyMode: 'text' | 'pic'
}

export const Config: Schema<Config> = Schema.object({
  pythonPath: Schema.string().default('python').description('Python可执行文件路径，默认为"python"'),
  dataDir: Schema.string().default('data/mhws-wiki').description('数据保存目录，相对于koishi主目录'),
  replyMode:Schema.union([
    Schema.const('text').description("文字回复"),
    Schema.const('pic').description("图片回复（实验性）")
  ]).default('text')
})

// 声明插件依赖
export const inject = {
  required: [] as const,
  optional: ['canvas'] as const
}

export function apply(ctx: Context, config: Config) {
  // 初始化数据目录
  const pluginDir = path.resolve(__dirname)
  const crawlerDir = path.join(pluginDir, 'crawler')
  // 使用绝对路径，相对于koishi主目录
  const dataDir = path.resolve(path.join(ctx.baseDir, config.dataDir))
  const replyMode = config.replyMode

  // 检查数据目录是否存在
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // 检查Python爬虫文件是否存在
  const crawlerPath = path.join(crawlerDir, 'koishi_crawler.py')
  if (!fs.existsSync(crawlerPath)) {
    ctx.logger('mhws-wiki').error(`爬虫文件不存在: ${crawlerPath}`)
  }
  
  // 注册命令
  ctx.command('mhws.crawl', '从魔物猎人Wilds官方网站爬取数据')
    .option('monster', '-m <name:string> 爬取特定怪物数据')
    .option('all', '-a 爬取所有怪物数据')
    .action(async ({ options }) => {
      const { monster, all } = options
      
      if (!monster && !all) {
        return '请指定要爬取的怪物名称(-m <n>)或使用 -a 爬取所有怪物'
      }
      
      try {
        const result = await runCrawler(config.pythonPath, crawlerPath, dataDir, { monster, all })
        return result
      } catch (error) {
        ctx.logger('mhws-wiki').error(`爬虫执行失败: ${error}`)
        return `爬虫执行失败: ${error}`
      }
    })
  
  // 在启动时检查canvas服务
  if (replyMode === 'pic') {
    if (!ctx.canvas) {
      ctx.logger('mhws-wiki').warn('图片回复模式开启但canvas服务不可用，将使用文本回复')
    } else {
      // 检查canvas服务是否符合预期
      try {
        if (
          !ctx.canvas.createCanvas || 
          (typeof ctx.canvas.createCanvas !== 'function' && typeof ctx.canvas !== 'function')
        ) {
          ctx.logger('mhws-wiki').warn('canvas服务接口不符合预期，可能无法正常使用图片回复模式')
        }
      } catch (error) {
        ctx.logger('mhws-wiki').warn(`检查canvas服务时出错: ${error}`)
      }
    }
  }
  
  // 注册查询命令
  ctx.command('mhws.monster <name:string>', '查询魔物猎人Wilds怪物数据')
    .action(async (_, name) => {
      if (!name) {
        return '请指定要查询的怪物名称'
      }
      
      try {
        const monsterData = await getMonsterData(name, dataDir)
        if (!monsterData) {
          return `未找到怪物: ${name}`
        }
        
        // 根据配置选择回复模式
        if (replyMode === 'pic') {
          try {
            // 检查canvas服务是否可用
            if (!ctx.canvas) {
              ctx.logger('mhws-wiki').warn('图片回复模式开启但canvas服务不可用，将使用文本回复')
              return formatMonsterData(monsterData)
            }
            
            // 生成图片并返回
            try {
              const image = await formatMonsterDataToImage(monsterData, ctx)
              if (Buffer.isBuffer(image)) {
                return h.image(image, 'image/png')
              } else {
                ctx.logger('mhws-wiki').warn('图片生成未返回正确的Buffer，将使用文本回复')
                return formatMonsterData(monsterData)
              }
            } catch (imageError) {
              ctx.logger('mhws-wiki').error(`生成图片时出错: ${imageError}`)
              // 图片生成失败时回退到文本模式
              return formatMonsterData(monsterData)
            }
          } catch (error) {
            ctx.logger('mhws-wiki').error(`图片回复出错: ${error}`)
            // 出错时回退到文本模式
            return formatMonsterData(monsterData)
          }
        } else {
          // 文本模式
          return formatMonsterData(monsterData)
        }
      } catch (error) {
        ctx.logger('mhws-wiki').error(`查询怪物数据时出错: ${error}`)
        return '查询怪物数据时出错，请检查日志'
      }
    })
}



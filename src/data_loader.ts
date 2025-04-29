import * as fs from 'fs'
import * as path from 'path'

// 获取怪物数据
export async function getMonsterData(name: string, dataDir: string): Promise<any> {
    // 读取怪物列表文件
    const listPath = path.join(dataDir, 'monster_list.json')
    
    if (!fs.existsSync(listPath)) {
      throw new Error('怪物列表数据不存在，请先运行爬虫')
    }
    
    const monsterList = JSON.parse(fs.readFileSync(listPath, 'utf-8'))
    
    // 查找匹配的怪物
    const monster = monsterList.find((m) => m.name.includes(name))
    
    if (!monster) {
      return null
    }
    
    // 读取怪物详细数据
    const monsterPath = path.join(dataDir, `${monster.name}.json`)
    
    if (!fs.existsSync(monsterPath)) {
      throw new Error(`怪物详细数据不存在: ${monster.name}`)
    }
    
    return JSON.parse(fs.readFileSync(monsterPath, 'utf-8'))
  }
  
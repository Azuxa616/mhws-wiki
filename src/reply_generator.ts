//

//定义怪物列表子项接口
interface Monster {
  imge: string
  name: string
  url: string
  description: string
}

//格式化怪物列表为文字信息
export function formatMonsterList(monsterList:Monster[]):string{
  let res = `【怪物列表】\n`

  if(!monsterList){
    return `未找到怪物列表`
  }
  let count=1
  for(const monster of monsterList){
    
    res += `${count}. ${monster.name}\n`
    count++
    
  }
  return res
}

// 格式化怪物数据为文字消息
export function formatMonsterData(monster: any): string {
    let result = `【${monster.name}】\n`
    
    if (monster.description) {
      result += `描述: ${monster.description}\n\n`
    }
    
    if (monster.base_data) {
      result += '【基础数据】\n'
      for (const [key, value] of Object.entries(monster.base_data)) {
        result += `${key}: ${value}\n`
      }
      result += '\n'
    }
    
    if (monster.hitzone_data && monster.hitzone_data.length) {
      result += '【弱点数据】\n'
      for (const hitzone of monster.hitzone_data) {
        // 将所有列固定宽度，实现对齐效果
        const column0 = hitzone.部位 || '';
        const paddedColumn0 = column0.padEnd(4, ' ');
        
        const column1 = hitzone.列1?`(${hitzone.列1})` : '      ';
        const paddedColumn1 = column1.padEnd(5, ' ');
        
        const column2 = hitzone.列2 || '?';
        const paddedColumn2 = column2.padEnd(4, ' ');
        
        const column3 = hitzone.列3 || '?';
        const paddedColumn3 = column3.padEnd(4, ' ');
        
        const column4 = hitzone.列4 || '?';
        const paddedColumn4 = column4.padEnd(4, ' ');
        
        const column5 = hitzone.列5 || '?';
        const paddedColumn5 = column5.padEnd(3, ' ');
        
        const column6 = hitzone.列6 || '?';
        const paddedColumn6 = column6.padEnd(3, ' ');
        
        const column7 = hitzone.列7 || '?';
        const paddedColumn7 = column7.padEnd(3, ' ');
        
        const column8 = hitzone.列8 || '?';
        const paddedColumn8 = column8.padEnd(3, ' ');
        
        const column9 = hitzone.列9 || '?';
        const paddedColumn9 = column9.padEnd(3, ' ');
        
        const column10 = hitzone.列10 || '?';
        
        result += `${paddedColumn0}  ${paddedColumn1}  斩击${paddedColumn2}钝击${paddedColumn3}弹吸收${paddedColumn4}火${paddedColumn5}水${paddedColumn6}雷${paddedColumn7}冰${paddedColumn8}龙${paddedColumn9}晕眩${column10}\n`
      }
      result += '\n'
    }
    
    if (monster.materials && monster.materials.length) {
      result += '【素材掉落】\n'
      for (const material of monster.materials) {
        result += `${material.name}: ${material.description} (${material.rate})\n`
      }
    }
    
    return result
  }


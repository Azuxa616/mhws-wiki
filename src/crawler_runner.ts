import { spawn } from 'child_process'
// 运行Python爬虫
export function runCrawler(pythonPath: string, crawlerPath: string, dataDir: string, options: { monster?: string, all?: boolean }): Promise<string> {
    return new Promise((resolve, reject) => {
      let args = [crawlerPath, '--data-dir', dataDir]
      
      if (options.monster) {
        args.push('--monster', options.monster)
      } else if (options.all) {
        args.push('--all')
      }
      
      // 创建子进程运行Python脚本
      const process = spawn(pythonPath, args)
      
      let output = ''
      let errorOutput = ''
      
      process.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      process.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(`爬虫执行成功！\n${output}`)
        } else {
          reject(`爬虫执行失败，退出码: ${code}\n${errorOutput}`)
        }
      })
      
      process.on('error', (err) => {
        reject(`启动爬虫失败: ${err.message}`)
      })
    })
  }
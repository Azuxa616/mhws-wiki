# Koishi 魔物猎人：荒野 Wiki 插件

一个魔物猎人：荒野(Monster Hunter Wilds)的Wiki资料查询插件，内置Python爬虫工具，可以从官方Wiki站点采集怪物数据。

## 功能

- 从官方网站爬取怪物数据
- 查询怪物的基础信息、弱点部位、素材掉落等数据

## 前置要求

1. **Python环境**：需要Python 3.7+
2. **Python依赖**：
   - requests
   - beautifulsoup4
   
   可以通过运行以下命令安装依赖：
   ```
   pip install requests beautifulsoup4
   ```

## 使用方法

### 安装插件

```
npm i koishi-plugin-mhws-wiki
```

### 爬取数据

首次使用需要爬取数据，可以通过以下命令：

- 爬取全部怪物数据：
  ```
  mhws.crawl -a
  ```

- 爬取指定怪物数据：
  ```
  mhws.crawl -m 雌火龙
  ```

### 查询怪物数据

```
mhws.monster 雌火龙
```

## 配置项

- **pythonPath**: Python可执行文件路径，默认为 `python`
- **dataDir**: 数据保存目录，相对于Koishi主目录，默认为 `data/mhws-wiki`

## 常见问题

1. **爬虫执行失败**：
   - 确认Python环境是否正确安装
   - 确认是否已安装所需的Python依赖
   - 检查网络连接是否正常

2. **怪物数据不存在**：
   - 确认是否已经成功运行过爬虫
   - 尝试重新运行爬虫命令

## 开发者信息

本插件由Koishi社区开发，基于魔物猎人：荒野官方Wiki数据。

## 许可证

MIT

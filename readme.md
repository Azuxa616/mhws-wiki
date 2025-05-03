# Koishi 怪物猎人：荒野 Wiki 插件

一个基于Koishi平台的怪物猎人：荒野(Monster Hunter Wilds)的Wiki资料查询插件，内置Python爬虫工具，可以从Wiki站点采集怪物数据。

## 功能

- 从Wiki网站爬取**怪物列表**和**怪物数据**
- 查询怪物的基础信息、弱点部位、素材掉落等数据
- 支持多种回复模式，包括图片和文本

## 注意事项
- 本插件目前***仅适配QQ平台***，其他平台暂未适配，不保证通用性
- 本插件基于Python爬虫工具，**需要安装Python环境和相关依赖**
- 首次使用前需要**手动配置Chorme浏览器可执行文件路径**（Chromium内核浏览器皆可使用，包括*Google Chrome、Microsoft Edge、Opera、Vivaldi、Brave*，不建议使用*360安全浏览器*、*QQ浏览器*和*UC浏览器*等**混合内核**的浏览器）
- 首次查询前需要**使用爬虫命令手动爬取数据**，数据保存在本地，之后无需再次爬取
- 爬虫是否成功取决于网络连接和服务器响应时间 
- 数据不与网站数据保持同步，网站数据更新后需要**重新爬取数据**
- 请**不要频繁使用爬虫命令**，以免对Wiki网站服务器造成压力
- 请不要更改**爬虫命令的权限值**
- 查询命令**暂不支持模糊查询**，请使用完整的中文名称查询（可先查询列表，后复制名称）

## 前置要求

1. **Python环境**：需要Python 3.7+
2. **Python依赖**：
   - requests
   - beautifulsoup4
   
   可以通过运行以下命令安装依赖：
   ```
   pip install -r requirements.txt
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
  mhws crawl -a
  ```

- 爬取指定怪物数据：
  ```
  mhws crawl -m 雌火龙
  ```
### 查询怪物列表
例：
```
mhws list
```
该部分仅支持文字回复（方便复制怪物名称）

### 查询怪物数据

例：
```
mhws monster 雌火龙
```

## 配置项

- **pythonPath**: Python可执行文件路径，默认为 `python`
- **dataDir**: 数据保存目录，相对于Koishi主目录，默认为 `data/mhws-wiki`
- **replyMode**: 回复模式，可选值为 `card` 和 `text`，默认为 `card`
- **chormePath**: Chrome浏览器可执行文件路径，用于puppeteer无头浏览器的截屏操作，***无默认值，需要手动配置***
## 常见问题

1. **爬虫执行失败**：
   - 确认Python环境是否正确安装
   - 确认是否已安装所需的Python依赖
   - 检查网络连接是否正常

2. **怪物数据不存在**：
   - 确认是否已经成功运行过爬虫
   - 尝试重新运行爬虫命令

## 开发者信息

- 本插件基于 怪物猎人：荒野 民间Wiki数据源：https://mhwilds.kiranico.com/ 开发
- Author：Azuxa616 Github：https://github.com/Azuxa616
- 感谢 *kiranico Wiki社区* 提供的Wiki网站数据

## 许可证

MIT

# @deepgis/node-mbtiles

[![npm version](https://img.shields.io/npm/v/@deepgis/node-mbtiles?color=red)](https://npmjs.com/package/@deepgis/node-mbtiles)
[![npm downloads](https://img.shields.io/npm/dm/@deepgis/node-mbtiles?color=yellow)](https://npm.chart.dev/vue)

一个用于读写MBTiles格式地图瓦片数据库的Node.js库。

## 功能特性

- 支持读取和写入MBTiles文件
- 提供基本的瓦片操作接口：
  - `getTile(z, x, y)` - 获取指定坐标的瓦片
  - `putTile(z, x, y, data)` - 写入瓦片数据
- 支持元数据操作：
  - `getInfo()` - 获取元数据信息
  - `putInfo(data)` - 写入元数据
- 使用`node:sqlite`访问数据库(这要求Node.js版本 >= 22.5)
- 支持TMS瓦片坐标系

## 安装

使用pnpm安装：

```bash
pnpm add @deepgis/node-mbtiles
```

## 使用示例

```ts
import { MBTiles } from '@deepgis/node-mbtiles';

// 打开MBTiles文件
const mbtiles = new MBTiles('path/to/database.mbtiles');

// 获取元数据
const info = mbtiles.getInfo();
console.log(info);

// 获取瓦片
const tile = mbtiles.getTile(1, 1, 1);

// 写入瓦片
await mbtiles.putTile(1, 1, 1, tileData);

// 关闭数据库
mbtiles.close();
```

## 开发

1. 克隆仓库

```bash
git clone https://github.com/me9rez/node-mbtiles.git
```

2. 安装依赖

```bash
pnpm install
```

3. 运行测试

```bash
pnpm test
``` 

## 技术栈

- TypeScript
- SQLite
- Vitest




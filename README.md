# @deepgis/node-mbtiles

[![npm version](https://img.shields.io/npm/v/@deepgis/node-mbtiles?color=red)](https://npmjs.com/package/@deepgis/node-mbtiles)
[![npm downloads](https://img.shields.io/npm/dm/@deepgis/node-mbtiles?color=yellow)](https://npm.chart.dev/@deepgis/node-mbtiles)

一个用于读写MBTiles格式地图瓦片数据库的Node.js库，支持TMS瓦片坐标系，基于Node.js内置的`node:sqlite`模块实现。

## 🚀 功能特性

- 支持读取和写入MBTiles文件
- 提供完整的瓦片操作接口
- 支持元数据的读取和写入
- 使用`node:sqlite`访问数据库（要求Node.js版本 >= 22.5）
- 支持TMS瓦片坐标系
- 提供辅助工具函数计算瓦片面积
- 完全用TypeScript实现，提供类型定义

## 📦 安装

使用pnpm安装：

```bash
pnpm add @deepgis/node-mbtiles
```

使用npm安装：

```bash
npm install @deepgis/node-mbtiles
```

## 📚 核心API文档

### MBTiles类

#### 构造函数
```ts
new MBTiles(location: string, options?: DatabaseSyncOptions)
```
- `location`: MBTiles文件路径
- `options`: 可选的数据库配置选项

#### getInfo()
```ts
getInfo(): Record<string, any>
```
获取MBTiles文件的元数据信息。

返回值：包含元数据的对象，其中会自动添加`scheme: 'tms'`字段。

#### putInfo(data: Record<string, any>)
```ts
putInfo(data: Record<string, any>): void
```
写入元数据信息到MBTiles文件。

- `data`: 包含元数据的对象

#### getTile(z: number, x: number, y: number)
```ts
getTile(z: number, x: number, y: number): Buffer
```
获取指定坐标的瓦片数据。

- `z`: 瓦片层级
- `x`: 瓦片X坐标
- `y`: 瓦片Y坐标（TMS坐标系）

返回值：瓦片数据的Buffer

#### putTile(z: number, x: number, y: number, data: Buffer | string)
```ts
putTile(z: number, x: number, y: number, data: Buffer | string): Promise<[any, any]>
```
写入瓦片数据到MBTiles文件。

- `z`: 瓦片层级
- `x`: 瓦片X坐标
- `y`: 瓦片Y坐标（TMS坐标系）
- `data`: 瓦片数据，可以是Buffer或文件路径字符串

返回值：包含两个数据库操作结果的数组

#### close()
```ts
close(): void
```
关闭数据库连接。

### 工具函数

#### calculateTileArea(zoom: number, tileX: number, tileY: number)
```ts
calculateTileArea(zoom: number, tileX: number, tileY: number): number
```
计算指定瓦片的面积（平方千米）。

- `zoom`: 瓦片层级
- `tileX`: 瓦片X坐标
- `tileY`: 瓦片Y坐标

返回值：瓦片面积（平方千米）

## 🗺️ 瓦片坐标系说明

本库使用TMS（Tile Map Service）瓦片坐标系，与常见的XYZ坐标系的区别在于：

- 在TMS坐标系中，Y轴从南向北递增
- 在XYZ坐标系中，Y轴从北向南递增

本库会自动处理TMS坐标转换，无需手动转换。

## 💻 使用示例

```ts
import { MBTiles, calculateTileArea } from '@deepgis/node-mbtiles';

// 打开MBTiles文件
const mbtiles = new MBTiles('path/to/database.mbtiles');

// 获取元数据
const info = mbtiles.getInfo();
console.log('元数据:', info);

// 设置元数据
mbtiles.putInfo({
  name: 'My Tile Set',
  description: 'A sample tile set',
  version: '1.0.0',
  bounds: '-180,-90,180,90',
  center: '0,0,0'
});

// 获取瓦片
try {
  const tile = mbtiles.getTile(1, 1, 1);
  console.log('瓦片数据长度:', tile.length);
} catch (error) {
  console.error('获取瓦片失败:', error);
}

// 写入瓦片
const tileData = Buffer.from([...]); // 瓦片数据
await mbtiles.putTile(1, 1, 1, tileData);

// 计算瓦片面积
const area = calculateTileArea(10, 512, 512);
console.log('瓦片面积(平方千米):', area);

// 关闭数据库
mbtiles.close();
```

## ⚠️ 错误处理

在使用过程中，建议使用try/catch捕获可能的错误，特别是在获取不存在的瓦片或写入数据时。

## 👨‍💻 开发

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

## 🛠️ 技术栈

- TypeScript
- SQLite (node:sqlite)
- Vitest

## 🔄 兼容性

- 要求Node.js版本 >= 22.5，因为使用了`node:sqlite`模块
- 支持Windows、macOS和Linux系统




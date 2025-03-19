import { assert, beforeAll, describe, it } from "vitest";
import path from "path";
import fs from "fs/promises";
import { glob } from "tinyglobby";
import { MBTiles } from "../dist";

describe("mbtiles read and write test", () => {
    let dbPaths: string[] = [];

    beforeAll( async () => {
        dbPaths = await glob("plain_*.mbtiles", {
            cwd: path.join(import.meta.dirname, "./fixtures"),
            absolute: true,
        });
        console.log(dbPaths);
        const tempPath = path.join(import.meta.dirname, "./fixtures/temp");
        await fs.mkdir(tempPath, { recursive: true });
    });

    it("getInfo", async () => {
        for (const dbPath of dbPaths.slice(0, 1)) {
            console.log(dbPath);
            const db = new MBTiles(dbPath);
            const info = db.getInfo() as object;
            console.log(info);
        }
    });

    it("getTile", async () => {
        for (const dbPath of dbPaths.slice(0, 1)) {
            console.log(dbPath);
            const db = new MBTiles(dbPath);
            const tile = db.getTile(1, 1, 1);
            // console.log(tile);
            await fs.writeFile(
                path.join(import.meta.dirname, "./fixtures/temp", "tile.png"),
                tile,
            );
        }
    });

    it("putTile", async () => {
        for (const dbPath of dbPaths.slice(0, 1)) {
            console.log(dbPath);
            const db = new MBTiles(dbPath);
            const tile = await fs.readFile(
                path.join(import.meta.dirname, "./fixtures/temp", "tile.png"),
            );
            await db.putTile(1, 1, 1, tile);
        }
    });

    it("putInfo", async () => {
        for (const dbPath of dbPaths.slice(0, 1)) {
            console.log(dbPath);
            // 复制数据库
            const dbPath2 = path.join(
                import.meta.dirname,
                "./fixtures/temp/plain_1.mbtiles",
            );
            await fs.copyFile(dbPath, dbPath2);
            const db = new MBTiles(dbPath);
            const db2 = new MBTiles(dbPath2);
            const info = db.getInfo() as object;
            info["test"] = "test";
            db2.putInfo(info);
            const info2 = db2.getInfo() as object;
            console.log(info2);
            assert.deepEqual(info2, info);
        }
    });
});

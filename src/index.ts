import fs from "node:fs/promises";
import path from "node:path";
import { DatabaseSync, type DatabaseSyncOptions } from "node:sqlite";
import { readFileSync } from "fs";
import { createHash } from "crypto";

export class MBTiles {
    _db: DatabaseSync;
    constructor(location: string, options?: DatabaseSyncOptions) {
        this._db = new DatabaseSync(location, options ?? {});
        const scheme = readFileSync(
            path.join(import.meta.dirname, "../sql/schema.sql"),
            {
                encoding: "utf-8",
            },
        );
        this._db.exec(scheme);
    }

    putInfo(data: Record<string, any>) {
        const stmt = this._db.prepare(
            "REPLACE INTO metadata (name, value) VALUES (?, ?)",
        );
        var jsondata: any;
        for (const key in data) {
            const nested = typeof data[key] === "object" &&
                !Array.isArray(data[key]);
            if (nested) {
                jsondata = jsondata || {};
                jsondata = { ...jsondata, ...data[key] };
            } else {
                stmt.run(key, String(data[key]));
            }
        }
        if (jsondata) stmt.run("json", JSON.stringify(jsondata));

        // Ensure scheme in metadata table always be 'tms'
        stmt.run("scheme", "tms");
    }

    getInfo() {
        const stmt = this._db.prepare(
            "SELECT name, value FROM metadata",
        );
        const res = stmt.all() as { name: string; value: string }[];
        const info: Record<string, any> = {};
        for (const row of res) {
            info[row.name] = row.value;
            if (row.name === "json") {
                info[row.name] = JSON.parse(row.value);
            }
            if (row.name === "bounds" || row.name === "center") {
                info[row.name] = row.value.split(",").map(Number);
            }
        }
        info["scheme"] = "tms";
        return info;
    }

    async putTile(z: number, x: number, y: number, data: Buffer | string) {
        if (typeof data === "string") {
            data = await fs.readFile(data);
        }
        y = (1 << z) - 1 - y;
        const id = createHash("md5").update(data).digest("hex");
        const coords = hash(z, x, y);
        const stmt = this._db.prepare(
            "REPLACE INTO images (tile_id, tile_data) VALUES (?,?)",
        );
        const res1 = stmt.run(id, data);
        const stmt2 = this._db.prepare(
            "REPLACE INTO map (zoom_level, tile_column, tile_row, tile_id) VALUES (?,?,?,?)",
        );
        const res2 = stmt2.run(z, x, y, id);
        return [res1, res2];
    }

    getTile(z: number, x: number, y: number) {
        y = (1 << z) - 1 - y;

        const sql =
            "SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?";

        const data = this._db.prepare(sql).get(z, x, y) as {
            tile_data: Buffer;
        };

        return data[`tile_data`];
    }

    close() {
        this._db.close();
    }
}

function hash(z: number, x: number, y: number) {
    return (1 << z) * ((1 << z) + x) + y;
}

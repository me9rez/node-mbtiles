import * as __WEBPACK_EXTERNAL_MODULE_node_fs_promises_153e37e0__ from "node:fs/promises";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__ from "node:path";
import * as __WEBPACK_EXTERNAL_MODULE_node_sqlite_33145763__ from "node:sqlite";
import * as __WEBPACK_EXTERNAL_MODULE_fs__ from "fs";
import * as __WEBPACK_EXTERNAL_MODULE_crypto__ from "crypto";
class MBTiles {
    _db;
    constructor(location, options){
        this._db = new __WEBPACK_EXTERNAL_MODULE_node_sqlite_33145763__.DatabaseSync(location, options ?? {});
        const scheme = (0, __WEBPACK_EXTERNAL_MODULE_fs__.readFileSync)(__WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__["default"].join(import.meta.dirname, "./schema.sql"), {
            encoding: "utf-8"
        });
        this._db.exec(scheme);
    }
    putInfo(data) {
        const stmt = this._db.prepare("REPLACE INTO metadata (name, value) VALUES (?, ?)");
        var jsondata;
        for(const key in data){
            const nested = "object" == typeof data[key] && !Array.isArray(data[key]);
            if (nested) {
                jsondata = jsondata || {};
                jsondata = {
                    ...jsondata,
                    ...data[key]
                };
            } else stmt.run(key, String(data[key]));
        }
        if (jsondata) stmt.run("json", JSON.stringify(jsondata));
        stmt.run("scheme", "tms");
    }
    getInfo() {
        const stmt = this._db.prepare("SELECT name, value FROM metadata");
        const res = stmt.all();
        const info = {};
        for (const row of res){
            info[row.name] = row.value;
            if ("json" === row.name) info[row.name] = JSON.parse(row.value);
            if ("bounds" === row.name || "center" === row.name) info[row.name] = row.value.split(",").map(Number);
        }
        info["scheme"] = "tms";
        return info;
    }
    async putTile(z, x, y, data) {
        if ("string" == typeof data) data = await __WEBPACK_EXTERNAL_MODULE_node_fs_promises_153e37e0__["default"].readFile(data);
        y = (1 << z) - 1 - y;
        const id = (0, __WEBPACK_EXTERNAL_MODULE_crypto__.createHash)("md5").update(data).digest("hex");
        hash(z, x, y);
        const stmt = this._db.prepare("REPLACE INTO images (tile_id, tile_data) VALUES (?,?)");
        const res1 = stmt.run(id, data);
        const stmt2 = this._db.prepare("REPLACE INTO map (zoom_level, tile_column, tile_row, tile_id) VALUES (?,?,?,?)");
        const res2 = stmt2.run(z, x, y, id);
        return [
            res1,
            res2
        ];
    }
    getTile(z, x, y) {
        y = (1 << z) - 1 - y;
        const sql = "SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?";
        const data = this._db.prepare(sql).get(z, x, y);
        return data["tile_data"];
    }
    close() {
        this._db.close();
    }
}
function hash(z, x, y) {
    return (1 << z) * ((1 << z) + x) + y;
}
export { MBTiles };

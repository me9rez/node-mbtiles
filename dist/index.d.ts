import { DatabaseSync } from 'node:sqlite';
import { DatabaseSyncOptions } from 'node:sqlite';
import { StatementResultingChanges } from 'node:sqlite';

export declare class MBTiles {
    _db: DatabaseSync;
    constructor(location: string, options?: DatabaseSyncOptions);
    putInfo(data: Record<string, any>): void;
    getInfo(): Record<string, any>;
    putTile(z: number, x: number, y: number, data: Buffer | string): Promise<StatementResultingChanges[]>;
    getTile(z: number, x: number, y: number): Buffer<ArrayBufferLike>;
    close(): void;
}

export { }

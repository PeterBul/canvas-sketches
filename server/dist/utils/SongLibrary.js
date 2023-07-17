import fs from 'fs';
import { nanoid } from 'nanoid';
import { database } from './db.js';
export default class SongLibrary {
    constructor() {
        this.reload();
    }
    getSongs() {
        return this.songs;
    }
    reload() {
        this.songs = fs.readdirSync('../sketches/audio');
        const dbFilenames = new Set(database.data.songs.map((song) => song.filename));
        this.songs.forEach((fileName) => {
            if (!dbFilenames.has(fileName)) {
                const id = nanoid(10);
                database.data.songs.push({ id, categories: [], filename: fileName });
            }
        });
    }
}

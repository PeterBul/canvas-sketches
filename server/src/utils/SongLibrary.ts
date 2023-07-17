import fs from 'fs';
import { nanoid } from 'nanoid';
import { database } from './db.js';

export default class SongLibrary {
  private songs: string[];

  constructor() {
    this.reload();
  }

  public getSongs() {
    return this.songs;
  }

  public reload() {
    this.songs = fs.readdirSync('../sketches/audio');
    const dbFilenames = new Set(
      database.data.songs.map((song) => song.filename)
    );
    this.songs.forEach((fileName) => {
      if (!dbFilenames.has(fileName)) {
        const id = nanoid(10);
        database.data.songs.push({ id, categories: [], filename: fileName });
      }
    });
  }
}

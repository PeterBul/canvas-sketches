import { getData } from './api/getData';

const GET_ACTIVE_SONGS = /* GraphQL */ `
  query GetActiveSongs {
    activeSongs {
      artist
      categories
      filename
      genre
      id
      mood
      title
    }
  }
`;

export default class SongLibrary {
  loaded = false;
  categories = new Set();
  needsReload = false;
  constructor() {
    /**
     * @type {Array}
     */
    getData({ query: GET_ACTIVE_SONGS }).then((result) => {
      this.allSongs = result.activeSongs;
      this.songs = this.allSongs;
      this.loaded = true;
    });
  }

  getSongs() {
    this.needsReload = false;
    return this.songs;
  }

  get fileNames() {
    this.needsReload = false;
    return this.songs.map((song) => song.filename);
  }

  get isSongLibraryLoaded() {
    return this.loaded;
  }

  /**
   *
   * @param {string} category
   */
  addCategory(category) {
    this.categories.add(category);
    this.filterSongs();
  }

  /**
   *
   * @param {string} category
   */
  setCategory(category) {
    this.categories = new Set([category]);
    this.filterSongs();
  }

  clearCategories() {
    this.categories = new Set();
    this.filterSongs();
  }

  /**
   *
   * @param {string} category
   */
  removeCategory(category) {
    this.categories.delete(category);
    this.filterSongs();
  }

  filterSongs() {
    console.log(this.allSongs);
    this.songs =
      this.categories.size > 0
        ? this.allSongs.filter((song) =>
            song.categories.some((songCategory) =>
              this.categories.has(songCategory)
            )
          )
        : this.allSongs;
    if (this.songs.length === 0) {
      this.songs = this.allSongs;
    }
    this.needsReload = true;
  }
}

import fs from 'fs';
import Metadata from '@enviro/metadata';

const files = fs.readdirSync('audio');
console.log(files);
async function read(file) {
  try {
    const metadata = await Metadata.get('file');
    console.log(metadata);
  } catch (e) {
    console.error(e);
  }
}

read('audio/Aes Dana - Chill Out Gardens 02 - Boom Festival 2014.mp3');

const data = new Uint8Array(
  Buffer.from(`export const songs = [${files.map((f) => `'${f}'`)}]`)
);
fs.writeFile('songs.js', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { database } from './utils/db.js';
import { nanoid } from 'nanoid';
import { ISong } from './interfaces/ISong';
import SongLibrary from './utils/SongLibrary.js';

const typeDefs = `#graphql
  # This "Book" type defines the queryable fields for every book in our data source.
  type Song {
    id: ID!
    filename: String!
    title: String
    artist: String
    genre: String
    mood: String
    categories: [String]
  }

  input NewSongInput {
    filename: String!
    title: String
    artist: String
    genre: String
    mood: String
    categories: [String]
  }

  input UpdateSongInput {
    filename: String
    title: String
    artist: String
    genre: String
    mood: String
    categories: [String]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "songs" query returns an array of zero or more Songs (defined above).
  type Query {
    songs: [Song]
    files: [String]
    reloadFiles: [String]
    activeSongs: [Song]
  }

  type Mutation {
    addSong(input: NewSongInput!): Song
    removeSong(id: ID!): ID!
    updateSong(id: ID!, input: UpdateSongInput!): Song
  }
`;

const resolvers = {
  Query: {
    songs: () => database.data.songs,
    files: () => library.getSongs(),
    reloadFiles: () => {
      library.reload();
      return library.getSongs();
    },
    activeSongs: () => {
      const songMetadata = Object.fromEntries(
        database.data.songs.map((song) => [song.filename, song])
      );
      return library
        .getSongs()
        .map((filename) => ({ ...songMetadata[filename], filename }));
    },
  },
  Mutation: {
    addSong: async (root, { input }: { input: Omit<ISong, 'id'> }, { db }) => {
      const id = nanoid(10);

      db.data.songs.push({
        id,
        title: input.title,
        categories: input.categories || [],
        filename: input.filename,
        artist: input.artist,
        genre: input.genre,
        mood: input.mood,
      });

      db.write();

      const song: ISong | undefined = db.chain
        .get('songs')
        .find({ id })
        .value();

      return song;
    },
    updateSong: async (root, { id, input }, { db }) => {
      const oldSong = db.chain.get('songs').find({ id }).value();
      db.chain
        .get('songs')
        .find({ id })
        .assign({ ...oldSong, ...input })
        .value();
      db.write();

      return db.chain.get('songs').find({ id }).value();
    },
    removeSong: async (root, args, { db }) => {
      db.chain.get('songs').remove({ id: args.id }).value();
      db.write();
      return args.id;
    },
  },
};
interface MyContext {
  // Context typing
  db: typeof database;
}
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  context: async () => ({
    db: database,
  }),
  listen: { port: 4000 },
});

export const library = new SongLibrary();

console.log(`🚀  Server ready at: ${url}`);

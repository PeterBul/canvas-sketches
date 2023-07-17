import { gql } from '@apollo/client';

export const GET_SONGS = gql`
  query GetSongs {
    songs {
      id
      filename
      title
      categories
      genre
    }
  }
`;

export const UPDATE_SONG = gql`
  mutation updateSong($id: ID!, $input: UpdateSongInput!) {
    updateSong(id: $id, input: $input) {
      id
      artist
      categories
      filename
      genre
      mood
      title
    }
  }
`;

import { useMutation, useQuery } from '@apollo/client';
import { GET_SONGS, UPDATE_SONG } from './utils/queries';
import { ISong } from './interfaces/ISong';
import './Songs.css';
import Chip from './Chip';

interface IProps {
  filter: string;
}

export default function Songs({ filter }: IProps) {
  const { loading, error, data } = useQuery<{ songs: ISong[] }>(GET_SONGS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) {
    return null;
  }
  const filteredSongs = filter
    ? data.songs.filter((song) => {
        return song.filename.includes(filter) || song.title?.includes(filter);
      })
    : data.songs;
  return (
    <table className="songs-table">
      <tbody>
        <tr>
          <th>Filename</th>
          <th>Title</th>
          <th>Categories</th>
        </tr>
        {filteredSongs.map((song) => (
          <SongRow key={song.id} song={song} />
        ))}
      </tbody>
    </table>
  );
}

interface ISongProps {
  song: ISong;
}

function SongRow({ song }: ISongProps) {
  const [updateSong] = useMutation(UPDATE_SONG, {
    variables: {
      id: song.id,
      input: {
        categories: song.categories,
      },
    },
  });
  const handleNewCategory = () => {
    const newCategories = [...song.categories, ''];
    void updateSong({
      variables: {
        id: song.id,
        input: {
          categories: newCategories,
        },
      },
    });
  };
  return (
    <tr>
      <td tabIndex={0}>{song.filename}</td>
      <td>{song.title}</td>
      <td className="chips" onClick={handleNewCategory}>
        {song.categories.map((category, index) => {
          const handleDeleteCategory = async () => {
            const newCategories = [...song.categories];
            newCategories.splice(index, 1);
            await updateSong({
              variables: {
                id: song.id,
                input: {
                  categories: newCategories,
                },
              },
            });
          };
          return (
            <Chip
              key={index}
              text={category}
              onEdit={async (text) => {
                if (!text) {
                  void handleDeleteCategory();
                  return;
                }
                const newCategories = [...song.categories];
                newCategories[index] = text;
                await updateSong({
                  variables: {
                    id: song.id,
                    input: {
                      categories: newCategories,
                    },
                  },
                });
              }}
              onCancelEdit={() => {
                if (!song.categories[index]) {
                  void handleDeleteCategory();
                }
              }}
              onDelete={handleDeleteCategory}
            />
          );
        })}
        <button className="icon-btn add-category-btn">
          <i onClick={handleNewCategory} className="fa-solid fa-plus"></i>
        </button>
      </td>
    </tr>
  );
}

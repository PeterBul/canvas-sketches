import { useState } from 'react';
import './App.css';
import Songs from './Songs';

function App() {
  const [filter, setFilter] = useState('');

  return (
    <>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter"
      />
      <Songs filter={filter} />
    </>
  );
}

export default App;

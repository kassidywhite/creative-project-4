import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  
  const date = new Date().toLocaleDateString();

  const fetchEntries = async() => {
    try {      
      const response = await axios.get("/api/entries");
      setEntries(response.data.entries);
    } catch(error) {
      setError("error retrieving entries: " + error);
    }
  }
  const createEntry = async() => {
    try {
      await axios.post("/api/entries", {entry: entry, mood: mood});
    } catch(error) {
      setError("error adding entry: " + error);
    }
  }
  const deleteOneEntry = async(entry) => {
    try {
      await axios.delete("/api/entries/" + entry.id);
    } catch(error) {
      setError("error deleting entry" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchEntries();
  },[]);

  const addEntry = async(e) => {
    e.preventDefault();
    await createEntry();
    fetchEntries();
    setMood("");
    setEntry("");
  }

  const deleteEntry = async(entry) => {
    await deleteOneEntry(entry);
    fetchEntries();
  }

  // render results
  return (
    <div className="App">
      {error}
      <div className="header">
      <h1>Gratitude Journal</h1>
      <p>---------- writing is medicine ----------</p>
      </div>
      <div className="inputs">
      <form onSubmit={addEntry}>
        <div>
          <label>
            What was the mood of today?
          </label>
        </div>
        <div className="spacing">
        <label>
            <input className="font-sizing-text-boxes" type="text" value={mood} onChange={e => setMood(e.target.value)} />
          </label>
        </div>
        <div className="spacing">
          <label>
            Write about some things you are grateful for:
          </label>
        </div>
        <div className="spacing">
          <label>
            <textarea className="font-sizing-text-boxes" value={entry} onChange={e=>setEntry(e.target.value)}></textarea>
          </label>
        </div>
        <button onClick={e => addEntry(entry)}>Post</button>
      </form>
      </div>
      <h2>Entries:</h2>
      {entries.map( entry => (
        <div key={entry.id} className="entry outputs">
          <div className="entry">
            <p>{date}</p>
            <div className="small-output">
            <p><strong>Feeling:</strong> {entry.mood}</p>
            <p><strong>Gratitude of the Day:</strong> {entry.entry}</p>
            </div>
          </div>
          <div className="delete-button">
          <button onClick={e => deleteEntry(entry)}>Delete</button>
          </div>
        </div>
      ))}     
    </div>
  );
}

export default App;
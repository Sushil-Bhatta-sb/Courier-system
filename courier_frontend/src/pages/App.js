import { useEffect, useState } from "react";

function App() {
  const [modes, setModes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/modes/")
      .then(res => res.json())
      .then(data => setModes(data));
  }, []);

  return (
    <div>
      <h2>Modes of Transport</h2>
      {modes.map(m => (
        <p key={m.id}>{m.name} - multiplier: {m.multiplier}</p>
      ))}
    </div>
  );
}

export default App;

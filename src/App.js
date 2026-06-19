import { useState } from 'react';
import './App.css';

const PUBLIC = process.env.PUBLIC_URL;

const messages = [
  'text 1', 'text 2', 'text 3', 'text 4',
  'text 5', 'text 6', 'text 7', 'text 8',
];

const tabBounds = [
  { left: 63.69, top: 28.32, width: 15.89, height: 37.89 },
  { left: 84.11, top: 6.21, width: 13.84, height: 20.74 },
  { left: 21.33, top: 4.11, width: 14.44, height: 28 },
  { left: 21.33, top: 38.84, width: 14.2, height: 28.84 },
  { left: 85.26, top: 33.16, width: 11.66, height: 13.26 },
  { left: 64.41, top: 4.21, width: 7.61, height: 20.32 },
  { left: 73.17, top: 4.11, width: 7.79, height: 20.42 },
  { left: 2.78, top: 12, width: 15.95, height: 33.89 },
];

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="App" style={{
      backgroundImage: `url(${PUBLIC}/Images/background_vide.png)`
    }}>
      <img src={`${PUBLIC}/Images/grand papier.png`} alt="grand papier" className="tab-img" />
      {[
        { left: 69.46, top: 66.84 },
        { left: 88.85, top: 27.58 },
        { left: 26.37, top: 32.74 },
        { left: 26.25, top: 68.32 },
        { left: 88.91, top: 47.05 },
        { left: 66.04, top: 25.16 },
        { left: 74.89, top: 25.16 },
        { left: 8.58, top: 46.53 },
      ].map((pos, i) => (
        <div key={i} className="petit-papier" style={{ left: `${pos.left}%`, top: `${pos.top}%`, backgroundImage: `url(${PUBLIC}/Images/petit%20papier.png)` }} />
      ))}
      {[1,2,3,4,5,6,7,8].map(i => (
        <img
          key={i}
          src={`${PUBLIC}/Images/tab_${i}.png`}
          alt={`tab ${i}`}
          className="tab-img"
        />
      ))}
      {tabBounds.map((b, i) => (
        <div
          key={i}
          className="hit-area"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: `${b.width}%`,
            height: `${b.height}%`,
          }}
          onClick={() => setSelected(i + 1)}
        />
      ))}
      <img src={`${PUBLIC}/Images/logo bhar.png`} alt="logo bhar" className="tab-img" />
      <img src={`${PUBLIC}/Images/logo isbat.png`} alt="logo isbat" className="tab-img" />

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            <p className="modal-text">{messages[selected - 1]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

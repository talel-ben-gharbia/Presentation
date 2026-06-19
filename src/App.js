import './App.css';

const PUBLIC = process.env.PUBLIC_URL;
const tabs = Array.from({ length: 8 }, (_, i) => i + 1);

function App() {
  return (
    <div className="App" style={{
      backgroundImage: `url(${PUBLIC}/Images/background_vide.png)`
    }}>
      {tabs.map(i => (
        <img
          key={i}
          src={`${PUBLIC}/Images/tab_${i}.png`}
          alt={`tab ${i}`}
          className="overlay"
        />
      ))}
      <img src={`${PUBLIC}/Images/grand papier.png`} alt="grand papier" className="overlay" />
      <img src={`${PUBLIC}/Images/petit papier.png`} alt="petit papier" className="overlay" />
      <img src={`${PUBLIC}/Images/logo bhar.png`} alt="logo bhar" className="overlay" />
      <img src={`${PUBLIC}/Images/logo isbat.png`} alt="logo isbat" className="overlay" />
    </div>
  );
}

export default App;

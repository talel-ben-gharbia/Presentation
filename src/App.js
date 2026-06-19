import { useState, useEffect } from 'react';
import './App.css';

const PUBLIC = process.env.PUBLIC_URL;

const slidesData = [
  { title: 'Introduction', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { title: 'Overview', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { title: 'Details', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
  { title: 'Analysis', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.' },
  { title: 'Conclusion', content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.' },
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
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState('');

  const openModal = (i, slideIndex = 0) => {
    setSelected(i);
    setSlide(slideIndex);
    setAnim('enter');
  };

  const closeModal = () => {
    setAnim('exit');
    setTimeout(() => {
      setSelected(null);
      setAnim('');
    }, 250);
  };

  const goTo = (i) => {
    if (i < 0) {
      if (selected > 1) {
        setAnim('exit');
        setTimeout(() => {
          openModal(selected - 1, slidesData.length - 1);
        }, 300);
      }
      return;
    }
    if (i >= slidesData.length) {
      if (selected < 8) {
        setAnim('exit');
        setTimeout(() => {
          openModal(selected + 1, 0);
        }, 300);
      }
      return;
    }
    setSlide(i);
  };

  useEffect(() => {
    if (!selected) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(slide + 1);
      if (e.key === 'ArrowLeft') goTo(slide - 1);
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, slide]);

  return (
    <div className="App" style={{
      backgroundImage: `url(${PUBLIC}/Images/background_vide.png)`
    }}>
      <img src={`${PUBLIC}/Images/grand papier.png`} alt="grand papier" className="premium-shadow" />
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
        <img key={i} src={`${PUBLIC}/Images/tab_${i}.png`} alt={`tab ${i}`} className="tab-img" />
      ))}
      {tabBounds.map((b, i) => (
        <div key={i} className="hit-area" style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` }} onClick={() => openModal(i + 1)} />
      ))}
      <img src={`${PUBLIC}/Images/logo bhar.png`} alt="logo bhar" className="premium-shadow" />
      <img src={`${PUBLIC}/Images/logo isbat.png`} alt="logo isbat" className="premium-shadow" />

      {selected && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className={`modal modal-${anim}`} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="slide-counter">{slide + 1} / {slidesData.length}</div>
            <div className="slide-track">
              {slidesData.map((s, i) => {
                const imgs = { 0: 'slide1.png', 1: 'slide2.png', 2: 'croquis 2-03.png' };
                const img = selected === 1 && imgs[i] ? `${PUBLIC}/Images/${imgs[i]}` : null;
                const isStretched = img && i < 2;
                return (
                  <div key={i} className={`slide-content ${i === slide ? 'active' : ''}`}
                    style={img ? {
                      backgroundImage: `url("${img}")`,
                      backgroundSize: isStretched ? '100% 100%' : 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    } : {}}>
                    {!img && <><h2>{s.title}</h2><p>{s.content}</p></>}
                  </div>
                );
              })}
            </div>
            <div className="slide-nav">
              <div className="dots">
                {slidesData.map((_, i) => (
                  <span key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => goTo(i)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

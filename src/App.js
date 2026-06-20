import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './App.css';
import { supabase } from './supabaseClient';

const PUBLIC = process.env.PUBLIC_URL;

const tabImgs = [
  'tab_1.png',
  'tab_2.png',
  'tab_3.png',
  'tab_4.png',
  'tab_5.png',
  'tab_6.png',
  'tab_7.png',
  'tab_8.png',
];

const tabBounds = [
  { left: 2.78, top: 12, width: 15.95, height: 33.89 },       // 1 → was #8
  { left: 21.33, top: 4.11, width: 14.44, height: 28 },       // 2 → was #3
  { left: 21.33, top: 38.84, width: 14.2, height: 28.84 },    // 3 → was #4
  { left: 64.41, top: 4.21, width: 7.61, height: 20.32 },     // 4 → was #6
  { left: 73.17, top: 4.11, width: 7.79, height: 20.42 },     // 5 → was #7
  { left: 63.69, top: 28.32, width: 15.89, height: 37.89 },   // 6 → was #1
  { left: 84.11, top: 6.21, width: 13.84, height: 20.74 },    // 7 → was #2
  { left: 85.26, top: 33.16, width: 11.66, height: 13.26 },   // 8 → was #5
];

function App() {
  const [selected, setSelected] = useState(null);
  const [slide, setSlide] = useState(0);
  const [artworkSlides, setArtworkSlides] = useState([]);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [pendingArtwork, setPendingArtwork] = useState(null);
  const [hoveredArtwork, setHoveredArtwork] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const fetchSlides = async (artworkId) => {
    console.log('Fetching slides for artTable:', artworkId);
    setArtworkSlides([]);
    try {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .eq('artTable', artworkId)
        .order('slide');
      if (error) console.error('Supabase error:', error);
      console.log('Fetched slides:', data);
      if (data) setArtworkSlides(data);
    } catch (e) {
      console.error('Fetch failed:', e);
    }
  };

  const openModal = async (i, slideIndex = 0, e) => {
    console.log('Opening artwork ID:', i);
    setPendingArtwork(null);
    const rect = e?.currentTarget?.getBoundingClientRect();
    if (rect) {
      setOrigin({
        x: rect.left + rect.width / 2 - window.innerWidth / 2,
        y: rect.top + rect.height / 2 - window.innerHeight / 2,
      });
    }
    setSelected(i);
    setSlide(slideIndex);
    setVideoUrl(null);
    setArtworkSlides([]);
    if (i === 8) {
      setVideoUrl('https://jxthfywtduzmukxzsuzs.supabase.co/storage/v1/object/public/vdo/WhatsApp%20Video%202026-06-20%20at%208.06.12%20PM.mp4');
    } else {
      fetchSlides(i);
    }
  };

  const closeModal = (keepPending) => {
    if (!keepPending) setPendingArtwork(null);
    setSelected(null);
    setVideoUrl(null);
  };

  const goTo = (i) => {
    setSlide(i);
  };

  const openGrandPapier = (e) => {
    const img = e.currentTarget;
    if (img.naturalWidth) {
      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const pixel = ctx.getImageData(
          Math.round(x * img.naturalWidth),
          Math.round(y * img.naturalHeight),
          1, 1
        ).data;
        if (pixel[3] < 10) return;
      } catch (_) {}
    }
    setSelected('grand');
    setSlide(0);
    setOrigin({ x: 0, y: 0 });
    setArtworkSlides([
      { Image_url: `${PUBLIC}/Images/1.png` },
      { Image_url: `${PUBLIC}/Images/2.png` },
    ]);
  };

  useEffect(() => {
    if (slide >= artworkSlides.length && artworkSlides.length > 0) {
      setSlide(artworkSlides.length - 1);
    }
  }, [artworkSlides, slide]);

  useEffect(() => {
    const onKey = (e) => {
      if (selected) {
        if (selected === 8) {
          if (e.key === 'Escape') closeModal();
          return;
        }
        if (e.key === 'ArrowRight') {
          if (slide + 1 >= artworkSlides.length) {
            if (selected < 8) {
              setPendingArtwork(selected + 1);
              closeModal(true);
            }
          } else {
            setSlide(slide + 1);
          }
        } else if (e.key === 'ArrowLeft') {
          if (slide - 1 < 0) {
            if (selected > 1) {
              setPendingArtwork(selected - 1);
              closeModal(true);
            }
          } else {
            setSlide(slide - 1);
          }
        } else if (e.key === 'Escape') {
          closeModal();
        }
      } else if (pendingArtwork && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const target = pendingArtwork;
        setPendingArtwork(null);
        const el = document.querySelector(`[data-artwork="${target}"]`);
        if (el) {
          const r = el.getBoundingClientRect();
          setOrigin({
            x: r.left + r.width / 2 - window.innerWidth / 2,
            y: r.top + r.height / 2 - window.innerHeight / 2,
          });
        }
        openModal(target, 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, slide, pendingArtwork, artworkSlides]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App" style={{
      backgroundImage: `url(${PUBLIC}/Images/background_vide.png)`
    }}>
      <img src={`${PUBLIC}/Images/grand papier.png`} alt="grand papier" className="premium-shadow" style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={openGrandPapier} />
      {[
        { left: 8.58, top: 46.53 },    // artwork 1 (was #8)
        { left: 26.37, top: 32.74 },   // artwork 2 (was #3)
        { left: 26.25, top: 68.32 },   // artwork 3 (was #4)
        { left: 66.04, top: 25.16 },   // artwork 4 (was #6)
        { left: 74.89, top: 25.16 },   // artwork 5 (was #7)
        { left: 69.46, top: 70.16 },   // artwork 6 (was #1)
        { left: 88.85, top: 27.58 },   // artwork 7 (was #2)
        { left: 88.91, top: 47.05 },   // artwork 8 (was #5)
      ].map((pos, i) => (
        <motion.div key={i} className="petit-papier"
          style={{ left: `${pos.left}%`, top: `${pos.top}%`, backgroundImage: `url(${PUBLIC}/Images/petit%20papier.png)` }}
          animate={{
            filter: !hoveredArtwork
              ? 'none'
              : hoveredArtwork === i + 1
                ? 'brightness(1)'
                : 'brightness(0.3)',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      ))}
      {tabImgs.map((name, i) => (
        <motion.img key={i} src={`${PUBLIC}/Images/${name}`} alt={`tab ${i + 1}`}
          className="tab-img"
          animate={{
            filter: !hoveredArtwork
              ? 'drop-shadow(4px 8px 1px rgba(80, 35, 10, 0.45))'
              : hoveredArtwork === i + 1
                ? 'drop-shadow(4px 8px 3px rgba(80, 35, 10, 0.65)) brightness(1.12)'
                : 'drop-shadow(4px 8px 1px rgba(80, 35, 10, 0.45)) brightness(0.3)',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      ))}
      {tabBounds.map((b, i) => (
        <div key={i} className="hit-area" data-artwork={i + 1}
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` }}
          onMouseEnter={() => setHoveredArtwork(i + 1)}
          onMouseLeave={() => setHoveredArtwork(null)}
          onClick={(e) => openModal(i + 1, 0, e)}
        />
      ))}
      <img src={`${PUBLIC}/Images/logo bhar.png`} alt="logo bhar" className="premium-shadow" />
      <img src={`${PUBLIC}/Images/logo isbat.png`} alt="logo isbat" className="premium-shadow" />

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.1, x: origin.x, y: origin.y, opacity: 0 }}
              animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              exit={{ scale: 0.1, x: origin.x, y: origin.y, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260, mass: 0.7 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.button
                className="modal-close"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
                onClick={closeModal}
              >
                &times;
              </motion.button>
              {selected === 8 && videoUrl ? (
                <video className="slide-video" src={videoUrl} controls autoPlay />
              ) : (
                <>
                  <motion.div
                    className="slide-counter"
                    key={slide}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {artworkSlides.length > 0 ? slide + 1 : '—'} / {artworkSlides.length}
                  </motion.div>
                  <div className="slide-track">
                    {artworkSlides.map((s, i) => {
                      const img = s.Image_url || null;
                      return (
                        <div key={i} className={`slide-content ${i === slide ? 'active' : ''}`}
                          style={img ? {
                            backgroundImage: `url("${img}")`,
                            backgroundSize: 'auto 100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                          } : {}} />
                      );
                    })}
                  </div>
                  <div className="slide-nav">
                    <div className="dots">
                      {artworkSlides.map((_, i) => (
                        <motion.span
                          key={i}
                          className={`dot ${i === slide ? 'active' : ''}`}
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.85 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                          onClick={() => goTo(i)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState } from 'react';

const proof = {
  gradingBefore: '/ProofOfWork/grading-before.jpg',
  gradingProgress: '/ProofOfWork/grading-sod-progress.jpg',
  gradingFinished: '/ProofOfWork/grading-sod-finished.jpg',
  sodBefore: '/ProofOfWork/sod-before.jpg',
  sodFinished: '/ProofOfWork/sod-finished.jpg',
};

const Arrow = () => <span aria-hidden="true">↗</span>;

function CompareReveal({ before, after, title, detail, number }) {
  const [value, setValue] = useState(52);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef(null);

  const positionFromEvent = (event) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(0, next)));
  };

  useEffect(() => {
    const stopDragging = () => setDragging(false);
    window.addEventListener('pointerup', stopDragging);
    return () => window.removeEventListener('pointerup', stopDragging);
  }, []);

  return (
    <article className="comparison">
      <div className="comparison-meta">
        <span>{number}</span>
        <p>{title}</p>
        <small>{detail}</small>
      </div>
      <div
        ref={frameRef}
        className={`comparison-frame ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={(event) => {
          setDragging(true);
          positionFromEvent(event);
        }}
        onPointerMove={(event) => dragging && positionFromEvent(event)}
      >
        <img src={before} alt={`${title} before work began`} />
        <div className="comparison-after" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }} aria-hidden="true">
          <img src={after} alt="" />
        </div>
        <span className="image-label image-label-before">Before</span>
        <span className="image-label image-label-after" style={{ left: `calc(${value}% - 64px)` }}>
          After
        </span>
        <div className="comparison-line" style={{ left: `${value}%` }} aria-hidden="true">
          <span>↔</span>
        </div>
        <label className="sr-only" htmlFor={`comparison-${number.replace(/[^\d]/g, '')}`}>
          Drag to compare before and after photos for {title}
        </label>
        <input
          id={`comparison-${number.replace(/[^\d]/g, '')}`}
          className="comparison-control"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
    </article>
  );
}

function WorkGallery() {
  const [activeImage, setActiveImage] = useState(null);
  const entries = [
    {
      src: proof.gradingFinished,
      alt: 'Freshly installed sod around a home after grading work',
      service: 'Sod installation',
      title: 'A finished lawn with clean edges',
    },
    {
      src: proof.gradingProgress,
      alt: 'New sod being installed around a wooded residential property',
      service: 'Sod installation',
      title: 'Fresh sod, laid with care',
    },
    {
      src: proof.gradingBefore,
      alt: 'Residential yard prepared for grading and sod installation',
      service: 'Grading & site preparation',
      title: 'The groundwork for a level lawn',
    },
    {
      src: proof.sodBefore,
      alt: 'Backyard being prepared with compact equipment before sod installation',
      service: 'Grading & soil preparation',
      title: 'Site prep before the finish',
    },
    {
      src: proof.sodFinished,
      alt: 'Completed backyard sod installation',
      service: 'Sod installation',
      title: 'A backyard ready to enjoy',
    },
  ];

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setActiveImage(null);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <>
      <section className="work section-shell" id="work" aria-labelledby="work-title">
        <div className="section-heading section-heading-split">
          <div>
            <p className="eyebrow">The receipts</p>
            <h2 id="work-title">Work that speaks<br />for itself.</h2>
          </div>
          <p className="section-intro">
            A closer look at the details behind a finished outdoor space—from site preparation to the final roll of sod.
          </p>
        </div>
        <div className="work-grid">
          {entries.map((entry, index) => (
            <button className={`work-card work-card-${index + 1}`} key={entry.src} onClick={() => setActiveImage(entry)}>
              <span className="work-image-wrap">
                <img src={entry.src} alt={entry.alt} loading="lazy" />
              </span>
              <span className="work-copy">
                <small>{entry.service}</small>
                <strong>{entry.title}</strong>
              </span>
              <span className="work-open" aria-hidden="true">View</span>
            </button>
          ))}
        </div>
      </section>
      {activeImage && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title} onClick={() => setActiveImage(null)}>
          <button className="lightbox-close" aria-label="Close image" onClick={() => setActiveImage(null)}>×</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={activeImage.src} alt={activeImage.alt} />
            <figcaption><span>{activeImage.service}</span>{activeImage.title}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ZP Outdoor Solutions home" onClick={closeMenu}>
          <span className="brand-monogram">ZP</span>
          <span>ZP <i>Outdoor Solutions</i></span>
        </a>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen((open) => !open)}>
          <span className="sr-only">Toggle navigation</span>
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'is-open' : ''} id="site-nav" aria-label="Main navigation">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#results" onClick={closeMenu}>Results</a>
          <a href="#work" onClick={closeMenu}>Our work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Get a free estimate <Arrow /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image" aria-hidden="true">
            <img src={proof.gradingFinished} alt="" fetchPriority="high" />
          </div>
          <div className="hero-overlay" />
          <div className="hero-content section-shell">
            <p className="eyebrow light">Mecklenburg County, NC</p>
            <h1 id="hero-title">Your yard,<br /><em>built to feel like home.</em></h1>
            <p className="hero-summary">Thoughtful grading, fresh sod, and polished landscape finishes for the spaces you come home to.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#contact">Start your project <Arrow /></a>
              <a className="text-link light" href="#results">See the transformations <span>↓</span></a>
            </div>
          </div>
          <div className="hero-footer section-shell">
            <p>Outdoor spaces, made simple.</p>
            <p>Scroll to explore <span>↓</span></p>
          </div>
        </section>

        <section className="intro section-shell" aria-label="ZP Outdoor Solutions introduction">
          <p className="eyebrow">The ZP standard</p>
          <div className="intro-layout">
            <h2>Good landscaping<br />starts <em>underfoot.</em></h2>
            <div>
              <p className="lead">The best outdoor spaces do more than look good. They make the everyday—coming home, hosting friends, watching the kids play—feel better.</p>
              <a className="text-link dark" href="#about">Meet the people behind the work <Arrow /></a>
            </div>
          </div>
          <div className="proof-points" aria-label="ZP Outdoor Solutions values">
            <p><strong>01</strong> Clear scope. Clear communication.</p>
            <p><strong>02</strong> Thoughtful prep, not rushed finishes.</p>
            <p><strong>03</strong> Details worth looking twice at.</p>
          </div>
        </section>

        <section className="services section-shell" id="services" aria-labelledby="services-title">
          <div className="section-heading">
            <p className="eyebrow">What we do</p>
            <h2 id="services-title">The work behind<br />a better yard.</h2>
          </div>
          <div className="service-list">
            <article className="service-item">
              <span>01</span>
              <div><h3>Lawn care</h3><p>Consistent mowing, edging, fertilization, and weed control to keep your lawn looking considered through every season.</p></div>
              <a href="#contact" aria-label="Ask about lawn care"><Arrow /></a>
            </article>
            <article className="service-item service-item-featured">
              <span>02</span>
              <div><h3>Sod installation</h3><p>From soil preparation to precise laying, we build an instantly greener lawn with a strong start beneath it.</p></div>
              <a href="#contact" aria-label="Ask about sod installation"><Arrow /></a>
            </article>
            <article className="service-item">
              <span>03</span>
              <div><h3>Grading &amp; site prep</h3><p>The careful, foundational work that creates a smoother finish and prepares your yard for what comes next.</p></div>
              <a href="#contact" aria-label="Ask about grading and site preparation"><Arrow /></a>
            </article>
            <article className="service-item">
              <span>04</span>
              <div><h3>River rock &amp; mulch</h3><p>Natural texture and definition that bring planting beds together while keeping the landscape easier to maintain.</p></div>
              <a href="#contact" aria-label="Ask about river rock and mulch"><Arrow /></a>
            </article>
          </div>
        </section>

        <section className="process">
          <div className="section-shell process-layout">
            <div className="process-intro">
              <p className="eyebrow light">A better way to get it done</p>
              <h2>A clear path<br />to <em>outside, better.</em></h2>
            </div>
            <ol>
              <li><span>01</span><div><h3>Walk the space</h3><p>We begin with your yard, your goals, and the details that will make the difference.</p></div></li>
              <li><span>02</span><div><h3>Define the work</h3><p>You get a clear conversation about what the job calls for before it begins.</p></div></li>
              <li><span>03</span><div><h3>Finish with intention</h3><p>We focus on the prep and final pass that make the transformation last.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="results" id="results" aria-labelledby="results-title">
          <div className="section-shell">
            <div className="section-heading results-heading">
              <div>
                <p className="eyebrow">See the difference</p>
                <h2 id="results-title">The proof is<br /><em>in the ground.</em></h2>
              </div>
              <p className="drag-note"><span>↔</span> Drag the handle to reveal the work.</p>
            </div>
            <div className="comparison-grid">
              <CompareReveal number="01" title="Grading + fresh sod" detail="A bare, uneven yard becomes a place to stretch out." before={proof.gradingBefore} after={proof.gradingFinished} />
              <CompareReveal number="02" title="Site prep + sod" detail="Careful preparation makes the finished lawn possible." before={proof.sodBefore} after={proof.sodFinished} />
            </div>
          </div>
        </section>

        <WorkGallery />

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <div className="about-photo"><img src={proof.gradingProgress} alt="Fresh sod installation in progress" loading="lazy" /></div>
          <div className="about-copy">
            <p className="eyebrow">A note from ZP</p>
            <h2 id="about-title">Built on the kind of care you can <em>see.</em></h2>
            <p>We started ZP Outdoor Solutions around a simple belief: your outdoor space deserves the same attention as the rest of your home. That means listening first, preparing thoroughly, and leaving every site better than we found it.</p>
            <p>It is a practical standard, but it makes all the difference when you look out the window.</p>
            <p className="signature">ZP Outdoor Solutions</p>
          </div>
        </section>

        <section className="reviews section-shell" aria-labelledby="reviews-title">
          <div className="section-heading"><p className="eyebrow">Good words from good neighbors</p><h2 id="reviews-title">The feeling<br />is <em>mutual.</em></h2></div>
          <div className="review-grid">
            <figure><blockquote>“Great work ethic, communication and a polite team. The sod looks great!”</blockquote><figcaption><strong>Bobby P.</strong><span>Facebook review</span></figcaption></figure>
            <figure><blockquote>“They were super flexible and made scheduling so easy. The team was professional, friendly, and went above and beyond.”</blockquote><figcaption><strong>Rachel S.</strong><span>Facebook review</span></figcaption></figure>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-image" aria-hidden="true"><img src={proof.sodFinished} alt="" loading="lazy" /></div>
          <div className="contact-overlay" />
          <div className="section-shell contact-content">
            <p className="eyebrow light">Make the first move</p>
            <h2 id="contact-title">Let’s make your<br /><em>outside better.</em></h2>
            <p>Tell us what you have in mind. We’ll start with a conversation about your space and a free estimate.</p>
            <div className="contact-actions">
              <a className="button button-light" href="tel:+15158979421">Call (515) 897-9421 <Arrow /></a>
              <a className="text-link light" href="mailto:zpoutdoorsolutions@gmail.com">Send an email <Arrow /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <a className="brand footer-brand" href="#top"><span className="brand-monogram">ZP</span><span>ZP <i>Outdoor Solutions</i></span></a>
        <p>Serving Mecklenburg County and surrounding counties.</p>
        <p>© {new Date().getFullYear()} ZP Outdoor Solutions</p>
      </footer>
    </div>
  );
}

export default App;

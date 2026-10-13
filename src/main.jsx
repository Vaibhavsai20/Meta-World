import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {

  ArrowDownRight, ArrowRight, Menu, X, Sparkles, Layers3, Code2,

  Smartphone, Palette, MoveUpRight as ArrowUpRightIcon, Globe2, ShieldCheck, Zap

} from 'lucide-react';
import './styles.css';



const services = [

  { icon: <Palette size={22} />, number: '01', title: 'Digital experiences', text: 'Distinctive interfaces that make complex products feel effortless.' },

  { icon: <Code2 size={22} />, number: '02', title: 'Web development', text: 'Fast, accessible websites and applications built to grow with you.' },

  { icon: <Layers3 size={22} />, number: '03', title: 'Product strategy', text: 'Clear product direction that turns ambitious ideas into real outcomes.' },

  { icon: <Smartphone size={22} />, number: '04', title: 'Mobile solutions', text: 'Connected, intuitive experiences for people on the move.' },

];



const projects = [

  { type: 'BRAND EXPERIENCE', title: 'NOVA / Future, simplified.', color: 'project-purple', mark: 'N.', desc: 'Brand system & digital platform' },

  { type: 'DIGITAL PRODUCT', title: 'Orbit / Work in sync.', color: 'project-orange', mark: '◉', desc: 'Product design & development' },

  { type: 'ECOMMERCE', title: 'Forma / Made to matter.', color: 'project-green', mark: 'F', desc: 'Commerce experience & strategy' },

];



function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [modal, setModal] = useState('');

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactError, setContactError] = useState('');

  const [authMessage, setAuthMessage] = useState('');



  const closeMenu = () => setMenuOpen(false);

  const goTo = (id) => { closeMenu(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };



  async function submitContact(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setContactError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          project: formData.get('project'),
          message: formData.get('message')
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to send your message. Please try again.');
      form.reset();
      setSent(true);
      if (result.confirmationEmailSent === false) setContactError('Your message was saved, but the confirmation email could not be sent.');
    } catch (error) {
      setContactError(error.message || 'Unable to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function submitAuth(e) {

    e.preventDefault();

    setAuthMessage('This is a frontend demo. Connect an authentication service to enable accounts.');

  }



  return (

    <div className="site-shell">

      <div className="announcement"><Sparkles size={14} /> A creative technology studio for what comes next <span className="announce-link" onClick={() => goTo('about')}>Meet MetaWorld <ArrowRight size={13} /></span></div>

      <header className="header">

        <a className="brand" href="#home" onClick={closeMenu} aria-label="MetaWorld home"><span className="brand-symbol"><span /></span><span>meta<span className="brand-light">world</span><small>CREATIVE TECHNOLOGY</small></span></a>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>

          <a href="#services" onClick={closeMenu}>What we do</a>

          <a href="#work" onClick={closeMenu}>Our work</a>

          <a href="#about" onClick={closeMenu}>About us</a>

          <a href="#contact" onClick={closeMenu}>Contact</a>

          <button className="nav-login" onClick={() => { setModal('login'); closeMenu(); }}>Log in</button>

          <button className="button button-small" onClick={() => { setModal('signup'); closeMenu(); }}>Let’s talk <ArrowUpRightIcon /></button>

        </nav>

        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>

      </header>



      <main>

        <section className="hero section-wrap" id="home">

          <div className="hero-copy">

            <div className="eyebrow"><span className="status-dot" /> INDEPENDENT DIGITAL STUDIO</div>

            <h1>Build what's<br />next<span className="period">.</span><br /><span className="outline-text">Make it matter.</span></h1>

            <p className="hero-desc">We turn big ideas into meaningful digital experiences. Strategy, design and technology — all working together.</p>

            <div className="hero-actions">

              <button className="button" onClick={() => goTo('work')}>Explore our work <ArrowRight size={17} /></button>

              <button className="text-button" onClick={() => goTo('services')}>What we do <ArrowDownRight size={17} /></button>

            </div>

            <div className="hero-note"><div className="avatar-stack"><span>M</span><span>W</span><span>+</span></div><span>Curious minds. <strong>Real-world impact.</strong></span></div>

          </div>

          <div className="hero-art" aria-label="Abstract digital artwork">

            <div className="art-grid" />

            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />

            <div className="art-core"><span className="core-shine" /><span className="core-letter">M</span></div>

            <div className="float-card card-top"><span className="tiny-icon"><Zap size={14} /></span><span>Ideas into impact</span><b>↗</b></div>

            <div className="float-card card-bottom"><span className="mini-bars"><i /><i /><i /><i /></span><span><b>Better by design</b><small>Built for what's next</small></span></div>

            <div className="art-caption">FIG. 01 — THE POSSIBLE, IN MOTION</div>

          </div>

          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><div className="scroll-line" /><span>01 / 04</span></div>

        </section>



        <section className="trust-strip">

          <span>GOOD IDEAS DESERVE GREAT EXECUTION</span><div className="trust-items"><span><Globe2 /> Digital-first</span><span><ShieldCheck /> People-focused</span><span><Zap /> Built to scale</span></div>

        </section>



        <section className="section-wrap services-section" id="services">

          <div className="section-heading"><div><div className="eyebrow">HOW WE HELP</div><h2>From first spark<br />to <span className="muted-heading">what's next.</span></h2></div><p>We bring clarity to complexity and craft to every detail — so your next big move feels less like a leap and more like a plan.</p></div>

          <div className="services-grid">{services.map(s => <article className="service-card" key={s.number}><div className="service-top"><span className="service-icon">{s.icon}</span><span className="service-number">{s.number}</span></div><h3>{s.title}</h3><p>{s.text}</p><button className="circle-arrow" aria-label={`Learn about ${s.title}`} onClick={() => goTo('contact')}><ArrowUpRightIcon /></button></article>)}</div>

        </section>



        <section className="work-section" id="work">

          <div className="section-wrap">

            <div className="section-heading work-heading"><div><div className="eyebrow">A FEW THINGS WE'VE MADE</div><h2>Good work.<br /><span className="muted-heading">Good energy.</span></h2></div><button className="text-button" onClick={() => goTo('contact')}>Have a project in mind? <ArrowRight size={17} /></button></div>

            <div className="projects-grid">{projects.map((p, i) => <article className="project-card" key={p.title}><div className={`project-visual ${p.color}`}><div className="project-orb orb-a" /><div className="project-orb orb-b" /><span className="project-mark">{p.mark}</span><span className="project-index">0{i + 1}</span><span className="project-visual-caption">SELECTED WORK / 2025—26</span></div><div className="project-meta"><div><span className="project-type">{p.type}</span><h3>{p.title}</h3><p>{p.desc}</p></div><button className="circle-arrow" aria-label={`Ask about ${p.title}`} onClick={() => goTo('contact')}><ArrowUpRightIcon /></button></div></article>)}</div>

          </div>

        </section>



        <section className="about-section section-wrap" id="about">

          <div className="about-art"><div className="about-ring ring-1" /><div className="about-ring ring-2" /><div className="about-center"><Sparkles size={34} /><span>MAKE<br />IT MATTER</span></div><span className="about-coordinate">17°N / INFINITE POSSIBILITIES</span></div>

          <div className="about-copy"><div className="eyebrow">A LITTLE ABOUT US</div><h2>Technology is the tool.<br /><span className="muted-heading">People are the point.</span></h2><p>MetaWorld is a creative technology studio helping ambitious teams make their mark. We mix thoughtful strategy, expressive design and dependable engineering to make digital things that work beautifully.</p><p>Small enough to care about every detail. Big-picture enough to see where you're going.</p><button className="button" onClick={() => goTo('contact')}>Get to know us <ArrowRight size={17} /></button></div>

        </section>



        <section className="contact-section" id="contact"><div className="section-wrap contact-layout"><div className="contact-copy"><div className="eyebrow"><span className="status-dot" /> YOUR NEXT CHAPTER STARTS HERE</div><h2>Got a good<br />feeling<span className="period">?</span></h2><p>Tell us what you're dreaming up. The early, messy, not-quite-sure-yet stage is our favorite.</p><div className="contact-detail"><span className="contact-detail-icon">↗</span><span><small>GOOD THINGS START WITH A HELLO</small><strong>hello@metaworld.studio</strong></span></div></div>

          <form className="contact-form" onSubmit={submitContact}><div className="form-head"><span>LET'S MAKE SOMETHING</span><span>✳</span></div>{sent ? <div className="success-message"><span>✓</span><h3>Message received!</h3><p>Thanks for reaching out. We’ve saved your enquiry and sent a confirmation email if email delivery is configured.</p>{contactError && <p className="contact-error">{contactError}</p>}<button type="button" className="text-button" onClick={() => { setSent(false); setContactError(''); }}>Send another <ArrowRight size={16} /></button></div> : <><label>Your name<input required name="name" placeholder="What should we call you?" /></label><label>Email address<input required type="email" name="email" placeholder="you@company.com" /></label><label>What are you thinking about?<select name="project" defaultValue=""><option value="" disabled>Choose a starting point</option><option>Website or digital product</option><option>Brand and design</option><option>Product strategy</option><option>Something else entirely</option></select></label><label>A little more detail<textarea name="message" rows="3" placeholder="The big idea, the small details, all of it..." /></label><button className="button form-submit" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send your note'} <ArrowRight size={17} /></button>{contactError && <p className="contact-error" role="alert">{contactError}</p>}<p className="form-privacy">No spam, no pressure. Just a real conversation.</p></>}</form>

        </div></section>

      </main>



      <footer className="footer"><div className="footer-top"><a className="brand" href="#home"><span className="brand-symbol"><span /></span><span>meta<span className="brand-light">world</span><small>CREATIVE TECHNOLOGY</small></span></a><span className="footer-tagline">A little more possible, every day.</span><button className="back-top" onClick={() => goTo('home')}>Back to top ↑</button></div><div className="footer-bottom"><span>© 2026 MetaWorld Studio. Demo website.</span><span>MADE WITH CURIOSITY <span className="period">✳</span></span><div><a href="#services">Services</a><a href="#work">Work</a><a href="#contact">Contact</a></div></div></footer>



      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) { setModal(''); setAuthMessage(''); } }}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="modal-close" onClick={() => { setModal(''); setAuthMessage(''); }} aria-label="Close"><X size={20} /></button><div className="auth-mark"><span className="brand-symbol"><span /></span></div><div className="eyebrow">{modal === 'login' ? 'WELCOME BACK' : 'COME BUILD WITH US'}</div><h2 id="auth-title">{modal === 'login' ? 'Good to see you.' : 'Your next chapter.'}</h2><p>{modal === 'login' ? 'Sign in to continue to your MetaWorld space.' : 'Create an account to stay connected with MetaWorld.'}</p><form onSubmit={submitAuth}><label>Email address<input required type="email" placeholder="you@example.com" /></label><label>Password<input required type="password" minLength="6" placeholder="At least 6 characters" /></label><button className="button form-submit" type="submit">{modal === 'login' ? 'Log in' : 'Create account'} <ArrowRight size={17} /></button></form>{authMessage && <p className="auth-note">{authMessage}</p>}<p className="switch-auth">{modal === 'login' ? "New around here?" : 'Already have an account?'} <button onClick={() => { setModal(modal === 'login' ? 'signup' : 'login'); setAuthMessage(''); }}>{modal === 'login' ? 'Sign up' : 'Log in'}</button></p><p className="auth-disclaimer">Demo UI only — no account details are stored or sent.</p></section></div>}

    </div>

  );

}






createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);

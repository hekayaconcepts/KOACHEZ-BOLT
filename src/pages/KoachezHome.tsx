import React, { useState, useEffect } from 'react';

const coaches = [
  { initials: 'AM', name: 'Amara Osei', niche: 'Executive Leadership', location: 'London, UK', sessions: '200+', color: '#1a6fb5' },
  { initials: 'JT', name: 'James Thornton', niche: 'Business Strategy', location: 'New York, USA', sessions: '350+', color: '#0e5a9e' },
  { initials: 'SC', name: 'Sofia Chen', niche: 'Life Coaching', location: 'San Francisco, USA', sessions: '180+', color: '#1480cc' },
  { initials: 'RB', name: 'Rachel Brooks', niche: 'Career Transitions', location: 'Manchester, UK', sessions: '290+', color: '#0d4f8a' },
  { initials: 'DM', name: 'David Mensah', niche: 'Mindset & Performance', location: 'Atlanta, USA', sessions: '420+', color: '#1565a8' },
  { initials: 'LP', name: 'Laura Pierce', niche: 'Wellbeing Coaching', location: 'Edinburgh, UK', sessions: '160+', color: '#1272b8' },
];

const stats = [
  { number: '2,400+', label: 'Coaches on platform' },
  { number: '98%', label: 'Client satisfaction' },
  { number: '5 min', label: 'To your live page' },
  { number: '$0', label: 'To get started' },
];

const features = [
  { icon: '◈', title: 'Your branded coaching page', desc: 'A professional page at yourname.koachez.com — live in under 5 minutes. No design skills needed.' },
  { icon: '◉', title: 'Booking & session management', desc: 'Clients book directly from your page. You manage everything from one simple dashboard.' },
  { icon: '◎', title: 'Content hosting included', desc: 'Publish articles, host your podcast, and sell courses — all built in, all free.' },
  { icon: '◈', title: 'Video calls built in', desc: 'No third-party tools. Run your sessions directly on Koachez.' },
  { icon: '◉', title: 'Client portal', desc: 'Every client gets their own secure space to track progress, access resources, and message you.' },
  { icon: '◎', title: 'Analytics that matter', desc: 'See what content works, where clients come from, and how your practice is growing.' },
];

const CoachCard = ({ initials, name, niche, location, sessions, color }) => (
  <div
    style={{ background: '#fff', border: '1px solid #e2eaf4', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(24,95,165,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{ width: 52, height: 52, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{initials}</div>
    <div>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: '#0d2d52' }}>{name}</p>
      <p style={{ margin: '2px 0 0', fontSize: 13, color: '#185fa5' }}>{niche}</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
      <span style={{ fontSize: 12, color: '#6b8aaa' }}>{location}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#185fa5', background: '#e6f1fb', padding: '3px 10px', borderRadius: 20 }}>{sessions} sessions</span>
    </div>
  </div>
);

const KoachezHome = () => {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#0d2d52', background: '#fff', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:wght@600;700&display=swap" rel="stylesheet" />

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff', borderBottom: scrolled ? '1px solid #e2eaf4' : '1px solid transparent', transition: 'all 0.3s', padding: '0 5vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 24, color: '#185fa5' }}>Koachez</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#how" style={{ fontSize: 14, color: '#4a6a8a', textDecoration: 'none', fontWeight: 500 }}>How it works</a>
          <a href="#coaches" style={{ fontSize: 14, color: '#4a6a8a', textDecoration: 'none', fontWeight: 500 }}>Find a coach</a>
          <a href="#features" style={{ fontSize: 14, color: '#4a6a8a', textDecoration: 'none', fontWeight: 500 }}>For coaches</a>
          <button style={{ background: '#185fa5', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Get started free</button>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #e6f1fb 50%, #f8fbff 100%)', padding: '100px 5vw 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#185fa5', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, padding: '6px 16px', borderRadius: 20, marginBottom: 28, textTransform: 'uppercase' }}>Free for every coach</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1, color: '#0a2240', margin: '0 0 24px', maxWidth: 800 }}>
          Your coaching practice,<br /><span style={{ color: '#185fa5' }}>fully online.</span>
        </h1>
        <p style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: '#3a5a7a', maxWidth: 560, lineHeight: 1.7, margin: '0 0 48px' }}>
          Get your branded coaching page, booking system, video calls, courses, and podcast hosting — completely free. Live in under 5 minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!submitted ? (
            <>
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '14px 20px', borderRadius: 10, border: '1.5px solid #b5d4f4', fontSize: 15, width: 280, outline: 'none' }} />
              <button onClick={() => email && setSubmitted(true)} style={{ background: '#185fa5', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Claim your free page →</button>
            </>
          ) : (
            <div style={{ background: '#e6f1fb', color: '#185fa5', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600 }}>✓ You're on the list!</div>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#7a9ab8', marginTop: 16 }}>No credit card. No setup fee. Free forever.</p>
      </section>

      <section style={{ background: '#185fa5', padding: '48px 5vw', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, textAlign: 'center' }}>
        {stats.map(s => (
          <div key={s.label}>
            <p style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 700, color: '#fff' }}>{s.number}</p>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#b5d4f4' }}>{s.label}</p>
          </div>
        ))}
      </section>

      <section id="how" style={{ padding: '96px 5vw', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#185fa5', textTransform: 'uppercase', marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#0a2240', margin: '0 0 60px', maxWidth: 480 }}>From signup to live page in 5 minutes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up with your email. No credit card needed.' },
              { step: '02', title: 'Set up your profile', desc: 'Add your photo, bio, services, and pricing.' },
              { step: '03', title: 'Choose your subdomain', desc: "Pick yourname.koachez.com — it's yours instantly." },
              { step: '04', title: 'Go live', desc: 'Share your link. Clients start booking immediately.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ borderTop: '3px solid #185fa5', paddingTop: 24 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 700, color: '#e6f1fb' }}>{step}</span>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#0a2240', margin: '8px 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#5a7a9a', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="coaches" style={{ padding: '96px 5vw', background: '#f8fbff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#185fa5', textTransform: 'uppercase', marginBottom: 12 }}>Find a coach</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#0a2240', margin: '0 0 48px' }}>Work with the best</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {coaches.map(c => <CoachCard key={c.name} {...c} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button style={{ background: 'transparent', color: '#185fa5', border: '1.5px solid #185fa5', padding: '12px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Browse all coaches</button>
          </div>
        </div>
      </section>

      <section id="features" style={{ padding: '96px 5vw', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#185fa5', textTransform: 'uppercase', marginBottom: 12 }}>For coaches</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#0a2240', margin: '0 0 16px', maxWidth: 480 }}>Everything you need. Nothing you don't.</h2>
          <p style={{ fontSize: 17, color: '#4a6a8a', margin: '0 0 60px', maxWidth: 520, lineHeight: 1.6 }}>The full stack for independent coaches — booking, content, clients, calls. Free forever.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {features.map(f => (
              <div key={f.title} style={{ padding: 28, background: '#f8fbff', borderRadius: 14, border: '1px solid #e2eaf4' }}>
                <span style={{ fontSize: 24, color: '#185fa5' }}>{f.icon}</span>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#0a2240', margin: '16px 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#5a7a9a', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #0a2240 0%, #185fa5 100%)', padding: '96px 5vw', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Ready to grow your practice?</h2>
        <p style={{ fontSize: 18, color: '#b5d4f4', margin: '0 auto 40px', maxWidth: 480 }}>Join thousands of coaches already building their business on Koachez.</p>
        <button style={{ background: '#fff', color: '#185fa5', border: 'none', padding: '16px 40px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Get your free page today</button>
      </section>

      <footer style={{ background: '#0a2240', padding: '48px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 22, color: '#fff' }}>Koachez</span>
        <p style={{ fontSize: 13, color: '#6a8aaa', margin: 0 }}>© 2026 Koachez. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => <a key={l} href="#" style={{ fontSize: 13, color: '#6a8aaa', textDecoration: 'none' }}>{l}</a>)}
        </div>
      </footer>
    </div>
  );
};

export default KoachezHome;
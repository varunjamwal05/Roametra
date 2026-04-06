import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import './landing.css';
import heroBg from '../assets/hero_bg.png';
import destBali from '../assets/dest_bali.png';
import destSantorini from '../assets/dest_santorini.png';
import destIceland from '../assets/dest_iceland.png';

const features = [
  {
    icon: '🗺️',
    title: 'Smart Itinerary',
    desc: 'Drag-and-drop planner to organize every day of your trip with ease.',
    color: '#6c63ff',
  },
  {
    icon: '💸',
    title: 'Expense Splitting',
    desc: 'Track shared costs and settle debts instantly with one tap.',
    color: '#f093fb',
  },
  {
    icon: '🗳️',
    title: 'Group Voting',
    desc: 'Vote on destinations, hotels and activities together as a crew.',
    color: '#43e97b',
  },
  {
    icon: '🎒',
    title: 'Packing Lists',
    desc: 'Collaborative checklists so nothing ever gets left behind.',
    color: '#f5a623',
  },
];

const destinations = [
  { name: 'Bali', country: 'Indonesia', img: destBali, tag: '7 days', badge: '🌴 Trending' },
  { name: 'Santorini', country: 'Greece', img: destSantorini, tag: '5 days', badge: '🌅 Popular' },
  { name: 'Iceland', country: 'Europe', img: destIceland, tag: '10 days', badge: '🌌 Epic' },
];

const stats = [
  { num: '10K+', label: 'Trips planned' },
  { num: '85K+', label: 'Travelers' },
  { num: '120+', label: 'Countries' },
  { num: '4.9★', label: 'Average rating' },
];

const testimonials = [
  {
    name: 'Anika S.',
    avatar: '🧳',
    text: 'Roametra completely changed how our friend group plans trips. No more chaotic group chats!',
    trip: 'Bali, Indonesia',
  },
  {
    name: 'Marcus J.',
    avatar: '🌍',
    text: 'The expense splitting feature alone is worth it. Settling up after a trip has never been easier.',
    trip: 'Iceland Road Trip',
  },
  {
    name: 'Priya K.',
    avatar: '✈️',
    text: 'We voted on everything as a group and it made the trip so much more fun and democratic!',
    trip: 'Santorini, Greece',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Landing = () => {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="landing-v2">
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero-v2" ref={heroRef}>
        <div className="glow-orb orb-primary" />
        <div className="glow-orb orb-secondary" />

        <motion.div className="hero-bg-img" style={{ y: heroY }}>
          <img src={heroBg} alt="Beautiful travel destination" />
          <div className="hero-overlay" />
        </motion.div>

        <motion.div className="hero-v2-content" style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="hero-eyebrow">✈ The world is waiting</span>
            <h1 className="hero-v2-heading">
              Plan trips that<br />
              <span className="hero-highlight">everyone loves.</span>
            </h1>
            <p className="hero-v2-sub">
              Roametra brings your group's travel chaos under one roof —<br />
              itineraries, expenses, votes, and packing lists.
            </p>
            <div className="hero-v2-cta">
              <Link to={user ? "/trips/new" : "/signup"} className="btn-premium">
                <span className="btn-premium-text">{user ? "Plan a New Trip" : "Start Exploring Free"}</span>
                <span className="btn-premium-icon">→</span>
              </Link>
              {!user && (
                <Link to="/login" className="btn-premium-ghost">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="hero-scroll-cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="scroll-dot" />
            <span>Scroll to explore</span>
          </motion.div>
        </motion.div>

        {/* Floating stat chips */}
        <motion.div
          className="hero-stat-chips"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="hero-stat-chip">
              <span className="chip-num">{s.num}</span>
              <span className="chip-label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── DESTINATIONS ─────────────────────────── */}
      <section className="section-destinations relative-section">
        <div className="glow-orb orb-accent" />
        <div className="section-inner">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">Popular destinations</span>
            <h2 className="section-heading">Where will<br /><em>you</em> go next?</h2>
          </motion.div>

          <motion.div
            className="dest-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {destinations.map((d, i) => (
              <motion.div key={d.name} className={`dest-card ${i === 0 ? 'dest-card-large' : ''}`} variants={itemVariants}>
                <div className="dest-img-wrap">
                  <img src={d.img} alt={d.name} />
                  <div className="dest-gradient" />
                </div>
                <span className="dest-badge">{d.badge}</span>
                <div className="dest-info">
                  <span className="dest-tag">{d.tag}</span>
                  <h3 className="dest-name">{d.name}</h3>
                  <span className="dest-country">📍 {d.country}</span>
                </div>
                <Link to={user ? "/trips/new" : "/signup"} className="dest-plan-btn">Plan this trip →</Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="section-how">
        <div className="section-inner">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">Getting started</span>
            <h2 className="section-heading">Your trip<br /><em>in 3 steps</em></h2>
          </motion.div>

          <div className="steps-grid">
            {[
              { num: '01', icon: '🌐', title: 'Create a Trip', desc: 'Set your destination, dates, and invite your travel crew to join.' },
              { num: '02', icon: '🗺️', title: 'Plan Together', desc: 'Build your itinerary, vote on activities, and keep track of all costs.' },
              { num: '03', icon: '🛫', title: 'Go & Enjoy', desc: 'Hit the road knowing everything is organized. Settle up after you return.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="step-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <span className="step-num">{step.num}</span>
                <span className="step-icon">{step.icon}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < 2 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="section-features relative-section">
        <div className="glow-orb orb-primary-right" />
        <div className="section-inner">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow">Everything you need</span>
            <h2 className="section-heading">One app.<br /><em>All the tools.</em></h2>
          </motion.div>

          <motion.div
            className="features-v2-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {features.map((f) => (
              <motion.div key={f.title} className="feature-v2-card" variants={itemVariants}>
                <div className="feature-v2-icon-wrap" style={{ '--feat-color': f.color }}>
                  <span className="feature-v2-icon">{f.icon}</span>
                </div>
                <h3 className="feature-v2-title">{f.title}</h3>
                <p className="feature-v2-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="section-testimonials">
        <div className="section-inner">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-eyebrow">Loved by travelers</span>
            <h2 className="section-heading">What our<br /><em>adventurers</em> say</h2>
          </motion.div>

          <motion.div
            className="testimonials-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} className="testimonial-card" variants={itemVariants}>
                <div className="testimonial-avatar">{t.avatar}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-footer">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-trip">📍 {t.trip}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="section-final-cta">
        <div className="final-cta-bg" />
        <motion.div
          className="final-cta-content"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow light">Ready to take off?</span>
          <h2 className="final-cta-heading">Your next adventure<br />starts here.</h2>
          <p className="final-cta-sub">
            Join thousands of travelers already planning smarter.<br />Free forever, no credit card required.
          </p>
          <Link to={user ? "/trips/new" : "/signup"} className="btn-premium btn-premium-large">
            <span className="btn-premium-text">{user ? "Plan your next adventure" : "Create your first trip — it's free"}</span>
            <span className="btn-premium-icon">✈</span>
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="footer-v2">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">✈ Roametra</span>
            <p>Made for wanderers. Built for groups.</p>
          </div>
          <div className="footer-links">
            <Link to="/signup">Get Started</Link>
            <Link to="/login">Sign In</Link>
          </div>
          <p className="footer-copy">© 2025 Roametra. All rights reserved 🌍</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

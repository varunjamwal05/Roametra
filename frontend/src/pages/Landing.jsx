import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';

const features = [
  { icon: '🗺️', title: 'Smart Itinerary', desc: 'Drag-and-drop planner to organize every day of your trip' },
  { icon: '💸', title: 'Expense Splitting', desc: 'Track shared costs and settle debts with one tap' },
  { icon: '🗳️', title: 'Group Voting', desc: 'Vote on destinations, hotels and activities together' },
  { icon: '🎒', title: 'Packing Lists', desc: 'Shared collaborative checklists so nothing gets left behind' },
];

const Landing = () => (
  <div className="landing">
    <Navbar />
    <main>
      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-badge">✈ Travel Together</span>
          <h1 className="hero-heading">
            Plan trips with friends,<br />
            <span className="gradient-text">effortlessly.</span>
          </h1>
          <p className="hero-sub">
            Roametra brings your group's travel chaos under one roof —
            itineraries, expenses, votes, and packing lists.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="hero-card-stack">
            <div className="mock-card mock-card-1">🌏 Bali Trip — 7 days</div>
            <div className="mock-card mock-card-2">💸 $240 to settle</div>
            <div className="mock-card mock-card-3">✅ 12 items packed</div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <h2 className="section-title">Everything you need</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Ready to plan your next adventure?</h2>
          <Link to="/signup" className="btn btn-primary btn-lg">Create your first trip →</Link>
        </motion.div>
      </section>
    </main>

    <footer className="footer">
      <p>© 2025 Roametra. Made for wanderers 🌍</p>
    </footer>
  </div>
);

export default Landing;

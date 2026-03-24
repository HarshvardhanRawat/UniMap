import { motion } from 'motion/react';
import { Button } from './ui/button';
import logoWebp from '../../assets/logo.webp';
import mitslogo from '../../assets/clg_logo.webp';
import mentorMd from '../../assets/DrMD.webp';
import mentorSa from '../../assets/DrSA.webp';
import developerProfile from '../../assets/profile.webp';

/**
 * LoginPage Component
 * 
 * Displays the login interface with Google authentication option.
 * Provides a simple login flow that sets a default user name.
 * 
 * @param {function} onLogin - Callback function called when user logs in
 *                            Receives the user's name as parameter
 * @param {number} searchCount - Total number of location searches made by users
 */
export default function LoginPage({ onLogin, searchCount = 0 }) {
  /**
   * Handles Google login button click.
   * Currently uses a default user name for demonstration.
   * TODO: Integrate with actual Google OAuth when backend is ready.
   */
  const handleGoogleLogin = () => {
    onLogin('Student User');
  };

  const highlights = [
    { title: '🔍 Smart Search', text: 'Quickly find any room, lab, or location on campus.' },
    { title: '🧭 Multi-Floor Navigation', text: 'Seamlessly navigate across different floors and buildings.' },
    { title: '⚡Real-Time Pathfinding', text: 'Instantly calculates the shortest and most efficient route.' },
    { title: '🗺️ Interactive Map', text: 'Dynamic map with clickable nodes for easy exploration.' },
  ];

  return (
    // Login Page Container
    <div className="login-page-root">
      <div className="login-page-grid">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="login-left-panel hidden lg:block"
        >
          <div className="login-left-radial" />
          <div className="login-left-content">
            <picture className="login-left-logo-wrap">
              <source srcSet={mitslogo} type="image/webp" />
              <img src={mitslogo} alt="UniMap Logo" className="h-16 w-16 rounded-full object-cover" decoding="async" />
            </picture>

            <h1 className="text-center text-3xl font-bold leading-tight sm:text-4xl">UniMap Campus Navigator</h1>
            <p className="mt-3 max-w-xl text-center text-sm text-blue-100 sm:text-base">
              Navigate your campus effortlessly with smart search, indoor routes, and quick destination guidance.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs text-blue-100">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm text-center">
              <p className="text-3xl font-bold text-white">{searchCount.toLocaleString()}</p>
              <p className="text-sm text-blue-100 mt-1">Total Destinations Searched</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          className="login-right-panel"
        >
          <div className="w-full max-w-md">
            <div className="login-mobile-hero">
              <div className="login-mobile-brand">
                <div className="text-center">
                  <picture className="login-left-logo-wrap !mb-2 !p-2">
                    <source srcSet={mitslogo} type="image/webp" />
                    <img src={mitslogo} alt="MITS Logo" className="h-12 w-12 rounded-full object-cover" decoding="async" />
                  </picture>
                  <p className="text-xs text-slate-600">
                    Madhav Institute of Technology and Science, Gwalior
                  </p>
                </div>
              </div>

              <div className="login-main-card">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center justify-center mb-4"
                  >
                    <picture>
                      <source srcSet={logoWebp} type="image/webp" />
                      <img src={logoWebp} alt="UniMap Logo" className="w-44 h-auto" decoding="async" />
                    </picture>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2l font-bold text-slate-900"
                  >
                    Welcome to UniMap
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500"
                  >
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="login-google-btn"
                  >
                    Continue to UniMap
                  </Button>
                </motion.div>
              </div>
            </div>

            <div className="login-dev-card">
              <p className="text-center text-base font-medium text-slate-800">Developed by</p>

              <div className="login-dev-inner">
                <img
                  src={developerProfile}
                  alt="Developer profile"
                  className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <h3 className="mt-2 text-xl font-semibold leading-none text-slate-900">Harshvardhan Rawat</h3>
                <p className="mt-1 text-sm text-slate-600">CSD 1st Year</p>

                <div className="mt-3 flex items-center justify-center gap-2.5">
                  <a
                    href="https://www.linkedin.com/in/Harshvardhan-Rawat"
                    target="_blank"
                    rel="noreferrer"
                    className="login-social-btn text-indigo-600"
                    aria-label="LinkedIn profile"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0zM8 8h4.8v2.2h.1c.7-1.3 2.4-2.7 4.9-2.7 5.2 0 6.2 3.3 6.2 7.7V24h-5v-7.6c0-1.8 0-4.2-2.6-4.2s-3 2-3 4v7.8H8z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/HarshvardhanRawat"
                    target="_blank"
                    rel="noreferrer"
                    className="login-social-btn text-slate-700"
                    aria-label="GitHub profile"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.5-4-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 0 1 1.2-3.2c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.9 5.7-5.7 6 .5.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
                    </svg>
                  </a>
                  <a
                    href="https://harshvardhanrawat.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="login-social-btn text-rose-500"
                    aria-label="Website"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93V18a1 1 0 0 0-1-1H8v-2a1 1 0 0 0-1-1H4.07A8.018 8.018 0 0 1 4 12c0-.34.02-.673.07-1H6a1 1 0 0 0 1-1V8a1 1 0 0 0-.293-.707L5.05 5.636A7.98 7.98 0 0 1 12 4c.342 0 .68.021 1 .07V5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5.93c.952.283 1.82.757 2.56 1.374L17 8h-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3.93c.05.327.07.66.07 1a8.018 8.018 0 0 1-.07 1H18a1 1 0 0 0-1 1v2h-2a1 1 0 0 0-1 1v1.93A8.026 8.026 0 0 1 11 19.93z" />
                    </svg>
                  </a>
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-slate-800">Built under the guidance of</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center text-center">
                  <div className="login-professor-frame">
                    <img src={mentorMd} alt="Dr. Manish Dixit" className="h-12 w-12 rounded-full object-cover" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-900">Dr. Manish Dixit</p>
                  <p className="text-xs text-slate-600">Professor & Head, CS</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="login-professor-frame">
                    <img src={mentorSa} alt="Dr. Saurabh Agarwal" className="h-12 w-12 rounded-full object-cover" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-900">Dr. Saurabh Agarwal</p>
                  <p className="text-xs text-slate-600">Assistant Professor</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

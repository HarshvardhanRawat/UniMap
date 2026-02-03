import { motion } from 'motion/react';
import { Button } from './ui/button';
import logo from '../../assets/logo.png';


//Login Page Component
export default function LoginPage({ onLogin }) {
  const handleGoogleLogin = () => {
    onLogin('Student User');
  };

  return (
    //  Login Page Container
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 md:p-10 border border-gray-100">
          <div className="text-center mb-8">

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-4"
            >
  
              <img src={logo} alt="UniMap Logo" className="w-48 h-auto" />

            </motion.div>
            {/* Logo Ends Here */}

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500"
            >

              Navigate your campus effortlessly

            </motion.p>
            {/* Tagline Ends Here  */}


          </div>
          
          {/* Login Options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >

            {/* Google Login Button  */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-14 rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700"
            >
              
              {/* Google Logo Svg */}
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {/* SVG Ends Here */}

              Continue with Google

            </Button>
            {/* Login with Google Button Ends Here */}

          </motion.div>
          {/* Login Options Ends Here */}

        </div>
      </motion.div>
    </div>
  );
}

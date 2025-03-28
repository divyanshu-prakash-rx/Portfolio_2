import React, { useState } from 'react';
import { Menu, X, Home, User, Briefcase, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
    { icon: <User className="w-5 h-5" />, label: 'About', href: '/about' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Projects', href: '/projects' },
    { icon: <Mail className="w-5 h-5" />, label: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.a 
            href="/" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-extrabold "
          >
            DP
          </motion.a>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button 
              onClick={toggleMenu} 
              whileTap={{ scale: 0.9 }}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-all duration-300 group relative"
              >
                {item.icon}
                <span className="ml-2 font-medium">{item.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-md">
                {navItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-3 rounded-md transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    {item.icon}
                    <span className="ml-3 font-medium">{item.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
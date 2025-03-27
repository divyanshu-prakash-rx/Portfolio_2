import React, { useState } from 'react';
import { Menu, X, Home, User, Briefcase, Mail } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a 
            href="/" 
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
          >
           DP
          </a>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
              >
                {item.icon}
                <span className="ml-2 group-hover:text-blue-600">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-md">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
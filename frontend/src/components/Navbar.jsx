import React, { useState } from 'react';
import { Menu, X, Home, User, Briefcase, Mail } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const mainNavItems = [
    { icon: <Home />, label: 'Home', href: '/' },
    { icon: <User />, label: 'About', href: '/about' },
    { icon: <Briefcase />, label: 'Projects', href: '/projects' },
    { icon: <Mail />, label: 'Contact', href: '/contact' }
  ];

  const socialNavItems = [
    { label: 'GitHub', href: 'https://github.com/divyanshu-prakash-rx', className: 'text-gray-700 hover:text-black' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/divyanshu-prakash-rx/', className: 'text-blue-600 hover:text-blue-800' },
    { label: 'Twitter', href: 'https://x.com/DivyanshuPrak20', className: 'text-blue-400 hover:text-blue-600' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center text-2xl font-bold text-orange-600">
           
            <a href="/" className="text-2xl font-bold text-gray-800">
              DP
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <div className="flex space-x-4">
              {mainNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </a>
              ))}
            </div>

            {/* Social Navigation */}
            <div className="flex space-x-4">
              {socialNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${item.className} transition-colors duration-300`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {mainNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </a>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex justify-center space-x-4">
                {socialNavItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${item.className} transition-colors duration-300`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
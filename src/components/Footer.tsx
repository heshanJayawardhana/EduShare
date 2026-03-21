import React from 'react';
import { Mail, Users } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">EduShare</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering students to share knowledge and earn from their academic contributions.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Built for academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Browse Resources
                </a>
              </li>
              <li>
                <a href="/upload" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Upload Resource
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-300 hover:text-white text-sm transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/help-center" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a 
                  href="mailto:support@edushare.com" 
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  support@edushare.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  +94 77 123 4567
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  Colombo, Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2026 EduShare. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12zm-6.93-6.494h2.782v-1.475c0-1.356.724-2.25 2.25-2.25h1.475v-2.782h-2.25c-1.526 0-3 1.474-3 3v1.475h-1.5v2.782h1.5v4.5h2.782v-4.5z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.14-2.735 4.958 4.958 0 00-2.14 2.735 10 10 0 012.825-.775 4.958 4.958 0 002.14 2.735 10 10 0 01-2.825.775 4.958 4.958 0 002.14 2.735 10 10 0 01-2.825.775z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0 0-1.446 1.389-1.446 1.389v-2.66h2.918c.052-.648.052-1.525.052-2.436 0-4.828-3.262-8.246-3.262-8.246s-3.262 3.418-3.262 8.246c0 4.828 3.262 8.246 3.262 8.246s3.262-3.418-3.262 8.246zm-1.446-4.828h-2.918v2.66s-1.446 0-1.446 1.389c0 1.826 1.852 3.037 1.852 3.037h3.554v5.569h2.918c.052-.648.052-1.525.052-2.436 0-4.828-3.262-8.246-3.262-8.246s-3.262 3.418-3.262 8.246zm-1.446-4.828h-2.918v2.66s-1.446 0-1.446 1.389c0 1.826 1.852 3.037 1.852 3.037h3.554v5.569h2.918c.052-.648.052-1.525.052-2.436 0-4.828-3.262-8.246-3.262-8.246s-3.262 3.418-3.262 8.246zm-1.446-4.828h-2.918v2.66s-1.446 0-1.446 1.389c0 1.826 1.852 3.037 1.852 3.037h3.554v5.569h2.918c.052-.648.052-1.525.052-2.436 0-4.828-3.262-8.246-3.262-8.246s-3.262 3.418-3.262 8.246z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

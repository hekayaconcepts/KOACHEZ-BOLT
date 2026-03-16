import React from 'react';
import { coachProfile } from '../data/coachData';
import { Linkedin, Youtube, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: 'Home', view: 'home' },
      { label: 'Articles', view: 'articles' },
      { label: 'Podcast', view: 'podcast' },
      { label: 'Courses', view: 'courses' },
    ],
    services: [
      { label: 'Coaching Packages', view: 'services' },
      { label: 'Book a Session', view: 'booking' },
      { label: 'Free Consultation', view: 'booking' },
      { label: 'Corporate Training', view: 'services' },
    ],
    support: [
      { label: 'About', view: 'about' },
      { label: 'Contact', view: 'contact' },
      { label: 'FAQ', view: 'faq' },
      { label: 'Testimonials', view: 'testimonials' },
    ],
    legal: [
      { label: 'Privacy Policy', view: 'privacy' },
      { label: 'Terms of Service', view: 'terms' },
      { label: 'Refund Policy', view: 'refund' },
    ],
  };

  return (
    <footer className="bg-sky-900 text-white">
      {/* Newsletter section */}
      <div className="border-b border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-sky-200">Get weekly leadership insights delivered to your inbox.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-sky-800 border border-sky-700 text-white placeholder-sky-400 focus:outline-none focus:border-sky-500 w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-sky-900 font-medium rounded-lg hover:bg-sky-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {coachProfile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="ml-3 font-semibold">{coachProfile.name}</span>
            </div>
            <p className="text-sky-200 text-sm mb-6">
              {coachProfile.title}
            </p>
            
            {/* Social links */}
            <div className="flex space-x-3">
              <a
                href={coachProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={coachProfile.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={coachProfile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-sky-200 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services links */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-sky-200 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className="text-sky-200 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${coachProfile.email}`}
                  className="text-sky-200 hover:text-white transition-colors text-sm flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </li>
              <li>
                <a
                  href={`tel:${coachProfile.phone}`}
                  className="text-sky-200 hover:text-white transition-colors text-sm flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </li>
              <li>
                <span className="text-sky-200 text-sm flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Virtual / Global
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sky-300 text-sm">
              © {currentYear} {coachProfile.name}. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.view)}
                  className="text-sky-300 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { coachProfile, featuredOn } from '../data/coachData';
import { Play, Calendar, ArrowRight, Linkedin, Youtube, Instagram } from 'lucide-react';

interface HeroSectionProps {
  onBookSession: () => void;
  onWatchIntro: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBookSession, onWatchIntro }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-100" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-300 rounded-full blur-3xl opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-sky-100 rounded-full mb-6">
              <span className="w-2 h-2 bg-sky-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-sky-700">Now accepting new clients</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sky-900 leading-tight mb-6">
              {coachProfile.tagline}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {coachProfile.bio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button
                onClick={onBookSession}
                className="inline-flex items-center justify-center px-8 py-4 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book a Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button
                onClick={onWatchIntro}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-sky-700 font-semibold rounded-xl border-2 border-sky-200 hover:border-sky-300 hover:bg-sky-50 transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Introduction
              </button>
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <span className="text-sm text-gray-500">Follow me:</span>
              <a
                href={coachProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <Linkedin className="w-5 h-5 text-sky-600" />
              </a>
              <a
                href={coachProfile.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <Youtube className="w-5 h-5 text-red-500" />
              </a>
              <a
                href={coachProfile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <Instagram className="w-5 h-5 text-pink-500" />
              </a>
            </div>
          </div>

          {/* Right content - Coach image */}
          <div className="relative">
            <div className="relative mx-auto w-72 h-72 sm:w-96 sm:h-96 lg:w-full lg:h-auto lg:aspect-square max-w-lg">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-4 border-sky-200 border-dashed animate-spin-slow" style={{ animationDuration: '20s' }} />
              
              {/* Main image container */}
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl">
                <img
                  src={coachProfile.image}
                  alt={coachProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating stats cards */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-4 hidden sm:block">
                <div className="text-2xl font-bold text-sky-600">500+</div>
                <div className="text-sm text-gray-500">Clients Coached</div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 hidden sm:block">
                <div className="text-2xl font-bold text-sky-600">15+</div>
                <div className="text-sm text-gray-500">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured On Section */}
        <div className="mt-20 pt-12 border-t border-sky-100">
          <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {featuredOn.map((item, index) => (
              <div
                key={index}
                className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors cursor-default"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

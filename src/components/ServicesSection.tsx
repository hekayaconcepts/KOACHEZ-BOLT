import React from 'react';
import { services } from '../data/coachData';
import { Check, ArrowRight, Star } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
  fullPage?: boolean;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, fullPage = false }) => {
  return (
    <section className={`${fullPage ? 'min-h-screen py-12' : 'py-20'} bg-gradient-to-b from-white to-sky-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full mb-4">
            Coaching Packages
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-4">
            Choose Your Path to Growth
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the coaching package that best fits your goals and schedule. All packages include personalized attention and proven frameworks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                service.popular ? 'ring-2 ring-sky-500 scale-105 md:scale-110 z-10' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-center py-2 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${service.popular ? 'pt-14' : ''}`}>
                <h3 className="text-xl font-bold text-sky-900 mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{service.subtitle}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-sky-600">${service.price}</span>
                  <span className="text-gray-500 ml-2">/ {service.frequency.toLowerCase()}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                  <span className="font-medium">{service.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{service.frequency}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="w-3 h-3 text-sky-600" />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectService(service.id)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center ${
                    service.popular
                      ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/30'
                      : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Not sure which package is right for you?</p>
          <button
            onClick={() => onSelectService('consultation')}
            className="text-sky-600 font-medium hover:text-sky-700 transition-colors inline-flex items-center"
          >
            Book a free 15-minute consultation
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

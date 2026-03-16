import React, { useState } from 'react';
import { testimonials } from '../data/coachData';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  fullPage?: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ fullPage = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (fullPage) {
    return (
      <section className="min-h-screen py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full mb-4">
              Client Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-4">
              What My Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from leaders who have transformed their careers through coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-sky-900">{testimonial.name}</h3>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    <p className="text-sky-600 text-sm">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

                <Quote className="w-8 h-8 text-sky-200 mb-4" />
                
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-full mb-4">
            Client Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-4">
            Trusted by Leaders
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from executives who have transformed their leadership through our coaching partnership.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-24 h-24 rounded-full object-cover flex-shrink-0"
              />
              
              <div className="text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-4">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                <Quote className="w-10 h-10 text-sky-200 mb-4 mx-auto sm:mx-0" />

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  "{testimonials[currentIndex].quote}"
                </p>

                <div>
                  <h4 className="font-semibold text-sky-900">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-gray-500">
                    {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="w-5 h-5 text-sky-600" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-sky-500'
                      : 'bg-sky-200 hover:bg-sky-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5 text-sky-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Clients Coached' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '15+', label: 'Years Experience' },
            { value: '50+', label: 'Companies Served' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-sky-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

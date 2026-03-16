import React, { useState } from 'react';
import { services, bookingSlots, coachProfile } from '../data/coachData';
import { Calendar, Clock, Check, ArrowLeft, ArrowRight, User, Mail, MessageSquare } from 'lucide-react';

interface BookingSectionProps {
  selectedServiceId?: string;
  onBack?: () => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({ selectedServiceId, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(selectedServiceId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const service = services.find(s => s.id === selectedService);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isComplete) {
    return (
      <section className="min-h-screen py-12 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-sky-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your session has been scheduled. You'll receive a confirmation email at {formData.email} with all the details.
            </p>
            
            <div className="bg-sky-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-sky-900 mb-4">Session Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Package:</span>
                  <span className="font-medium text-sky-900">{service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-sky-900">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium text-sky-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-sky-900">{service?.duration}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="px-6 py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-12 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-sky-600 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          )}
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Book a Session</h1>
          <p className="text-gray-600">Schedule your coaching session with {coachProfile.name}</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= s
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 sm:w-32 h-1 mx-2 rounded ${
                    step > s ? 'bg-sky-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Select a Package</h2>
            
            <div className="space-y-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedService === s.id
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sky-900">{s.name}</h3>
                      <p className="text-sm text-gray-500">{s.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-sky-600">${s.price}</div>
                      <div className="text-sm text-gray-500">{s.frequency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedService}
              className="w-full mt-8 py-4 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Select Date & Time</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Date selection */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-sky-500" />
                  Available Dates
                </h3>
                <div className="space-y-2">
                  {bookingSlots.map((slot) => (
                    <button
                      key={slot.date}
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime('');
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedDate === slot.date
                          ? 'bg-sky-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatDate(slot.date)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selection */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-sky-500" />
                  Available Times
                </h3>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2">
                    {bookingSlots
                      .find(s => s.date === selectedDate)
                      ?.times.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg text-center transition-colors ${
                            selectedTime === time
                              ? 'bg-sky-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Please select a date first</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 py-4 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Your Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    What would you like to discuss? (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all resize-none"
                    placeholder="Tell me about your goals and what you'd like to achieve..."
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 p-4 bg-sky-50 rounded-xl">
                <h3 className="font-medium text-sky-900 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Package:</span>
                    <span className="font-medium">{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-sky-200">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-bold text-sky-600">${service?.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <Check className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSection;

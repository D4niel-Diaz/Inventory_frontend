'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { toast } from 'react-toastify';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(
        "Message sent successfully! We'll get back to you soon."
      );
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0a2540] bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 border-cyan-400 shadow-2xl p-8">
            <h1 className="text-4xl font-serif text-center text-cyan-300 mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-300 text-center mb-8">
              We&apos;re here to help! Reach out for support, feedback, or business
              inquiries.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-3 py-3 bg-transparent border-2 border-cyan-600 rounded-lg text-white"
                placeholder="Your Full Name"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full px-3 py-3 bg-transparent border-2 border-cyan-600 rounded-lg text-white"
                placeholder="Your Email Address"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="block w-full px-3 py-3 bg-transparent border-2 border-cyan-600 rounded-lg text-white"
                placeholder="Subject (e.g., Technical Support, Feature Request)"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="block w-full px-3 py-3 bg-transparent border-2 border-cyan-600 rounded-lg text-white resize-none"
                placeholder="Your Message"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-cyan-600 text-center">
              <p className="text-gray-300">
                <span className="text-cyan-400">📧 Email:</span>{' '}
                support@inventory.com
              </p>
              <p className="text-gray-300">
                <span className="text-cyan-400">📞 Phone:</span> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

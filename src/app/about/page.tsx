'use client';

import Navigation from '@/components/Navigation';

export default function About() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a2540] bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 border-cyan-400 shadow-2xl p-8">
            <h1 className="text-4xl font-serif text-center text-cyan-300 mb-8">
              About Us
            </h1>
            
            <div className="bg-[#0a2540] bg-opacity-60 rounded-xl border border-cyan-600 p-6 mb-8">
              <p className="text-gray-200 text-center leading-relaxed">
                Our Inventory Management System is a web-based application that manages items efficiently. 
                This system ensures efficient monitoring items, prevents overdue borrowing, maintaining 
                organized record transactions, and provides a user friendly interface through categorization 
                promoting accountability for the user.
              </p>
            </div>

            <div className="border-t-2 border-cyan-600 my-8"></div>

            <h2 className="text-3xl font-serif text-center text-cyan-300 mb-8">
              The Team
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { name: 'Daniel Diaz', image: null },
                { name: 'Ryan Joseph De Leon', image: null },
                { name: 'John Ryle Samson', image: null },
                { name: 'Zigmundo Golimlim', image: null },
                { name: 'Paul Brian Brizuela', image: null },
                { name: 'Jessa Garais', image: null },
                { name: 'Angel Bahillo', image: null },
              ].map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-3 border-2 border-cyan-300">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-white text-sm text-center font-medium">
                    {member.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

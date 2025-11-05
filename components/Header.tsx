
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          Daily Attendance Register
        </h1>
        <p className="text-slate-500 mt-1">Your modern solution for tracking student attendance.</p>
      </div>
    </header>
  );
};

export default Header;

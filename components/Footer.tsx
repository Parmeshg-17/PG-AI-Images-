import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-light-secondary dark:bg-dark-secondary border-t border-light-border dark:border-dark-border py-8 mt-16 font-sans">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="font-heading font-bold text-lg text-light-text dark:text-dark-text mb-2">PG AI IMAGE</p>
        <div className="mb-4 space-x-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span className='opacity-30'>|</span>
          <a href="#" className="hover:underline">Terms of Service</a>
          <span className='opacity-30'>|</span>
          <a href="mailto:pgaiimage@gmail.com" className="hover:underline">Contact</a>
        </div>
        <p>&copy; {currentYear} PG AI IMAGE. All Rights Reserved. A trust-first platform.</p>
      </div>
    </footer>
  );
};

export default Footer;
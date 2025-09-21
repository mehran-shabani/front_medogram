import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import logoImage from '../../assets/images/medogram-logo.png';

const footerLinks = {
  services: [
    { name: 'چت پزشکی', href: '/chat' },
    { name: 'پیش‌بینی دیابت', href: '/diabetes-prediction' },
    { name: 'ویزیت آنلاین', href: '/visits' },
    { name: 'بلاگ', href: '/blogs' },
  ],
  support: [
    { name: 'درباره ما', href: '/about' },
    { name: 'تماس با ما', href: '/contact' },
    { name: 'سوالات متداول', href: '/faq' },
    { name: 'حریم خصوصی', href: '/privacy' },
  ],
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img className="h-10 w-auto" src={logoImage} alt="Medogram" />
              <span className="mr-3 text-xl font-bold">مدوگرام</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              مدوگرام یک پلتفرم پیشرفته برای خدمات پزشکی آنلاین است که با استفاده از هوش مصنوعی، 
              بهترین راهکارهای درمانی را به شما ارائه می‌دهد.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <div className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-5 w-5 ml-2" />
                <span>info@medogram.ir</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">خدمات</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">پشتیبانی</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} مدوگرام. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center mt-4 md:mt-0 text-gray-400 text-sm">
              <span>ساخته شده با</span>
              <HeartIcon className="h-4 w-4 mx-2 text-red-500" />
              <span>در ایران</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
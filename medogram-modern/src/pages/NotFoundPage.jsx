import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          صفحه مورد نظر یافت نشد
        </h2>
        <p className="text-gray-600 mb-8">
          صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا حذف شده است.
        </p>
        <Button as={Link} to="/" size="lg">
          <HomeIcon className="w-5 h-5 ml-2" />
          بازگشت به خانه
        </Button>
      </motion.div>
    </div>
  );
};
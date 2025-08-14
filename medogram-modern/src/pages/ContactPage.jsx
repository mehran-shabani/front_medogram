import React from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '../components/ui/Card';

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
            تماس با ما
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <EnvelopeIcon className="h-6 w-6 text-primary-600 ml-3" />
                  <h3 className="text-lg font-semibold">ایمیل</h3>
                </div>
                <p className="text-gray-600">info@medogram.ir</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <PhoneIcon className="h-6 w-6 text-primary-600 ml-3" />
                  <h3 className="text-lg font-semibold">پشتیبانی</h3>
                </div>
                <p className="text-gray-600">24 ساعته در دسترس</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
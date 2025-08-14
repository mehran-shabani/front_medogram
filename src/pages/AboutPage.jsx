import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
            درباره مدوگرام
          </h1>
          
          <Card>
            <CardContent>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  مدوگرام یک پلتفرم پیشرفته برای خدمات پزشکی آنلاین است که با استفاده از هوش مصنوعی، 
                  بهترین راهکارهای درمانی را به کاربران ارائه می‌دهد.
                </p>
                
                <h2 className="text-2xl font-semibold mb-4">ماموریت ما</h2>
                <p className="mb-6">
                  ما به دنبال ایجاد دسترسی آسان و سریع به مشاوره‌های پزشکی با کیفیت هستیم. 
                  هدف ما کمک به افراد برای دریافت بهترین مراقبت‌های پزشکی در کمترین زمان ممکن است.
                </p>
                
                <h2 className="text-2xl font-semibold mb-4">ویژگی‌های کلیدی</h2>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>مشاوره پزشکی 24 ساعته با هوش مصنوعی</li>
                  <li>امنیت بالا و حفظ حریم خصوصی</li>
                  <li>پاسخ‌های سریع و دقیق</li>
                  <li>رابط کاربری ساده و کاربرپسند</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
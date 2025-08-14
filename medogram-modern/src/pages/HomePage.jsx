import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: SparklesIcon,
    title: 'هوش مصنوعی پیشرفته',
    description: 'تشخیص دقیق و سریع با استفاده از آخرین تکنولوژی‌های AI',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'چت پزشکی 24/7',
    description: 'دسترسی همیشگی به مشاوره پزشکی در هر زمان از شبانه‌روز',
    color: 'text-success-600',
    bgColor: 'bg-success-100',
  },
  {
    icon: ShieldCheckIcon,
    title: 'امنیت اطلاعات',
    description: 'حفظ کامل حریم خصوصی و امنیت اطلاعات پزشکی شما',
    color: 'text-warning-600',
    bgColor: 'bg-warning-100',
  },
  {
    icon: ClockIcon,
    title: 'پاسخ سریع',
    description: 'دریافت پاسخ در کمتر از 30 ثانیه',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

const stats = [
  { label: 'کاربران راضی', value: '10,000+' },
  { label: 'مشاوره روزانه', value: '500+' },
  { label: 'دقت تشخیص', value: '95%' },
  { label: 'پزشک متخصص', value: '50+' },
];

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                مشاوره پزشکی
                <span className="text-primary-600 block">هوشمند و آنلاین</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                با استفاده از هوش مصنوعی پیشرفته، بهترین مشاوره پزشکی را دریافت کنید. 
                سریع، دقیق و در دسترس همیشه.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                as={Link}
                to={isAuthenticated ? '/chat' : '/login'}
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
                شروع مشاوره
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                درباره ما
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-success-200 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              چرا مدوگرام؟
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              با ویژگی‌های منحصر به فرد، بهترین تجربه مشاوره پزشکی را داشته باشید
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent>
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              همین حالا شروع کنید
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              به هزاران کاربر راضی بپیوندید و بهترین مشاوره پزشکی را تجربه کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as={Link}
                to={isAuthenticated ? '/chat' : '/login'}
                variant="secondary"
                size="lg"
                className="px-8 py-4 text-lg bg-white text-primary-600 hover:bg-gray-50"
              >
                <HeartIcon className="w-5 h-5 ml-2" />
                شروع مشاوره رایگان
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="ghost"
                size="lg"
                className="px-8 py-4 text-lg text-white border-white hover:bg-white hover:text-primary-600"
              >
                تماس با ما
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
# مدوگرام - نسخه مدرن

یک پلتفرم پیشرفته برای خدمات پزشکی آنلاین با استفاده از React، Vite و طراحی مدرن الهام گرفته از OpenAI.

## ویژگی‌های کلیدی

- 🚀 **React 18** با Vite برای عملکرد بهینه
- 🎨 **طراحی مدرن** الهام گرفته از OpenAI ChatGPT
- 🎭 **انیمیشن‌های روان** با Framer Motion
- 🎯 **Tailwind CSS** برای استایل‌دهی سریع و منعطف
- 🔐 **سیستم احراز هویت** کامل با Context و Hooks
- 💬 **چت پزشکی** با رابط کاربری مدرن
- 📱 **طراحی ریسپانسیو** برای همه دستگاه‌ها
- 🌐 **پشتیبانی RTL** کامل برای زبان فارسی
- ⚡ **بهینه‌سازی عملکرد** با React Query
- 🔧 **TypeScript ready** با JSDoc

## تکنولوژی‌های استفاده شده

### Frontend
- **React 18** - کتابخانه UI
- **Vite** - ابزار build سریع
- **React Router DOM** - مسیریابی
- **Tailwind CSS** - فریمورک CSS
- **Framer Motion** - انیمیشن‌ها
- **Headless UI** - کامپوننت‌های accessible
- **Heroicons** - آیکون‌ها

### State Management & API
- **React Query** - مدیریت state server
- **Zustand** - مدیریت state کلاینت
- **Axios** - HTTP client
- **React Hook Form** - مدیریت فرم‌ها
- **Yup** - اعتبارسنجی

### UI/UX
- **React Toastify** - نوتیفیکیشن‌ها
- **Lucide React** - آیکون‌های اضافی
- **Inter Font** - فونت مدرن

## نصب و راه‌اندازی

### GitHub Codespaces (پیشنهادی)

برای شروع سریع با GitHub Codespaces:

1. **ایجاد Codespace**
   - روی دکمه "Code" در صفحه repository کلیک کنید
   - تب "Codespaces" را انتخاب کنید
   - "Create codespace on main" را کلیک کنید

2. **انتظار برای ساخت**
   - Codespace به صورت خودکار ساخته می‌شود
   - وابستگی‌ها نصب می‌شوند
   - سرور توسعه روی پورت 5173 شروع می‌شود

3. **دسترسی به پروژه**
   - پورت 5173 به صورت خودکار forward می‌شود
   - می‌توانید مستقیماً در مرورگر کد کنید

### نصب محلی

### پیش‌نیازها
- Node.js (نسخه 18 یا بالاتر)
- npm یا yarn

### مراحل نصب

1. **کلون کردن پروژه**
```bash
git clone <repository-url>
cd medogram-modern
```

2. **نصب وابستگی‌ها**
```bash
npm install
```

3. **تنظیم متغیرهای محیط**
```bash
cp .env.example .env
```

4. **اجرای سرور توسعه**
```bash
npm run dev
```

پروژه روی آدرس `http://localhost:5173` در دسترس خواهد بود.

## ساختار پروژه

```
src/
├── components/          # کامپوننت‌های قابل استفاده مجدد
│   ├── ui/             # کامپوننت‌های پایه UI
│   ├── layout/         # کامپوننت‌های layout
│   └── features/       # کامپوننت‌های ویژگی‌های خاص
├── contexts/           # Context providers
├── hooks/              # Custom hooks
├── pages/              # صفحات اپلیکیشن
├── services/           # API services
├── utils/              # توابع کمکی
└── assets/             # فایل‌های استاتیک
```

## API Integration

پروژه با سرور Django backend ارتباط برقرار می‌کند:

- **Production API**: `https://api.medogram.ir`
- **Local Development**: `http://127.0.0.1:8000`

### Endpoints اصلی:
- `/api/register/` - ثبت‌نام کاربر
- `/api/verify/` - تأیید کد
- `/api/chat/message/` - چت عادی
- `/api/customchatbot/message/` - چت پیشرفته

## کامپوننت‌های UI

### Button
```jsx
import { Button } from './components/ui/Button';

<Button variant="primary" size="lg" loading={isLoading}>
  متن دکمه
</Button>
```

### Input
```jsx
import { Input } from './components/ui/Input';

<Input
  label="عنوان"
  placeholder="متن placeholder"
  error="پیام خطا"
  leftIcon={IconComponent}
/>
```

### Card
```jsx
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>عنوان کارت</CardTitle>
  </CardHeader>
  <CardContent>
    محتوای کارت
  </CardContent>
</Card>
```

## Authentication

سیستم احراز هویت با Context API پیاده‌سازی شده:

```jsx
import { useAuth } from './contexts/AuthContext';

const { isAuthenticated, user, login, logout } = useAuth();
```

## چت پزشکی

رابط چت مدرن با ویژگی‌های:
- پیام‌های real-time
- حالت عادی و پیشرفته
- کپی کردن پاسخ‌ها
- انیمیشن‌های روان
- پشتیبانی از کیبورد

## طراحی ریسپانسیو

- **Mobile First**: طراحی ابتدا برای موبایل
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Grid System**: CSS Grid و Flexbox
- **Typography**: مقیاس‌بندی خودکار فونت

## بهینه‌سازی عملکرد

- **Code Splitting**: تقسیم کد خودکار
- **Lazy Loading**: بارگذاری تنبل کامپوننت‌ها
- **Image Optimization**: بهینه‌سازی تصاویر
- **Bundle Analysis**: تحلیل اندازه bundle

## دستورات npm

```bash
# اجرای سرور توسعه
npm run dev

# ساخت نسخه production
npm run build

# پیش‌نمایش نسخه production
npm run preview

# بررسی کد (linting)
npm run lint

# تست‌ها
npm run test
```

## متغیرهای محیط

```env
VITE_API_BASE_URL=https://api.medogram.ir
VITE_LOCAL_API_URL=http://127.0.0.1:8000
```

## مشارکت در پروژه

1. Fork کردن پروژه
2. ایجاد branch جدید (`git checkout -b feature/amazing-feature`)
3. Commit کردن تغییرات (`git commit -m 'Add amazing feature'`)
4. Push کردن به branch (`git push origin feature/amazing-feature`)
5. ایجاد Pull Request

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## پشتیبانی

برای پشتیبانی و سوالات:
- ایمیل: info@medogram.ir
- وب‌سایت: [medogram.ir](https://medogram.ir)

---

**نکته**: این پروژه برای استفاده در production آماده است و شامل تمام ویژگی‌های مورد نیاز یک اپلیکیشن مدرن می‌باشد.

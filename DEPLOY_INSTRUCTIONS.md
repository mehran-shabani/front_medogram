# راهنمای دیپلوی پروژه مدوگرام

## 🚀 روش‌های دیپلوی

### 1. Vercel (توصیه شده)
```bash
# نصب Vercel CLI
npm install -g vercel

# ورود به حساب Vercel
vercel login

# دیپلوی
vercel --prod
```

### 2. Netlify
```bash
# نصب Netlify CLI
npm install -g netlify-cli

# ورود به حساب Netlify
netlify login

# دیپلوی
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages
- فایل `.github/workflows/github-pages.yml` آماده است
- فقط کافی است کد را push کنید
- در Settings > Pages فعال کنید

### 4. Docker
```bash
# Build image
docker build -t medogram-modern .

# Run container
docker run -p 3000:80 medogram-modern
```

## 🔧 تنظیمات محیطی

### متغیرهای محیطی مورد نیاز:
```env
VITE_API_BASE_URL=https://api.medogram.ir
VITE_LOCAL_API_URL=https://api.medogram.ir
```

## 📱 دسترسی به پروژه

پروژه در حال حاضر روی localhost در حال اجرا است:
- **آدرس محلی**: http://localhost:3000
- **پورت**: 3000

## 🎯 مراحل بعدی

1. یکی از روش‌های بالا را انتخاب کنید
2. حساب کاربری در پلتفرم مورد نظر ایجاد کنید
3. پروژه را دیپلوی کنید
4. آدرس دیپلوی شده را دریافت کنید

## 📞 پشتیبانی

اگر مشکلی در دیپلوی داشتید، لطفاً پیام دهید.
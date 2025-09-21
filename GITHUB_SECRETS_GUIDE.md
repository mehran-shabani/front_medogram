# راهنمای تنظیم GitHub Secrets برای Docker Private Publishing

## 🔐 GitHub Secrets مورد نیاز

برای استفاده از وورک فلوهای GitHub Actions، باید این secrets را در repository خود تنظیم کنید:

### 1️⃣ Docker Registry Secrets
```
DOCKER_REGISTRY_URL    # آدرس رجیستری خصوصی شما (مثل: registry.example.com)
DOCKER_USERNAME        # نام کاربری رجیستری
DOCKER_PASSWORD        # رمز عبور رجیستری
```

### 2️⃣ Application Secrets
```
VITE_API_BASE_URL      # آدرس API اصلی (مثل: https://api.medogram.ir)
VITE_LOCAL_API_URL     # آدرس API محلی (مثل: http://127.0.0.1:8000)
```

## 📋 مراحل تنظیم GitHub Secrets

### مرحله 1: رفتن به تنظیمات Repository
1. به repository خود در GitHub بروید
2. روی تب **Settings** کلیک کنید
3. در منوی سمت چپ، روی **Secrets and variables** کلیک کنید
4. روی **Actions** کلیک کنید

### مرحله 2: اضافه کردن Secrets
برای هر secret:
1. روی **New repository secret** کلیک کنید
2. نام secret را وارد کنید
3. مقدار secret را وارد کنید
4. روی **Add secret** کلیک کنید

## 🔄 نحوه کار وورک فلوها

### وورک فلو کامل (`docker-private-deploy.yml`)
- ✅ تست و لینت کد
- ✅ ساخت و پابلیش Docker image
- ✅ اسکن امنیتی
- ✅ دیپلوی اتوماتیک
- ✅ اطلاع‌رسانی

### وورک فلو ساده (`docker-simple.yml`)
- ✅ ساخت و پابلیش Docker image
- ✅ قابل اجرای دستی

## 🚀 نحوه استفاده

### اتوماتیک
- هر بار که کد را به branch `main` push کنید، وورک فلو اجرا می‌شود

### دستی
- به تب **Actions** در GitHub بروید
- روی وورک فلو مورد نظر کلیک کنید
- روی **Run workflow** کلیک کنید

## 📊 مانیتورینگ

### مشاهده وضعیت
- به تب **Actions** بروید
- وضعیت اجرای وورک فلوها را مشاهده کنید
- در صورت خطا، لاگ‌ها را بررسی کنید

### دریافت اطلاع‌رسانی
- در تنظیمات GitHub، اعلان‌ها را فعال کنید
- ایمیل یا اعلان‌های مرورگر دریافت کنید

## 🛠️ عیب‌یابی

### مشکلات رایج

1. **خطای Authentication**
   - بررسی کنید که secrets درست تنظیم شده‌اند
   - آدرس رجیستری را بررسی کنید

2. **خطای Build**
   - Dockerfile را بررسی کنید
   - وابستگی‌ها را چک کنید

3. **خطای Push**
   - دسترسی‌های رجیستری را بررسی کنید
   - فضای رجیستری را چک کنید

## 📈 بهینه‌سازی

### کش کردن
- وورک فلوها از GitHub Actions cache استفاده می‌کنند
- این باعث سرعت بیشتر build می‌شود

### Multi-stage Build
- Dockerfile شما از multi-stage build استفاده می‌کند
- این باعث کوچک‌تر شدن image نهایی می‌شود

## 🔒 امنیت

### محافظت از Secrets
- هرگز secrets را در کد قرار ندهید
- فقط از GitHub Secrets استفاده کنید
- دسترسی‌ها را محدود کنید

### اسکن امنیتی
- وورک فلو کامل شامل اسکن امنیتی است
- آسیب‌پذیری‌ها در GitHub Security tab نمایش داده می‌شوند
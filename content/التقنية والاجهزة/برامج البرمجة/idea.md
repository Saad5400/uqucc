# IntelliJ IDEA

بيئة التطوير المخصصة لجافا

::el-cato
::

#### 1. تحميل IntelliJ IDEA

ادخل الرابط [https://www.jetbrains.com/idea](https://www.jetbrains.com/idea) واختر زر التحميل.

![تحميل IntelliJ IDEA](https://i.imgur.com/dQQBP2m.png)

في الصفحة التالية انزل عند **Community Edition** واضغط تحميل (تأكد من اختيارك لنفس النسخة المجانية، **لا تحمل Ultimate** لأنها مدفوعة).

<img alt="image" src="https://github.com/user-attachments/assets/9845931d-5140-4624-8c04-80e91272ef96" />

بعد انتهاء التحميل، اذهب إلى مجلد التنزيلات واضغط على الملف مرتين.

![فتح ملف التثبيت](https://i.imgur.com/GHiEEa6.png)

ستظهر نافذة التثبيت، استمر بالضغط على **Next** واختر **Add bin folder to PATH** كما في الصور:

![تثبيت – خطوة 1](https://i.imgur.com/mOexoQX.png)  
![تثبيت – خطوة 2](https://i.imgur.com/X68f7FN.png)  
![تثبيت – خطوة 3](https://i.imgur.com/jLG8NqY.png)  
![تثبيت – خطوة 4](https://i.imgur.com/fsOmKke.png)

بعد انتهاء عملية التثبيت اختر **Reboot now** (الخيار الأول) ثم اضغط **Finish** لإعادة تشغيل الجهاز.

![إنهاء التثبيت](https://i.imgur.com/AOgt4Y6.png)

#### 2. تحميل Java JDK من داخل البرنامج

افتح IntelliJ IDEA عن طريق البحث عنه أو من أيقونة سطح المكتب.

![فتح IntelliJ IDEA](https://i.imgur.com/UaE2DXG.png)

وافق على شروط الاستخدام ومنح الصلاحيات اللازمة.

![شروط الاستخدام](https://i.imgur.com/higUgCe.png)  
![منح الصلاحيات](https://i.imgur.com/IJqoM66.png)  
![متابعة](https://i.imgur.com/KL4MQX4.png)

اختر **Create New Project**.

![إنشاء مشروع جديد](https://i.imgur.com/4ggQc3h.png)

غيّر اسم المشروع إن أردت، ثم اضغط على **Project SDK**.

![اختيار SDK](https://i.imgur.com/zr7JeoU.png)

اضغط **Add SDK**.

![إضافة SDK](https://i.imgur.com/RQFDZCO.png)

اختر **Download JDK**.

![تحميل JDK](https://i.imgur.com/2GUW0aF.png)

حدد أحدث نسخة (مثلاً JDK 21) أو أي نسخة مطلوبة، ثم اضغط **Download**.

![اختيار إصدار JDK](https://i.imgur.com/jOok4gN.png)

اضغط **Create** لإنشاء المشروع.

![إنشاء المشروع](https://i.imgur.com/43upyk4.png)

#### 3. تشغيل كود جافا

بعد فتح المشروع ستجد ملف الكود في مجلد **src** باسمه **Main**. لتشغيل الكود اضغط زر التشغيل في أعلى يمين البرنامج.

![تشغيل الكود](https://i.imgur.com/HkyFuyg.png)

سيظهر ناتج الكود في نافذة **Run** أسفل البرنامج.

![ناتج التشغيل](https://i.imgur.com/rk1C7YQ.png)

#### 4. تتبع كود جافا (Debugging)

لتتبع كود جافا سطرًا بسطر ورؤية قيم المتغيرات، ضع نقطة التوقف (Breakpoint) الحمراء عند السطر الذي تريد البدء منه.

![نقطة التوقف](https://i.imgur.com/7NXb0Ds.png)

اضغط على أيقونة الحشرة (Debug) أعلى يمين البرنامج.

![بدء التتبع](https://i.imgur.com/rh3Vnsn.png)

ستظهر لوحة تحكم **Debug**؛ استخدم الزر التالي للانتقال للسطر التالي:

![Step Over](https://i.imgur.com/EbdZB3f.png)

تظهر المتغيرات أسفل في قسم **Threads & Variables**.

![عرض المتغيرات](https://i.imgur.com/jtApV1v.png)

لإنهاء جلسة التتبع واستكمال البرنامج اضغط الزر الموضح:

![إيقاف التتبع](https://i.imgur.com/9IskTJG.png)

ولرؤية ناتج الكود أو إدخال البيانات في خانة **Console**:

![نافذة Console](https://i.imgur.com/ScN6uSU.png)

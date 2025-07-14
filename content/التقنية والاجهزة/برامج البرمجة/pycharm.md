# PyCharm

بيئة التطوير المخصصة لبايثون

::el-cato
::

### تحميل Python
1. اذهب إلى موقع [python.org](https://www.python.org/downloads/)
2. اضغط على "Download Python" (سيعرض أحدث إصدار)

![تحميل Python](placeholder-pycharm-python-download.png)

### تثبيت Python

**في Windows:**
1. شغل ملف التثبيت
2. **مهم جداً:** تأكد من تحديد "Add Python to PATH"

![تثبيت Python في Windows](placeholder-pycharm-python-install-windows.png)

3. اختر "Install Now" أو "Customize installation"
4. في الخيارات المتقدمة، تأكد من تحديد:
   - Install for all users
   - Add Python to environment variables
   - Precompile standard library

![خيارات التثبيت المتقدمة](placeholder-pycharm-python-advanced-options.png)

**في Mac:**
استخدم Homebrew لسهولة الإدارة:
```bash
# تثبيت Homebrew إذا لم يكن مثبت
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# تثبيت Python
brew install python
```

## الخطوة 2: تحميل PyCharm Community

### التحميل
1. اذهب إلى موقع [jetbrains.com/pycharm](https://www.jetbrains.com/pycharm/)
2. اضغط على "Download"

![موقع PyCharm](placeholder-pycharm-website.png)

3. اختر "Community" (النسخة المجانية)

![اختيار PyCharm Community](placeholder-pycharm-community-selection.png)

4. اختر نظام التشغيل المناسب

![اختيار نظام التشغيل](placeholder-pycharm-os-selection.png)

## الخطوة 3: تثبيت PyCharm

### التثبيت في Windows
1. شغل ملف `.exe` المحمل
2. ستظهر شاشة الترحيب، اضغط "Next"

![شاشة ترحيب PyCharm](placeholder-pycharm-welcome.png)

3. اختر مجلد التثبيت

![اختيار مجلد التثبيت](placeholder-pycharm-install-location.png)

4. حدد Installation Options:
   - Create Desktop Shortcut
   - Update PATH variable
   - Update Context Menu
   - Create Associations

![خيارات التثبيت](placeholder-pycharm-install-options.png)

5. اختر Start Menu Folder

![Start Menu Folder](placeholder-pycharm-start-menu.png)

6. اضغط "Install" وانتظر انتهاء التثبيت

![عملية التثبيت](placeholder-pycharm-installing.png)

### التثبيت في Mac
1. افتح ملف `.dmg` المحمل
2. اسحب PyCharm إلى مجلد Applications

![تثبيت PyCharm في Mac](placeholder-pycharm-mac-install.png)

## الخطوة 4: أول تشغيل وإعداد

### بدء التشغيل
1. افتح PyCharm من desktop أو start menu
2. ستظهر شاشة Data Sharing

![Data Sharing](placeholder-pycharm-data-sharing.png)

3. اختر ما إذا كنت تريد مشاركة بيانات الاستخدام

### إعداد UI Theme
اختر theme المفضل:

![اختيار Theme](placeholder-pycharm-theme-selection.png)

- **Darcula:** الوضع المظلم
- **IntelliJ Light:** الوضع الفاتح
- **High contrast:** للوضوح العالي

### إعداد Plugins
يمكن تثبيت plugins إضافية أو تخطي هذه الخطوة:

![إعداد Plugins](placeholder-pycharm-plugins-setup.png)

### شاشة الترحيب
ستظهر شاشة PyCharm الرئيسية:

![شاشة الترحيب النهائية](placeholder-pycharm-final-welcome.png)

## الخطوة 5: إنشاء مشروع Python جديد

### إنشاء مشروع جديد
1. من شاشة الترحيب، اضغط "New Project"
2. أو من القائمة: File > New Project

![إنشاء مشروع جديد](placeholder-pycharm-new-project.png)

### تكوين المشروع
1. اختر نوع المشروع "Pure Python"
2. حدد Location للمشروع

![تكوين المشروع](placeholder-pycharm-project-config.png)

3. في Python Interpreter، اختر:
   - **Previously configured interpreter:** استخدام Python موجود
   - **New environment using Virtualenv:** إنشاء بيئة افتراضية جديدة

![اختيار Python Interpreter](placeholder-pycharm-interpreter-selection.png)

4. إذا اخترت New environment:
   - حدد Location للبيئة الافتراضية
   - اختر Base interpreter (Python المثبت)
   - حدد inherit global site-packages إذا كنت تريد الوصول للمكتبات العامة

![إعداد البيئة الافتراضية](placeholder-pycharm-venv-config.png)

5. اضغط "Create" لإنشاء المشروع

## الخطوة 6: استكشاف واجهة PyCharm

### النظرة العامة على الواجهة
بعد إنشاء المشروع، ستظهر الواجهة الرئيسية:

![الواجهة الرئيسية](placeholder-pycharm-main-interface.png)

### أجزاء الواجهة الرئيسية

**1. Project Tool Window (الشريط الأيسر):**
عرض هيكل المشروع والملفات

![Project Tool Window](placeholder-pycharm-project-window.png)

**2. Editor (الجزء الأوسط):**
منطقة كتابة وتحرير الكود

![Editor](placeholder-pycharm-editor.png)

**3. Structure Tool Window:**
عرض هيكل الملف الحالي (functions, classes, etc.)

![Structure Window](placeholder-pycharm-structure.png)

**4. Terminal:**
طرفية مدمجة للتشغيل المباشر

![Terminal المدمج](placeholder-pycharm-terminal.png)

**5. Python Console:**
وحدة تحكم Python تفاعلية

![Python Console](placeholder-pycharm-console.png)

## الخطوة 7: كتابة أول برنامج Python

### إنشاء ملف Python جديد
1. انقر بزر الماوس الأيمن على مجلد المشروع
2. اختر New > Python File

![إنشاء ملف Python](placeholder-pycharm-new-file.png)

3. أدخل اسم الملف (مثل `main`)

![تسمية الملف](placeholder-pycharm-file-name.png)

### كتابة الكود
```python
# برنامج تفاعلي بسيط
def main():
    print("مرحباً بك في PyCharm!")
    print("=" * 30)
    
    # طلب معلومات المستخدم
    name = input("ما اسمك؟ ")
    age = int(input("كم عمرك؟ "))
    
    print(f"\nأهلاً وسهلاً {name}!")
    print(f"عمرك {age} سنة")
    
    # حساب بسيط
    year_born = 2024 - age
    print(f"لقد ولدت في عام {year_born} تقريباً")
    
    # قائمة اهتمامات
    interests = []
    print("\nأخبرني عن اهتماماتك (اكتب 'انتهيت' للانتهاء):")
    
    while True:
        interest = input("اهتمام: ")
        if interest.lower() == 'انتهيت':
            break
        interests.append(interest)
    
    if interests:
        print(f"\nاهتماماتك: {', '.join(interests)}")
    
    print("\nشكراً لك!")

if __name__ == "__main__":
    main()
```

![كتابة الكود](placeholder-pycharm-write-code.png)

### استخدام IntelliSense
PyCharm يوفر IntelliSense متقدم:
- `Ctrl+Space`: إكمال الكود
- عرض documentation عند التمرير
- اقتراح parameters للدوال

![IntelliSense في PyCharm](placeholder-pycharm-intellisense.png)

## الخطوة 8: تشغيل البرنامج

### طرق تشغيل البرنامج

**الطريقة 1: من الأيقونة**
اضغط على أيقونة Run الخضراء في toolbar

![أيقونة Run](placeholder-pycharm-run-icon.png)

**الطريقة 2: انقر بزر الماوس الأيمن**
في المحرر واختر "Run 'main'"

![Run من Context Menu](placeholder-pycharm-run-context.png)

### نافذة النتائج
ستظهر النتائج في Run tool window:

![نافذة النتائج](placeholder-pycharm-run-output.png)

## الخطوة 9: استخدام Debugger

### وضع Breakpoints
1. انقر على gutter (الهامش الأيسر) بجانب رقم السطر
2. سيظهر نقطة حمراء تشير للـ breakpoint

![وضع Breakpoint](placeholder-pycharm-set-breakpoint.png)

### بدء Debug
1. اضغط على أيقونة Debug (الخنفساء)
2. أو اذهب إلى Run > Debug 'main' (`Shift+F9`)

![بدء Debug](placeholder-pycharm-start-debug.png)

### استخدام Debug Controls
عند التوقف على breakpoint:

![Debug Controls](placeholder-pycharm-debug-controls.png)

- **Resume Program (F9):** متابعة التنفيذ
- **Step Over (F8):** تنفيذ السطر الحالي
- **Step Into (F7):** الدخول إلى function
- **Step Out (Shift+F8):** الخروج من function

### فحص المتغيرات
في نافذة Variables:

![فحص المتغيرات](placeholder-pycharm-debug-variables.png)

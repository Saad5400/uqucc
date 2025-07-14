# IntelliJ IDEA

بيئة التطوير المخصصة لجافا

::el-cato
::

### التحميل
1. اذهب إلى موقع [jetbrains.com](https://www.jetbrains.com/idea/download#community-edition)
2. اضغط على "Download"

![تحميل IntelliJ IDEA](placeholder-intellij-download.png)

### التثبيت في Windows
1. شغل الملف المحمل
2. اتبع خطوات معالج التثبيت

![معالج تثبيت IntelliJ](placeholder-intellij-install-wizard.png)

![اختيار مجلد التثبيت](placeholder-intellij-install-path.png)

4. حدد الخيارات الإضافية:
   - إنشاء desktop shortcut
   - إضافة مجلد bin إلى PATH

![خيارات التثبيت](placeholder-intellij-install-options.png)

5. اضغط "Install" وانتظر انتهاء التثبيت

![عملية التثبيت](placeholder-intellij-installing.png)

### التثبيت في Mac
1. افتح ملف `.dmg` المحمل
2. اسحب IntelliJ IDEA إلى مجلد Applications

![تثبيت IntelliJ في Mac](placeholder-intellij-mac-install.png)

### بدء التشغيل
1. افتح IntelliJ IDEA من desktop أو start menu
2. ستظهر شاشة الترحيب

![شاشة الترحيب](placeholder-intellij-welcome-screen.png)

### إعداد UI Theme
1. اختر theme المفضل (Darcula للوضع المظلم أو IntelliJ Light)

![اختيار Theme](placeholder-intellij-theme-selection.png)

### إعداد Keymap
1. اختر تخطيط المفاتيح (عادة Default أو Eclipse للقادمين من Eclipse)

![اختيار Keymap](placeholder-intellij-keymap-selection.png)

### إعداد Plugins
1. اختر plugins الإضافية حسب الحاجة
2. يمكن تثبيت المزيد لاحقاً

![اختيار Plugins](placeholder-intellij-plugins-selection.png)

### إنشاء مشروع جديد
1. من شاشة الترحيب، اضغط "New Project"
2. أو من القائمة: File > New > Project

![إنشاء مشروع جديد](placeholder-intellij-new-project.png)

### اختيار نوع المشروع
1. اختر "Java" من القائمة اليسرى
2. تأكد من اختيار Project SDK الصحيح

![اختيار نوع المشروع](placeholder-intellij-project-type.png)

3. إذا لم يظهر JDK، اضغط "New" واختر مجلد تثبيت Java

![إضافة JDK](placeholder-intellij-add-jdk.png)

### إعداد المشروع
1. اختر ما إذا كنت تريد إنشاء project من template
2. للمبتدئين، اختر "Create project from template"
3. حدد "Command Line App"

![اختيار Template](placeholder-intellij-project-template.png)

4. أدخل معلومات المشروع:
   - Project name: اسم المشروع
   - Project location: مكان حفظ المشروع
   - Base package: اسم package الأساسي

![معلومات المشروع](placeholder-intellij-project-details.png)

5. اضغط "Finish" لإنشاء المشروع

### نظرة عامة على الواجهة
بعد إنشاء المشروع، ستظهر الواجهة الرئيسية:

![الواجهة الرئيسية](placeholder-intellij-main-interface.png)

### أجزاء الواجهة الرئيسية

**1. Project Explorer (الشريط الأيسر):**
- عرض هيكل المشروع وملفاته

![Project Explorer](placeholder-intellij-project-explorer.png)

**2. Editor (الجزء الأوسط):**
- منطقة كتابة وتحرير الكود

![Editor](placeholder-intellij-editor.png)

**3. Tool Windows (الأشرطة الجانبية):**
- نوافذ للأدوات المختلفة (Terminal, Version Control, إلخ)

![Tool Windows](placeholder-intellij-tool-windows.png)

**4. Status Bar (الشريط السفلي):**
- معلومات حول المشروع والملف الحالي

![Status Bar](placeholder-intellij-status-bar.png)

### إنشاء class جديد
1. انقر بزر الماوس الأيمن على مجلد `src`
2. اختر New > Java Class

![إنشاء Java Class](placeholder-intellij-new-class.png)

3. أدخل اسم الـ class (مثل `HelloWorld`)

![تسمية Class](placeholder-intellij-class-name.png)

### كتابة الكود
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // طلب اسم المستخدم
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        System.out.print("What's your name? ");
        String name = scanner.nextLine();
        
        System.out.println("Hello, " + name + "!");
        scanner.close();
    }
}
```

![كتابة كود Java](placeholder-intellij-write-code.png)

### استخدام IntelliSense
- اضغط `Ctrl+Space` لإظهار اقتراحات الكود
- IntelliJ يقترح methods وvariables تلقائياً

![IntelliSense في IntelliJ](placeholder-intellij-intellisense.png)

## الخطوة 8: تشغيل البرنامج

### طرق تشغيل البرنامج

**الطريقة 1: من المحرر**
1. انقر بزر الماوس الأيمن في المحرر
2. اختر "Run 'Main.main()'"

![تشغيل من المحرر](placeholder-intellij-run-from-editor.png)

**الطريقة 2: من الأيقونة**
1. اضغط على أيقونة Run الخضراء بجانب method main

![أيقونة Run](placeholder-intellij-run-icon.png)

### نافذة النتائج
ستظهر نافذة Run في أسفل الشاشة مع نتيجة البرنامج:

![نافذة النتائج](placeholder-intellij-run-output.png)

## الخطوة 9: استخدام Debugger

### وضع Breakpoints
1. انقر على الهامش الأيسر بجانب رقم السطر لوضع breakpoint

![وضع Breakpoint](placeholder-intellij-set-breakpoint.png)

2. سيظهر نقطة حمراء تشير إلى الـ breakpoint

![Breakpoint موضوع](placeholder-intellij-breakpoint-set.png)

### بدء Debug
1. انقر بزر الماوس الأيمن في المحرر
2. اختر "Debug 'Main.main()'"

![بدء Debug](placeholder-intellij-start-debug.png)

3. أو اضغط على أيقونة Debug (الخنفساء الخضراء)

![أيقونة Debug](placeholder-intellij-debug-icon.png)

### استخدام Debug Controls
عند التوقف على breakpoint، ستظهر أدوات debug:

![أدوات Debug](placeholder-intellij-debug-controls.png)

- **Step Over (F8):** تنفيذ السطر الحالي
- **Step Into (F7):** الدخول إلى method
- **Step Out (Shift+F8):** الخروج من method حالي
- **Resume (F9):** متابعة التنفيذ

### فحص المتغيرات
في نافذة Variables، يمكن رؤية قيم المتغيرات:

![فحص المتغيرات](placeholder-intellij-debug-variables.png)

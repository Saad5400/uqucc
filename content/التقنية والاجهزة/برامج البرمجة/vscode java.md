# VS Code مع Java

::el-cato
::

## الخطوة 1: تحميل وتثبيت Java

### تحميل Java Development Kit (JDK)

1. اذهب إلى موقع [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) أو [OpenJDK](https://openjdk.org/)
2. اختر إصدار JDK المناسب لنظام التشغيل (Windows/Mac/Linux)

![تحميل JDK](placeholder-jdk-download.png)

3. قم بتحميل الملف واتبع خطوات التثبيت
4. بعد التثبيت، افتح Command Prompt أو Terminal
5. اكتب `java -version` للتأكد من التثبيت

![فحص إصدار Java](placeholder-java-version-check.png)

## الخطوة 2: تحميل وتثبيت VS Code

### التحميل
1. اذهب إلى موقع [code.visualstudio.com](https://code.visualstudio.com)
2. اضغط على "Download" واختر نظام التشغيل

![تحميل VS Code](placeholder-vscode-download.png)

### التثبيت
1. شغل ملف التثبيت
2. اتبع خطوات المعالج
3. تأكد من تحديد "Add to PATH" أثناء التثبيت

![تثبيت VS Code](placeholder-vscode-installation.png)

4. بعد التثبيت، افتح VS Code

![واجهة VS Code الأولى](placeholder-vscode-first-launch.png)

## الخطوة 3: تثبيت امتدادات Java

### Extension Pack for Java
1. افتح VS Code
2. اضغط على أيقونة Extensions في الشريط الجانبي (`Ctrl+Shift+X`)
3. ابحث عن "Extension Pack for Java"

![البحث عن امتدادات Java](placeholder-vscode-java-extensions-search.png)

4. اضغط "Install" على "Extension Pack for Java" من Microsoft

![تثبيت Extension Pack for Java](placeholder-java-extension-pack-install.png)

هذا الامتداد يشمل:
- Language Support for Java by Red Hat
- Debugger for Java
- Test Runner for Java
- Maven for Java
- Project Manager for Java
- Visual Studio IntelliCode

### امتدادات إضافية مفيدة

**Spring Boot Extension Pack:**
إذا كنت تعمل مع Spring Boot
1. ابحث عن "Spring Boot Extension Pack"
2. اضغط "Install"

![Spring Boot Extensions](placeholder-spring-boot-extensions.png)

**SonarLint:**
لتحليل جودة الكود
1. ابحث عن "SonarLint"
2. اضغط "Install"

![SonarLint Extension](placeholder-sonarlint-extension.png)

## الخطوة 4: إنشاء مشروع Java جديد

### طريقة Command Palette
1. اضغط `Ctrl+Shift+P` (أو `Cmd+Shift+P` في Mac)
2. اكتب "Java: Create Java Project"

![إنشاء مشروع Java](placeholder-create-java-project.png)

3. اختر "No build tools" للمشاريع البسيطة أو "Maven" للمشاريع المتقدمة

![اختيار نوع المشروع](placeholder-project-type-selection.png)

4. اختر مجلد للمشروع وأدخل اسم المشروع

![اختيار مجلد المشروع](placeholder-project-folder-selection.png)

## الخطوة 5: كتابة أول برنامج Java

### إنشاء ملف Java
1. في VS Code، اضغط `Ctrl+N` لإنشاء ملف جديد
2. احفظ الملف باسم `HelloWorld.java`

![إنشاء ملف Java](placeholder-create-java-file.png)

### كتابة الكود
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

![كتابة كود Java](placeholder-write-java-code.png)

### تشغيل البرنامج
1. اضغط `F5` أو اضغط على أيقونة "Run" في الشريط العلوي
2. أو انقر بزر الماوس الأيمن واختر "Run Java"

![تشغيل برنامج Java](placeholder-run-java-program.png)

3. ستظهر النتيجة في نافذة Terminal

![نتيجة تشغيل البرنامج](placeholder-java-output.png)

## الخطوة 6: استخدام Debugger

### وضع Breakpoints
1. انقر على الرقم في بداية السطر لوضع breakpoint

![وضع Breakpoint](placeholder-set-breakpoint.png)

### بدء Debug
1. اضغط `F5` أو اذهب إلى "Run" > "Start Debugging"
2. اختر "Java" كنوع environment

![بدء Debug](placeholder-start-debugging.png)

3. سيتوقف البرنامج عند نقطة التوقف

![Debug في العمل](placeholder-debugging-in-action.png)

### استخدام Debug Controls
- `F10`: Step Over
- `F11`: Step Into
- `Shift+F11`: Step Out
- `F5`: Continue

![أدوات Debug](placeholder-debug-controls.png)

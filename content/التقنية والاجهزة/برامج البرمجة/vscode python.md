# VS Code مع Python

::el-cato
::

## الخطوة 1: تحميل وتثبيت Python

### تحميل Python
1. اذهب إلى موقع [python.org](https://www.python.org/downloads/)
2. اضغط على "Download Python" (سيعرض أحدث إصدار)

![تحميل Python](placeholder-python-download.png)

### تثبيت Python

**في Windows:**
1. شغل ملف التثبيت
2. **مهم جداً:** تأكد من تحديد "Add Python to PATH"

![تثبيت Python في Windows](placeholder-python-install-windows.png)

3. اختر "Install Now" أو "Customize installation" للخيارات المتقدمة
4. انتظر انتهاء التثبيت

![إتمام تثبيت Python](placeholder-python-install-complete.png)

**في Mac:**
1. شغل ملف .pkg المحمل
2. اتبع خطوات المعالج

![تثبيت Python في Mac](placeholder-python-install-mac.png)

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

## الخطوة 3: تثبيت امتداد Python

### تثبيت Python Extension
1. افتح VS Code
2. اضغط على أيقونة Extensions في الشريط الجانبي (`Ctrl+Shift+X`)
3. ابحث عن "Python"

![البحث عن امتداد Python](placeholder-vscode-python-extension-search.png)

4. اضغط "Install" على "Python" من Microsoft

![تثبيت امتداد Python](placeholder-python-extension-install.png)

### امتدادات إضافية مفيدة

**Pylint:**
لفحص جودة الكود
1. ابحث عن "Pylint"
2. اضغط "Install"

![Pylint Extension](placeholder-pylint-extension.png)

**Python Docstring Generator:**
لإنشاء docstrings تلقائياً
1. ابحث عن "Python Docstring Generator"
2. اضغط "Install"

![Python Docstring Generator](placeholder-docstring-extension.png)

**Jupyter:**
لدعم Jupyter Notebooks
1. ابحث عن "Jupyter"
2. اضغط "Install"

![Jupyter Extension](placeholder-jupyter-extension.png)

## الخطوة 4: إعداد بيئة Python

### اختيار Python Interpreter
1. افتح VS Code
2. اضغط `Ctrl+Shift+P` لفتح Command Palette
3. اكتب "Python: Select Interpreter"

![اختيار Python Interpreter](placeholder-select-interpreter.png)

4. اختر إصدار Python المثبت على جهازك

![قائمة Python Interpreters](placeholder-interpreter-list.png)

## الخطوة 5: إنشاء مشروع Python جديد

### إنشاء مجلد المشروع
1. أنشئ مجلد جديد لمشروعك
2. افتح VS Code واضغط "File" > "Open Folder"
3. اختر المجلد الذي أنشأته

![فتح مجلد المشروع](placeholder-open-project-folder.png)

### إنشاء ملف Python
1. في VS Code، اضغط `Ctrl+N` لإنشاء ملف جديد
2. احفظ الملف باسم `main.py`

![إنشاء ملف Python](placeholder-create-python-file.png)

### كتابة أول برنامج
```python
def main():
    print("Hello, World!")
    name = input("What's your name? ")
    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
```

![كتابة كود Python](placeholder-write-python-code.png)

### تشغيل البرنامج
1. اضغط `F5` أو اضغط على أيقونة "Run" في الشريط العلوي
2. أو انقر بزر الماوس الأيمن واختر "Run Python File in Terminal"

![تشغيل برنامج Python](placeholder-run-python-program.png)

3. ستظهر النتيجة في نافذة Terminal

![نتيجة تشغيل البرنامج](placeholder-python-output.png)

## الخطوة 6: استخدام Debugger

### وضع Breakpoints
1. انقر على الرقم في بداية السطر لوضع breakpoint

![وضع Breakpoint](placeholder-set-breakpoint.png)

### بدء Debug
1. اضغط `F5` أو اذهب إلى "Run" > "Start Debugging"
2. اختر "Python File" كنوع configuration

![بدء Debug](placeholder-start-debugging.png)

3. سيتوقف البرنامج عند نقطة التوقف

![Debug في العمل](placeholder-debugging-in-action.png)

### استخدام Debug Controls
- `F10`: Step Over
- `F11`: Step Into  
- `Shift+F11`: Step Out
- `F5`: Continue

![أدوات Debug](placeholder-debug-controls.png)

### فحص المتغيرات
في نافذة Debug، يمكنك رؤية قيم المتغيرات:

![فحص المتغيرات](placeholder-debug-variables.png)

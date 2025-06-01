import re

# ------------------------------------------
# Updated parsing function (captures zeros)
# ------------------------------------------
def parse_courses_from_text(text: str):
    """
    Return list[dict(id, grade, credits)].
    • Accept grade tokens '+', empty, or standard letters.
    • Accept credit '0' as well.
    """
    tokens = [tok.strip() for tok in text.split(';') if tok.strip()]

    code_re   = re.compile(r'^[A-Z]{2,4}\d{4}$')
    grade_re  = re.compile(r'^(A\+|A|B\+|B|C\+|C|D\+|D|F|\+)$')
    credit_re = re.compile(r'^[0-6]$')                # include 0 now

    courses, i = [], 0
    while i < len(tokens):
        # locate a course-code
        if not code_re.match(tokens[i]):
            i += 1
            continue

        # gather contiguous codes
        codes = []
        while i < len(tokens) and code_re.match(tokens[i]):
            codes.append(tokens[i]); i += 1

        # skip numeric marks (0-100)
        while i < len(tokens) and tokens[i].isdigit() and 0 <= int(tokens[i]) <= 100:
            i += 1

        # gather grades
        grades = []
        while i < len(tokens) and grade_re.match(tokens[i]):
            grades.append(tokens[i]); i += 1
        # pad / trim to match codes
        if len(grades) < len(codes):
            grades += [None] * (len(codes) - len(grades))
        else:
            grades = grades[:len(codes)]

        # optional repeat of codes
        repeat = 0
        while repeat < len(codes) and i + repeat < len(tokens) and code_re.match(tokens[i + repeat]):
            repeat += 1
        if repeat == len(codes):
            i += repeat

        # hunt credits
        credits = [None] * len(codes)
        j = i
        while j < len(tokens):
            if credit_re.match(tokens[j]):
                run = tokens[j:j+len(codes)]
                if len(run) == len(codes) and all(credit_re.match(x) for x in run):
                    credits = run
                    i = j + len(codes)
                    break
            j += 1

        # emit
        for idx, code in enumerate(codes):
            grade = grades[idx]
            # normalise '+' -> None because it's not informative
            grade = None if grade == '+' else grade
            courses.append({"id": code, "grade": grade, "credits": credits[idx]})
    return courses


print(parse_courses_from_text("""BATWA, SAAD NOOR A;:;CS1101;SE1101;MTH1105;QR1101;ELCE1201;CS1211;PHY1118;MTH1211;ICC1201;ELCE1202;CS1312;DS1302;MTH1501;BA1901;ELCE1203;100;100;100;99;98;100;95;100;99;100;98;95;95;93;95;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A;A+;CS1101;SE1101;MTH1105;QR1101;ELCE1201;CS1211;PHY1118;MTH1211;ICC1201;ELCE1202;CS1312;DS1302;MTH1501;BA1901;ELCE1203;Discrete Structures 1;Computational Thinking & Problem;Solving;Calculus 1;The Holy Qur'an (1);English Language 1;Computer Programming 1;General Physics 1;Linear Algebra 1;Islamic Culture (1);English Language 2;Computer Programming 2;Topics in Computing;Elementary Statistics and probability;Career Preparation Skills;English Language 3;4;3;4;2;4;3;4;4;2;4;3;3;4;2;4;4;3;4;2;4;3;4;4;2;4;3;3;4;2;4;16.00;12.00;16.00;8.00;16.00;12.00;16.00;16.00;8.00;16.00;12.00;12.00;16.00;7.50;16.00;+;+;+;+;+;+;+;+;+;+;+;+;+;+;)(;)(;. :;. :;. :;. :;. :;. :;:;:;:;-;-;-;:;:;:;:;:;:;:;:;:;:;:;First Semester 2022/2022;Second Semester 2022/2023;Third Semester 2023/2023;4.00;4.00;3.99;4.00;4.00;3.97;S.GPA:;S.GPA:;S.GPA:;Ac. GPA :;Ac. GPA :;Ac. GPA :;First Year of Computing College;First Year of Computing College;First Year of Computing College;Dept :;Dept :;Dept :;-Excellent;-Excellent;-Excellent;Status :;Status :;Status :;Active;Active;Active;Computers and Information Systems;Computers and Information Systems;Computers and Information Systems;Faculty :;Faculty :;Faculty :;68.00;68.00;63.50;17;17;16;17;17;16;sum:;sum:;sum:;Course Code;Course Code;Course Code;Course Name;Course Name;Course Name;Crd.;Hours;Crd.;Hours;Crd.;Hours;Pass;Hourse;Pass;Hourse;Pass;Hourse;Degree;Degree;Degree;Grade;Grade;Grade;Points;Points;Points;Student ID:;444004616;Name:;Status:;Active;:;--;:;01-06-2025;1;Date :;Page :;/;/;:;:;:;. :;:;GPA :;Degree :;Faculty :;Major :;Bachelor;Study type :;Full Time;Computing;Software Engineering;4.00;First Year of Computing College;First Year of Computing College;First Year of Computing College;:;:;:;Major:;Major:;Major:;4BATWA, SAAD NOOR A;:;CS2214;SE2102;SE2103;CEN2002;ICC2202;QR2102;CS2231;CS2315;SE2205;SE2204;ARS1601;SE2306;SE2307;SE2308;SE2309;BA1902;ICC3203;100;95;95;100;96;98;99;98;98;95;100;96;96;100;95;97;96;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;CS2214;SE2102;SE2103;CEN2002;ICC2202;QR2102;CS2231;CS2315;SE2205;SE2204;ARS1601;SE2306;SE2307;SE2308;SE2309;BA1902;ICC3203;Data Structures;Foundations of Software Engineering;Software Enginneering Ethics;Hardware and Software Interface;Islamic Culture (2);The Holy Qur'an (2);Database Fundamentals;Algorithm Fundamentals;Distributed programming paradigms;Requirements Engineering 1;Arabic Writing and Editing;Software Design & Construction 1;Requirements Engineering 2;Web Engineering;Project Management;Entrepreneurship and Innovation;Islamic Culture (3);3;3;2;4;2;2;3;3;4;4;2;5;3;3;3;2;2;3;3;2;4;2;2;3;3;4;4;2;5;3;3;3;2;2;12.00;12.00;8.00;16.00;8.00;8.00;12.00;12.00;16.00;16.00;8.00;20.00;12.00;12.00;12.00;8.00;8.00;+;+;+;+;+;+;+;+;+;+;+;+;+;+;+;+;+;)(;)(;)(;. :;. :;. :;. :;. :;. :;:;:;:;-;-;-;:;:;:;:;:;:;:;:;:;:;:;First Semester 2023/2023;Second Semester 2023/2024;Third Semester 2024/2024;3.99;3.99;4.00;4.00;4.00;4.00;S.GPA:;S.GPA:;S.GPA:;Ac. GPA :;Ac. GPA :;Ac. GPA :;Software Engineering;Software Engineering;Software Engineering;Dept :;Dept :;Dept :;-Excellent;-Excellent;-Excellent;Status :;Status :;Status :;Active;Active;Active;Computing;Computing;Computing;Faculty :;Faculty :;Faculty :;64.00;64.00;72.00;16;16;18;16;16;18;sum:;sum:;sum:;Course Code;Course Code;Course Code;Course Name;Course Name;Course Name;Crd.;Hours;Crd.;Hours;Crd.;Hours;Pass;Hourse;Pass;Hourse;Pass;Hourse;Degree;Degree;Degree;Grade;Grade;Grade;Points;Points;Points;Student ID:;444004616;Name:;Status:;Active;:;--;:;01-06-2025;2;Date :;Page :;/;/;:;:;:;. :;:;GPA :;Degree :;Faculty :;Major :;Bachelor;Study type :;Full Time;Computing;Software Engineering;4.00;Software Engineering;Software Engineering;Software Engineering;:;:;:;Major:;Major:;Major:;4BATWA, SAAD NOOR A;:;SE3110;SE3111;SE3112;SE3113;SE3114;SPED1102;CS4103;AI2001;SEC2101;SE3215;SE3216;SE3217;QR3103;99;96;98;97;99;100;99;95;96;97;95;100;100;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;A+;SE3110;SE3111;SE3112;SE3113;SE3114;SPED1102;CS4103;AI2001;SEC2101;SE3215;SE3216;SE3217;QR3103;Software Testing;Mobile Apps engineering;Models & Methods;Software Design & Construction 2;Functional programming;Scientific Computing;Introduction to Artificial Intelligence;Introduction to Cybersecurity;Research Methods;Software Maintenance and Configuration;Frameworks and Tools;The Holy Qur'an (3);3;3;3;3;3;2;3;2;3;2;4;4;2;3;3;3;3;3;2;3;2;3;2;4;4;2;12.00;12.00;12.00;12.00;12.00;8.00;12.00;8.00;12.00;8.00;16.00;16.00;8.00;+;+;+;+;+;+;+;+;+;+;+;+;+;)(;. :;. :;. :;. :;:;:;-;-;:;:;:;:;:;:;:;:;First Semester 2024/2024;Second Semester 2024/2025;4.00;4.00;4.00;4.00;S.GPA:;S.GPA:;Ac. GPA :;Ac. GPA :;Software Engineering;Software Engineering;Dept :;Dept :;-Excellent;-Excellent;Status :;Status :;Active;Active;Computing;Computing;Faculty :;Faculty :;68.00;80.00;17;20;17;20;sum:;sum:;Course Code;Course Code;Course Name;Course Name;Crd.;Hours;Crd.;Hours;Pass;Hourse;Pass;Hourse;Degree;Degree;Grade;Grade;Points;Points;Student ID:;444004616;Name:;Status:;Active;:;--;:;01-06-2025;3;Date :;Page :;/;/;:;:;:;. :;:;GPA :;Degree :;Faculty :;Major :;Bachelor;Study type :;Full Time;Computing;Software Engineering;4.00;Software Engineering;Software Engineering;:;:;Major:;Major:;4BATWA, SAAD NOOR A;:;/;SE3318;SE3320;SE3321;SE4430;DS3002;ICC4204;99;A+;SE3318;SE3320;SE3321;SE4430;DS3002;ICC4204;Software Quality Attributes;Group Project 1;Operation Research;Design Patterns;Data Engineering;Islamic Culture (4);0;0;0;0;0;2;0;0;0;0;0;2;0.00;0.00;0.00;0.00;0.00;8.00;+;)(;. :;. :;:;:;:;:;:;:;:;:;:;Third Semester 2025/2025;S.GPA:;Ac. GPA :;Software Engineering;Dept :;Status :;Active;Computing;Faculty :;sum:;Course Code;Course Name;Crd.;Hours;Pass;Hourse;Degree;Grade;Points;Crd Hrs:;139;Passed Hrs:;139;Accum GPA:;4.00;Points:;555.5;Student ID:;444004616;Name:;Status:;Active;:;--;:;01-06-2025;4;Date :;Page :;/;/;4;:;:;:;. :;:;GPA :;Degree :;Faculty :;Major :;Bachelor;Study type :;Full Time;Computing;Software Engineering;4.00;Software Engineering;:;Major:;Dean of Admission and Registration;Dr. Khalid T. Althagafy;."""))

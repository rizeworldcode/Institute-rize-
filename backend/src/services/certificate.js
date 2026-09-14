const student_model = require("../models/studentModel");

exports.certificateData = async (req,res)=>{

    try {
        const student = req.user
        if(!student){
            return{
                message: "Student not found",
                success: false,
            }
        }
        
        const student_name = student.student_name;
        const student_id = student.student_ID;
        const now = new Date();
        
        // Helper to get course completion date
        const getCompDate = (courseName) => {
            let start = null;
            let end = null;
            if (student.admissions && student.admissions.length > 0) {
                for (const adm of student.admissions) {
                    if (courseName && Array.isArray(adm.courses) && adm.courses.some(c => c.toLowerCase().includes(courseName.toLowerCase()) || courseName.toLowerCase().includes(c.toLowerCase()))) {
                        if (adm.startDate) start = new Date(adm.startDate);
                        if (adm.endDate) end = new Date(adm.endDate);
                    }
                }
                if (!start && student.admissions[0].startDate) start = new Date(student.admissions[0].startDate);
                if (!end && student.admissions[0].endDate) end = new Date(student.admissions[0].endDate);
            }
            if (!start && student.course_start_date) start = new Date(student.course_start_date);
            if (!end && student.course_end_date) end = new Date(student.course_end_date);
            if (!start && student.createdAt) start = new Date(student.createdAt);
            if (!start) start = new Date();

            let durMonths = 2;
            const clc = (courseName || '').toLowerCase();
            if (clc.includes('seo') && !clc.includes('marketing') && !clc.includes('smo')) durMonths = 1;
            else if (clc.includes('master') || clc.includes('web development')) durMonths = 3;

            const calcEnd = new Date(start);
            calcEnd.setMonth(calcEnd.getMonth() + durMonths);
            if (end && !isNaN(end.getTime())) {
                return calcEnd < end ? calcEnd : end;
            }
            return calcEnd;
        };

        // Collect all certificates (only completed courses)
        const certificates = [];
        
        // Add old certificate if exists and completed
        if (student.certificate_photo) {
            const cName = Array.isArray(student.selected_course_name) ? student.selected_course_name[0] : (student.selected_course_name || "Course");
            const cDate = getCompDate(cName);
            if (now >= cDate) {
                certificates.push({
                    courseName: cName,
                    certificatePath: student.certificate_photo,
                    issuedAt: student.created_at || new Date(),
                    isEligible: true
                });
            }
        }
        
        // Add certificates from student.certificates array
        if (student.certificates && student.certificates.length > 0) {
            student.certificates.forEach((cert) => {
                const cName = cert.course_name || cert.courseName || "Course";
                const cDate = getCompDate(cName);
                if (now >= cDate) {
                    certificates.push({
                        courseName: cName,
                        certificatePath: cert.certificate_path || cert.certificatePath,
                        issuedAt: cert.issued_at || cert.issuedAt || new Date(),
                        isEligible: true
                    });
                }
            });
        }
        
        // Add certificates from admissions
        if (student.admissions && student.admissions.length > 0) {
            student.admissions.forEach((admission) => {
                if (admission.certificates && admission.certificates.length > 0) {
                    admission.certificates.forEach((cert) => {
                        const cName = cert.courseName || cert.course_name || "Course";
                        const cDate = getCompDate(cName);
                        if (now >= cDate) {
                            certificates.push({
                                courseName: cName,
                                certificatePath: cert.certificatePath || cert.certificate_path,
                                issuedAt: cert.issuedAt || cert.issued_at || new Date(),
                                isEligible: true
                            });
                        }
                    });
                }
            });
        }

        // Also compile pending/ongoing courses list
        const rawCourses = [];
        if (Array.isArray(student.selected_course_name)) rawCourses.push(...student.selected_course_name);
        else if (student.selected_course_name) rawCourses.push(student.selected_course_name);
        if (student.admissions && student.admissions.length > 0) {
            for (const adm of student.admissions) {
                if (Array.isArray(adm.courses)) rawCourses.push(...adm.courses);
            }
        }
        const uniqueCourses = [...new Set(rawCourses.filter(Boolean).map(c => c.trim()))];
        const ongoingCourses = [];
        for (const c of uniqueCourses) {
            const cDate = getCompDate(c);
            const isCompleted = now >= cDate;
            if (!isCompleted) {
                ongoingCourses.push({
                    courseName: c,
                    completionDate: cDate,
                    status: "In Progress"
                });
            }
        }

        return {
            message: "Student data fetched",
            success: true,
            student_name,
            student_id,
            certificates,
            ongoingCourses
        };

    
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
} 
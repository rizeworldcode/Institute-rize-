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

        // Collect all certificates
        const certificates = [];
        const seenCourseKeys = new Set();

        const getCourseKey = (name) => {
            const lower = (name || '').toLowerCase().trim();
            if (lower.includes('creative pro')) return 'creative_pro';
            if (lower.includes('seo') && !lower.includes('marketing') && !lower.includes('smo')) return 'seo';
            if (lower.includes('marketing pro')) return 'marketing_pro';
            if (lower.includes('master course')) return 'master_course';
            if (lower.includes('web development')) return 'web_development';
            return lower.replace(/[^a-z0-9]/g, '');
        };

        const addCert = (cName, cPath, issuedAt) => {
            if (!cName || !cPath) return;
            const key = getCourseKey(cName);
            if (seenCourseKeys.has(key)) return;
            seenCourseKeys.add(key);
            certificates.push({
                courseName: cName.trim(),
                certificatePath: cPath,
                issuedAt: issuedAt || new Date(),
                isEligible: true
            });
        };

        // 1. Add certificates explicitly issued/uploaded in student.certificates
        if (student.certificates && student.certificates.length > 0) {
            student.certificates.forEach((cert) => {
                const cName = cert.course_name || cert.courseName;
                const cPath = cert.certificate_path || cert.certificatePath;
                addCert(cName, cPath, cert.issued_at || cert.issuedAt);
            });
        }

        // 2. Add certificates uploaded/issued in admissions
        if (student.admissions && student.admissions.length > 0) {
            student.admissions.forEach((admission) => {
                if (admission.certificates && admission.certificates.length > 0) {
                    admission.certificates.forEach((cert) => {
                        const cName = cert.courseName || cert.course_name;
                        const cPath = cert.certificatePath || cert.certificate_path;
                        addCert(cName, cPath, cert.issuedAt || cert.issued_at);
                    });
                }
            });
        }

        // 3. Add backward compatibility student.certificate_photo
        if (student.certificate_photo) {
            const cName = Array.isArray(student.selected_course_name) 
                ? student.selected_course_name[0] 
                : (student.selected_course_name || "Course");
            addCert(cName, student.certificate_photo, student.created_at);
        }

        // 4. Also compile pending/ongoing courses list or auto-generate eligible completed ones
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
            const key = getCourseKey(c);
            if (seenCourseKeys.has(key)) continue; // Already has an issued/uploaded certificate!

            const cDate = getCompDate(c);
            const isCompleted = now >= cDate;
            if (!isCompleted) {
                ongoingCourses.push({
                    courseName: c,
                    completionDate: cDate,
                    status: "In Progress"
                });
            } else {
                // Completed course without certificate: auto-generate on demand
                try {
                    const { generateSingleStudentCertificate } = require('../utils/certificateGenerator');
                    const genRes = await generateSingleStudentCertificate(student_id, c);
                    if (genRes && genRes.eligible && genRes.cert) {
                        addCert(c, genRes.cert.publicPath, new Date());
                    }
                } catch (genErr) {
                    console.error('Error generating on-demand cert in certificateData:', genErr);
                }
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
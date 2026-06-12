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
        
        // Collect all certificates
        const certificates = [];
        
        // Add old certificate if exists
        if (student.certificate_photo) {
            certificates.push({
                courseName: "Default Course",
                certificatePath: student.certificate_photo,
                issuedAt: new Date()
            });
        }
        
        // Add old certificates array if exists
        if (student.certificates && student.certificates.length > 0) {
            student.certificates.forEach((cert) => {
                certificates.push({
                    courseName: cert.course_name || "Unknown Course",
                    certificatePath: cert.certificate_path || cert.certificatePath,
                    issuedAt: cert.issued_at || cert.issuedAt || new Date()
                });
            });
        }
        
        // Add certificates from admissions
        if (student.admissions && student.admissions.length > 0) {
            student.admissions.forEach((admission) => {
                if (admission.certificates && admission.certificates.length > 0) {
                    admission.certificates.forEach((cert) => {
                        certificates.push({
                            courseName: cert.courseName || "Unknown Course",
                            certificatePath: cert.certificatePath,
                            issuedAt: cert.issuedAt || new Date()
                        });
                    });
                }
            });
        }

        return {
            message: "Student data fetched",
            success: true,
            student_name,
            student_id,
            certificates
        };
    
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
} 
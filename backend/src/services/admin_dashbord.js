
const Tc_model = require("../models/studentModel");
const admin_model = require("../models/adminmodel.js");
const referred_model = require("../models/referreledModel.js");
const memoryCache = require("../utils/cache");

exports.admin_dashboardGet = async (req, res) => {
    try {
        const cached = memoryCache.get("admin_dashboard");
        if (cached) {
            return cached;
        }
        // 1. Total Students
        const total_students = await Tc_model.countDocuments({ is_deleted: { $ne: true } });

        // 2. Total Issued/Unissued Certificates
    // Count unique students who have at least one certificate, plus backward compatibility
    const students = await Tc_model.find({ is_deleted: { $ne: true } }).lean();
    
    // Collect all students with certificates + their issued courses
    const studentsWithCertificates = [];
    students.forEach(student => {
      // Collect all unique courses with certificates for this student
      const issuedCourses = new Set();
      
      // Check certificates from admissions
      if (student.admissions && student.admissions.length > 0) {
        student.admissions.forEach(adm => {
          if (adm.certificates && adm.certificates.length > 0) {
            adm.certificates.forEach(cert => {
              if (cert.courseName) {
                issuedCourses.add(cert.courseName);
              }
            });
          }
        });
      }
      // Backward compatibility
      if (student.certificate_photo && student.certificate_photo !== "") {
        issuedCourses.add("Default Course");
      }
      if (student.certificates && student.certificates.length > 0) {
        student.certificates.forEach(cert => {
          if (cert.course_name) {
            issuedCourses.add(cert.course_name);
          } else if (cert.courseName) {
            issuedCourses.add(cert.courseName);
          }
        });
      }
      
      // If student has any certificate
      if (issuedCourses.size > 0) {
        studentsWithCertificates.push({
          studentId: student.student_ID,
          studentName: student.student_name,
          issuedCourses: Array.from(issuedCourses)
        });
      }
    });
    
    const total_issued_certificates = studentsWithCertificates.length;
    const total_unissued_certificates = Math.max(0, total_students - total_issued_certificates);

        // 3. Total Earnings & Fee Status Counts
        let total_earnings = 0;
        let clear_fee_students = 0;
        let unclear_fee_students = 0;

        const tcData = students.map(student => {
            // Calculate totals from admissions or old structure
            let totalFee = 0;
            let totalPaidFee = 0;
            let allClear = true;
            let anyPaid = false;
            
            let admissions = student.admissions || [];

            // Process admissions to ensure they have all required fields
            const processedAdmissions = admissions.map(adm => ({
                admissionId: adm.admissionId || adm.admission_id || `ADM-${Date.now()}-${student.student_ID}`,
                courses: adm.courses || [],
                courseDuration: adm.courseDuration || adm.course_duration || "N/A",
                totalFee: adm.totalFee || adm.total_fee || 0,
                totalPaidFee: adm.totalPaidFee || adm.total_paid_fee || 0,
                pendingFee: adm.pendingFee || adm.pending_fee || (adm.totalFee - adm.totalPaidFee) || 0,
                feesStatus: adm.feesStatus || adm.status || "Pending",
                feesInstallment: adm.feesInstallment || adm.fee_installment || 0,
                payments: (adm.payments || []).map(pmt => ({
                    id: `pay-${Date.now()}-${Math.random()}`,
                    amount: pmt.amount,
                    paymentMethod: pmt.paymentMethod,
                    utrNumber: pmt.utrNumber,
                    date: pmt.date ? new Date(pmt.date).toISOString() : new Date().toISOString()
                })),
                certificates: (adm.certificates || []).map(cert => ({
                    id: `cert-${Date.now()}-${Math.random()}`,
                    courseName: cert.courseName || cert.course_name,
                    url: cert.certificatePath || cert.certificate_path,
                    date: cert.issuedAt || cert.issued_at ? new Date(cert.issuedAt || cert.issued_at).toISOString() : new Date().toISOString()
                })),
                startDate: adm.startDate || adm.course_start_date || new Date(),
                endDate: adm.endDate || adm.course_end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                createdAt: adm.createdAt || adm.created_at || Date.now(),
                updatedAt: adm.updatedAt || adm.updated_at || Date.now()
            }));
            
            // If no admissions, use old structure
            if (processedAdmissions.length === 0) {
                const oldPaid = parseFloat(student.total_paid_fee || 0);
                const oldTotal = parseFloat(student.total_fee || 0);
                totalFee = oldTotal;
                totalPaidFee = oldPaid;
                
                if (oldPaid > 0) anyPaid = true;
                allClear = oldPaid >= oldTotal && oldTotal > 0;
            } else {
                processedAdmissions.forEach(adm => {
                    const admTotal = parseFloat(adm.totalFee || 0);
                    const admPaid = parseFloat(adm.totalPaidFee || 0);
                    totalFee += admTotal;
                    totalPaidFee += admPaid;
                    
                    if (admPaid > 0) anyPaid = true;
                    if (admPaid < admTotal && admTotal > 0) allClear = false;
                });
            }

            total_earnings += totalPaidFee;

            if (allClear && anyPaid) {
                clear_fee_students++;
            } else {
                unclear_fee_students++;
            }

            return {
                student_name: student.student_name,
                student_ID: student.student_ID,
                selected_course_name: student.selected_course_name,
                course_duration: student.course_duration,
                _id: student._id,
                total_fee: totalFee,
                total_paid_fee: totalPaidFee,
                pending_fee: (totalFee - totalPaidFee).toString(),
                status: allClear ? "Clear" : (anyPaid ? "Partial" : "Pending"),
                fee: student.fee,
                email: student.email,
                phone: student.phone,
                address: student.address,
                course_start_date: student.course_start_date,
                course_end_date: student.course_end_date,
                fee_installment: student.fee_installment,
                created_at: student.created_at,
                certificates: student.certificates,
                admissions: processedAdmissions,
                referredByName: student.referredByName || "",
                referredByPhone: student.referredByPhone || "",
                referredByEmail: student.referredByEmail || "",
                referredAmount: student.referredAmount || 0,
                // Backward compatibility
                certificate_photo: student.certificate_photo
            };
        });

        // 4. Calculate total referral amount paid to referrers
        const referrers = await referred_model.find({ is_deleted: { $ne: true } });
        let total_referral_paid = 0;
        referrers.forEach(referrer => {
            total_referral_paid += referrer.amount?.paid || 0;
        });

        // 5. Deduct referral amount from total earnings
        const net_earnings = total_earnings - total_referral_paid;

        // 4. Top 3 Courses (only currently active students)
        const today = new Date();
        const courseStudentMap = {}; // To track unique students per course
        
        students.forEach(student => {
            const studentId = student._id.toString();
            
            // Process old structure (selected_course_name)
            if (student.selected_course_name && student.selected_course_name.length > 0) {
                const startDate = student.course_start_date ? new Date(student.course_start_date) : null;
                const endDate = student.course_end_date ? new Date(student.course_end_date) : null;
                
                // Check if course is currently active
                const isActive = (!startDate || startDate <= today) && (!endDate || endDate >= today);
                
                if (isActive) {
                    student.selected_course_name.forEach(courseName => {
                        if (!courseStudentMap[courseName]) {
                            courseStudentMap[courseName] = new Set();
                        }
                        courseStudentMap[courseName].add(studentId);
                    });
                }
            }
            
            // Process admissions
            if (student.admissions && student.admissions.length > 0) {
                student.admissions.forEach(adm => {
                    const startDate = adm.startDate ? new Date(adm.startDate) : null;
                    const endDate = adm.endDate ? new Date(adm.endDate) : null;
                    
                    // Check if admission is currently active
                    const isActive = (!startDate || startDate <= today) && (!endDate || endDate >= today);
                    
                    if (isActive && adm.courses && adm.courses.length > 0) {
                        adm.courses.forEach(courseName => {
                            if (!courseStudentMap[courseName]) {
                                courseStudentMap[courseName] = new Set();
                            }
                            courseStudentMap[courseName].add(studentId);
                        });
                    }
                });
            }
        });
        
        // Convert to sorted array
        const top_courses = Object.keys(courseStudentMap)
            .map(key => ({ _id: key, count: courseStudentMap[key].size }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // 5. Monthly Growth (Students and Earnings) - Calculate 6-month timeline safely in JS
        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const graphData = [];

        // Collect all transactions per student to prevent double-counting between s.fee and adm.payments
        let allTransactions = [];
        students.forEach(student => {
            let studentTxns = [];
            if (student.admissions && student.admissions.length > 0) {
                student.admissions.forEach(adm => {
                    if (adm.payments && adm.payments.length > 0) {
                        adm.payments.forEach(p => {
                            if (p && p.amount) {
                                studentTxns.push({
                                    amount: parseFloat(p.amount || 0),
                                    date: p.date ? new Date(p.date) : (student.created_at ? new Date(student.created_at) : new Date())
                                });
                            }
                        });
                    }
                });
            }

            if (studentTxns.length === 0 && student.fee && student.fee.length > 0) {
                student.fee.forEach(f => {
                    if (f && f.amount) {
                        studentTxns.push({
                            amount: parseFloat(f.amount || 0),
                            date: f.date ? new Date(f.date) : (student.created_at ? new Date(student.created_at) : new Date())
                        });
                    }
                });
            }

            if (studentTxns.length === 0 && parseFloat(student.total_paid_fee || 0) > 0) {
                studentTxns.push({
                    amount: parseFloat(student.total_paid_fee || 0),
                    date: student.created_at ? new Date(student.created_at) : (student.createdAt ? new Date(student.createdAt) : new Date())
                });
            }

            allTransactions.push(...studentTxns);
        });

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const m = d.getMonth();
            const y = d.getFullYear();

            // Count new students in this month & year
            const count = students.filter(s => {
                const dateVal = s.createdAt || s.created_at || s.course_start_date;
                if (!dateVal) return false;
                const dt = new Date(dateVal);
                return !isNaN(dt.getTime()) && dt.getMonth() === m && dt.getFullYear() === y;
            }).length;

            // Calculate total earnings in this month & year
            let earnings = 0;
            allTransactions.forEach(t => {
                if (t.date && !isNaN(t.date.getTime()) && t.date.getMonth() === m && t.date.getFullYear() === y) {
                    earnings += t.amount;
                }
            });

            graphData.push({
                month: `${monthsShort[m]} ${y}`,
                newStudents: count,
                earnings: earnings
            });
        }

        const adminConfig = await admin_model.findOne().lean();

        const result = {
            success: true,
            stats: {
              total_students,
              total_issued_certificates,
              total_unissued_certificates,
              total_earnings,
              net_earnings,
              total_referral_paid,
              clear_fee_students,
              unclear_fee_students
            },
            tcData, 
            top_courses,
            graphData,
            referrel_amount: adminConfig ? adminConfig.referrel_amount : 0,
            studentsWithCertificates
        };

        memoryCache.set("admin_dashboard", result, 30);
        return result;
    } catch (error) {
        console.log("Dashboard Error:", error);
        return { success: false, message: "Error fetching dashboard data" };
    }
};

exports.updateReferralAmount = async (req, res) => {
    try {
        const { amount } = req.body;
        
        let admin = await admin_model.findOne();
        if (!admin) {
            admin = new admin_model({ referrel_amount: amount });
        } else {
            admin.referrel_amount = amount;
        }
        
        await admin.save();
        memoryCache.clear();
        
        return {
            success: true,
            message: "Referral amount updated successfully",
            amount: admin.referrel_amount
        };
    } catch (error) {
        console.log("Error updating referral amount:", error);
        return {
            success: false,
            message: "Error updating referral amount"
        };
    }
};
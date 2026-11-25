import React, { useState, useRef } from "react";
import { X, Printer } from "lucide-react";
import { Student } from "../types";

interface StudentInvoiceModalProps {
  student: Student;
  onClose: () => void;
  initialPaymentIndex?: number;
}

export function StudentInvoiceModal({ student, onClose, initialPaymentIndex }: StudentInvoiceModalProps) {
  // Extract payments from student.fee or admissions
  const paymentsList = React.useMemo(() => {
    const list: {
      amount: number;
      paymentMethod: string;
      utrNumber?: string;
      date: string;
      installmentNumber: number;
    }[] = [];

    // Check admissions first
    if (student.admissions && student.admissions.length > 0) {
      student.admissions.forEach(adm => {
        if (adm.payments && adm.payments.length > 0) {
          adm.payments.forEach((p) => {
            if (p && (Number(p.amount) > 0 || p.date)) {
              const amt = Number(p.amount) || 0;
              const utr = (p.utrNumber || (p as any).utr_Number || "").trim();
              const meth = p.paymentMethod || (p as any).payment_method || (utr ? "Online" : "Cash");
              list.push({
                amount: amt,
                paymentMethod: meth,
                utrNumber: utr,
                date: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
                installmentNumber: 0
              });
            }
          });
        }
      });
    }

    // Also check student.fee
    if (student.fee && student.fee.length > 0) {
      student.fee.forEach((f: any) => {
        if (f && (Number(f.amount) > 0 || f.date)) {
          const amt = Number(f.amount) || 0;
          const utr = (f.utr_Number || f.utrNumber || "").trim();
          const dateStr = f.date ? new Date(f.date).toISOString().split('T')[0] : "";

          const alreadyExists = list.some(existing => {
            const exUtr = (existing.utrNumber || "").trim();
            if (utr && exUtr && utr.toLowerCase() === exUtr.toLowerCase()) return true;
            const exDateStr = existing.date ? new Date(existing.date).toISOString().split('T')[0] : "";
            return existing.amount === amt && exDateStr === dateStr;
          });

          if (!alreadyExists) {
            const meth = f.payment_method || f.paymentMethod || (utr ? "Online" : "Cash");
            list.push({
              amount: amt,
              paymentMethod: meth,
              utrNumber: utr,
              date: f.date ? new Date(f.date).toISOString() : new Date().toISOString(),
              installmentNumber: 0
            });
          }
        }
      });
    }

    // Sort chronologically
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Assign installment numbers
    list.forEach((item, idx) => {
      item.installmentNumber = idx + 1;
    });

    // If still no payment records but paidFees > 0, generate one virtual payment
    if (list.length === 0 && Number(student.paidFees) > 0) {
      list.push({
        amount: Number(student.paidFees) || 0,
        paymentMethod: student.feeType || "Cash",
        utrNumber: student.utrNumber || "",
        date: student.startDate || new Date().toISOString(),
        installmentNumber: 1
      });
    }

    return list;
  }, [student]);

  const [selectedPaymentIdx, setSelectedPaymentIdx] = useState<number>(() => {
    if (typeof initialPaymentIndex === "number" && initialPaymentIndex >= 0 && initialPaymentIndex < paymentsList.length) {
      return initialPaymentIndex;
    }
    // Default to the latest payment if available, otherwise 0
    return paymentsList.length > 0 ? paymentsList.length - 1 : 0;
  });

  const invoicePrintRef = useRef<HTMLDivElement>(null);

  // Compute fee details
  const totalFee = Number(student.totalFees) || (student.admissions?.[0]?.totalFee) || 0;
  const currentPayment = paymentsList[selectedPaymentIdx];

  // Cumulative paid up to selected installment
  let cumulativePaid = 0;
  for (let i = 0; i <= selectedPaymentIdx && i < paymentsList.length; i++) {
    cumulativePaid += paymentsList[i].amount;
  }
  if (paymentsList.length === 0) {
    cumulativePaid = Number(student.paidFees) || 0;
  }

  const balanceDue = Math.max(0, totalFee - cumulativePaid);

  // Course Details
  const courseName = Array.isArray(student.course)
    ? student.course.join(", ")
    : (student.course || student.admissions?.[0]?.courses?.join(", ") || "Master Course");

  const duration = student.duration || student.admissions?.[0]?.courseDuration || "3 Months";
  
  // Joining Date format
  const rawStartDate = student.startDate || student.admissions?.[0]?.startDate;
  const joiningDateFormatted = rawStartDate 
    ? new Date(rawStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // Bill Date format (from payment date or today)
  const paymentDate = currentPayment?.date ? new Date(currentPayment.date) : new Date();
  const billDateFormatted = paymentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const paymentMethod = currentPayment?.paymentMethod || student.feeType || "Online";
  const utrNumber = currentPayment?.utrNumber || student.utrNumber || "";

  const getInstallmentLabel = (num: number) => {
    if (num === 1) return "1st Installment Paid";
    if (num === 2) return "2nd Installment Paid";
    if (num === 3) return "3rd Installment Paid";
    return `${num}th Installment Paid`;
  };

  // List of all installments paid up to the selected one
  const displayedPayments = paymentsList.length > 0
    ? paymentsList.slice(0, selectedPaymentIdx + 1)
    : (Number(student.paidFees) > 0
        ? [{
            amount: Number(student.paidFees) || 0,
            paymentMethod: student.feeType || "Cash",
            utrNumber: student.utrNumber || "",
            date: student.startDate || new Date().toISOString(),
            installmentNumber: 1
          }]
        : []
      );

  // Print function
  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>&nbsp;</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            @media print {
              html, body {
                width: 210mm;
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
            }
            html, body {
              width: 210mm;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              color: #1e293b;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 15px;
            }
            .invoice-wrapper {
              width: 210mm;
              min-height: 296mm;
              height: 296mm;
              max-height: 296mm;
              margin: 0 auto;
              padding: 22mm 22mm 20mm 22mm;
              background: #ffffff;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
              page-break-inside: avoid;
              page-break-after: avoid;
              overflow: hidden;
            }
            .content-body {
              display: flex;
              flex-direction: column;
              flex: 1;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            .logo-img {
              height: 46px;
              width: auto;
              max-width: 150px;
              object-fit: contain;
              object-position: left;
            }
            .invoice-title {
              font-size: 42px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.5px;
            }
            .invoice-date {
              font-size: 16px;
              font-weight: 600;
              color: #1e293b;
              text-align: right;
            }
            .billed-to-section {
              margin-bottom: 42px;
              font-size: 15px;
              line-height: 1.5;
            }
            .billed-to-label {
              color: #0f172a;
              font-weight: 700;
              display: inline-block;
              width: 105px;
              vertical-align: top;
              font-size: 16px;
            }
            .billed-to-content {
              display: inline-block;
              vertical-align: top;
            }
            .student-name {
              font-size: 21px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .student-phone {
              color: #334155;
              margin-bottom: 4px;
              font-size: 15px;
            }
            .student-address {
              color: #334155;
              font-size: 15px;
              max-width: 420px;
              word-break: break-word;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 42px;
            }
            .invoice-table th {
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
              padding: 14px 10px;
              border-bottom: 2.5px solid #0f172a;
              text-align: left;
            }
            .invoice-table th.center { text-align: center; }
            .invoice-table th.right { text-align: right; }
            .invoice-table td {
              font-size: 16px;
              color: #1e293b;
              padding: 22px 10px;
              border-bottom: 2.5px solid #0f172a;
            }
            .invoice-table td.center { text-align: center; }
            .invoice-table td.right { text-align: right; font-weight: 700; font-size: 18px; }
            .course-name {
              font-weight: 700;
              font-size: 18px;
              color: #0f172a;
            }
            .course-joining {
              font-size: 14px;
              color: #64748b;
              margin-top: 5px;
              font-weight: 500;
            }
            .summary-container {
              display: flex;
              justify-content: flex-end;
              margin-top: 36px;
              margin-bottom: auto;
            }
            .summary-boxes {
              width: 350px;
              display: flex;
              flex-direction: column;
              gap: 14px;
            }
            .summary-box-dark {
              background-color: #0f172a !important;
              color: #ffffff !important;
              border-radius: 16px;
              padding: 14px 22px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: 700;
              font-size: 16px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .summary-box-gray {
              background-color: #f1f5f9 !important;
              color: #0f172a !important;
              border: 1.5px solid #cbd5e1 !important;
              border-radius: 16px;
              padding: 14px 22px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: 700;
              font-size: 16px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .footer {
              margin-top: auto;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding-top: 24px;
              border-top: 1.5px solid #e2e8f0;
            }
            .payment-info-title {
              color: #0f172a;
              font-weight: 700;
              font-size: 16px;
              margin-bottom: 6px;
            }
            .payment-info-institute {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .payment-info-method {
              font-size: 14px;
              color: #334155;
            }
            .signatory-container {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              text-align: right;
            }
            .signature-img {
              width: 160px;
              height: auto;
              max-height: 58px;
              object-fit: contain;
              margin-bottom: 3px;
            }
            .signatory-label {
              color: #0f172a;
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <div class="content-body">
              <div class="header">
                <img class="logo-img" src="/logo/RIZE_LOGO_CROPPED.png" alt="Rizeworld" />
                <div class="invoice-title">Invoice</div>
                <div class="invoice-date">${billDateFormatted}</div>
              </div>

              <div class="billed-to-section">
                <span class="billed-to-label">Billed to:</span>
                <div class="billed-to-content">
                  <div class="student-name">${student.name}</div>
                  <div class="student-phone">${student.phone || "N/A"}</div>
                  <div class="student-address">${student.address ? student.address.replace(/\\n/g, '<br/>') : "Alwar, Rajasthan"}</div>
                </div>
              </div>

              <table class="invoice-table">
                <thead>
                  <tr>
                    <th style="width: 48%;">Description</th>
                    <th class="center" style="width: 22%;">Duration</th>
                    <th class="center" style="width: 12%;">QTY</th>
                    <th class="right" style="width: 18%;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="course-name">${courseName}</div>
                      <div class="course-joining">Joining Date: ${joiningDateFormatted}</div>
                    </td>
                    <td class="center">${duration}</td>
                    <td class="center">1</td>
                    <td class="right">${totalFee}</td>
                  </tr>
                </tbody>
              </table>

              <div class="summary-container">
                <div class="summary-boxes">
                  <div class="summary-box-dark">
                    <span>Total</span>
                    <span>${totalFee}</span>
                  </div>
                  ${displayedPayments.map((p, idx) => `
                    <div class="summary-box-dark">
                      <span>${getInstallmentLabel(idx + 1)}</span>
                      <span>${p.amount}</span>
                    </div>
                  `).join("")}
                  <div class="summary-box-gray">
                    <span>Balance Due</span>
                    <span>${balanceDue}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div>
                <div class="payment-info-title">Payment Info</div>
                <div class="payment-info-institute">Rizeworld Institute of AI & Digital Marketing</div>
                <div class="payment-info-method">
                  Payment: ${paymentMethod}
                  ${utrNumber ? `<br/><span style="font-size:12px; color:#64748b;">UTR: ${utrNumber}</span>` : ""}
                </div>
              </div>
              <div class="signatory-container">
                <img class="signature-img" src="/bhavik_signature.png" alt="Bhavik Joshi" />
                <div class="signatory-label">Authorised Signatory</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Wait for image/fonts to load, then print
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-neutral-100">
        
        {/* Top Action Bar (Screen Only) */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-bold text-neutral-500">Student Bill / Invoice</span>
            {paymentsList.length > 1 && (
              <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-neutral-200 shadow-2xs">
                <span className="text-xs text-neutral-600 font-medium">Installment:</span>
                <select
                  value={selectedPaymentIdx}
                  onChange={(e) => setSelectedPaymentIdx(Number(e.target.value))}
                  className="text-xs font-bold text-neutral-800 bg-transparent border-none outline-none cursor-pointer"
                >
                  {paymentsList.map((p, idx) => (
                    <option key={idx} value={idx}>
                      {idx + 1}{idx === 0 ? "st" : idx === 1 ? "nd" : idx === 2 ? "rd" : "th"} Installment (₹{p.amount})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer hover:shadow"
              title="Print or Save as PDF"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Preview Container (Full A4 Page Layout) */}
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[85vh] bg-neutral-200/60 flex justify-center">
          <div 
            ref={invoicePrintRef}
            className="w-full max-w-[760px] min-h-[960px] sm:min-h-[1020px] bg-white rounded-2xl p-8 sm:p-14 shadow-xl border border-neutral-200/80 text-neutral-900 flex flex-col justify-between"
          >
            {/* Upper Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Header: Logo, Title, Date */}
              <div className="flex items-center justify-between gap-4 mb-10">
                <div className="w-1/3 flex justify-start">
                  <img 
                    src="/logo/RIZE_LOGO_CROPPED.png" 
                    alt="Rizeworld Institute of AI & Digital Marketing" 
                    className="h-9 sm:h-11 w-auto max-w-[140px] object-contain object-left"
                  />
                </div>
                <div className="w-1/3 text-center">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">Invoice</h1>
                </div>
                <div className="w-1/3 text-right">
                  <p className="text-sm sm:text-base font-semibold text-neutral-800">{billDateFormatted}</p>
                </div>
              </div>

              {/* Billed To Section */}
              <div className="flex items-start gap-4 mb-10 text-sm sm:text-base">
                <div className="text-neutral-900 font-bold min-w-[85px] pt-0.5">
                  Billed to:
                </div>
                <div>
                  <div className="font-bold text-neutral-900 text-lg sm:text-xl">{student.name}</div>
                  <div className="text-neutral-700 mt-1 font-medium">{student.phone || "N/A"}</div>
                  <div className="text-neutral-700 mt-1 max-w-sm whitespace-pre-line leading-relaxed">
                    {student.address || "Alwar, Rajasthan"}
                  </div>
                </div>
              </div>

              {/* Course Table */}
              <div className="mb-10 overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-900">
                      <th className="py-3.5 px-2 font-bold text-neutral-900 w-[46%]">Description</th>
                      <th className="py-3.5 px-2 font-bold text-neutral-900 text-center w-[22%]">Duration</th>
                      <th className="py-3.5 px-2 font-bold text-neutral-900 text-center w-[12%]">QTY</th>
                      <th className="py-3.5 px-2 font-bold text-neutral-900 text-right w-[20%]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-2 border-neutral-900">
                      <td className="py-5 px-2">
                        <div className="font-bold text-neutral-900 text-base sm:text-lg">{courseName}</div>
                        <div className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">Joining Date: {joiningDateFormatted}</div>
                      </td>
                      <td className="py-5 px-2 text-center text-neutral-800 font-medium">{duration}</td>
                      <td className="py-5 px-2 text-center text-neutral-800 font-medium">1</td>
                      <td className="py-5 px-2 text-right font-bold text-neutral-900 text-base sm:text-lg">{totalFee}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Pill Boxes (Aligned Right) */}
              <div className="flex justify-end mt-8 sm:mt-12 mb-auto">
                <div className="w-full max-w-[320px] sm:max-w-[350px] space-y-3 sm:space-y-3.5">
                  {/* Total Box */}
                  <div className="bg-neutral-900 text-white rounded-2xl px-6 py-3.5 sm:py-4 flex items-center justify-between font-bold text-sm sm:text-base shadow-xs">
                    <span>Total</span>
                    <span>{totalFee}</span>
                  </div>

                  {/* All Paid Installment Boxes */}
                  {displayedPayments.map((p, idx) => (
                    <div 
                      key={idx} 
                      className="bg-neutral-900 text-white rounded-2xl px-6 py-3.5 sm:py-4 flex items-center justify-between font-bold text-sm sm:text-base shadow-xs"
                    >
                      <span>{getInstallmentLabel(idx + 1)}</span>
                      <span>{p.amount}</span>
                    </div>
                  ))}

                  {/* Balance Due Box */}
                  <div className="bg-neutral-100 border border-neutral-300 text-neutral-900 rounded-2xl px-6 py-3.5 sm:py-4 flex items-center justify-between font-bold text-sm sm:text-base">
                    <span>Balance Due</span>
                    <span>{balanceDue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Payment Info (Left) & Authorised Signatory (Right) - Pinned to bottom */}
            <div className="mt-auto pt-6 border-t border-neutral-200 flex items-end justify-between">
              {/* Payment Info */}
              <div>
                <div className="text-neutral-900 font-bold text-sm sm:text-base mb-1.5">Payment Info</div>
                <div className="text-neutral-900 text-xs sm:text-sm font-semibold">
                  Rizeworld Institute of AI & Digital Marketing
                </div>
                <div className="text-neutral-700 text-xs sm:text-sm mt-1">
                  Payment: {paymentMethod}
                  {utrNumber && <span className="block text-xs text-neutral-500 mt-0.5">UTR: {utrNumber}</span>}
                </div>
              </div>

              {/* Authorised Signatory */}
              <div className="flex flex-col items-end text-right">
                <img 
                  src="/bhavik_signature.png" 
                  alt="Bhavik Joshi" 
                  className="w-36 sm:w-44 h-auto max-h-14 sm:max-h-16 object-contain mb-1"
                />
                <div className="text-neutral-900 text-xs sm:text-sm font-bold tracking-wider uppercase">
                  Authorised Signatory
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

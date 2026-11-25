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

  // Bill Date format
  const paymentDate = currentPayment?.date ? new Date(currentPayment.date) : new Date();
  const billDateFormatted = paymentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const paymentMethod = currentPayment?.paymentMethod || student.feeType || "Cash";
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
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
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
              color: #000000;
              font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
              height: 48px;
              width: auto;
              max-width: 160px;
              object-fit: contain;
              object-position: left;
              filter: grayscale(100%) contrast(140%);
              -webkit-filter: grayscale(100%) contrast(140%);
            }
            .invoice-title {
              font-size: 40px;
              font-weight: 900;
              color: #000000;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .invoice-date {
              font-size: 15px;
              font-weight: 600;
              color: #000000;
              text-align: right;
            }
            .billed-to-section {
              margin-bottom: 38px;
              font-size: 15px;
              line-height: 1.5;
            }
            .billed-to-label {
              color: #000000;
              font-weight: 800;
              display: inline-block;
              width: 105px;
              vertical-align: top;
              font-size: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .billed-to-content {
              display: inline-block;
              vertical-align: top;
            }
            .student-name {
              font-size: 20px;
              font-weight: 800;
              color: #000000;
              margin-bottom: 4px;
            }
            .student-phone {
              color: #333333;
              margin-bottom: 4px;
              font-size: 15px;
            }
            .student-address {
              color: #333333;
              font-size: 15px;
              max-width: 420px;
              word-break: break-word;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 36px;
            }
            .invoice-table th {
              font-size: 14px;
              font-weight: 800;
              color: #000000;
              padding: 12px 10px;
              border-top: 2px solid #000000;
              border-bottom: 2px solid #000000;
              text-align: left;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              background-color: #f8fafc;
            }
            .invoice-table th.center { text-align: center; }
            .invoice-table th.right { text-align: right; }
            .invoice-table td {
              font-size: 15px;
              color: #000000;
              padding: 18px 10px;
              border-bottom: 1px solid #cbd5e1;
            }
            .invoice-table td.center { text-align: center; }
            .invoice-table td.right { text-align: right; font-weight: 700; font-size: 17px; }
            .course-name {
              font-weight: 700;
              font-size: 17px;
              color: #000000;
            }
            .course-joining {
              font-size: 13px;
              color: #555555;
              margin-top: 5px;
              font-weight: 500;
            }
            .summary-container {
              display: flex;
              justify-content: flex-end;
              margin-top: 30px;
              margin-bottom: auto;
            }
            .summary-table {
              width: 340px;
              border-collapse: collapse;
              border: 1.5px solid #000000;
              background: #ffffff;
            }
            .summary-table td {
              padding: 10px 16px;
              font-size: 15px;
              border-bottom: 1px solid #e2e8f0;
            }
            .summary-table .sum-label {
              font-weight: 600;
              color: #1e293b;
              text-align: left;
            }
            .summary-table .sum-val {
              font-weight: 700;
              color: #000000;
              text-align: right;
              font-size: 16px;
            }
            .summary-table tr.balance-row td {
              border-top: 2px solid #000000;
              border-bottom: none;
              background-color: #f1f5f9;
              font-weight: 800;
              font-size: 16px;
            }
            .summary-table tr.balance-row .sum-val {
              font-weight: 800;
              font-size: 17px;
            }
            .footer {
              margin-top: auto;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding-top: 22px;
              border-top: 2px solid #000000;
            }
            .payment-info-title {
              color: #000000;
              font-weight: 800;
              font-size: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }
            .payment-info-institute {
              font-size: 14px;
              font-weight: 700;
              color: #000000;
              margin-bottom: 4px;
            }
            .payment-info-method {
              font-size: 14px;
              color: #334155;
              line-height: 1.5;
            }
            .signatory-container {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              text-align: right;
            }
            .signature-img {
              width: 165px;
              height: auto;
              max-height: 60px;
              object-fit: contain;
              margin-bottom: 3px;
              filter: grayscale(100%);
            }
            .signatory-line {
              border-top: 1.5px solid #000000;
              width: 175px;
              margin-bottom: 4px;
            }
            .signatory-label {
              color: #000000;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.5px;
              text-transform: uppercase;
              width: 175px;
              text-align: center;
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
                    <td class="right">₹${totalFee}</td>
                  </tr>
                </tbody>
              </table>

              <div class="summary-container">
                <table class="summary-table">
                  <tbody>
                    <tr>
                      <td class="sum-label">Total Course Fee</td>
                      <td class="sum-val">₹${totalFee}</td>
                    </tr>
                    ${displayedPayments.map((p, idx) => `
                      <tr>
                        <td class="sum-label">${getInstallmentLabel(idx + 1)}</td>
                        <td class="sum-val">₹${p.amount}</td>
                      </tr>
                    `).join("")}
                    <tr class="balance-row">
                      <td class="sum-label">Balance Due</td>
                      <td class="sum-val">₹${balanceDue}</td>
                    </tr>
                  </tbody>
                </table>
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
                <div class="signatory-line"></div>
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
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="w-full max-w-[760px] min-h-[960px] sm:min-h-[1020px] bg-white rounded-2xl p-8 sm:p-14 shadow-xl border border-neutral-200/80 text-black flex flex-col justify-between"
          >
            {/* Upper Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Header: Logo, Title, Date */}
              <div className="flex items-center justify-between gap-4 mb-10">
                <div className="w-1/3 flex justify-start">
                  <img 
                    src="/logo/RIZE_LOGO_CROPPED.png" 
                    alt="Rizeworld Institute of AI & Digital Marketing" 
                    className="h-9 sm:h-11 w-auto max-w-[140px] object-contain object-left filter grayscale contrast-125"
                  />
                </div>
                <div className="w-1/3 text-center">
                  <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">Invoice</h1>
                </div>
                <div className="w-1/3 text-right">
                  <p className="text-sm sm:text-base font-semibold text-black">{billDateFormatted}</p>
                </div>
              </div>

              {/* Billed To Section */}
              <div className="flex items-start gap-4 mb-10 text-sm sm:text-base">
                <div className="text-black font-extrabold min-w-[85px] pt-0.5 uppercase tracking-wide">
                  Billed to:
                </div>
                <div>
                  <div className="font-extrabold text-black text-lg sm:text-xl">{student.name}</div>
                  <div className="text-neutral-800 mt-1 font-medium">{student.phone || "N/A"}</div>
                  <div className="text-neutral-800 mt-1 max-w-sm whitespace-pre-line leading-relaxed">
                    {student.address || "Alwar, Rajasthan"}
                  </div>
                </div>
              </div>

              {/* Course Table */}
              <div className="mb-10 overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base border-collapse">
                  <thead>
                    <tr className="border-t-2 border-b-2 border-black">
                      <th className="py-3 px-2 font-black text-black uppercase tracking-wider w-[46%]">Description</th>
                      <th className="py-3 px-2 font-black text-black uppercase tracking-wider text-center w-[22%]">Duration</th>
                      <th className="py-3 px-2 font-black text-black uppercase tracking-wider text-center w-[12%]">QTY</th>
                      <th className="py-3 px-2 font-black text-black uppercase tracking-wider text-right w-[20%]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-300">
                      <td className="py-5 px-2">
                        <div className="font-bold text-black text-base sm:text-lg">{courseName}</div>
                        <div className="text-xs sm:text-sm text-neutral-600 mt-1 font-medium">Joining Date: {joiningDateFormatted}</div>
                      </td>
                      <td className="py-5 px-2 text-center text-neutral-800 font-medium">{duration}</td>
                      <td className="py-5 px-2 text-center text-neutral-800 font-medium">1</td>
                      <td className="py-5 px-2 text-right font-extrabold text-black text-base sm:text-lg">₹{totalFee}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Table (Aligned Right) */}
              <div className="flex justify-end mt-8 sm:mt-12 mb-auto">
                <div className="w-full max-w-[320px] sm:max-w-[340px] border-[1.5px] border-black rounded-lg overflow-hidden bg-white shadow-2xs">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-200 text-sm sm:text-base">
                    <span className="font-semibold text-neutral-800">Total Course Fee</span>
                    <span className="font-bold text-black">₹{totalFee}</span>
                  </div>
                  {displayedPayments.map((p, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center px-4 py-3 border-b border-neutral-200 text-sm sm:text-base"
                    >
                      <span className="font-semibold text-neutral-800">{getInstallmentLabel(idx + 1)}</span>
                      <span className="font-bold text-black">₹{p.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3.5 bg-neutral-100 border-t-2 border-black text-sm sm:text-base">
                    <span className="font-extrabold text-black">Balance Due</span>
                    <span className="font-extrabold text-black text-base sm:text-lg">₹{balanceDue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Payment Info (Left) & Authorised Signatory (Right) - Pinned to bottom */}
            <div className="mt-auto pt-6 border-t-2 border-black flex items-end justify-between">
              {/* Payment Info */}
              <div>
                <div className="text-black font-extrabold text-sm sm:text-base mb-1.5 uppercase tracking-wide">Payment Info</div>
                <div className="text-black text-xs sm:text-sm font-bold">
                  Rizeworld Institute of AI & Digital Marketing
                </div>
                <div className="text-neutral-700 text-xs sm:text-sm mt-1 leading-relaxed">
                  Payment: {paymentMethod}
                  {utrNumber && <span className="block text-xs text-neutral-500 mt-0.5">UTR: {utrNumber}</span>}
                </div>
              </div>

              {/* Authorised Signatory */}
              <div className="flex flex-col items-end text-right">
                <img 
                  src="/bhavik_signature.png" 
                  alt="Bhavik Joshi" 
                  className="w-36 sm:w-44 h-auto max-h-14 sm:max-h-16 object-contain mb-1.5 filter grayscale"
                />
                <div className="border-t-[1.5px] border-black w-36 sm:w-44 mb-1.5" />
                <div className="text-black text-xs sm:text-sm font-extrabold tracking-wider uppercase text-center w-36 sm:w-44">
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

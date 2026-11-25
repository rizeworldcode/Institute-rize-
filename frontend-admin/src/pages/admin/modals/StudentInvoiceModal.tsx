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
    ? new Date(rawStartDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-")
    : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");

  // Bill Date format (e.g. 23-Nov-2026)
  const paymentDate = currentPayment?.date ? new Date(currentPayment.date) : new Date();
  const billDateFormatted = paymentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).replace(/ /g, "-");

  // Invoice Number
  const invoiceNo = (student as any).invoiceNo || (student.id ? `RW-${student.id.replace(/\D/g, '').slice(-3) || student.id.slice(-4).toUpperCase()}` : "111");

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
              font-size: 13px;
              line-height: 1.4;
            }
            .invoice-wrapper {
              width: 210mm;
              min-height: 296mm;
              height: 296mm;
              max-height: 296mm;
              margin: 0 auto;
              padding: 16mm 18mm 14mm 18mm;
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
            }
            .header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
            }
            .logo-img {
              height: 64px;
              width: auto;
              max-width: 190px;
              object-fit: contain;
              object-position: left;
              filter: grayscale(100%) contrast(140%);
              -webkit-filter: grayscale(100%) contrast(140%);
            }
            .company-header-info {
              text-align: right;
              font-size: 11.5px;
              line-height: 1.4;
              color: #000000;
            }
            .company-title {
              font-weight: 900;
              font-size: 13.5px;
              letter-spacing: 0.3px;
              margin-bottom: 3px;
              text-transform: uppercase;
            }
            .company-line {
              margin-top: 1px;
            }
            .company-contact {
              margin-top: 2px;
            }
            .header-divider {
              border-bottom: 2px solid #000000;
              margin: 14px 0 16px 0;
            }
            .section-heading-large {
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 0.5px;
              text-transform: uppercase;
              margin-bottom: 12px;
            }
            .section-heading-medium {
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 0.4px;
              text-transform: uppercase;
              margin-top: 14px;
              margin-bottom: 8px;
            }
            .grid-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #000000;
              font-size: 12.5px;
            }
            .grid-table th {
              border: 1px solid #000000;
              padding: 7px 8px;
              font-weight: 800;
              background-color: #ffffff;
              font-size: 12.5px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            .grid-table td {
              border: 1px solid #000000;
              padding: 7px 10px;
              vertical-align: middle;
            }
            .cell-label {
              font-weight: 700;
              color: #000000;
            }
            .cell-value {
              color: #000000;
            }
            .meta-grid-table {
              margin-bottom: 4px;
            }
            .bill-grid-table {
              margin-bottom: 14px;
            }
            .service-grid-table {
              margin-bottom: 12px;
            }
            .declaration-text {
              font-size: 12px;
              margin: 10px 0 16px 0;
              line-height: 1.45;
            }
            .footer-layout {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-top: auto;
              padding-top: 10px;
            }
            .footer-signatory {
              width: 44%;
            }
            .signatory-company {
              font-weight: 800;
              font-size: 13px;
              line-height: 1.35;
              text-transform: uppercase;
            }
            .signatory-title {
              font-size: 12px;
              font-weight: 600;
              margin-top: 6px;
            }
            .signatory-img-wrap {
              margin: 6px 0 2px 0;
            }
            .signature-img {
              height: 52px;
              width: auto;
              max-width: 160px;
              object-fit: contain;
              filter: grayscale(100%);
            }
            .signatory-name {
              font-weight: 800;
              font-size: 13.5px;
            }
            .signatory-role {
              font-weight: 700;
              font-size: 11.5px;
              text-transform: uppercase;
              margin-top: 1px;
            }
            .footer-bank {
              width: 52%;
              border-left: 2px solid #000000;
              padding-left: 20px;
              font-size: 12px;
              line-height: 1.6;
            }
            .payment-method-box {
              margin-top: 6px;
              padding-top: 6px;
              border-top: 1px dashed #777777;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <div class="content-body">
              <!-- Top Header: Logo (Left) + Company Info (Right) -->
              <div class="header">
                <img class="logo-img" src="/logo/RIZE_LOGO_CROPPED.png" alt="Rizeworld" />
                <div class="company-header-info">
                  <div class="company-title">RIZE WORLD INSTITUTE OF<br/>AI & DIGITAL MARKETING</div>
                  <div class="company-line"><strong>Address :</strong> <a href="https://maps.google.com/?q=C197,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001" target="_blank" style="color: inherit; text-decoration: none;">C197, near Telco Circle, UIT colony,<br/>Shalimar Nagar, Alwar, Rajasthan 301001</a></div>
                  <div class="company-contact">
                    <span>🌐 <a href="https://rizeworldinstitute.in/" target="_blank" style="color: inherit; text-decoration: none;">www.rizeworldinstitute.in</a></span>
                    <span style="margin-left: 14px;">📞 <a href="tel:+918302277092" style="color: inherit; text-decoration: none;">+91 8302277092</a></span>
                  </div>
                  <div class="company-line" style="margin-top: 2px;">✉️ hro@rizeworld.in</div>
                </div>
              </div>

              <!-- Solid Black Divider Line -->
              <div class="header-divider"></div>

              <!-- TAX INVOICE Heading -->
              <div class="section-heading-large">TAX INVOICE</div>

              <!-- Meta Table (2x2 Grid) -->
              <table class="grid-table meta-grid-table">
                <tbody>
                  <tr>
                    <td class="cell-label" style="width: 20%;">Invoice No</td>
                    <td class="cell-value" style="width: 30%; font-weight: 600;">${invoiceNo}</td>
                    <td class="cell-label" style="width: 22%;">Invoice Date</td>
                    <td class="cell-value" style="width: 28%; font-weight: 600;">${billDateFormatted}</td>
                  </tr>
                  <tr>
                    <td class="cell-label">GSTIN</td>
                    <td class="cell-value">${(student as any).gstin || ""}</td>
                    <td class="cell-label">PAN</td>
                    <td class="cell-value">${(student as any).pan || ""}</td>
                  </tr>
                </tbody>
              </table>

              <!-- BILL TO Heading -->
              <div class="section-heading-medium">BILL TO</div>

              <!-- BILL TO Table -->
              <table class="grid-table bill-grid-table">
                <tbody>
                  <tr>
                    <td class="cell-label" style="width: 24%;">Client Name</td>
                    <td class="cell-value" style="width: 76%; font-weight: 700;">${student.name}</td>
                  </tr>
                  <tr>
                    <td class="cell-label">Company Name</td>
                    <td class="cell-value">Rizeworld Student</td>
                  </tr>
                  <tr>
                    <td class="cell-label">Address</td>
                    <td class="cell-value">${student.address ? student.address.replace(/\\n/g, '<br/>') : "Nagli Cir, Alwar, Rajasthan 301001"}</td>
                  </tr>
                  <tr>
                    <td class="cell-label">Contact / Phone</td>
                    <td class="cell-value">${student.phone || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Services / Fee Description Table -->
              <table class="grid-table service-grid-table">
                <thead>
                  <tr>
                    <th style="width: 8%; text-align: center;">S.No</th>
                    <th style="width: 52%; text-align: center;">Service Description</th>
                    <th style="width: 18%; text-align: center;">Duration</th>
                    <th style="width: 22%; text-align: center;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="text-align: center; font-weight: 600;">1</td>
                    <td>
                      <div style="font-weight: 700;">${courseName}</div>
                      <div style="font-size: 11.5px; color: #333; margin-top: 2px;">( Joining Date: ${joiningDateFormatted} )</div>
                    </td>
                    <td style="text-align: center; font-weight: 500;">${duration}</td>
                    <td style="text-align: right; font-weight: 700;">${Number(totalFee).toLocaleString("en-IN")} /-</td>
                  </tr>
                  ${displayedPayments.map((p, idx) => `
                    <tr>
                      <td style="text-align: center; font-weight: 600;">${idx + 2}</td>
                      <td>
                        <span style="font-weight: 600;">${getInstallmentLabel(idx + 1)}</span>
                        <span style="font-size: 11.5px; margin-left: 6px; color: #333;">( Mode: ${p.paymentMethod}${p.utrNumber ? ` - UTR: ${p.utrNumber}` : ""} - ${new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-")} )</span>
                      </td>
                      <td style="text-align: center; font-weight: 500;">Paid</td>
                      <td style="text-align: right; font-weight: 700;">${Number(p.amount).toLocaleString("en-IN")} /-</td>
                    </tr>
                  `).join("")}
                  <tr>
                    <td style="height: 18px;"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align: right; font-weight: 800; padding-right: 14px; text-transform: uppercase;">TOTAL PAID</td>
                    <td style="text-align: right; font-weight: 800;">${Number(cumulativePaid).toLocaleString("en-IN")} /-</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align: right; font-weight: 800; padding-right: 14px; text-transform: uppercase;">BALANCE DUE</td>
                    <td style="text-align: right; font-weight: 800; font-size: 13.5px;">${Number(balanceDue).toLocaleString("en-IN")} /-</td>
                  </tr>
                </tbody>
              </table>

              <!-- Declaration Text -->
              <div class="declaration-text">
                <strong>Declaration:</strong> We declare that this invoice shows the true and correct value of services provided.
              </div>
            </div>

            <!-- Footer: Signatory (Left) & Bank/Payment Info (Right) -->
            <div class="footer-layout">
              <div class="footer-signatory">
                <div class="signatory-company">For Rizeworld Institute of<br/>AI & Digital Marketing</div>
                <div class="signatory-title">Authorized Signatory</div>
                <div class="signatory-img-wrap">
                  <img class="signature-img" src="/bhavik_signature.png" alt="Bhavik Joshi" />
                </div>
                <div class="signatory-name">Bhavik Joshi</div>
                <div class="signatory-role">CEO</div>
              </div>

              <div class="footer-bank">
                <div style="font-weight: 800; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">Payment Info</div>
                <div><strong>Payment Mode:</strong> ${paymentMethod}</div>
                ${utrNumber ? `<div style="margin-top: 2px;"><strong>UTR Number:</strong> ${utrNumber}</div>` : ""}
                <div style="margin-top: 2px;"><strong>Payment Date:</strong> ${billDateFormatted}</div>
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
                      {idx + 1}{idx === 0 ? "st" : idx === 1 ? "nd" : idx === 2 ? "rd" : "th"} Installment (₹{p.amount.toLocaleString("en-IN")})
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

        {/* Invoice Preview Container (Full A4 Page Layout matching user template) */}
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[85vh] bg-neutral-200/60 flex justify-center">
          <div 
            ref={invoicePrintRef}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="w-full max-w-[760px] min-h-[960px] sm:min-h-[1020px] bg-white rounded-2xl p-6 sm:p-12 shadow-xl border border-neutral-200 text-black flex flex-col justify-between"
          >
            {/* Upper Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Header: Logo (Left) + Company Info (Right) */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-1/3 flex justify-start">
                  <img 
                    src="/logo/RIZE_LOGO_CROPPED.png" 
                    alt="Rizeworld Institute of AI & Digital Marketing" 
                    className="h-12 sm:h-16 w-auto max-w-[170px] object-contain object-left filter grayscale contrast-125"
                  />
                </div>
                <div className="w-2/3 text-right text-[11px] sm:text-xs leading-relaxed text-black">
                  <div className="font-black text-xs sm:text-sm uppercase tracking-wide">
                    RIZE WORLD INSTITUTE OF<br />AI & DIGITAL MARKETING
                  </div>
                  <div className="mt-0.5">
                    <strong className="font-bold">Address :</strong>{" "}
                    <a 
                      href="https://maps.google.com/?q=C197,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001" 
                      target="_blank" 
                      rel="noreferrer"
                      className="hover:underline text-black"
                    >
                      C197, near Telco Circle, UIT colony,<br />
                      Shalimar Nagar, Alwar, Rajasthan 301001
                    </a>
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-3 text-neutral-800">
                    <a 
                      href="https://rizeworldinstitute.in/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1 text-black"
                    >
                      <span>🌐</span>
                      <span>www.rizeworldinstitute.in</span>
                    </a>
                    <a 
                      href="tel:+918302277092" 
                      className="hover:underline flex items-center gap-1 text-black"
                    >
                      <span>📞</span>
                      <span>+91 8302277092</span>
                    </a>
                  </div>
                  <div className="mt-0.5 text-neutral-800">✉️ hro@rizeworld.in</div>
                </div>
              </div>

              {/* Solid Black Divider Line */}
              <div className="border-b-2 border-black my-3.5 sm:my-4" />

              {/* TAX INVOICE Heading */}
              <div className="text-lg sm:text-xl font-black uppercase tracking-wider text-black mb-3">
                TAX INVOICE
              </div>

              {/* Meta Table (2x2 Grid) */}
              <table className="w-full border-collapse border border-black text-xs sm:text-sm mb-3">
                <tbody>
                  <tr>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold w-[20%]">Invoice No</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-semibold w-[30%]">{invoiceNo}</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold w-[22%]">Invoice Date</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-semibold w-[28%]">{billDateFormatted}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold">GSTIN</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2">{(student as any).gstin || ""}</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold">PAN</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2">{(student as any).pan || ""}</td>
                  </tr>
                </tbody>
              </table>

              {/* BILL TO Heading */}
              <div className="text-sm sm:text-base font-black uppercase tracking-wider text-black mt-2 mb-2">
                BILL TO
              </div>

              {/* BILL TO Table */}
              <table className="w-full border-collapse border border-black text-xs sm:text-sm mb-4">
                <tbody>
                  <tr>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold w-[24%]">Client Name</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold w-[76%]">{student.name}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold">Company Name</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-medium">Rizeworld Student</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold">Address</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-medium">
                      {student.address || "Nagli Cir, Alwar, Rajasthan 301001"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-bold">Contact / Phone</td>
                    <td className="border border-black px-2.5 sm:px-3 py-1.5 sm:py-2 font-medium">{student.phone || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Service Description Table */}
              <div className="overflow-x-auto mb-3">
                <table className="w-full border-collapse border border-black text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white">
                      <th className="border border-black px-2 py-2 font-extrabold text-center w-[8%]">S.No</th>
                      <th className="border border-black px-2 py-2 font-extrabold text-center w-[52%]">Service Description</th>
                      <th className="border border-black px-2 py-2 font-extrabold text-center w-[18%]">Duration</th>
                      <th className="border border-black px-2 py-2 font-extrabold text-center w-[22%]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-2 py-2 text-center font-bold">1</td>
                      <td className="border border-black px-2.5 py-2">
                        <div className="font-bold text-black">{courseName}</div>
                        <div className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 font-medium">
                          ( Joining Date: {joiningDateFormatted} )
                        </div>
                      </td>
                      <td className="border border-black px-2 py-2 text-center font-medium">{duration}</td>
                      <td className="border border-black px-2.5 py-2 text-right font-bold text-black">
                        {Number(totalFee).toLocaleString("en-IN")} /-
                      </td>
                    </tr>
                    {displayedPayments.map((p, idx) => (
                      <tr key={idx}>
                        <td className="border border-black px-2 py-1.5 text-center font-bold">{idx + 2}</td>
                        <td className="border border-black px-2.5 py-1.5">
                          <span className="font-bold text-black">{getInstallmentLabel(idx + 1)}</span>
                          <span className="text-[11px] sm:text-xs text-neutral-600 ml-1.5 font-medium">
                            ( Mode: {p.paymentMethod}{p.utrNumber ? ` - UTR: ${p.utrNumber}` : ""} - {new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-")} )
                          </span>
                        </td>
                        <td className="border border-black px-2 py-1.5 text-center font-medium">Paid</td>
                        <td className="border border-black px-2.5 py-1.5 text-right font-bold text-black">
                          {Number(p.amount).toLocaleString("en-IN")} /-
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="border border-black h-5"></td>
                      <td className="border border-black"></td>
                      <td className="border border-black"></td>
                      <td className="border border-black"></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="border border-black px-3 py-2 text-right font-black uppercase text-xs sm:text-sm">
                        TOTAL PAID
                      </td>
                      <td className="border border-black px-2.5 py-2 text-right font-black text-black text-xs sm:text-sm">
                        {Number(cumulativePaid).toLocaleString("en-IN")} /-
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="border border-black px-3 py-2 text-right font-black uppercase text-xs sm:text-sm">
                        BALANCE DUE
                      </td>
                      <td className="border border-black px-2.5 py-2 text-right font-black text-black text-xs sm:text-sm">
                        {Number(balanceDue).toLocaleString("en-IN")} /-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Declaration Text */}
              <div className="text-[11px] sm:text-xs text-black my-2.5 leading-relaxed">
                <strong className="font-bold">Declaration:</strong> We declare that this invoice shows the true and correct value of services provided.
              </div>
            </div>

            {/* Footer: Signatory (Left) & Bank/Payment Info (Right) */}
            <div className="mt-auto pt-3 flex items-start justify-between">
              {/* Left: Signatory */}
              <div className="w-[45%]">
                <div className="font-black text-xs sm:text-sm uppercase leading-tight text-black">
                  For Rizeworld Institute of<br />AI & Digital Marketing
                </div>
                <div className="text-xs font-semibold text-black mt-1.5">
                  Authorized Signatory
                </div>
                <div className="my-1.5">
                  <img 
                    src="/bhavik_signature.png" 
                    alt="Bhavik Joshi" 
                    className="w-32 sm:w-40 h-auto max-h-12 sm:max-h-14 object-contain filter grayscale"
                  />
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-black">
                  Bhavik Joshi
                </div>
                <div className="font-bold text-[11px] uppercase text-black mt-0.5">
                  CEO
                </div>
              </div>

              {/* Right: Payment Details */}
              <div className="w-[52%] border-l-2 border-black pl-4 sm:pl-6 text-[11px] sm:text-xs leading-relaxed text-black">
                <div className="font-black text-xs sm:text-sm uppercase tracking-wide mb-1 text-black">
                  Payment Info
                </div>
                <div><strong className="font-bold">Payment Mode:</strong> {paymentMethod}</div>
                {utrNumber && <div className="mt-0.5"><strong className="font-bold">UTR Number:</strong> {utrNumber}</div>}
                <div className="mt-0.5"><strong className="font-bold">Payment Date:</strong> {billDateFormatted}</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

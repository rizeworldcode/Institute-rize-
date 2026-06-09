import { useState } from "react";
import { UserCircle, X, Banknote, IndianRupee, Wallet, CreditCard, CheckCircle2, Calendar, BookOpen, Contact, Phone, Mail, MapPin, Activity } from "lucide-react";

export function StudentDetailsModal({ student, onClose }: any) {
   const [paymentTab, setPaymentTab] = useState<"one-time" | "installment">("one-time");
   // Calculate percentages for chart
   const total = Number(student.totalFees) || 0;
   const paid = Number(student.paidFees) || 0;
   const paidPercent = total > 0 ? Math.round((paid / total) * 100) : 0;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
         <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose}></div>
         
         <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#f8fafc] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-neutral-100 shrink-0">
               <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <UserCircle className="text-blue-600" /> Student Details
               </h2>
               <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
                  <X size={20} />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 flex-1 space-y-6">
               
               {/* Top 3 Analytics Boxes */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Box 1 */}
                  <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg group hover:-translate-y-1 transition-transform">
                     <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><UserCircle size={80} /></div>
                     <div className="relative z-10">
                        <div className="text-blue-100 text-sm font-semibold mb-1 uppercase tracking-wider">Student Profile</div>
                        <div className="text-2xl font-bold mb-1 truncate">{student.name}</div>
                        <div className="text-blue-200 font-mono text-sm opacity-90">{student.id}</div>
                     </div>
                  </div>
                  
                  {/* Box 2 */}
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200 relative overflow-hidden shadow-sm group hover:-translate-y-1 transition-transform">
                     <div className="absolute top-0 right-0 p-4 text-neutral-100 group-hover:scale-110 transition-transform"><Banknote size={80} /></div>
                     <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-2xl flex items-center justify-center shrink-0">
                           <IndianRupee size={24} />
                        </div>
                        <div>
                           <div className="text-neutral-500 text-sm font-semibold mb-1 uppercase tracking-wider">Total Fee</div>
                           <div className="text-2xl font-bold text-neutral-900">₹{total.toLocaleString()}</div>
                        </div>
                     </div>
                  </div>

                  {/* Box 3 */}
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200 relative overflow-hidden shadow-sm group hover:-translate-y-1 transition-transform">
                     <div className="absolute top-0 right-0 p-4 text-green-50 group-hover:scale-110 transition-transform"><Wallet size={80} /></div>
                     <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                           <Wallet size={24} />
                        </div>
                        <div>
                           <div className="text-neutral-500 text-sm font-semibold mb-1 uppercase tracking-wider">Paid Fee</div>
                           <div className="text-2xl font-bold text-green-600">₹{paid.toLocaleString()}</div>
                        </div>
                     </div>
                  </div>
               </div>

            {/* Payment Details & Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
               {/* Left Box: Payment History */}
               <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                     <CreditCard className="text-purple-600" size={20} /> Payment History
                  </h3>
                  
                  <div className="flex bg-neutral-100 p-1 rounded-xl mb-6">
                     <button onClick={() => setPaymentTab("one-time")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${paymentTab === "one-time" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>One Time</button>
                     <button onClick={() => setPaymentTab("installment")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${paymentTab === "installment" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>Installments</button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 max-h-[400px] scrollbar-thin scrollbar-thumb-neutral-200">
                     {paymentTab === "one-time" && (
                        <div className="space-y-4">
                           {student.fee && student.fee.length > 0 && Number(student.fee[0].amount) > 0 ? (
                              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 hover:border-blue-200 transition-colors">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                          <CheckCircle2 size={20} />
                                       </div>
                                       <div>
                                          <div className="font-bold text-neutral-900">Total Payment</div>
                                          <div className="text-xs text-neutral-500">Status: {paid >= total && total > 0 ? "Clear" : "Pending"}</div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="font-bold text-neutral-900 text-lg">₹{paid.toLocaleString()}</div>
                                       <div className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-md inline-block">Success</div>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-xl border border-neutral-100">
                                    <div>
                                       <div className="text-neutral-500 text-xs mb-1">Last Payment Date</div>
                                       <div className="font-semibold text-neutral-900 flex items-center gap-1">
                                          <Calendar size={14} className="text-neutral-400" /> 
                                          {student.fee[student.fee.length - 1]?.date ? new Date(student.fee[student.fee.length - 1].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                                       </div>
                                    </div>
                                    <div>
                                       <div className="text-neutral-500 text-xs mb-1">Latest UTR / Ref</div>
                                       <div className="font-mono font-semibold text-neutral-900 truncate">
                                          {student.fee[student.fee.length - 1]?.utr_Number || 'Cash'}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ) : paid > 0 ? (
                              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 hover:border-blue-200 transition-colors">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                          <Wallet size={20} />
                                       </div>
                                       <div>
                                          <div className="font-bold text-neutral-900">Total Paid Amount</div>
                                          <div className="text-xs text-neutral-500 font-medium italic">Record exists in database</div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="font-bold text-neutral-900 text-lg">₹{paid.toLocaleString()}</div>
                                       <div className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-md inline-block">Paid</div>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                                 <Banknote size={48} className="opacity-20 mb-4" />
                                 <p>No payment records found.</p>
                              </div>
                           )}
                        </div>
                     )}

                     {paymentTab === "installment" && (
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-neutral-200 before:to-transparent pt-2 pb-8">
                           {(() => {
                              const numInstallments = Number(student.feesInstallment) || 1;
                              const rows = [];
                              
                              for (let i = 0; i < numInstallments; i++) {
                                 const payment = student.fee && student.fee[i];
                                 const isPaid = !!payment;
                                 
                                 rows.push(
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                       <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                                          isPaid ? 'bg-blue-500 text-white' : 'bg-neutral-200 text-neutral-500'
                                       }`}>
                                          {i + 1}
                                       </div>
                                       <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                                          isPaid ? 'border-neutral-200 hover:border-blue-300' : 'border-neutral-100 opacity-70'
                                       }`}>
                                          <div className="flex justify-between items-start mb-3">
                                             <div className="font-bold text-neutral-900">{i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Installment</div>
                                             <div className={`${isPaid ? 'text-blue-600' : 'text-neutral-500'} font-bold text-lg`}>
                                                ₹{isPaid ? Number(payment.amount).toLocaleString() : (total / numInstallments).toLocaleString(undefined, {maximumFractionDigits: 0})}
                                             </div>
                                          </div>
                                          <div className="text-xs text-neutral-500 flex flex-col gap-1.5">
                                             <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-lg">
                                                <span className="flex items-center gap-1">
                                                   <Calendar size={12} /> 
                                                   {isPaid ? new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Pending"}
                                                </span>
                                                <span className={`${isPaid ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'} font-bold px-2 py-0.5 rounded text-[10px]`}>
                                                   {isPaid ? 'Success' : 'Awaited'}
                                                </span>
                                             </div>
                                             <div className="flex justify-between items-center px-1">
                                                <span>UTR No:</span>
                                                <span className={`font-mono font-semibold ${isPaid ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                                   {isPaid ? (payment.utr_Number || 'Cash') : '---'}
                                                </span>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 );
                              }
                              return rows;
                           })()}
                        </div>
                     )}
                  </div>
               </div>

                  {/* Right Box: 3D Fee Chart */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                     <h3 className="text-lg font-bold text-neutral-900 mb-8 w-full text-left flex items-center gap-2">
                        <Activity className="text-blue-600" size={20} /> Fee Overview
                     </h3>
                     
                     <div className="relative w-56 h-32 mb-6 flex items-end justify-center">
                        <svg className="w-full h-full" viewBox="0 0 140 78">
                           <defs>
                              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                 <stop offset="0%" stopColor="#1e3a8a" />
                                 <stop offset="100%" stopColor="#60a5fa" />
                              </linearGradient>
                           </defs>
                           
                           {[...Array(12)].map((_, i) => {
                              const radius = 54;
                              const circumference = 2 * Math.PI * radius;
                              const halfCircumference = circumference / 2;
                              const numSegments = 12;
                              const gap = 4;
                              const dashLength = (halfCircumference - (numSegments - 1) * gap) / numSegments;
                              
                              const offset = -(halfCircumference + (i * (dashLength + gap)));
                              const activeCount = Math.round((paidPercent / 100) * numSegments);
                              const isActive = i < activeCount;
                              
                              return (
                                 <circle 
                                    key={i}
                                    cx="70" 
                                    cy="70" 
                                    r={radius} 
                                    fill="transparent" 
                                    stroke={isActive ? "url(#gauge-gradient)" : "#f1f5f9"} 
                                    strokeWidth="16" 
                                    strokeDasharray={`${dashLength} ${circumference - dashLength}`} 
                                    strokeDashoffset={offset} 
                                    className="transition-all duration-1000 ease-out"
                                 />
                              );
                           })}
                        </svg>
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pointer-events-none translate-y-4">
                           <div className="text-4xl font-black text-neutral-900">{paidPercent}%</div>
                           <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mt-1">Paid Fees</div>
                        </div>
                     </div>

                     <div className="w-full grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-center shadow-sm hover:shadow-md transition-shadow">
                           <div className="text-xs text-neutral-500 font-semibold mb-1 uppercase tracking-wider">Paid</div>
                           <div className="font-bold text-neutral-900 text-lg">₹{paid.toLocaleString()}</div>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-center shadow-sm hover:shadow-md transition-shadow">
                           <div className="text-xs text-neutral-500 font-semibold mb-1 uppercase tracking-wider">Pending</div>
                           <div className="font-bold text-neutral-900 text-lg">₹{(total - paid).toLocaleString()}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Course & Personal Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Details */}
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden group">
                     <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700"><BookOpen size={200} /></div>
                     <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2 relative z-10">
                        <BookOpen className="text-indigo-600" size={20} /> Course Details
                     </h3>
                     <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 hover:bg-indigo-50 transition-colors">
                           <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Course Name</div>
                           <div className="font-bold text-neutral-900 text-sm">{student.course || "N/A"}</div>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 hover:bg-indigo-50 transition-colors">
                           <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Duration</div>
                           <div className="font-bold text-neutral-900 text-sm">{student.duration || "N/A"}</div>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 hover:bg-indigo-50 transition-colors">
                           <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Start Date</div>
                           <div className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                              <Calendar size={14} className="text-indigo-500"/> 
                              {student.startDate ? new Date(student.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                           </div>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 hover:bg-indigo-50 transition-colors">
                           <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">End Date</div>
                           <div className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                              <Calendar size={14} className="text-indigo-500"/> 
                              {student.endDate ? new Date(student.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Personal Details */}
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden group">
                     <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700"><Contact size={200} /></div>
                     <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2 relative z-10">
                        <Contact className="text-blue-600" size={20} /> Personal Details
                     </h3>
                     <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-xs hover:shadow-md transition-shadow">
                           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                              <Phone size={18} />
                           </div>
                           <div>
                              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">Phone Number</div>
                              <div className="font-bold text-neutral-900 text-sm">{student.phone || "N/A"}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-xs hover:shadow-md transition-shadow">
                           <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                              <Mail size={18} />
                           </div>
                           <div className="overflow-hidden">
                              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">Email Address</div>
                              <div className="font-bold text-neutral-900 text-sm truncate">{student.email || "N/A"}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-xs hover:shadow-md transition-shadow">
                           <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                              <MapPin size={18} />
                           </div>
                           <div className="overflow-hidden">
                              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">Residential Address</div>
                              <div className="font-bold text-neutral-900 text-sm truncate">{student.address || "N/A"}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
}

export type Admission = {
  admissionId: string;
  courses: string[];
  courseDuration: string;
  totalFee: number;
  totalPaidFee: number;
  pendingFee: number;
  feesStatus: "Clear" | "Pending" | "Partial";
  feesInstallment: number;
  payments: {
    id?: string;
    amount: number;
    paymentMethod: string;
    utrNumber?: string;
    date: string;
  }[];
  certificates: Certificate[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
  id: string;
  name: string;
  password?: string;
  email?: string;
  phone?: string;
  course?: string | string[];
  duration?: string;
  totalFees?: string | number;
  paidFees?: string | number;
  pendingFees?: string | number;
  feesInstallment?: string | number;
  feesStatus: "Clear" | "Pending" | "Partial";
  feeType?: "Online" | "Cash";
  utrNumber?: string;
  address?: string;
  startDate?: string;
  referredByName?: string;
  referredByPhone?: string;
  referredByEmail?: string;
  referredAmount?: string | number;
  endDate?: string;
  certificates: Certificate[];
  fee?: {
    amount: string;
    utr_Number?: string;
    date: string;
    payment_method: string;
  }[];
  admissions: Admission[];
};

export type Certificate = {
  id: string;
  url: string;
  date: string;
  courseName: string;
  name?: string;
  certificatePath?: string;
  issuedAt?: string;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  course: string;
  date: string;
  message?: string;
  status: "New" | "Contacted" | "Closed";
};

export type Teacher = {
  id: string;
  name: string;
  image?: string;
  subject: string;
  email: string;
  phone: string;
  address: string;
};

export type FollowupHistoryItem = {
  _id?: string;
  date: string;
  conversation: string;
  status: string;
  next_followup_date?: string | null;
  taken_by?: string;
  next_followup_by?: string;
  followup_round?: string;
};

export type StudentLead = {
  _id: string;
  lead_ID: string;
  student_name: string;
  address?: string;
  phone: string;
  school_name?: string;
  current_education?: string;

  is_from_workshop: boolean;
  workshop_school_name?: string;
  workshop_date?: string | null;
  source_other?: string;

  demo_class_taken: boolean;
  demo_date?: string | null;
  interested_course?: string;
  interest_level?: "High" | "Medium" | "Low" | "Not Interested" | "";
  problems_faced?: string;
  remarks?: string;

  conversation_notes?: string;
  call_outcome?: "Connected" | "Yes for Demo" | "Told Later" | "No" | "Not Connected" | "";
  status: "New Inquiry" | "In Follow-up" | "Demo Scheduled" | "Demo Completed" | "Converted" | "Lost";
  next_followup_date?: string | null;
  next_followup_by?: string;
  followup_round?: string;
  followup_taken_by?: string;
  followup_history?: FollowupHistoryItem[];

  created_at: string;
  updated_at?: string;
};

export type StudentLeadStats = {
  totalLeads: number;
  newInquiries: number;
  inFollowUp: number;
  converted: number;
  lostLeads: number;
  totalCalls?: number;
  totalConnected?: number;
  totalNotConnected?: number;
  yesForDemo?: number;
  noLeads?: number;
  toldLater?: number;
};


export type Student = {
  id: string;
  name: string;
  password?: string;
  email?: string;
  phone?: string;
  course?: string;
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
    id?: string;
    amount: string | number;
    utr_Number?: string;
    utrNumber?: string;
    date: string;
    payment_method?: string;
    paymentMethod?: string;
  }[];
};

export type Certificate = {
  id: string;
  url: string;
  date: string;
  name: string;
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

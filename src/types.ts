export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id?: number;
  name: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface Invoice {
  id?: number;
  customer: Customer;
  date: string;
  items: InvoiceItem[];
  total: number;
  status: 'paid' | 'unpaid';
  dueDate: string;
  taxPercentage: number; // New field
}
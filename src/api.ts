import axios, { AxiosError } from 'axios';
import { Invoice, Customer } from './types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<{ userId?: number, token?: string }> => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to login. Please try again.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export const verify2FA = async (userId: number, code: string): Promise<{ token: string }> => {
  try {
    const response = await api.post('/verify-2fa', { userId, code });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to verify 2FA code. Please try again.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export const signup = async (email: string, password: string, phoneNumber: string, name: string): Promise<void> => {
  try {
    await api.post('/signup', { email, password, phoneNumber, name });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to sign up. Please try again.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await api.get('/invoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const createInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
  try {
    const response = await api.post('/invoices', invoice);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const updateInvoice = async (id: number, invoice: Partial<Invoice>): Promise<Invoice> => {
  try {
    const response = await api.put(`/invoices/${id}`, invoice);
    return response.data;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

export const deleteInvoice = async (id: number): Promise<void> => {
  try {
    await api.delete(`/invoices/${id}`);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const createCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  try {
    const response = await api.post('/customers', customer);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
  try {
    const response = await api.put(`/customers/${customer.id}`, customer);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};
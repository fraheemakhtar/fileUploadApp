export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;   // ISO date string YYYY-MM-DD
  status: string;     // 'Active' | 'Inactive' | 'On Leave'
  gender: string;     // 'Male' | 'Female' | 'Other'
  address: string;
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  private readonly STORAGE_KEY = 'crud_employees';

  private readonly defaultEmployees: Employee[] = [
    {
      id: 1, firstName: 'John', lastName: 'Smith',
      email: 'john.smith@company.com', phone: '1234567890',
      department: 'Engineering', position: 'Senior Developer',
      salary: 95000, joinDate: '2021-03-15',
      status: 'Active', gender: 'Male',
      address: '123 Main Street, New York, NY 10001'
    },
    {
      id: 2, firstName: 'Sarah', lastName: 'Johnson',
      email: 'sarah.johnson@company.com', phone: '2345678901',
      department: 'HR', position: 'HR Executive',
      salary: 65000, joinDate: '2020-06-01',
      status: 'Active', gender: 'Female',
      address: '456 Oak Avenue, Los Angeles, CA 90001'
    },
    {
      id: 3, firstName: 'Michael', lastName: 'Brown',
      email: 'michael.brown@company.com', phone: '3456789012',
      department: 'Finance', position: 'Accountant',
      salary: 72000, joinDate: '2019-09-10',
      status: 'Active', gender: 'Male',
      address: '789 Pine Street, Chicago, IL 60601'
    },
    {
      id: 4, firstName: 'Emily', lastName: 'Davis',
      email: 'emily.davis@company.com', phone: '4567890123',
      department: 'Marketing', position: 'Designer',
      salary: 68000, joinDate: '2022-01-20',
      status: 'On Leave', gender: 'Female',
      address: '321 Elm Street, Houston, TX 77001'
    },
    {
      id: 5, firstName: 'Robert', lastName: 'Wilson',
      email: 'robert.wilson@company.com', phone: '5678901234',
      department: 'Sales', position: 'Manager',
      salary: 88000, joinDate: '2018-04-05',
      status: 'Active', gender: 'Male',
      address: '654 Maple Drive, Phoenix, AZ 85001'
    },
    {
      id: 6, firstName: 'Jennifer', lastName: 'Martinez',
      email: 'jennifer.martinez@company.com', phone: '6789012345',
      department: 'Engineering', position: 'Junior Developer',
      salary: 58000, joinDate: '2023-02-28',
      status: 'Active', gender: 'Female',
      address: '987 Cedar Lane, Philadelphia, PA 19101'
    },
    {
      id: 7, firstName: 'William', lastName: 'Anderson',
      email: 'william.anderson@company.com', phone: '7890123456',
      department: 'Operations', position: 'Manager',
      salary: 82000, joinDate: '2017-11-15',
      status: 'Active', gender: 'Male',
      address: '147 Birch Road, San Antonio, TX 78201'
    },
    {
      id: 8, firstName: 'Lisa', lastName: 'Thompson',
      email: 'lisa.thompson@company.com', phone: '8901234567',
      department: 'HR', position: 'Analyst',
      salary: 61000, joinDate: '2020-08-22',
      status: 'Inactive', gender: 'Female',
      address: '258 Walnut Street, San Diego, CA 92101'
    },
    {
      id: 9, firstName: 'James', lastName: 'Taylor',
      email: 'james.taylor@company.com', phone: '9012345678',
      department: 'Finance', position: 'Analyst',
      salary: 69000, joinDate: '2021-05-17',
      status: 'Active', gender: 'Male',
      address: '369 Spruce Ave, Dallas, TX 75201'
    },
    {
      id: 10, firstName: 'Mary', lastName: 'Garcia',
      email: 'mary.garcia@company.com', phone: '0123456789',
      department: 'Marketing', position: 'Manager',
      salary: 79000, joinDate: '2019-12-03',
      status: 'Active', gender: 'Female',
      address: '741 Poplar Street, San Jose, CA 95101'
    },
    {
      id: 11, firstName: 'David', lastName: 'Lee',
      email: 'david.lee@company.com', phone: '1122334455',
      department: 'Engineering', position: 'Senior Developer',
      salary: 98000, joinDate: '2020-03-09',
      status: 'Active', gender: 'Male',
      address: '852 Aspen Road, Austin, TX 78701'
    },
    {
      id: 12, firstName: 'Patricia', lastName: 'White',
      email: 'patricia.white@company.com', phone: '2233445566',
      department: 'Sales', position: 'Analyst',
      salary: 62000, joinDate: '2022-07-14',
      status: 'On Leave', gender: 'Female',
      address: '963 Magnolia Blvd, Jacksonville, FL 32201'
    },
    {
      id: 13, firstName: 'Charles', lastName: 'Harris',
      email: 'charles.harris@company.com', phone: '3344556677',
      department: 'Operations', position: 'Analyst',
      salary: 67000, joinDate: '2021-09-30',
      status: 'Active', gender: 'Male',
      address: '159 Sycamore Lane, Columbus, OH 43201'
    },
    {
      id: 14, firstName: 'Jessica', lastName: 'Clark',
      email: 'jessica.clark@company.com', phone: '4455667788',
      department: 'Engineering', position: 'Manager',
      salary: 105000, joinDate: '2016-01-18',
      status: 'Active', gender: 'Female',
      address: '357 Redwood Court, Fort Worth, TX 76101'
    },
    {
      id: 15, firstName: 'Christopher', lastName: 'Lewis',
      email: 'christopher.lewis@company.com', phone: '5566778899',
      department: 'Finance', position: 'Manager',
      salary: 91000, joinDate: '2018-06-25',
      status: 'Inactive', gender: 'Male',
      address: '468 Chestnut Street, Charlotte, NC 28201'
    }
  ];

  private employeesSubject: BehaviorSubject<Employee[]>;
  employees$: Observable<Employee[]>;

  constructor() {
    this.employeesSubject = new BehaviorSubject<Employee[]>(this.loadFromStorage());
    this.employees$ = this.employeesSubject.asObservable();
  }

  private loadFromStorage(): Employee[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Employee[];
      }
    } catch {
      // Corrupted storage — fall back to defaults
    }
    this.saveToStorage(this.defaultEmployees);
    return [...this.defaultEmployees];
  }

  private saveToStorage(employees: Employee[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
  }

  getAll(): Observable<Employee[]> {
    return this.employees$;
  }

  getById(id: number): Employee | undefined {
    return this.employeesSubject.getValue().find(e => e.id === id);
  }

  add(employee: Omit<Employee, 'id'>): void {
    const current = this.employeesSubject.getValue();
    const newId = current.length > 0 ? Math.max(...current.map(e => e.id)) + 1 : 1;
    const updated = [...current, { ...employee, id: newId, salary: +employee.salary }];
    this.employeesSubject.next(updated);
    this.saveToStorage(updated);
  }

  update(employee: Employee): void {
    const updated = this.employeesSubject.getValue().map(e =>
      e.id === employee.id ? { ...employee, salary: +employee.salary } : e
    );
    this.employeesSubject.next(updated);
    this.saveToStorage(updated);
  }

  delete(id: number): void {
    const updated = this.employeesSubject.getValue().filter(e => e.id !== id);
    this.employeesSubject.next(updated);
    this.saveToStorage(updated);
  }

  resetToDefault(): void {
    const fresh = [...this.defaultEmployees];
    this.employeesSubject.next(fresh);
    this.saveToStorage(fresh);
  }
}

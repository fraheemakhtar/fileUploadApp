import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  searchTerm     = '';
  departmentFilter = '';
  statusFilter   = '';
  fromDate       = '';
  toDate         = '';

  departments = ['HR', 'Finance', 'Engineering', 'Marketing', 'Sales', 'Operations'];
  statuses    = ['Active', 'Inactive', 'On Leave'];

  private destroy$ = new Subject<void>();

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.employees$
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => {
        this.allEmployees = employees;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    let result = [...this.allEmployees];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(e =>
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.phone.includes(term) ||
        e.department.toLowerCase().includes(term) ||
        e.position.toLowerCase().includes(term)
      );
    }

    if (this.departmentFilter) {
      result = result.filter(e => e.department === this.departmentFilter);
    }

    if (this.statusFilter) {
      result = result.filter(e => e.status === this.statusFilter);
    }

    if (this.fromDate) {
      result = result.filter(e => e.joinDate >= this.fromDate);
    }

    if (this.toDate) {
      result = result.filter(e => e.joinDate <= this.toDate);
    }

    this.filteredEmployees = result;
  }

  clearFilters(): void {
    this.searchTerm      = '';
    this.departmentFilter = '';
    this.statusFilter    = '';
    this.fromDate        = '';
    this.toDate          = '';
    this.applyFilters();
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.employeeService.delete(id);
    }
  }

  resetData(): void {
    if (confirm('Reset all data to default sample records?')) {
      this.employeeService.resetToDefault();
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Active':   'bg-success',
      'Inactive': 'bg-danger',
      'On Leave': 'bg-warning text-dark'
    };
    return map[status] ?? 'bg-secondary';
  }

  getDeptClass(dept: string): string {
    const map: Record<string, string> = {
      'Engineering': 'badge-engineering',
      'HR':          'badge-hr',
      'Finance':     'badge-finance',
      'Marketing':   'badge-marketing',
      'Sales':       'badge-sales',
      'Operations':  'badge-operations'
    };
    return map[dept] ?? 'bg-secondary';
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(dept: string): string {
    const colors: Record<string, string> = {
      'Engineering': '#0d6efd',
      'HR':          '#6f42c1',
      'Finance':     '#198754',
      'Marketing':   '#fd7e14',
      'Sales':       '#dc3545',
      'Operations':  '#20c997'
    };
    return colors[dept] ?? '#6c757d';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

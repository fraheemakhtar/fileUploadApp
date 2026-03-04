import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit, OnDestroy {

  allEmployees: Employee[]      = [];
  filteredEmployees: Employee[] = [];

  searchTerm       = '';
  departmentFilter = '';
  statusFilter     = '';
  genderFilter     = '';
  fromDate         = '';
  toDate           = '';

  departments = ['HR', 'Finance', 'Engineering', 'Marketing', 'Sales', 'Operations'];
  statuses    = ['Active', 'Inactive', 'On Leave'];
  genders     = ['Male', 'Female', 'Other'];

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

  /* ── Computed summary stats ── */
  get totalEmployees(): number { return this.filteredEmployees.length; }
  get activeCount(): number    { return this.filteredEmployees.filter(e => e.status === 'Active').length; }
  get inactiveCount(): number  { return this.filteredEmployees.filter(e => e.status === 'Inactive').length; }
  get onLeaveCount(): number   { return this.filteredEmployees.filter(e => e.status === 'On Leave').length; }

  get totalSalary(): number {
    return this.filteredEmployees.reduce((sum, e) => sum + +e.salary, 0);
  }
  get avgSalary(): number {
    return this.filteredEmployees.length ? this.totalSalary / this.filteredEmployees.length : 0;
  }
  get maxSalary(): number {
    return this.filteredEmployees.length
      ? Math.max(...this.filteredEmployees.map(e => +e.salary))
      : 0;
  }

  getDeptCount(dept: string): number {
    return this.filteredEmployees.filter(e => e.department === dept).length;
  }
  getDeptPct(dept: string): number {
    return this.filteredEmployees.length
      ? Math.round((this.getDeptCount(dept) / this.filteredEmployees.length) * 100)
      : 0;
  }
  getDeptBarColor(dept: string): string {
    const map: Record<string, string> = {
      'Engineering': '#0d6efd', 'HR': '#6f42c1', 'Finance': '#198754',
      'Marketing': '#fd7e14',   'Sales': '#dc3545', 'Operations': '#20c997'
    };
    return map[dept] ?? '#6c757d';
  }

  /* ── Filters ── */
  applyFilters(): void {
    let result = [...this.allEmployees];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(e =>
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.position.toLowerCase().includes(term) ||
        e.phone.includes(term)
      );
    }

    if (this.departmentFilter) result = result.filter(e => e.department === this.departmentFilter);
    if (this.statusFilter)     result = result.filter(e => e.status     === this.statusFilter);
    if (this.genderFilter)     result = result.filter(e => e.gender     === this.genderFilter);
    if (this.fromDate)         result = result.filter(e => e.joinDate   >= this.fromDate);
    if (this.toDate)           result = result.filter(e => e.joinDate   <= this.toDate);

    this.filteredEmployees = result;
  }

  clearFilters(): void {
    this.searchTerm = this.departmentFilter = this.statusFilter =
    this.genderFilter = this.fromDate = this.toDate = '';
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Active': 'bg-success', 'Inactive': 'bg-danger', 'On Leave': 'bg-warning text-dark'
    };
    return map[status] ?? 'bg-secondary';
  }

  /* ── CSV Export ── */
  exportToCSV(): void {
    const headers = [
      'ID','First Name','Last Name','Email','Phone',
      'Department','Position','Salary','Join Date','Status','Gender','Address'
    ];
    const rows = this.filteredEmployees.map(e => [
      e.id,
      `"${e.firstName}"`, `"${e.lastName}"`, `"${e.email}"`, `"${e.phone}"`,
      `"${e.department}"`, `"${e.position}"`, e.salary, e.joinDate,
      `"${e.status}"`, `"${e.gender}"`, `"${e.address}"`
    ]);

    const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `employees_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

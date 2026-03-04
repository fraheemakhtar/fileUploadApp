import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode  = false;
  employeeId?: number;
  submitted   = false;

  departments = ['HR', 'Finance', 'Engineering', 'Marketing', 'Sales', 'Operations'];
  positions   = [
    'Manager', 'Team Lead', 'Senior Developer', 'Junior Developer',
    'Analyst', 'Designer', 'HR Executive', 'Accountant'
  ];
  statuses    = ['Active', 'Inactive', 'On Leave'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.employeeId = parseInt(idParam, 10);
      const emp = this.employeeService.getById(this.employeeId);
      if (emp) {
        this.form.patchValue(emp);
      } else {
        this.router.navigate(['/employees']);
      }
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email:     ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone:     ['', [Validators.required, Validators.pattern(/^[0-9]{10,12}$/)]],
      department:['', Validators.required],
      position:  ['', Validators.required],
      salary:    [null, [Validators.required, Validators.min(1000), Validators.max(1000000)]],
      joinDate:  ['', Validators.required],
      status:    ['Active', Validators.required],
      gender:    ['', Validators.required],
      address:   ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  /** Quick accessor for template: f['fieldName'] */
  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched || this.submitted));
  }

  isValid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.valid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as Omit<Employee, 'id'>;
    if (this.isEditMode && this.employeeId !== undefined) {
      this.employeeService.update({ id: this.employeeId, ...value });
    } else {
      this.employeeService.add(value);
    }
    this.router.navigate(['/employees']);
  }

  resetForm(): void {
    this.submitted = false;
    if (this.isEditMode && this.employeeId !== undefined) {
      const emp = this.employeeService.getById(this.employeeId);
      if (emp) {
        this.form.reset();
        this.form.patchValue(emp);
      }
    } else {
      this.form.reset({ status: 'Active' });
    }
  }
}

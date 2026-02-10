import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeResponse, EmployeeCreateRequest } from '../../models/employee.model';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-employee-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './employee-management.component.html',
    styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {

    employees: EmployeeResponse[] = [];
    filteredEmployees: EmployeeResponse[] = [];

    showAddModal = false;


    newEmployee: EmployeeCreateRequest = {
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        departmentId: 1,
        designationId: 1,
        dateOfJoining: ''
    };

    totalEmployees = 0;
    activeEmployees = 0;
    exitedEmployees = 0;

    constructor(
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
    }

    loadEmployees(): void {
        this.employeeService.getAllEmployees().subscribe({
            next: (data) => {
                this.employees = [...data];
                this.filteredEmployees = [...data];
                this.updateStatistics();
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading employees:', error);
            }
        });
    }

    updateStatistics(): void {
        this.totalEmployees = this.employees.length;
        this.activeEmployees = this.employees.filter(e => e.status === 'ACTIVE').length;
        this.exitedEmployees = this.employees.filter(e => e.status === 'EXITED').length;
    }

    openAddModal(): void {
        this.showAddModal = true;
        this.resetForm();
    }

    closeAddModal(): void {
        this.showAddModal = false;
    }

    resetForm(): void {
        this.newEmployee = {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            departmentId: 1,
            designationId: 1,
            dateOfJoining: ''
        };
    }

    createEmployee(): void {
        this.employeeService.createEmployee(this.newEmployee).subscribe({
            next: () => {
                this.toastr.success('Employee created successfully', 'Success');
                this.closeAddModal();
                this.loadEmployees();
            },
            error: (error) => {
                this.toastr.error('Failed to create employee', 'Error');
            }
        });
    }

    exitEmployee(employeeId: string): void {
        if (confirm('Are you sure you want to exit this employee?')) {
            this.employeeService.exitEmployee(employeeId).pipe(
                finalize(() => {
                    this.loadEmployees();
                })
            ).subscribe({
                next: () => {
                    this.toastr.success('Employee exited successfully');
                },
                error: (error) => {
                    this.toastr.error('Failed to exit employee');
                }
            });
        }
    }

    getStatusClass(status: string): string {
        return status === 'ACTIVE' ? 'status-active' : 'status-exited';
    }
}

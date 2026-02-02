import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeResponse, EmployeeCreateRequest } from '../../models/employee.model';
import { finalize } from 'rxjs/operators';

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
    searchTerm = '';

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
        private cdr: ChangeDetectorRef
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
                this.closeAddModal();
                this.loadEmployees();
            },
            error: (error) => {
                console.error('Error creating employee:', error);
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
                    console.log('Employee exited successfully');
                },
                error: (error) => {
                    console.error('Error exiting employee:', error);
                }
            });
        }
    }

    getStatusClass(status: string): string {
        return status === 'ACTIVE' ? 'status-active' : 'status-exited';
    }
}

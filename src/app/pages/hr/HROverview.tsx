import { Users } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function HROverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Human Resources Module" 
        description="Complete HR management including employee data, attendance, payroll, and recruitment"
        icon={<Users className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Employee"
          description="Employee master data and employment details"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'employeeNumber', type: 'string', description: 'Employee number' },
            { name: 'firstName', type: 'string', description: 'First name' },
            { name: 'lastName', type: 'string', description: 'Last name' },
            { name: 'email', type: 'string', description: 'Email address' },
            { name: 'departmentId', type: 'string', description: 'Department reference' },
            { name: 'position', type: 'string', description: 'Job position' },
            { name: 'hireDate', type: 'Date', description: 'Date of hire' },
          ]}
        />

        <DataStructure
          title="Department"
          description="Organizational departments and structure"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'departmentCode', type: 'string', description: 'Department code' },
            { name: 'departmentName', type: 'string', description: 'Department name' },
            { name: 'managerId', type: 'string', description: 'Department manager' },
            { name: 'parentDepartmentId', type: 'string?', description: 'Parent department' },
          ]}
        />

        <DataStructure
          title="Attendance"
          description="Employee attendance and time tracking"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'employeeId', type: 'string', description: 'Employee reference' },
            { name: 'date', type: 'Date', description: 'Attendance date' },
            { name: 'checkIn', type: 'Date', description: 'Check-in time' },
            { name: 'checkOut', type: 'Date?', description: 'Check-out time' },
            { name: 'status', type: 'enum', description: 'Present | Absent | Late | Half Day' },
          ]}
        />

        <DataStructure
          title="Leave Request"
          description="Employee leave applications and approvals"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'employeeId', type: 'string', description: 'Employee reference' },
            { name: 'leaveType', type: 'enum', description: 'Annual | Sick | Unpaid | Other' },
            { name: 'startDate', type: 'Date', description: 'Leave start date' },
            { name: 'endDate', type: 'Date', description: 'Leave end date' },
            { name: 'status', type: 'enum', description: 'Pending | Approved | Rejected' },
          ]}
        />

        <DataStructure
          title="Payroll"
          description="Employee payroll processing and payments"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'employeeId', type: 'string', description: 'Employee reference' },
            { name: 'payPeriod', type: 'string', description: 'Pay period' },
            { name: 'basicSalary', type: 'number', description: 'Basic salary' },
            { name: 'allowances', type: 'number', description: 'Total allowances' },
            { name: 'deductions', type: 'number', description: 'Total deductions' },
            { name: 'netPay', type: 'number', description: 'Net payment' },
          ]}
        />
      </div>
    </div>
  );
}

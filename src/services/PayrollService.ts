import { PayrollRepository } from '../repositories/PayrollRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

export class PayrollService {
    private payrollRepository: PayrollRepository;
    private employeeRepository: EmployeeRepository;

    constructor() {
        this.payrollRepository = new PayrollRepository();
        this.employeeRepository = new EmployeeRepository();
    }

    async getAllPayrolls() {
        return await this.payrollRepository.findAll();
    }

    // Educational: Demonstrate Promise.all for concurrency
    async generatePayrollForBatch(employeeIds: number[]) {
        const results = await Promise.all(employeeIds.map(async (id) => {
            const employee = await this.employeeRepository.findById(id);
            if (!employee) return null;

            return await this.payrollRepository.create({
                employeeId: id,
                amount: employee.salary,
                status: 'pending'
            });
        }));

        return results.filter(p => p !== null);
    }
}

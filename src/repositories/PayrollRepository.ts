import Payroll from '../models/Payroll';

export class PayrollRepository {
    async findAll() {
        return await Payroll.findAll();
    }

    async create(payroll: any) {
        return await Payroll.create(payroll);
    }

    async findByEmployeeId(employeeId: number) {
        return await Payroll.findAll({ where: { employeeId } });
    }
}

import Employee from '../models/Employee';

export class EmployeeRepository {
    async findAll() {
        return await Employee.findAll();
    }

    async findById(id: number) {
        return await Employee.findByPk(id);
    }

    async create(employee: any) {
        return await Employee.create(employee);
    }

    async update(id: number, data: any) {
        const employee = await this.findById(id);
        if (employee) {
            return await employee.update(data);
        }
        return null;
    }
}

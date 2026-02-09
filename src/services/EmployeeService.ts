import { EmployeeRepository } from '../repositories/EmployeeRepository';

export class EmployeeService {
    private employeeRepository: EmployeeRepository;

    constructor() {
        this.employeeRepository = new EmployeeRepository();
    }

    async getAllEmployees() {
        return await this.employeeRepository.findAll();
    }

    async createEmployee(data: any) {
        return await this.employeeRepository.create(data);
    }
}

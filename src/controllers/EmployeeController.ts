import { Request, Response } from 'express';
import { EmployeeService } from '../services/EmployeeService';

const employeeService = new EmployeeService();

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (data.salary) {
            data.salary = parseFloat(data.salary);
        }
        if (req.file) {
            data.photoUrl = `/uploads/${req.file.filename}`;
        }
        const employee = await employeeService.createEmployee(data);
        res.json(employee);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

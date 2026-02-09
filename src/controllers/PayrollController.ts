import { Request, Response } from 'express';
import { PayrollService } from '../services/PayrollService';

const payrollService = new PayrollService();

export const getPayrolls = async (req: Request, res: Response) => {
    try {
        const payrolls = await payrollService.getAllPayrolls();
        res.json(payrolls);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const generatePayroll = async (req: Request, res: Response) => {
    try {
        const { employeeIds } = req.body; // Expect array of IDs
        const payrolls = await payrollService.generatePayrollForBatch(employeeIds);
        res.json(payrolls);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

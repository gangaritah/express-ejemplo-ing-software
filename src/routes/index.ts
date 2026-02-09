import { Router } from 'express';
import { login } from '../controllers/AuthController';
import { getEmployees, createEmployee } from '../controllers/EmployeeController';
import { getPayrolls, generatePayroll } from '../controllers/PayrollController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

router.post('/login', login);

router.get('/employees', authMiddleware, getEmployees);
router.post('/employees', authMiddleware, upload.single('photo'), createEmployee);

router.get('/payrolls', authMiddleware, getPayrolls);
router.post('/payrolls/generate', authMiddleware, generatePayroll);

export default router;

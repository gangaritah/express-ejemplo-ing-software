import sequelize from './config/database';
import User from './models/User';
import Employee from './models/Employee';
import Payroll from './models/Payroll';

const syncDatabase = async () => {
    try {
        // Force models to be loaded (prevents tree-shaking)
        console.log('📦 Loading models:', User.name, Employee.name, Payroll.name);

        await sequelize.authenticate();
        console.log('✅ Database connected!');
        // Force sync for educational/dev purposes to reset DB easily. 
        // In production, use migrations!
        await sequelize.sync({ force: true });
        console.log('✅ Database synced!');

        // Seed admin user
        await User.create({
            username: 'admin',
            password: 'password123', // In real app, hash this!
            role: 'admin'
        });
        console.log('Admin user created');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

syncDatabase();

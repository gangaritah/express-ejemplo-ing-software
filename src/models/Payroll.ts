import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Employee from './Employee';

class Payroll extends Model {
    public id!: number;
    public employeeId!: number;
    public date!: Date;
    public amount!: number;
    public status!: string; // 'pending' | 'paid'
}

Payroll.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        employeeId: {
            type: DataTypes.INTEGER,
            references: {
                model: Employee,
                key: 'id',
            },
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid'),
            defaultValue: 'pending',
        },
    },
    {
        sequelize,
        tableName: 'payrolls',
    }
);

// Define associations clearly here for educational purposes
Employee.hasMany(Payroll, { foreignKey: 'employeeId' });
Payroll.belongsTo(Employee, { foreignKey: 'employeeId' });

export default Payroll;

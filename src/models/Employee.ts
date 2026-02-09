import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Employee extends Model {
    public id!: number;
    public name!: string;
    public salary!: number;
    public photoUrl!: string;
}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salary: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        photoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'employees',
    }
);

export default Employee;

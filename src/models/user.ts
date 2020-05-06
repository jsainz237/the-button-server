import { Model, Table, PrimaryKey, Unique, AllowNull, Column, DataType } from "sequelize-typescript";
import { Rank } from "../types/ranks";

export interface UserAttr {
    id: string;
    ci_username: string;
    username: string;
    password: string;
    rank?: Rank;
}

@Table({ timestamps: false, tableName: 'users' })
export default class User extends Model<User> implements UserAttr {
    
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Unique
    @Column
    ci_username!: string;

    @AllowNull(false)
    @Column
    username!: string;

    @AllowNull(false)
    @Column
    password!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    rank!: Rank;
}
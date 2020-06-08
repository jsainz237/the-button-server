import { Model, Table, PrimaryKey, Unique, AllowNull, Column, DataType, Default } from "sequelize-typescript";
import { Rank } from "../types/ranks";

export interface UserAttr {
    id: string;
    email: string;
    displayname: string;
    ci_displayname: string;
    rank: Rank;
}

@Table({ timestamps: false, tableName: 'users' })
export default class User extends Model<User> implements UserAttr {
    
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Column
    email!: string;

    @AllowNull(false)
    @Column
    displayname!: string;

    @AllowNull(false)
    @Unique
    @Column
    ci_displayname!: string;

    @AllowNull(false)
    @Default(Rank.GRAY)
    @Column(DataType.STRING)
    rank!: Rank;
}
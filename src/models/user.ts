import { Model, Table, PrimaryKey, Unique, AllowNull, Column, DataType } from "sequelize-typescript";

export interface UserAttr {
    id: string;
    username: string;
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
    username!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    rank!: Rank;
}

enum Rank {
    GRAY = "GRAY",
    PURPLE = "PURPLE",
    BLUE = "BLUE",
    GREEN = "GREEN",
    YELLOW = "YELLOW",
    ORANGE = "ORANGE",
    RED = "RED"
}
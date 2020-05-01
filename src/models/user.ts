import { Model } from "sequelize/types";
import { Table, PrimaryKey, Unique, AllowNull, Column, DataType } from "sequelize-typescript";

export interface UserAttr {
    id: string;
    username: string;
    rank: Rank;
}

@Table({ timestamps: false, tableName: 'users' })
export class User extends Model<User> implements UserAttr {
    
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @Column(DataType.UUIDV4)
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
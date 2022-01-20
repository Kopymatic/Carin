import { DataTypes, Model } from "sequelize";
import global from "./global";

export function setUpModels() {
    const database = global.database;

    //Initialize all the database models
    MoodLog.init(
        {
            userID: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            rating: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            summary: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        { sequelize: database }
    );

    CommandStats.init(
        {
            commandName: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true,
            },
            allTimeUses: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            recentUses: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
        },
        { sequelize: database }
    );

    Reminder.init(
        {
            userID: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        { sequelize: database }
    );

    //Sync all the database models
    MoodLog.sync().then(
        () => console.log("MoodLog model success!"),
        (err) => console.error("MoodLog model error!", err)
    );

    CommandStats.sync().then(
        () => console.log("CommandStats model success!"),
        (err) => console.error("CommandStats model error!", err)
    );

    Reminder.sync().then(
        () => console.log("Reminder model success!"),
        (err) => console.error("Reminder model error!", err)
    );
}

export class MoodLog extends Model {
    // Specifying data types on the class itself so the compiler doesnt complain
    public id: number;
    public userID: string;
    public rating: number;
    public summary: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class CommandStats extends Model {
    // Specifying data types on the class itself so the compiler doesnt complain
    public commandName: string;
    public allTimeUses: number;
    public recentUses: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export class Reminder extends Model {
    // Specifying data types on the class itself so the compiler doesnt complain
    public id: number;
    public userID: string;
    public time: Date;
    public text: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

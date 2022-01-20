import Eris from "eris";
import { CommandOptionTypes, ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { Reminder } from "../models";

export default class ReminderCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Remind";
        this.description = "Reminds you at the time you choose.";
        let min: any = 1;
        let max: any = 10080;
        this.options = [
            {
                name: "time",
                description: "The time (in minutes) until the reminder goes off.",
                type: CommandOptionTypes.NUMBER,
                required: true,
                min_value: min,
                max_value: max,
            },
            {
                name: "text",
                description: "The text to be sent with the reminder",
                type: CommandOptionTypes.STRING,
                required: true,
            },
        ];
        this.onRun = async (interaction) => {
            let options: any = interaction.data.options;
            let user: Eris.Member | Eris.User;
            if (interaction.member == undefined || interaction.member == null) {
                user = interaction.user;
            } else {
                user = interaction.member;
            }

            let text = options[1].value;
            let time = options[0].value * 60000;
            let timeToGoOff = new Date(Date.now() + time);

            let newOne = await Reminder.create({
                userID: user.id,
                time: timeToGoOff,
                text: text,
            });

            setTimeout(() => {
                ReminderCmd.remind(newOne);
            }, time);

            interaction.createMessage({
                content: `Got it! I'll remind you to **${text}** in **${time / 60000}** minutes.`,
                flags: ResponseFlags.EPHEMERAL,
            });
        };
    }

    public static async remind(databaseEntry: Reminder) {
        let channel = await global.bot.getDMChannel(databaseEntry.userID);
        global.bot.createMessage(channel.id, {
            content: `I'm here to remind you to **${databaseEntry.text}**. Have a great day!`, //Randomize this eventually.
        });
        databaseEntry.destroy();
    }
}

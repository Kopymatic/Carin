import Eris from "eris";
import { CommandOptionTypes, ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { Reminder } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";

export default class ReminderCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Quote";
        this.description = "Sends a random quote";
        let min: any = 1;
        let max: any = 10080;
        this.options = [
            // {
            //     name: "time",
            //     description: "The time (in minutes) until the reminder goes off.",
            //     type: CommandOptionTypes.NUMBER,
            //     required: true,
            //     min_value: min,
            //     max_value: max,
            // },
            // {
            //     name: "text",
            //     description: "The text to be sent with the reminder",
            //     type: CommandOptionTypes.STRING,
            //     required: true,
            // },
        ];
        this.onRun = async (interaction) => {
            let options = InteractionUtils.getOptions(interaction);
            let user = InteractionUtils.getUser(interaction);

            const api_url = "https://zenquotes.io/api/quotes/";

            this.getapi(api_url);
        };
    }

    async getapi(url: string) {
        const response = await fetch(url);
        var data = await response.json();
        console.log(data);
    }

    public static async remind(databaseEntry: Reminder) {
        let channel = await global.bot.getDMChannel(databaseEntry.userID);
        global.bot.createMessage(channel.id, {
            content: `I'm here to remind you to **${databaseEntry.text}**. Have a great day!`, //Randomize this eventually.
        });
        databaseEntry.destroy();
    }
}

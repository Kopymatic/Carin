import Eris from "eris";
import { CommandOptionTypes, ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { Reminder } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import axios from "axios";
import { randomInt } from "crypto";

export default class ReminderCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Quote";
        this.description = "Sends a random quote";
        let min: any = 1;
        let max: any = 10080;
        this.options = [];
        this.onRun = async (interaction) => {
            let options = InteractionUtils.getOptions(interaction);
            let user = InteractionUtils.getUser(interaction);

            let quote: any = global.quotes[randomInt(global.quotes.length)];

            interaction.createMessage({
                embeds: [
                    {
                        description: `${quote.q}\n-${quote.a}`,
                        footer: {
                            text: "Quotes provided by https://zenquotes.io/",
                        },
                        color: global.defaultColor,
                    },
                ],
            });
        };
    }

    public static async getapi(url: string): Promise<[]> {
        const response = await axios.get(url);
        var data: [] = await response.data;
        return data;
    }
}

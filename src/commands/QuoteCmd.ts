import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import InteractionUtils from "../utils/InteratctionUtils";
import axios from "axios";
import { randomInt } from "crypto";

export default class QuoteCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Quote";
        this.description = "Sends a random quote";
        this.options = [];
        this.onRun = async (interaction) => {
            await interaction.acknowledge();
            let options = InteractionUtils.getOptions(interaction);
            let user = InteractionUtils.getUser(interaction);

            let quote: any = global.quotes[randomInt(global.quotes.length)];

            interaction.createFollowup({
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

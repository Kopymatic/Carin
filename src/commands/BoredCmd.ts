import { CommandOptionTypes } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import InteractionUtils from "../utils/InteratctionUtils";
import axios from "axios";

export default class BoredCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Bored";
        this.description = "Sends a random thing to do";
        this.options = [
            {
                name: "type",
                description: "Type of the activity",
                type: CommandOptionTypes.STRING,
                required: false,
                choices: [
                    {
                        name: "education",
                        value: "education",
                    },
                    {
                        name: "recreational",
                        value: "recreational",
                    },
                    {
                        name: "social",
                        value: "social",
                    },
                    {
                        name: "diy",
                        value: "diy",
                    },
                    {
                        name: "charity",
                        value: "charity",
                    },
                    {
                        name: "music",
                        value: "music",
                    },
                    {
                        name: "busywork",
                        value: "busywork",
                    },
                ],
            },
        ];
        this.onRun = async (interaction) => {
            let options = InteractionUtils.getOptions(interaction);
            let user = InteractionUtils.getUser(interaction);

            let url = "";
            if (options === null || options === undefined) {
                url = "https://www.boredapi.com/api/activity/";
            } else {
                url = `https://www.boredapi.com/api/activity?type=${options[0].value}`;
            }

            let response: any = await BoredCmd.getapi(url);

            interaction.createMessage({
                embeds: [
                    {
                        title: response.activity,
                        description: `Type: ${response.type}`,
                        footer: {
                            text: "Activities provided by https://www.boredapi.com/",
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

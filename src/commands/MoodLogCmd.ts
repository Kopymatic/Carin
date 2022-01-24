import { MoodLog } from "../models";
import { CommandOptionTypes, ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";

export default class MoodLogCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "MoodLog";
        this.description =
            "Log your mood. The bot will remember it so you can look back on how you've been doing.";

        let max: any = 10;
        let min: any = -10; //Weird bullshittery why do i have to do this
        this.options = [
            {
                name: "rating",
                description: "On a scale of 1-10, how have you been since your last log?",
                type: CommandOptionTypes.NUMBER,
                required: true,
                max_value: max,
                min_value: min,
            },
            {
                name: "summary",
                description: "A summary of why you rated your mood as such",
                type: CommandOptionTypes.STRING,
                required: false,
            },
        ];
        this.onRun = async (interaction) => {
            let options: any = interaction.data.options;
            let user;
            if (interaction.member == undefined || interaction.member == null) {
                user = interaction.user;
            } else {
                user = interaction.member;
            }

            let summary: string;
            if (options[1] == undefined) {
                summary = null;
            } else {
                summary = options[1].value;
            }
            let newOne = await MoodLog.create({
                userID: user.id,
                rating: options[0].value,
                summary: summary,
            });

            interaction.createMessage({
                embeds: [
                    {
                        title: "New mood log created",
                        description: `Rating: ${newOne.rating} \nSummary: ${
                            newOne.summary
                        } \nCreated at ${newOne.createdAt.toUTCString()}`,
                        color: global.defaultColor,
                    },
                ],
                flags: ResponseFlags.EPHEMERAL,
            });
        };
    }
}

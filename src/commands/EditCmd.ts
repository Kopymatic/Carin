import { MoodLog } from "../models";
import { CommandOptionTypes, ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";

export default class EditCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "EditLog";
        this.description = "Edit an old mood log.";

        let max: any = 10;
        let min: any = 1; //Weird bullshittery why do i have to do this
        this.options = [
            {
                name: "id",
                description: "The id of the log. Found in /viewLog.",
                type: CommandOptionTypes.NUMBER,
                required: true,
            },
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

            let found = await MoodLog.findOne({ where: { id: options[0].value } });
            if (found == null || found == undefined) {
                interaction.createMessage({
                    content:
                        "That id wasn't found! Make sure to use the ID provided under /viewlog.",
                    flags: ResponseFlags.EPHEMERAL,
                });
                return;
            } else {
                if (found.userID != user.id) {
                    interaction.createMessage({
                        content:
                            "That's someone else's log! Make sure to use the ID provided under /viewlog.",
                        flags: ResponseFlags.EPHEMERAL,
                    });
                    return;
                } else {
                    let summary: string;
                    if (options[2] == undefined) {
                        summary = null;
                    } else {
                        summary = options[2].value;
                    }

                    found.rating = options[1].value;
                    found.summary = summary;
                    found.save();

                    interaction.createMessage({
                        embeds: [
                            {
                                title: "Mood log edited",
                                description: `ID: ${found.id}\nRating: ${found.rating} \nSummary: ${
                                    found.summary
                                } \nCreated at ${found.createdAt.toUTCString()}`,
                                color: global.defaultColor,
                            },
                        ],
                        flags: ResponseFlags.EPHEMERAL,
                    });
                }
            }
        };
    }
}

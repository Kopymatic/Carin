import { MoodLog } from "../models";
import { CommandOptionTypes, ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "./SlashCommand";

export default class DeleteLogCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "DeleteLog";
        this.description = "Delete an old mood log.";
        this.options = [
            {
                name: "id",
                description: "The id of the log. Found in /viewLog.",
                type: CommandOptionTypes.NUMBER,
                required: true,
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
                    found.destroy();
                    interaction.createMessage({
                        content: "Successfully deleted id " + options[0].value,
                        flags: ResponseFlags.EPHEMERAL,
                    });
                }
            }
        };
    }
}

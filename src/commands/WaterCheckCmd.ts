import Eris from "eris";
import { CommandOptionTypes, ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";

export default class WaterCheckCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "WaterCheck";
        this.description = "Reminds you to drink water in 30 minutes (Or at the time you choose).";
        let min: any = 1;
        let max: any = 10080;
        this.options = [
            {
                name: "time",
                description:
                    "The time (in minutes) until the reminder goes off (Will not persist across bot restarts)",
                type: CommandOptionTypes.NUMBER,
                required: false,
                min_value: min,
                max_value: max,
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

            let time = 0;
            if (options == null || options == undefined) {
                time = 1800000;
            } else {
                time = options[0].value * 60000;
            }

            setTimeout(() => {
                this.check(user);
            }, time); //30 minutes

            interaction.createMessage({
                content: `Got it! I'll remind you to drink water in ${time / 60000} minutes.`,
                flags: ResponseFlags.EPHEMERAL,
            });
        };
    }

    async check(user: Eris.User | Eris.Member) {
        let channel = await global.bot.getDMChannel(user.id);
        global.bot.createMessage(channel.id, {
            content: "I'm here to remind you to drink a nice glass of water! Stay hydrated!", //Randomize this eventually.
        });
    }
}

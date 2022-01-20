import Eris from "eris";
import { MoodLog } from "../models";
import { ResponseFlags } from "../utils/CommandUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";
import { EphemerealButtonPaginator } from "../utils/EphemeralButtonPaginator";

export default class ViewLogCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "ViewLog";
        this.description = "View your previous mood logs.";

        this.onRun = async (interaction) => {
            let user;
            if (interaction.member == undefined || interaction.member == null) {
                user = interaction.user;
            } else {
                user = interaction.member;
            }

            await interaction.createMessage({
                embeds: [
                    {
                        title: "Loading...",
                    },
                ],
                flags: ResponseFlags.EPHEMERAL,
            });

            let all = await MoodLog.findAll({
                where: {
                    userID: user.id,
                },
                order: [["createdAt", "ASC"]],
            });

            let average: number = 0;
            all.forEach((index) => {
                average += index.rating;
            });
            average = average / all.length;

            let embeds: Eris.Embed[] = [
                {
                    title: "Your mood log summary",
                    description: `Average rating: ${average.toPrecision(4)}`,
                    color: global.defaultColor,
                    type: "rich",
                },
            ];

            all.forEach((index) => embeds.push(this.makeEmbed(index)));

            new EphemerealButtonPaginator(
                global.bot,
                interaction,
                await interaction.getOriginalMessage(),
                {
                    startingPage: 0,
                    allowedUsers: [user.id],
                    maxTime: 30000,
                    pages: embeds,
                }
            );
        };
    }

    makeEmbed(moodLog: MoodLog): Eris.Embed {
        return {
            title: `Mood log from ${moodLog.createdAt.toUTCString()}`,
            description: `Rating: ${moodLog.rating} \nSummary: ${moodLog.summary}\nID: ${moodLog.id}`,
            color: global.defaultColor,
            type: "rich",
        };
    }
}

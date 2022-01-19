import { CommandOptionTypes } from "../utils/CommandUtils";
import SlashCommand from "./SlashCommand";
import global from "../global";

export default class OneVOne extends SlashCommand {
    constructor() {
        super();
        this.toDelete = true;
        this.name = "OneVOne";
        this.description = "Pit two things against eachother!";
        this.options = [
            {
                name: "first",
                description: "First thing in the fight",
                type: CommandOptionTypes.STRING,
                required: true,
            },
            {
                name: "second",
                description: "Second thing in the fight",
                type: CommandOptionTypes.STRING,
                required: false,
            },
        ];
        this.onRun = (interaction) => {
            let options: any = interaction.data.options;

            const title = "Ouchie"; //lists.OneVOne.titles[randomInt(lists.OneVOne.titles.length)];
            const action = "kicked"; //lists.OneVOne.actions[randomInt(lists.OneVOne.actions.length)];
            const descriptor = "in the balls"; //lists.OneVOne.descriptors[randomInt(lists.OneVOne.descriptors.length)];

            let first; //vars to store the first and second name
            let second;
            if (options[1] == null) {
                first = interaction.member.mention;
                second = options[0].value;
            } else {
                first = options[0].value;
                second = options[1].value;
            }

            //Scramble the options so that its random
            if (Math.random() < 0.5) {
                const temp = first;
                first = second;
                second = temp;
            }

            //Create and send the embed
            interaction.createMessage({
                embeds: [
                    {
                        title: title, // Set the title to our title variable
                        description: `${first} **${action}** ${second} **${descriptor}**`, //Use FancyString(TM) to quickly format the desc
                        color: global.defaultColor, // Color, either in hex (show), or a base-10 integer
                    },
                ],
            });
        };
    }
}

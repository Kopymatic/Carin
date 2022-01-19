/* eslint-disable @typescript-eslint/no-unused-vars */
import Eris from "eris";

export default class SlashCommand {
    name: string;
    description: string;
    defaultPermission: boolean = true;
    options: Eris.ApplicationCommandOptions[];
    onRun: (interaction: Eris.CommandInteraction) => void;
    toDelete: boolean = false;
}

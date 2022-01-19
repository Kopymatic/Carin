import SlashCommand from "./SlashCommand";
import Ping from "./PingCmd";
import MoodLogCmd from "./MoodLogCmd";
import ViewLogCmd from "./ViewLogCmd";
import StatsCmd from "./StatsCmd";
import DeleteLogCmd from "./deleteLogCmd";
import EditCmd from "./EditCmd";

const commands: SlashCommand[] = [
    new Ping(),
    new MoodLogCmd(),
    new ViewLogCmd(),
    new StatsCmd(),
    new DeleteLogCmd(),
    new EditCmd(),
];

export default commands;

import SlashCommand from "../utils/SlashCommand";
import Ping from "./PingCmd";
import MoodLogCmd from "./MoodLogCmd";
import ViewLogCmd from "./ViewLogCmd";
import StatsCmd from "./StatsCmd";
import DeleteLogCmd from "./deleteLogCmd";
import EditCmd from "./EditCmd";
import WaterCheckCmd from "./WaterCheckCmd";
import ReminderCmd from "./ReminderCmd";
import QuoteCmd from "./QuoteCmd";

const commands: SlashCommand[] = [
    new Ping(),
    new MoodLogCmd(),
    new ViewLogCmd(),
    new StatsCmd(),
    new DeleteLogCmd(),
    new EditCmd(),
    new WaterCheckCmd(),
    new ReminderCmd(),
    new QuoteCmd(),
];

export default commands;

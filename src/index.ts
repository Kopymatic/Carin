import Eris, { CommandInteraction } from "eris";
import global from "./global";
import commands from "./commands";
import * as pg from "pg";
import { Op, Sequelize } from "sequelize";
import { CommandTypes } from "./utils/CommandUtils";
import { CommandStats, setUpModels } from "./models";

console.log("Loading...");
console.log(
    `Configuration:
       experimental: ${global.experimental}
       version: ${global.version}
       name: ${global.name}`
);

global.database = new Sequelize(
    `postgres://${global.databaseUsername}:${global.databasePassword}@localhost:5432/Carin`,
    {
        logging: false,
        dialectModule: pg,
    }
);
global.database.authenticate();
console.log("Database connection successful!");
setUpModels();

const bot = new Eris.Client(global.token, {
    intents: ["guildEmojis"],
    allowedMentions: { everyone: false }, //No pingy everyone
    maxShards: "auto",
    restMode: true,
});

global.bot = bot;
let firstReady = true;
bot.on("ready", async () => {
    //When bot is ready, log ready
    console.log("Ready!");
    if (firstReady) {
        let all = await CommandStats.findAll();
        all.forEach((index) => {
            //Clear recent uses
            index.recentUses = 0;
            index.save();
        });

        if (global.experimental) {
            commands.forEach(async (index) => {
                //make new commands or replace old ones
                let newCommand = await bot.createGuildCommand(global.devServerId, {
                    name: index.name,
                    description: index.description,
                    defaultPermission: index.defaultPermission,
                    options: index.options,
                    type: CommandTypes.SLASH,
                });
                console.log(
                    `Guild command ${index.name} created with id ${newCommand.id} in guild ${newCommand.guild_id}`
                );

                if (index.toDelete) {
                    bot.deleteGuildCommand(newCommand.guild_id, newCommand.id);
                    console.log(`Command ${index.name} deleted`);
                }
            });
        } else {
            commands.forEach(async (index) => {
                //make new commands or replace old ones
                let newCommand = await bot.createCommand({
                    name: index.name,
                    description: index.description,
                    defaultPermission: index.defaultPermission,
                    options: index.options,
                    type: CommandTypes.SLASH,
                });
                console.log(`Global command ${index.name} created with id ${newCommand.id}`);
                if (index.toDelete) {
                    bot.deleteCommand(newCommand.id);
                    console.log(`Command ${index.name} deleted`);
                }
            });
        }

        global.absoluteStartTime = Date.now();
        bot.createMessage("826674337591197708", {
            embeds: [
                {
                    title: `${global.name} Version ${global.version} is now online!`,
                    color: global.green,
                },
            ],
        });
        firstReady = false;
    }
});

bot.on("shardReady", (id) => {
    bot.shards.get(id).editStatus("online", {
        name: `Version ${global.version} | Shard ${id}`,
        type: 3,
    });
});

bot.on("error", (err) => {
    //If the bot encounters an error, log it
    console.error(err);
    bot.createMessage("826674337591197708", {
        embeds: [
            {
                title: `${global.name} encountered an error!`,
                description: `\`\`\`${err.name}\n${err.message}\n${err.stack}\`\`\``,
                color: global.red,
            },
        ],
    });
});

bot.on("interactionCreate", (interaction) => {
    if (interaction instanceof Eris.CommandInteraction) {
        commands.forEach(async (command) => {
            if (command.name.toLowerCase() == interaction.data.name) {
                command.onRun(interaction);

                let commandStats = await CommandStats.findOrCreate({
                    where: {
                        commandName: command.name,
                    },
                });
                commandStats[0].allTimeUses++;
                commandStats[0].recentUses++;
                commandStats[0].save();
            }
        });
    }
});

bot.editStatus("idle", { name: `Loading...`, type: 3 });

bot.connect();

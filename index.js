const { Client, IntentsBitField, Partials, EmbedBuilder, ComponentBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
require("dotenv/config");
const { v4: uuidv4 } = require('uuid');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ],
    partials: [Partials.Channel],
});

const owner = "874730179468079159";
const logs = "1106794693255245865";

function sendLog(msg) {
    client.channels.cache.get(logs).send(msg);
}

client.on("ready", () => {
    console.log("Bot is now online.");
});

client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "code") {
            var codeEmbed = new EmbedBuilder().setTitle("⚠️ Generate Code").setDescription("You are about to generate a code for verification purposes. Do not share this code with anyone, or it could result in you being punished due to other member's actions. Once you press the button below, the code will be sent in raw text to make it easier to copy.").setColor("ff73fa");
            interaction.reply({
                embeds: [codeEmbed], components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 1,
                                label: "I Agree | Generate Code",
                                custom_id: "generateCode"
                            }
                        ]
                    }
                ], ephemeral: true,
            });
        }
    }
    if (interaction.isButton()) {
        if (interaction.customId === "generateCode") {
            const generatedCode = uuidv4();
            client.channels.cache.get(process.env.CODE_LOGS_ID).send(`${generatedCode} | <@${interaction.user.id}> (${interaction.user.username}) (${interaction.user.id})`);
            interaction.reply({ content: generatedCode, ephemeral: true, });
        }
    }
});

client.on("messageCreate", async (msg) => {
    if (msg.content === "!run" && msg.author.id === owner) {
        msg.delete();
        const guild = msg.guild;
        const role = guild.roles.cache.get("1106794272671416370");
        let res = await guild.members.fetch();
        res.forEach((member) => {
            if (member.user.bot) return false;
            var guildMember = guild.members.cache.get(member.user.id);
            var ends = ["4", "5", "6", "7", "8"];
            // 5/12/23 5,6,7,8
            // 5/13/23 added 4
            for (let i = 0; i < ends.length; i++) {
                if (member.user.id.endsWith(ends[i])) {
                    if (guildMember.roles.cache.has(role.id)) return false;
                    guildMember.roles.add(role);
                    sendLog(`Nicknames perms beta feature - added perms to <@${member.user.id}> (${member.user.id})`);
                }
            }
        });
    }
});

client.login(process.env.TOKEN);
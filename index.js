// HELLO WORLD!
const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
} = require("discord.js");
const express = require("express");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Commands
const commands = [
    new SlashCommandBuilder()
        .setName("r4id")
        .setDescription("Start a r4id.")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("how many messages to spam?")
                .setRequired(true),
        ),

    new SlashCommandBuilder()
        .setName("customr4id")
        .setDescription("Start a custom r4id, with custom text.")
        .addStringOption((option) =>
            option
                .setName("text")
                .setDescription("The custom text.")
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("How many messages to spam?")
                .setRequired(true),
        ),

    new SlashCommandBuilder()
        .setName("dmfl00d")
        .setDescription("Flood someone's DMs")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Who's DMs to flood?")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("text")
                .setDescription("What to flood with")
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("How many messages to send?")
                .setRequired(true),
        ),

    new SlashCommandBuilder()
        .setName("gping")
        .setDescription("Ghost ping someone")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("User to ghost ping")
                .setRequired(true),
        ),

    new SlashCommandBuilder().setName("hailarko").setDescription("HAIL ARKO"),

    new SlashCommandBuilder()
        .setName("kill")
        .setDescription("(FOR AUTHORIZED ONLY) Shut down the bot"),
].map((c) => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("Slash commands registered.");
})();

// are you READY?
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// command responses
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // normal raid
    if (interaction.commandName === "r4id") {
        const amount = interaction.options.getInteger("amount");

        if (
            interaction.guild?.id === "1456814648111141007" &&
            interaction.channel.id !== "1456826341688082605"
        ) {
            return interaction.reply({ content: "Really?", ephemeral: true });
        }

        if (amount <= 0) {
            return interaction.reply({
                content: "Invalid number.",
                ephemeral: true,
            });
        }

        const msgs = [
            "Get Rasraided!",
            "Rasraided.",
            "Don't forget to hail arko. Also get rasraided.",
        ];

        await interaction.reply({
            content: `starting`,
            ephemeral: true,
        });

        for (let i = 0; i < amount; i++) {
            await interaction.channel.send(
                msgs[Math.floor(Math.random() * msgs.length)],
            );
        }
    }

    // custom raid
    if (interaction.commandName === "customr4id") {
        const text = interaction.options.getString("text");
        const amount = interaction.options.getInteger("amount");

        if (amount <= 0) {
            return interaction.reply({
                content: "Invalid number.",
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: "Starting custom r4id...",
            ephemeral: true,
        });

        for (let i = 0; i < amount; i++) {
            await interaction.channel.send(text);
        }
    }

    // dm flooder
    if (interaction.commandName === "dmfl00d") {
        const target = interaction.options.getUser("target");
        const text = interaction.options.getString("text");
        const amount = interaction.options.getInteger("amount");

        await interaction.deferReply({ ephemeral: true });

        try {
            const dm = await target.createDM();

            for (let i = 0; i < amount; i++) {
                await dm.send(text);
            }

            await interaction.editReply(
                `Sent ${amount} DM(s) to ${target.tag}`,
            );
        } catch {
            await interaction.editReply("Could not DM that user.");
        }
    }

    // ghost ping
    if (interaction.commandName === "gping") {
        const target = interaction.options.getUser("target");

        await interaction.deferReply({ ephemeral: true });
        const msg = await interaction.channel.send(`${target}`);
        await msg.delete();
        await interaction.editReply("Ghost pinged.");
    }

    // HAIL ARKO !
    if (interaction.commandName === "hailarko") {
        await interaction.reply(
            "https://tenor.com/view/resist-vox-vox-hazbin-hotel-hazbin-hotel-season-2-hazbin-hotel-gif-7310967986653570928\n# HAIL ARKO!",
        );
    }

    // kill
    if (interaction.commandName === "kill") {
        if (interaction.user.id !== "1408543769527058474") {
            return interaction.reply({ content: "No.", ephemeral: true });
        }

        await interaction.reply({ content: "Shutting down.", ephemeral: true });
        client.destroy();
        server.close(() => process.exit(0));
    }
});

// 24/7 server
const app = express();
app.get("/", (_, res) => res.send("Bot alive"));
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log("Web server running"));

client.login(TOKEN);

const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription(`Viewstats!`)
        .addSubcommand(subcommand =>
			subcommand
			.setName("server")
			.setDescription("View server stats"))
        .addSubcommand(subcommand =>
            subcommand
            .setName("user")
            .setDescription("View a user's stats")
            .addUserOption(option => option.setName('user').setDescription('the chosen one').setRequired(false))),
    async execute(interaction) {
        const db = interaction.client.db.Counters;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "server") {
            
            var tot = 0

            list = await db.findAll({
                attributes: ['numbers']
            })

            for(var i=0; i < list.length; i++){
                tot = tot + list[i].numbers
            }

            const embed = new MessageEmbed()
                .setTitle(`Server Stats`)
                .setColor("#0099ff")
                .setDescription(`everyone in the server has counted a total of **${tot}** numbers ~~wow what losers~~`)
                .setTimestamp()

		    return interaction.reply({embeds: [embed]});

        } else if (subcommand === "user") {
            const usr = interaction.options.getUser("user") || interaction.member.user;

            const tag = await db.findOne({ where: { userID: usr.id } });
              
            if (tag) {
                const correct = tag.get("numbers")
                const incorrect = tag.get("wrongNumbers")
                const accuracy = (correct / (correct + incorrect) * 100).toFixed(3)
                const embed = new MessageEmbed()
                    .setTitle(`User Stats`)
                    .setColor("#0099ff")
                    //.setDescription(`<@${usr.id}> has counted **${correct}** numbers with **${incorrect}** wrong numbers (${accuracy}% accuracy)`)
                    .setDescription(`Stats for <@${usr.id}>\n\nCorrect numbers: **${correct}**\nWrong numbers: **${incorrect}**\nAccuracy: **${accuracy}%**\nSaves: /5`)
                    .setTimestamp()
                return interaction.reply({embeds: [embed]});
            } else {
                const embed = new MessageEmbed()
                    .setTitle(`User Stats`)
                    .setColor("#0099ff")
                    .setDescription(`Stats for <@${usr.id}>\n\n**No stats found**`)
                    .setTimestamp()
                return interaction.reply({embeds: [embed]});
            }
        }
    },
};
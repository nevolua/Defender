const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { send_log } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true)),
    
    async execute(interaction) {
        const { admins } = require('../../config.json');
        
        if (!admins.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member) {
            return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
        }

        try {
            await member.ban({ reason: 'Banned by command' });
            
            send_log("User Banned", `${targetUser.tag} has been banned from the server.`, interaction.guild)

            await interaction.reply(`${targetUser.tag} has been banned!`);
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error trying to ban the user.', ephemeral: true });
        }
    },
};

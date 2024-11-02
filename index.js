const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
require('dotenv').config();

client.once('ready', () => {
    console.log('selfbotが起動しました');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; 

    if (message.content.startsWith('!users')) {
        const args = message.content.split(' ');
        if (args.length !== 2) {
            return message.reply('コマンドが無効です。\n !users <serverID>と送信してください');
        }

        const guildId = args[1];
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return message.reply('サーバーに参加していません');
        }

        try {
            await guild.members.fetch(); 
            const users = guild.members.cache.filter(member => !member.user.bot).map(member => member.user.id);
            const content = users.join('\n');

            fs.writeFile('userID.txt', content, err => {
                if (err) {
                    console.error('txtに記述するときにエラーが発生しました', err);
                    return message.reply('txt記述エラー');
                }
                console.log('ユーザーIDを保存しました');
                message.reply('IDの保存が完了しました');
            });
        } catch (error) {
            console.error('メンバーの取得エラー', error);
            message.reply('メンバーの取得エラー');
        }
    }
});

client.login(process.env.token);

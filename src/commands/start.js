const Strings = require('../english.json');
const { isOnSpamWatch } = require('../spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../spamwatch/Middleware.js')(isOnSpamWatch);

module.exports = (bot) => {
  bot.start(spamwatchMiddleware, async (ctx) => {
    const botInfo = await ctx.telegram.getMe();
    const startMsg = Strings.botWelcome.replace('{botName}', botInfo.first_name);

    ctx.reply(startMsg, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id
    });
  });

  bot.command(["mlp", "help"], spamwatchMiddleware, async (ctx) => {
    ctx.reply(Strings.ponyApi.helpDesc, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: ctx.message.message_id
    });
  });

  bot.command('privacy', spamwatchMiddleware, async (ctx) => {
    let message = "";

    const isChildPrivacy = Strings.isChildPrivacy
      .replace("{fatherBot}", process.env.fatherBot)
      .replace("{fatherBotUser}", process.env.fatherBotUser)

    const botPrivacy = Strings.botPrivacy
      .replace("{privacyPolicy}", process.env.botPrivacy)

    if (process.env.isChild == "true") {
      message = isChildPrivacy + botPrivacy
    } else {
      message = botPrivacy
    }

    ctx.reply(message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: ctx.message.message_id
    });
  });
};
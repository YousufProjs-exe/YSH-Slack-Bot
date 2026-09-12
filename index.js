
/*
    available commands:
    - /ysh-help
    - /ysh-ping
    - /ysh-time
    - /ysh-date
    - /ysh-hello
    - /ysh-neofetch

    soon to be added:
    thasts secrect.
*/

require("dotenv").config();

const { App } = require("@slack/bolt");
// %)% 505 
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Need Help ?! 
app.command("/ysh-help", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text:
      "*YSH — Yousuf Shell*\n\n" +
      "`/ysh-help` — Show commands\n" +
      "`/ysh-ping` — Check status\n" +
      "`/ysh-time` — Current time\n" +
      "`/ysh-date` — Current date\n" +
      "`/ysh-hello` — Say hello\n" +
      "`/ysh-neofetch` — (Personal Favorite)\n",
  });
});

// lil personal touch 
app.command("/ysh-ping", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "in_channel",
    text: " *YSH:* Pong! System is responsive.",
    // ?/ dap me up 
  });
});

// WHatasup  
app.command("/ysh-time", async ({ ack, respond }) => {
  await ack();

  const time = new Date().toLocaleTimeString("en-IN");

  await respond({
    response_type: "ephemeral",
    text: ` *YSH Time:* \`${time}\``, 
  });
});

// Whatsup ! 
app.command("/ysh-date", async ({ ack, respond }) => {
  await ack();

  const date = new Date().toLocaleDateString("en-IN");

  await respond({
    response_type: "ephemeral",
    text: ` *YSH Date:* \`${date}\``,
  });
});

// personal touch again
app.command("/ysh-hello", async ({ ack, respond, command }) => {
  await ack();

  await respond({
    response_type: "in_channel",
    text: ` *YSH:* Hello, ${command.user_name}!`,
  });
});

// another touch but cool one
app.command("/ysh-neofetch", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text:
  "```\n" +
  " __   __  _____  _   _ \n" +
  " \\ \\ / / / ____|| | | |\n" +
  "  \\ V / | (___  | |_| |\n" +
  "   | |   \\___ \\ |  _  |\n" +
  "   | |   ____) || | | |\n" +
  "   |_|  |_____/ |_| |_|\n\n" +
  " YSH — Yousuf Shell\n" +
  " Slack Edition\n" +
  " Runtime: Node.js\n" +
  " Framework: Slack Bolt\n" +
  " Mode: Socket Mode\n" +
  "```",
  });
});

(async () => {
  await app.start();
  console.log("YSH Slack Bot is running.");
    // Terminaloic Hope ! 
})();

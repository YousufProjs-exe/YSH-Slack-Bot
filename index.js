
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

    v2 updates: 
    - /ysh-coinflip 
    - /ysh-dice 
    - /ysh-whoami 
    - /ysh-password 
    - /ysh-remind 
    - /ysh-poll 
    - /ysh-quote 
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
      "`/ysh-help` - Show commands\n" +
      "`/ysh-ping` - Check status\n" +
      "`/ysh-time` - Current time\n" +
      "`/ysh-date` - Current date\n" +
      "`/ysh-whoami` - know abt you from YSH\n" +
      "`/ysh-hello` - Say hello\n" +
      "`/ysh-password` - generate a password\n" +
      "`/ysh-neofetch` - (Personal Favorite)\n" + 
      "`/ysh-dice` - Rollly rolly dice\n" + 
      "`/ysh-coinflip` - Filp a Coin ! \n",
  });
});

// let YSH create a password for u 
app.command("/ysh-password", async ({ ack, respond }) => {
  await ack();

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  const bytes = require("crypto").randomBytes(16);
  const password = Array.from(bytes, b => chars[b % chars.length]).join("");

  await respond({
    response_type: "ephemeral",
    text: `Generated password: \`${password}\``,
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

// lol know urself 
app.command("/ysh-whoami", async ({ ack, respond, command}) => {
  await ack();

  // was first abt to keep only name but found out ID can be done too 
  await respond({
      response_type: "ephemeral",
      text: `User: ${command.user_name}\nUser ID: ${command.user_id}`,
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

// flip a coin to decide ! 
app.command("/ysh-coinflip", async ({ ack, respond }) => {
  await ack();

  const result = Math.random() < 0.5 ? "Heads" : "Tails";

  await respond({
    response_type: "in_channel",
    text: ` ${result}!`,
  });
});

// Roll a dice !!  - rolly rolly.. 
app.command("/ysh-dice", async ({ ack, respond }) => {
  await ack();

  const result = Math.floor(Math.random() * 6) + 1;

  await respond({
    response_type: "in_channel",
    text: ` You rolled a ${result}!`,
  });
});

// another touch but cool one
app.command("/ysh-neofetch", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",
    text:
  "```\n" +
  " __   __  _____  _   _ \n" +    // this may seems to be AI written
  " \\ \\ / / / ____|| | | |\n" +  //  but only i now how irrittating it was
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

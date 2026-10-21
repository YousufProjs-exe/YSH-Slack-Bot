
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
      "`/ysh-quote` - Quotes..!\n" +
      "`/ysh-ping` - Check status\n" +
      "`/ysh-remind` - Add a reminder\n" +
      "`/ysh-time` - Current time\n" +
      "`/ysh-date` - Current date\n" +
      "`/ysh-whoami` - know abt you from YSH\n" +
      "`/ysh-hello` - Say hello\n" +
      "`/ysh-password` - generate a password\n" +
      "`/ysh-neofetch` - (Personal Favorite)\n" + 
      "`/ysh-dice` - Rollly rolly dice\n" + 
      "`/ysh-poll` - host a poll\n" + 
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

// Poll to decide 
app.command("/ysh-poll", async ({ command, ack, respond, client }) => {
  await ack();

  const parts = command.text.split("|").map((part) => part.trim());
  const question = parts[0];
  const options = parts.slice(1).filter(Boolean);

  if (!question || options.length < 2 || options.length > 5) {
    await respond({
      response_type: "ephemeral",
      text: "Usage: `/ysh-poll Favorite color? | Red | Blue | Green`\nProvide 2 - 5 options separated by `|`.",
    });
    return;
  }

  const votes = new Map();

  await client.chat.postMessage({
    channel: command.channel_id,
    text: `📊 ${question}`,
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: `📊 *${question}*` },
      },
      {
        type: "actions",
        elements: options.map((option, index) => ({
          type: "button",
          text: { type: "plain_text", text: option },
          action_id: `ysh_poll_vote_${index}`,
          value: `${index}`,
        })),
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "Votes: 0" }],
      },
    ],
  });

  await respond({
    response_type: "ephemeral",
    text: "Poll posted!",
  });
});

app.action(/^ysh_poll_vote_/, async ({ ack, body, action, client }) => {
  await ack();

  const channel = body.channel.id;
  const ts = body.message.ts;
  const user = body.user.id;
  const optionIndex = Number(action.value);

  const key = `${channel}:${ts}`;

  if (!global.yshPolls) global.yshPolls = new Map();
  if (!global.yshPolls.has(key)) {
    global.yshPolls.set(key, { votes: new Map(), options: [] });
  }

  const poll = global.yshPolls.get(key);
  poll.votes.set(user, optionIndex);

  const counts = new Map();
  for (const vote of poll.votes.values()) {
    counts.set(vote, (counts.get(vote) || 0) + 1);
  }

  const originalBlocks = body.message.blocks || [];
  const updatedBlocks = originalBlocks.map((block) => {
    if (block.type !== "context") return block;

    return {
      type: "context",
      elements: [{
        type: "mrkdwn",
        text: `Total votes: ${poll.votes.size}`,
      }],
    };
  });

  await client.chat.update({
    channel,
    ts,
    blocks: updatedBlocks,
    text: body.message.text || "YSH Poll",
  });
});

// Reminder to add ! 
app.command("/ysh-remind", async ({ command, ack, respond }) => {
  await ack();

  const match = command.text.trim().match(/^(\d+)(s|`m|h)\s+(.+)$/i);

  if (!match) {
    await respond({
      response_type: "ephemeral",
      text: "Usage: `/ysh-remind 10s test reminder`",
    });
    return;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const message = match[3].trim();
  const multipliers = { s: 1000, m: 60000, h: 3600000 };
  const delay = amount * multipliers[unit];

  if (!Number.isSafeInteger(amount) || amount < 1 || delay > 2147483647) {
    await respond({
      response_type: "ephemeral",
      text: "Invalid duration. Maximum is about 24 days.",
    });
    return;
  }

  await respond({
    response_type: "ephemeral",
    text: `Reminder set for ${amount}${unit}: "${message}"`,
  });

  setTimeout(async () => {
    try {
      await app.client.chat.postMessage({
      channel: command.channel_id,
      // text: `<@${command.user_id}> reminder: ${message}`,
      // was onto adding id instead of name 
      text: `<@${command.user_name}> reminder: ${message}`,
    });
    } 
    
    catch (error) {
      console.error("Reminder failed:", error);
    }

  }, delay);

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
  "  \\ V / | (___  | |_| |\n" +   // to make this masterpiece.
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

// Quotes ! now my my philosophy works 
app.command("/ysh-quote", async ({ ack, respond }) => {
  await ack();

  // got this from Google. btw 
  const quotes = [
    "Great things are done by a series of small things brought together. — Vincent van Gogh",
    "First, solve the problem. Then, write the code. — John Johnson",
    "Simplicity is the soul of efficiency. — Austin Freeman",
    "Make it work, make it right, make it fast. — Kent Beck",
    "It always seems impossible until it's done. — Nelson Mandela",
    "Stay hungry, stay foolish. — Steve Jobs",
    "The secret of getting ahead is getting started. — Mark Twain",
    "Talk is cheap. Show me the code. — Linus Torvalds",
    "Any sufficiently advanced technology is indistinguishable from magic. — Arthur C. Clarke",
    "Code is like humor. When you have to explain it, it's bad. — Cory House",
    "Only Limit is your Imagination. — Steve ig"
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  await respond({
    response_type: "in_channel",
    text: `*Quote of the moment*\n>${quote}`,
  });
});

(async () => {
  await app.start();
  console.log("YSH Slack Bot is running.");
    // Terminaloic Hope ! 
})();

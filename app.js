require('dotenv').config()
const tmi = require('tmi.js');
const Max = require('max-api');

// HPGL instructions
let instructions = [
  "AA", "AF", "AH", "AP", "AR", "AS", "BL", "CA", "CC", "CI", "CM", "CP", "CS", "CT", "DC",
  "DF", "DI", "DL", "DP", "DR", "DS", "DT", "EA", "EC", "EP", "ER", "ES", "EW", "FP", "FR",
  "FS", "FT", "GP", "IM", "IN", "IP", "IV", "IW", "LB", "LO", "LT", "NR", "OA", "OC", "OD",
  "OE", "OF", "OH", "OI", "OL", "OO", "OP", "OS", "OT", "OW", "PA", "PB", "PD", "PG", "PM",
  "PR", "PT", "PU", "RA", "RO", "RR", "SA", "SC", "SG", "SI", "SL", "SM", "SP", "SR", "SS",
  "TL", "UC", "UF", "VS", "WG", "XT", "YT"
]

// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD
  },
  channels: [
    process.env.TWITCH_CHANNEL
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const message = msg.trim();
  const instruction = message.substring(0,2);
  const arguments = msg.trim().substring(2);

  // If the command is known, let's execute it
  if (instructions.includes(instruction)) {
    const command = instruction + arguments;
    client.say(target, `You did a ${command} command`);
    console.log(`* Executed ${command} command`);
    Max.outlet(command);
  } else {
    client.say(target, `${instruction} is an unknown command!`);
    console.log(`* Unknown command ${instruction}`);
    Max.outlet(`* Unknown command ${instruction}`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
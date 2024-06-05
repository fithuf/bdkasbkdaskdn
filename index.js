import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import fs from "node:fs";
import keepAlive from "./server.js";

// Create a new client instance
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
], partials: [Partials.Channel] });

client.commands = new Collection();


// When the client is ready, run this code (only once)

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const { default: event } = await import(`./events/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
keepAlive();
const token = process.env['token']
client.login(token);
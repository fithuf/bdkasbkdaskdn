import { ActivityType } from 'discord.js';
import mongoose from "mongoose";
import userProfiles from '../models/userProfiles.js';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function CookieCheck() {
	while (true) {
		try {
			const userProfile = await userProfiles.findOne({ 'connectionArray.siteName': "bangbros1" });
			if (userProfile) {
				const checkArray = userProfile.connectionArray.filter(entry => entry.description?.includes("cookie check"));
				for (let index = 0; index < checkArray.length; index++) {
					const element = checkArray[index];
					try {
						const response = await fetch(element.testSite, {
							"credentials": "include",
							"headers": {
								"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
								"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
								"Accept-Language": "en-US,en;q=0.5",
								"Upgrade-Insecure-Requests": "1",
								"Sec-Fetch-Dest": "document",
								"Sec-Fetch-Mode": "navigate",
								"Sec-Fetch-Site": "none",
								"Sec-Fetch-User": "?1",
								"cookie": `${element.cookie}`
							},
							"method": "GET",
							"mode": "cors"
						});
						const body = await response.text();
						const $ = cheerio.load(body);
						console.log($('title').text());
					} catch (error) {
						console.error(error);
					}
					await wait(1000*20);
				}
			}
		} catch (error) {
			console.error(error);
		}
		await wait(1000 * 60 * 30)
	}
}

export default {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		await client.user.setPresence({
			activities: [{
				name: `Watching you`,
				type: ActivityType.Listening
			}],
			status: 'online' });

		const DBURL = process.env['DBURL']
		if(!DBURL) return;
		mongoose.set('strictQuery', true)
		mongoose.connect(DBURL, {}).then(() => {
			console.log("Bot connected to DB!")
		}).catch((err) => {
			console.log(err)
			return;
		});
		CookieCheck();
	},
};
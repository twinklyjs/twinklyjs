#!/usr/bin/env node
import fs from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import envPaths from 'env-paths';
import * as api from './api.js';
import { discover } from './discovery.js';

const configDir = envPaths('twinklyjs').config;
const configFile = path.join(configDir, 'config.json');

interface Config {
	ip: string;
}

async function getConfig(): Promise<Config | null> {
	try {
		const fileContents = await readFile(configFile, 'utf-8');
		const config = JSON.parse(fileContents);
		return config;
	} catch (err) {
		return null;
	}
}

const { values, positionals } = parseArgs({
	options: {
		ip: { type: 'string' },
		help: { type: 'boolean' },
	},
	tokens: true,
	allowPositionals: true,
});

if (positionals.length === 0 || values.help) {
	showHelp();
	process.exit(1);
}

const command = positionals[0];

const { ip } = values;
function requireIP() {
	if (!ip) {
		showHelp();
		process.exit(1);
	}
	api.init(ip);
}

const config = await getConfig();
if (!config) {
	if (!['discover', 'config'].includes(command)) {
		requireIP();
	}
} else {
	if (ip) {
		api.init(ip);
	} else {
		if (!config?.ip) {
			showHelp();
			process.exit(-1);
		}
		api.init(config.ip);
	}
}
switch (command) {
	case 'setmovie': {
		await api.setLEDOperationMode(api.LEDOperationMode.MOVIE);
		const movieId = Number(positionals[1]);
		const setmovie = await api.setCurrentMovie(movieId);
		console.log(setmovie);
		break;
	}
	case 'getmovie': {
		const movie = await api.getCurrentMovie();
		console.log(movie);
		break;
	}
	case 'getmovies': {
		const movies = await api.getMovies();
		console.log(movies);
		break;
	}
	case 'getsummary': {
		const summary = await api.getSummary();
		console.log(summary);
		break;
	}
	case 'discover': {
		const devices = await discover();
		console.log(devices);
		break;
	}
	case 'setbrightness': {
		const setbrightness = await api.setLEDBrightness({
			mode: positionals[1],
			type: positionals[2],
			value: Number(positionals[3]),
		});
		console.log(setbrightness);
		break;
	}
	case 'setopmode': {
		const mode = positionals[1] as api.LEDOperationMode;
		const setopmode = await api.setLEDOperationMode(mode);
		console.log(setopmode);
		break;
	}
	case 'setcolor': {
		const setcolor = await api.setLEDColor({
			red: Number(positionals[1]),
			green: Number(positionals[2]),
			blue: Number(positionals[3]),
		});
		console.log(setcolor);
		break;
	}
	case 'getfwversion': {
		const getfw = await api.getFWVersion();
		console.log(getfw);
		break;
	}
	case 'getname': {
		const nameconstant = await api.getDeviceName();
		console.log(`device name is ${nameconstant.name}`);
		break;
	}
	case 'setname': {
		const previousname = await api.getDeviceName();
		await api.setDeviceName({ name: positionals[1] });
		const newname = await api.getDeviceName();
		// biome-ignore lint/style/useTemplate: <explanation>
		console.log(previousname.name + ' has been set to ' + newname.name);
		break;
	}
	case 'config': {
		const getorset = positionals[1];

		switch (getorset) {
			case 'getip': {
				const config = await getConfig();
				if (config) {
					console.log(config?.ip);
				} else {
					console.log('No IP address set');
				}
				break;
			}
			case 'setip': {
				const newIP = positionals[2];
				let config = await getConfig();
				if (config) {
					config.ip = newIP;
				} else {
					config = { ip: newIP };
					if (!fs.existsSync(configDir)) {
						await mkdir(configDir, { recursive: true });
					}
				}
				await writeFile(configFile, JSON.stringify(config), 'utf-8');
				console.log('Config saved.');
				break;
			}
		}
		break;
	}
	default:
		showHelp();
		break;
}

function showHelp() {
	const help = `Usage: twinkly <command> [options]
Commands:
	discover - Discover Twinkly devices on the network
	getmovie - Get the current movie
	getmovies - Get all movies
	setmovie <id> - Set the current movie
	getsummary - Get the summary of the device
	setbrightness - Set enabled or disabled, A or R, and brightness from 0..100 if type set to A and -100..100 if type set to R'
	setopmode - Set LED operation mode'
	setcolor - Set LED color in RGB if in color opmode'
	getfwversion - Get the current firmware version'

Options:
	--ip <ip> - The IP address of the Twinkly device. Required.
`;
	console.log(help);
}

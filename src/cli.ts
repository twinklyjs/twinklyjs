#!/usr/bin/env node
import fs from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import envPaths from 'env-paths';
import schedule from 'node-schedule';
import * as api from './api.js';
import { discover } from './discovery.js';

const program = new Command();
const configDir = envPaths('twinklyjs').config;
const configFile = path.join(configDir, 'config.json');
interface Config {
	ip: string;
}

async function getConfig(): Promise<Config | null> {
	try {
		const fileContents = await readFile(configFile, 'utf-8');
		return JSON.parse(fileContents);
	} catch {
		return null;
	}
}

async function saveConfig(ip: string) {
	if (!fs.existsSync(configDir)) {
		await mkdir(configDir, { recursive: true });
	}
	await writeFile(configFile, JSON.stringify({ ip }), 'utf-8');
}

async function requireIP(ip: string | undefined): Promise<string> {
	if (ip) return ip;

	const config = await getConfig();
	if (config?.ip) return config.ip;

	console.error('Error: No IP address provided or saved in the config.');
	process.exit(1);
}

program
	.name('twinkly')
	.description('CLI tool for managing Twinkly smart lights')
	.version('1.0.0');

program
	.command('discover')
	.description('Discover Twinkly devices on the network')
	.action(async () => {
		const devices = await discover();
		console.log(devices);
	});

program
	.command('getmovie')
	.description('Get the current movie')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const movie = await api.getCurrentMovie();
		console.log(movie);
	});

program
	.command('getmovies')
	.description('Get movies installed.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const movies = await api.getMovies();
		console.log(movies);
	});

program
	.command('setmovie')
	.description('Set LED color in RGB')
	.argument('<id>')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (id, options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		await api.setLEDOperationMode({ mode: api.LEDOperationMode.MOVIE });
		const result = await api.setCurrentMovie({ id: Number(id) });
		console.log(result);
	});

program
	.command('setcolor')
	.description('Set LED color in RGB')
	.argument('<red>')
	.argument('<green>')
	.argument('<blue>')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (red, green, blue, options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		//Ignore: the response from method.
		const result = await api.setLEDColor({
			red: Number(red),
			green: Number(green),
			blue: Number(blue),
		});
		console.log(result);
	});

program
	.command('setopmode')
	.description('Set the LED operation mode')
	.argument('<mode>')

	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (mode, options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);

		const result = await api.setLEDOperationMode({
			mode: mode as api.LEDOperationMode,
		});
		console.log(result);
	});

program
	.command('config <action> [value]')
	.description('Manage configuration settings')
	.action(async (action, value) => {
		switch (action) {
			case 'getip': {
				const config = await getConfig();
				console.log(config?.ip || 'No IP address set');
				break;
			}
			case 'setip': {
				if (!value) {
					console.error('Error: No IP address provided.');
					process.exit(1);
				}
				await saveConfig(value);
				console.log('IP address saved.');
				break;
			}
			default:
				console.error('Invalid action. Use "getip" or "setip".');
		}
	});

program.parse(process.argv);

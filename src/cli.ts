#!/usr/bin/env node
import fs from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Argument, Command } from 'commander';
import envPaths from 'env-paths';
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
	.description('Discover Twinkly devices on the network.')
	.addHelpText(
		'after',
		'If no broadcast address is provided, the tool will attempt to discover devices on all network interfaces.',
	)
	.option(
		'--timeout <timeout>',
		'The time to wait for responses in milliseconds',
		'1000',
	)
	.option(
		'--broadcast-address <address>',
		'The broadcast address to use for discovery',
	)
	.action(async (options) => {
		const devices = await discover({
			timeout: Number(options.timeout),
			broadcastAddress: options.broadcastAddress,
		});
		if (devices.length > 0) {
			console.log(devices);
			console.log(
				`To configure your default device, run "twinkly config setip <ip>"`,
			);
		} else {
			console.log('No devices found.');
		}
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

		await api.setLEDOperationMode({ mode: api.LEDOperationMode.COLOR });

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

	.addArgument(
		new Argument('<mode>', 'The LED Operation Mode Twinkly is set to.').choices(
			['off', 'color', 'demo', 'movie', 'rt', 'effect', 'playlist'],
		),
	)

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
program
	.command('setbrightness')
	.description('Send http request for changing brightness.')
	.addArgument(
		new Argument('<mode>', 'Enabled or Disabled').choices([
			'enabled',
			'disabled',
		]),
	)
	.addArgument(
		new Argument('<type>', 'Either absolute(A) or relative(R)').choices([
			'a',
			'r',
		]),
	)
	.addArgument(
		new Argument(
			'<value>',
			'The brightness being set, if mode set to Absolute/A,0-100, if mode set to Relative, integer from -100 to 100.',
		),
	)
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (mode, type, value, options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const response = await api.setLEDBrightness({
			mode: mode as 'enabled' | 'disabled',
			type: type as 'A' | 'R',
			value: Number(value),
		});
		console.log(response);
	});
program
	.command('getbrightness')
	.description('Get the brightness of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const details = await api.getLEDBrightness();
		console.log(details);
	});

program
	.command('getopmode')
	.description('Get the current LED operation mode of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const details = await api.getLEDOperationMode();
		console.log(details);
	});

program
	.command('getcolor')
	.description('Get the color of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const details = await api.getLEDColor();
		console.log(details);
	});

program
	.command('getdetails')
	.description('Get the details of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const details = await api.getDeviceDetails();
		console.log(details);
	});

program
	.command('gettimer')
	.description('Get the timer set for the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const timer = await api.getTimer();

		console.log(
			`Time on: ${Math.floor(timer.time_on / 3600)}:${Math.floor((timer.time_on % 3600) / 60)} Time off: ${Math.floor(timer.time_off / 3600)}:${Math.floor((timer.time_off % 3600) / 60)} `,
		);
	});
program
	.command('settimer')
	.description('Send http request for setting timer.')
	.argument(
		'<TimeOn>',
		'The time at which the device should turn on in military time, hours and seconds.',
	)
	.argument(
		'<TimeOff>',
		'The time at which the device should turn off in military time, hours and seconds.',
	)
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (TimeOn, TimeOff, options) => {
		const ip = await requireIP(options.ip);
		api.init(ip);
		const Now = new Date();
		const hours = Now.getHours();
		const minutes = Now.getMinutes();
		const seconds = Now.getSeconds();

		const [timeOnHr, timeOnMin] = TimeOn.split(':');
		const [timeOffHr, timeOffMin] = TimeOff.split(':');
		const response = await api.setTimer({
			time_now: hours * (60 * 60) + minutes * 60 + seconds,
			time_on: timeOnHr * (60 * 60) + timeOnMin * 60,
			time_off: timeOffHr * (60 * 60) + timeOffMin * 60,
		});
		console.log(response);
	});

program.parse(process.argv);

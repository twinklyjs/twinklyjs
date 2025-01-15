#!/usr/bin/env node
import fs from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Argument, Command } from 'commander';
import envPaths from 'env-paths';
import { discover } from './discovery.js';
import { LEDOperationMode, TwinklyClient } from './index.js';

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
	.command('get-brightness')
	.description('Get the brightness of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getLEDBrightness();
		console.log(details);
	});

program
	.command('set-brightness')
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
		const client = new TwinklyClient({ ip });
		const response = await client.setLEDBrightness({
			mode: mode as 'enabled' | 'disabled',
			type: type as 'A' | 'R',
			value: Number(value),
		});
		console.log(response);
	});

program
	.command('get-color')
	.description('Get the color of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getLEDColor();
		console.log(details);
	});

program
	.command('set-color')
	.description('Set LED color in RGB')
	.argument('<red>')
	.argument('<green>')
	.argument('<blue>')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (red, green, blue, options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		await client.setLEDOperationMode({ mode: LEDOperationMode.COLOR });
		const result = await client.setLEDColor({
			red: Number(red),
			green: Number(green),
			blue: Number(blue),
		});
		console.log(result);
	});

program
	.command('get-details')
	.description('Get the details of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getDeviceDetails();
		console.log(details);
	});

program
	.command('get-device-name')
	.description('Get the name of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getDeviceName();
		console.log(details);
	});

program
	.command('set-device-name')
	.description('Set the name of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.addArgument(new Argument('<name>', 'The name of the device.'))
	.action(async (name, options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		await client.setDeviceName({ name });
		console.log('Device name set.');
	});

program
	.command('get-led-effects')
	.description('Get the LED effects')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getLEDEffects();
		console.log(details);
	});

program
	.command('get-current-led-effect')
	.description('Get the current LED effect')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getCurrentLEDEffect();
		console.log(details);
	});

program
	.command('set-current-led-effect')
	.description('Set the current LED effect')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.option('--effect-id <effect-id>', 'The effect to set')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.setCurrentLEDEffect({
			effect_id: options.effectId,
		});
		console.log(details);
	});

program
	.command('get-firmware-version')
	.description('Get the firmware version')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getFWVersion();
		console.log(details);
	});

program
	.command('get-layout')
	.description('Get the current layout')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.deleteLayout();
		console.log(details);
	});

program
	.command('delete-layout')
	.description('Delete the current layout')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		await client.getLayout();
		console.log('Layout deleted.');
	});

program
	.command('get-movie')
	.description('Get the current movie')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const movie = await client.getCurrentMovie();
		console.log(movie);
	});

program
	.command('get-movies')
	.description('Get movies installed.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const movies = await client.getMovies();
		console.log(movies);
	});

program
	.command('set-movie')
	.description('Set LED color in RGB')
	.argument('<id>')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (id, options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		await client.setLEDOperationMode({ mode: LEDOperationMode.MOVIE });
		const result = await client.setCurrentMovie({ id: Number(id) });
		console.log(result);
	});

program
	.command('get-music-drivers')
	.description('Get music drivers')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getMusicDrivers();
		console.log(details);
	});

program
	.command('get-music-drivers-sets')
	.description('Get music drivers sets')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getMusicDriversSets();
		console.log(details);
	});

program
	.command('get-current-music-driver-set')
	.description('Get current music drivers sets')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getCurrentMusicDriverset();
		console.log(details);
	});

program
	.command('get-op-mode')
	.description('Get the current LED operation mode of the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getLEDOperationMode();
		console.log(details);
	});

program
	.command('set-op-mode')
	.description('Set the LED operation mode')
	.addArgument(
		new Argument('<mode>', 'The LED Operation Mode Twinkly is set to.').choices(
			['off', 'color', 'demo', 'movie', 'rt', 'effect', 'playlist'],
		),
	)
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (mode, options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const result = await client.setLEDOperationMode({
			mode: mode as LEDOperationMode,
		});
		console.log(result);
	});

program
	.command('get-summary')
	.description('Get the device summary.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const details = await client.getSummary();
		console.log(details);
	});

program
	.command('get-timer')
	.description('Get the timer set for the device.')
	.option('--ip <ip>', 'The IP address of the Twinkly device')
	.action(async (options) => {
		const ip = await requireIP(options.ip);
		const client = new TwinklyClient({ ip });
		const timer = await client.getTimer();
		console.log(
			`Time on: ${Math.floor(timer.time_on / 3600)}:${Math.floor((timer.time_on % 3600) / 60)} Time off: ${Math.floor(timer.time_off / 3600)}:${Math.floor((timer.time_off % 3600) / 60)} `,
		);
	});

program
	.command('set-timer')
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
		const client = new TwinklyClient({ ip });
		const Now = new Date();
		const hours = Now.getHours();
		const minutes = Now.getMinutes();
		const seconds = Now.getSeconds();

		const [timeOnHr, timeOnMin] = TimeOn.split(':');
		const [timeOffHr, timeOffMin] = TimeOff.split(':');
		const response = await client.setTimer({
			time_now: hours * (60 * 60) + minutes * 60 + seconds,
			time_on: timeOnHr * (60 * 60) + timeOnMin * 60,
			time_off: timeOffHr * (60 * 60) + timeOffMin * 60,
		});
		console.log(response);
	});

program.parse(process.argv);

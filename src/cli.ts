#!/usr/bin/env node
import { parseArgs } from 'node:util';
import * as api from './api.js';
import { discover } from './discovery.js';

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

if (command !== 'discover') {
	requireIP();
}

switch (command) {
	case 'setmovie': {
		await api.setLEDOperationMode('movie');
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
	case 'discover': {
		const devices = await discover();
		console.log(devices);
		break;
	}
	default:
		showHelp();
		break;
}

function showHelp() {
	const help = `Usage: twinkly <command> [options]
Commands:
	setmovie <id> - Set the current movie'
	getmovie - Get the current movie'
	getmovies - Get all movies'

Options:
	--ip <ip> - The IP address of the Twinkly device. Required.
`;
	console.log(help);
}

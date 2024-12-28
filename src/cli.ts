#!/usr/bin/env node
import * as api from './api.js';
const args = process.argv.slice(2);
const ip = args[0];
api.init(ip);
const command = args[1];
await api.setLEDOperationMode('movie');

if (command === 'setmovie') {
	const movieId = Number(args[2]);
	const setmovie = await api.setCurrentMovie(movieId);
	console.log(setmovie);
}
if (command === 'getmovie') {
	const movie = await api.getCurrentMovie();
	console.log(movie);
}
if (command === 'getmovies') {
	const movies = await api.getMovies();
	console.log(movies);
}

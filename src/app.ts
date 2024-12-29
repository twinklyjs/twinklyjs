import { readFile } from 'node:fs/promises';
import * as api from './api.js';
import { discover } from './discovery.js';
api.init('10.0.0.167');
await api.setLEDOperationMode(api.LEDOperationMode.MOVIE);
const details = await api.getMovies();
console.log(details);

// await api.setLEDOperationMode('color');
// await api.setLEDColor(0, 255, 0);
// const data = await api.getLEDOperationMode();
// console.log(data);

// const devices = await discover();
// console.log(devices);

import * as api from './api.js';
import { discover } from './discovery.js';

api.init('10.0.0.187');
const details = await api.getLEDColor();
console.log(details);

// await api.setLEDOperationMode('color');
// await api.setLEDColor(0, 255, 0);
// const data = await api.getLEDOperationMode();
// console.log(data);

// const devices = await discover();
// console.log(devices);

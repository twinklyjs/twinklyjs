import * as api from './api.js';
import {discover} from './discovery.js';

// const details = await api.getDeviceDetails();
// console.log(details);

// const data = await api.getLEDConfig();
// console.log(data);

const devices = await discover();
console.log(devices);

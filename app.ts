import * as api from './api.js';
const details = await api.getDeviceDetails();
console.log(details);

const data = await api.getLEDConfig();
console.log(data);

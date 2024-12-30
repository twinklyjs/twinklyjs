import {realtime, api} from '@twinklyjs/twinkly';

const ip = process.argv.slice(2)[0];

await api.init(ip);
await api.setLEDOperationMode(api.LEDOperationMode.RT);
const token = api.getToken();

for (let i=0; i<1000; i++) {
  const nodes = [];
  for (let i=0; i<600; i++) {
    nodes.push({
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    });
  }

  await realtime.sendFrame(ip, token, nodes);
  await new Promise(resolve => setTimeout(resolve, 50));
}

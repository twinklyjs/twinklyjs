import {TwinklyClient, LEDOperationMode, sendFrame} from '@twinklyjs/twinkly';

const ip = process.argv.slice(2)[0];
if (!ip) {
  console.error('Usage: node examples/realtime.js <ip>');
  process.exit(1);
}

const client = new TwinklyClient({ip});
await client.setLEDOperationMode({ mode: LEDOperationMode.RT });
const {number_of_led} = await client.getDeviceDetails();
const token = client.getToken();
const NUMBER_OF_FRAMES = 100;

for (let i=0; i<NUMBER_OF_FRAMES; i++) {
  const nodes = [];
  for (let i=0; i<number_of_led; i++) {
    nodes.push({
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    });
  }

  await sendFrame(ip, token, nodes);
  await new Promise(resolve => setTimeout(resolve, 50));
}

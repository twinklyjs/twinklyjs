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

while (true) {
  for (let i=0; i<number_of_led; i++) {
    const nodes = [];
    for (let j=0; j<number_of_led; j++) {
      const distance = Math.abs(i - j);
      const alpha = distance < 5 ? (1 - distance/5) : 0;
      const color = Math.floor(255 * alpha);
      nodes.push({
        r: color,
        g: color,
        b: color || 255,
      });
    }
    await sendFrame(ip, token, nodes);
    await new Promise(resolve => setTimeout(resolve, 25));
  }
}

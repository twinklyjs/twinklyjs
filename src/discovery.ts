import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const UDP_BROADCAST_PORT = 5555;

interface DiscoverOptions {
  timeout: number;
  broadcastAddress: string;
}

interface Device {
  ip: string;
  port: number;
  deviceId: string;
}

/**
 * Discover Twinkly devices on the network. 
 * Based on guidance at https://xled-docs.readthedocs.io/en/latest/protocol_details.html#discovery-protocol
 */
export async function discover(options?: DiscoverOptions) {
  const timeout = options?.timeout ?? 1000;
  const broadcastAddress = options?.broadcastAddress ?? '10.0.0.255';

  // Discovery request message to find all Twinkly devices on the network:
  // 1 byte 0x01 probably version
  // 8 bytes as a string discover
  const message = Buffer.from('1discover');

  const socket = dgram.createSocket('udp4');
  socket.bind(() => {
    socket.setBroadcast(true);
  });
  return await new Promise<Device[]>((resolve, reject) => {
    const devices: Device[] = [];
    setTimeout(() => {
      socket.close();
      resolve(devices);
      return;
    }, timeout);
    socket
      .on('message', (msg, rinfo) => {
        // Twinkly devices respond with message:
        // first four bytes are octets of IP address of the device in reverse order.
        // first byte is last octet of the IP adress, second one is the second to last, ...
        // fifth and sixth byte are 0x79 0x75 - string OK
        // rest is a string representing device id
        // last one is a zero byte
        const device = {
          ip: rinfo.address,
          port: rinfo.port,
          deviceId: msg.subarray(6, msg.length - 2).toString('utf8'),
        };
        // avoid adding the same device twice
        if (!devices.find((d) => d.deviceId === device.deviceId)) {
          devices.push(device);
        }
      })
      .send(message, 0, message.length, UDP_BROADCAST_PORT, broadcastAddress, (err) => {
        if (err) {
          socket.close();
          reject(err);
        }
      });
  });
}

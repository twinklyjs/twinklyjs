import { Buffer } from 'node:buffer';
import dgram from 'node:dgram';
import os from 'node:os';

const UDP_BROADCAST_PORT = 5555;

export interface DiscoverOptions {
	timeout?: number;
	broadcastAddress?: string;
}

export interface Device {
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

	// If the user sent a broadcast address, use it directly
	if (options?.broadcastAddress) {
		return await sendDiscoveryRequest(options.broadcastAddress, timeout);
	}

	// otherwise, we have to send a request to each potential interface.
	const interfaces = Object.values(os.networkInterfaces());
	const devices: Device[] = [];
	for (const addresses of interfaces) {
		if (!addresses) {
			continue;
		}
		for (const address of addresses) {
			// Right now we are assuming this should be an IPv4 address ... but I don't know if that's
			// actually a good assumption.  We should listen for feedback on this one.
			if (address.family === 'IPv4' && !address.internal) {
				const broadcastAddress = calculateBroadcastAddress(
					address.address,
					address.netmask,
				);
				const localDevices = await sendDiscoveryRequest(
					broadcastAddress,
					timeout,
				);
				devices.push(...localDevices);
			}
		}
	}
	return devices;
}

/**
 * Calculate the broadcast address for a given IP address and subnet mask.
 *
 * This will frequently return a value like `10.0.0.255` or `192.168.1.255`.
 */
function calculateBroadcastAddress(ip: string, subnetMask: string): string {
	const ipParts = ip.split('.').map(Number);
	const maskParts = subnetMask.split('.').map(Number);
	const broadcastParts = ipParts.map(
		(ipPart, i) => ipPart | (~maskParts[i] & 255),
	);
	return broadcastParts.join('.');
}

/**
 * Send a discovery request to the given broadcast address and return the devices that respond.
 */
async function sendDiscoveryRequest(
	broadcastAddress: string,
	timeout: number,
): Promise<Device[]> {
	const socket = dgram.createSocket('udp4');
	socket.bind(() => {
		socket.setBroadcast(true);
	});

	// Discovery request message to find all Twinkly devices on the network:
	// 1 byte 0x01 probably version
	// 8 bytes as a string discover
	const message = Buffer.from('1discover');

	const devices = await new Promise<Device[]>((resolve, reject) => {
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
			.send(
				message,
				0,
				message.length,
				UDP_BROADCAST_PORT,
				broadcastAddress,
				(err) => {
					if (err) {
						socket.close();
						// This could fail for a variety of reasons. We should log and continue.
						if (process.env.TWINKLY_DEBUG) {
							console.error(err);
						}
					}
				},
			);
	});
	return devices;
}

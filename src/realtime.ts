// Application calls HTTP API to switch mode to rt
// Then UDP datagrams are sent to a port 7777 of device. Each datagram
// contains a frame or its segment that is immediately displayed. See bellow
// for format of the datagrams.
// After some time without any UDP datagrams device switches back to movie mode.

// 1 byte: version \x03 (byte with hex representation 0x03)
// 8 bytes: byte representation of the authentication token - not encoded in base 64
// 2 bytes: \x00\x00 of unknown meaning - maybe a fragment could be 3 bytes long?
// 1 byte: frame fragment number - first one is 0

// See https://xled-docs.readthedocs.io/en/latest/protocol_details.html#real-time-led-operating-mode

import { Buffer } from 'node:buffer';
import dgram from 'node:dgram';

const UDP_PORT = 7777;

export interface LightNode {
	r: number;
	g: number;
	b: number;
}

/**
 *
 * @param ip IP address of the device to send the frame
 * @param token Pre-fetched authentication token
 * @param nodes {r, g, b} array of light nodes
 */
export async function sendFrame(ip: string, token: string, nodes: LightNode[]) {
	const socket = dgram.createSocket('udp4');
	let frame = 0;
	let light = 0;
	while (light < nodes.length) {
		const messageParts = [
			Buffer.from([0x03]),
			Buffer.from(token, 'base64'),
			Buffer.from([0x00, 0x00, frame]),
		];
		for (let i = 12; i < 900 && light < nodes.length; i += 3) {
			const node = nodes[light];
			messageParts.push(Buffer.from([node.r, node.g, node.b]));
			light++;
		}
		const message = Buffer.concat(messageParts);
		await new Promise<void>((resolve, reject) => {
			socket.send(message, 0, message.length, UDP_PORT, ip, (err, bytes) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				resolve();
			});
		});
		frame++;
	}
	socket.close();
}

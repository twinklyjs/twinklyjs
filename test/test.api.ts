import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { TwinklyClient } from '../src/api.js';

describe('api', () => {
	it('should allow setting the ip', async () => {
		const ip = 'ippy';
		const client = new TwinklyClient({ ip });
		assert.ok(client);
	});
});

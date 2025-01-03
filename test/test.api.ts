import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { init, paths } from '../src/api.js';

describe('api', () => {
	it('should allow setting the ip', async () => {
		init('ippy');
		assert.strictEqual(paths.ECHO, 'http://ippy/xled/v1/echo');
	});
});

import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { $ } from 'execa';

describe('cli', () => {
	it('should show help', async () => {
		const { stdout } = await $`node build/src/cli.js --help`;
		assert.match(stdout, /Usage: twinkly \[options\] \[command\]/);
	});
});

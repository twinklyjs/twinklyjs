export const basePath = '/xled/v1';
export const paths = {
	ECHO: '/echo',
	LOGIN: '/login',
	VERIFY: '/verify',
	GET_DEVICE_DETAILS: '/gestalt',
	GET_DEVICE_NAME: '/device_name',
	GET_LED_CONFIG: '/led/config',
	GET_LED_EFFECTS: '/led/effects',
	GET_LED_OPERATION_MODE: '/led/mode',
	GET_LED_BRIGHTNESS: '/led/out/brightness',
	GET_LAYOUT: '/led/layout/full',
	GET_CURRENT_LED_EFFECT: '/led/effects/current',
	GET_NETWORK_STATUS: '/network/status',
	SET_NETWORK_STATUS: '/network/status',
	SET_LED_COLOR: '/led/color',
	SET_LED_OPERATION_MODE: '/led/mode',
	SET_DEVICE_NAME: '/device_name',
	GET_MOVIES: '/movies',
	GET_CURRENT_MOVIE: '/movies/current',
	SET_CURRENT_MOVIE: '/movies/current',
	GET_SUMMARY: '/summary',
	GET_LED_COLOR: '/led/color',
};

const TypedKeys = <T extends object>(obj: T): (keyof T)[] => {
	return Object.keys(obj) as (keyof T)[];
};

interface TokenData {
	authentication_token: string;
}

let tokenData: TokenData;

export interface CodeResponse {
	code: number;
}

export interface GetLEDConfigResponse extends CodeResponse {
	strings: {
		first_led_id: number;
		length: number;
	}[];
}

export async function getLEDConfig(): Promise<GetLEDConfigResponse> {
	return await request(paths.GET_LED_CONFIG);
}

export interface GetLEDColorResponse extends CodeResponse {
	hue: number;
	saturation: number;
	value: number;
	red: number;
	green: number;
	blue: number;
}

/**
 * Gets the color shown when in color mode.
 * Since firmware version 2.7.1
 */
export async function getLEDColor(): Promise<GetLEDColorResponse> {
	return await request(paths.GET_LED_COLOR);
}

export interface GetSummaryResponse extends CodeResponse {
	/**
	 * (object) corresponds to response of Get LED operation mode without code.
	 */
	led_mode: {
		mode: string;
		detect_mode: number;
		shop_mode: number;
	};

	/**
	 * (object) corresponds to response of Get Timer without code.
	 */
	timer: {
		time_now: number;
		time_on: number;
		time_off: number;
		tz: string;
	};

	/**
	 * (object)
	 */
	music: {
		enabled: number;
		active: number;
		mode: string;
		auto_mode: string;
		current_driverset: number;
		mood_index: number;
	};

	/**
	 * Array of objects
	 */
	filters: {
		filter: 'brightness' | 'hue' | 'saturation';
		config: {
			value: number;
			mode: string;
		};
	}[];

	/**
	 * (object) corresponds to sync object from response of Get LED movie config without code.
	 */
	group: { mode: string; compat_mode: number };

	/**
	 * (object)
	 */
	layout: {
		uuid: string;
	};

	/**
	 * (object) corresponds to response of Get LED color without code. Since firmware version 2.7.1
	 */
	color: {
		hue: number;
		saturation: number;
		value: number;
		red: number;
		green: number;
		blue: number;
	};
}

export async function getSummary(): Promise<GetSummaryResponse> {
	return await request(paths.GET_SUMMARY);
}

export interface GetCurrentMovieResponse extends CodeResponse {
	/**
	 * (integer), numeric id of movie, in range 0 .. 15
	 */
	id: number;

	/**
	 * (string), UUID of movie.
	 */
	unique_id: string;

	/**
	 * (string), name of movie.
	 */
	name: string;
}

/**
 * Gets the id of the movie shown when in movie mode.
 */
export async function getCurrentMovie(): Promise<GetCurrentMovieResponse> {
	return await request(paths.GET_CURRENT_MOVIE);
}

export interface Movie {
	id: number;
	name: string;
	unique_id: string;
	descriptor_type: string;
	leds_per_frame: number;
	frames_number: number;
	fps: number;
}

export async function getMovies(): Promise<Movie[]> {
	return await request(paths.GET_MOVIES);
}

/**
 * Sets which movie to show when in movie mode.
 * Since firmware version 2.5.6.
 * @param id
 * @returns
 */
export async function setCurrentMovie(id: number): Promise<CodeResponse> {
	return await request(paths.SET_CURRENT_MOVIE, {
		method: 'POST',
		body: { id },
	});
}

/**
 * Responds with requested message.
 * Since firmware version 1.99.18.
 * @param body
 * @returns
 */
export async function echo<T>(body: T): Promise<T> {
	return await request(paths.ECHO, {
		method: 'POST',
		body,
	});
}

export interface GetDeviceNameResponse {
	name: string;
	code: number;
}

export async function getDeviceName(): Promise<GetDeviceNameResponse> {
	return await request(paths.GET_DEVICE_NAME);
}

/**
 * Sets device name
 * @param name (string) Desired device name. At most 32 characters.
 * @returns
 */
export async function setDeviceName(name: string): Promise<CodeResponse> {
	return await request(paths.SET_DEVICE_NAME, {
		method: 'POST',
		body: {
			name,
		},
	});
}

export interface DeviceDetails {
	/**
	 * (string) Twinkly
	 */
	product_name: string;
	/**
	 * (numeric string), e.g. “6”
	 */
	hardware_version: string;
	bytes_per_led: number;
	hw_id: string;
	flash_size: number;
	led_type: number;
	product_code: string;
	fw_family: string;
	device_name: string;
	uptime: string;
	mac: string;
	uuid: string;
	max_supported_led: number;
	number_of_led: number;
	led_profile: string;
	frame_rate: number;
	measured_frame_rate: number;
	movie_capacity: number;
	max_movies: number;
	wire_type: number;
	copyright: string;
	code: number;
}

/**
 * Initialize the API with the IP address of the device.
 * @param ip The IP address of the device
 */
export function init(ip: string) {
	for (const key of TypedKeys(paths)) {
		paths[key] = `http://${ip}${basePath}${paths[key]}`;
	}
}

/**
 * Gets information detailed information about the device.
 * Since firmware version 1.99.18.
 * @returns
 */
export async function getDeviceDetails(): Promise<DeviceDetails> {
	return await request(paths.GET_DEVICE_DETAILS);
}

export interface GetLEDEffectsResponse extends CodeResponse {
	/**
	 * (integer), e.g. 5 until firmware version 2.4.30 and 15 since firmware version 2.5.6.
	 */
	effects_number: number;

	/**
	 * (array), since firmware version 2.5.6.
	 */
	unique_ids: string[];
}

export async function getLEDEffects(): Promise<GetLEDEffectsResponse> {
	return await request(paths.GET_LED_EFFECTS);
}

export interface GetLEDOperationModeResponse extends CodeResponse {
	/**
	 * (string) mode of operation.
	 */
	mode: LEDOperationMode;

	/**
	 * (integer), by default 0. Since firmware version 2.4.21.
	 */
	shop_mode: number;
}

/**
 * Gets current LED operation mode.
 */
export async function getLEDOperationMode() {
	return await request(paths.GET_LED_OPERATION_MODE);
}

export interface GetLEDBrightnessResponse extends CodeResponse {
	/**
	 * (string) one of “enabled” or “disabled”.
	 */
	mode: 'enabled' | 'disabled';

	/**
	 * (integer) brightness level in range of 0..100
	 */
	value: number;
}

/**
 * Gets the current brightness level.
 * For devices with firmware family “D” since version 2.3.5.
 * For devices with firmware family “F” since 2.4.2.
 * For devices with firmware family “G” since version 2.4.21.
 */
export async function getLEDBrightness(): Promise<GetLEDBrightnessResponse> {
	return await request(paths.GET_LED_BRIGHTNESS);
}

export interface GetLayoutResponse extends CodeResponse {
	/**
	 * (integer), e.g. 0
	 */
	aspectXY: number;

	/**
	 * (integer), e.g. 0
	 */
	aspectXZ: number;

	/**
	 * (array)
	 */
	coordinates: { x: number; y: number; z: number }[];

	/**
	 * (string enum)
	 */
	source: 'linear' | '2d' | '3d';

	/**
	 * (bool), e.g. false
	 */
	synthesized: boolean;

	/**
	 * (string), e.g. “00000000-0000-0000-0000-000000000000”
	 */
	uuid: string;
}

/**
 * Since firmware version 1.99.18.
 */
export async function getLayout(): Promise<GetLayoutResponse> {
	return await request(paths.GET_LAYOUT);
}

export async function getCurrentLEDEffect() {
	return await request(paths.GET_CURRENT_LED_EFFECT);
}

export interface HSVColor {
	/**
	 * (integer), hue component of HSV, in range 0..359
	 */
	hue: number;

	/**
	 * (integer), saturation component of HSV, in range 0..255
	 */
	saturation: number;

	/**
	 * (integer), value component of HSV, in range 0..255
	 */
	value: number;
}

export interface RGBColor {
	/**
	 * (integer), red component of RGB, in range 0..255
	 */
	red: number;

	/**
	 * (integer), green component of RGB, in range 0..255
	 */
	green: number;

	/**
	 * (integer), blue component of RGB, in range 0..255
	 */
	blue: number;
}

export type SetLEDColorRequest = HSVColor | RGBColor;

/**
 * Sets the color shown when in color mode.
 * @param red
 * @param green
 * @param blue
 * @returns
 */
export async function setLEDColor(
	options: SetLEDColorRequest,
): Promise<CodeResponse> {
	return await request(paths.SET_LED_COLOR, {
		method: 'POST',
		body: options,
	});
}

export enum LEDOperationMode {
	OFF = 'off',
	COLOR = 'color',
	DEMO = 'demo',
	MOVIE = 'movie',
	RT = 'rt',
	EFFECT = 'effect',
	PLAYLIST = 'playlist',
}

/**
 * off - turns off lights
 * color - shows a static color
 * demo - starts predefined sequence of effects that are changed after few seconds
 * movie - plays predefined or uploaded effect. If movie hasn’t been set (yet) code 1104 is returned.
 * rt - receive effect in real time
 * effect - plays effect with effect_id
 * playlist - plays a movie from a playlist. Since firmware version 2.5.6.
 * @param {*} mode
 * @returns
 */
export async function setLEDOperationMode(mode: LEDOperationMode) {
	return await request(paths.SET_LED_OPERATION_MODE, {
		method: 'POST',
		body: {
			mode,
		},
	});
}

/**
 * Obtain an auth token from the API.  As far as I can tell this is mostly theatre since there is no
 * private key or token from the app required?
 * @returns The token data
 */
async function getTokenData() {
	const challengeBits = new Uint8Array(32);
	crypto.getRandomValues(challengeBits);
	const challenge = btoa(String.fromCharCode(...challengeBits));
	const res = await fetch(paths.LOGIN, {
		method: 'POST',
		body: JSON.stringify({ challenge }),
	});
	throwIfErr(res);
	const data = await res.json();
	return data;
}

export async function throwIfErr(response: Response) {
	if (response.ok) {
		return;
	}
	const errorText = `Error fetching ${response.url}: ${response.status} ${response.statusText}`;
	throw new FetchError(errorText, response);
}

export class FetchError extends Error {
	constructor(
		message: string,
		public response: Response,
	) {
		super(message);
	}
}

/**
 * Make a request to the API automatically injecting the token if needed
 * @param {*} url
 * @param {*} options
 * @returns The data from the successful request
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function request(url: string, options: any = {}) {
	if (!tokenData) {
		tokenData = await getTokenData();
		await request(paths.VERIFY, { method: 'POST' });
	}

	options.headers = options.headers ?? {};
	options.headers['X-Auth-Token'] = tokenData.authentication_token;

	if (typeof options.body === 'object') {
		options.body = JSON.stringify(options.body);
	}

	const res = await fetch(url, options);
	throwIfErr(res);
	const data = await res.json();
	return data;
}

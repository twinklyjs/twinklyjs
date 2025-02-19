export const basePath = '/xled/v1';
export const paths = Object.freeze({
	LOGIN: '/login',
	VERIFY: '/verify',
	LOGOUT: '/logout',
	ECHO: '/echo',
	GET_DEVICE_DETAILS: '/gestalt',
	GET_DEVICE_NAME: '/device_name',
	SET_DEVICE_NAME: '/device_name',
	GET_TIMER: '/timer',
	SET_TIMER: '/timer',
	GET_LAYOUT: '/led/layout/full',
	UPLOAD_LAYOUT: '/led/layout/full',
	DELETE_LAYOUT: '/led/layout/full',
	GET_LED_OPERATION_MODE: '/led/mode',
	SET_LED_OPERATION_MODE: '/led/mode',
	GET_LED_COLOR: '/led/color',
	SET_LED_COLOR: '/led/color',
	GET_LED_EFFECTS: '/led/effects',
	GET_CURRENT_LED_EFFECT: '/led/effects/current',
	SET_CURRENT_LED_EFFECT: '/led/effects/current',
	GET_LED_CONFIG: '/led/config',
	SET_LED_CONFIG: '/led/config',
	UPLOAD_FULL_MOVIE: '/led/movie/full',
	GET_LED_MOVIE_CONFIG: '/led/movie/config',
	SET_LED_MOVIE_CONFIG: '/led/movie/config',
	GET_LED_BRIGHTNESS: '/led/out/brightness',
	SET_LED_BRIGHTNESS: '/led/out/brightness',
	GET_LED_SATURATION: '/led/out/saturation',
	SET_LED_SATURATION: '/led/out/saturation',
	SET_LED_DRIVER_PARAMETERS: '/led/driver_params',
	RESET_LED: '/led/reset',
	RESET_LED2: '/led/reset2',
	SEND_REALTIME_FRAME: '/led/rt/frame',
	GET_FW_VERSION: '/fw/version',
	GET_STATUS: '/status',
	UPDATE_FIRMWARE: '/fw/update',
	UPLOAD_FIRST_STAGE_FIRMWARE: '/fw/0/update',
	UPLOAD_SECOND_STAGE_FIRMWARE: '/fw/1/update',
	GET_MOVIES: '/movies',
	DELETE_MOVIES: '/movies',
	CREATE_MOVIE_ENTRY: '/movies/new',
	UPLOAD_MOVIE: '/movies/full',
	GET_CURRENT_MOVIE: '/movies/current',
	SET_CURRENT_MOVIE: '/movies/current',
	INITIATE_WIFI_NETWORK_SCAN: '/network/scan',
	GET_NETWORK_SCAN_RESULTS: '/network/scan_results',
	GET_NETWORK_STATUS: '/network/status',
	SET_NETWORK_STATUS: '/network/status',
	GET_MQTT_CONFIG: '/mqtt/config',
	SET_MQTT_CONFIG: '/mqtt/config',
	GET_PLAYLIST: '/playlist',
	CREATE_PLAYLIST: '/playlist',
	DELETE_PLAYLIST: '/playlist',
	GET_CURRENT_PLAYLIST_ENTRY: '/playlist/current',
	SET_CURRENT_PLAYLIST_ENTRY: '/playlist/current',
	GET_MIC_CONFIG: '/mic/config',
	GET_MIC_SAMPLE: '/mic/sample',
	GET_SUMMARY: '/summary',
	GET_MUSIC_DRIVERS: '/music/drivers',
	GET_MUSIC_DRIVERS_SETS: '/music/drivers/sets',
	GET_CURRENT_MUSIC_DRIVERSET: '/music/drivers/sets/current',
});

export interface InitOptions {
	ip: string;
	additionalHeaders?: Record<string, string>;
}

export interface CodeResponse {
	code: number;
}

export interface LoginResponse extends CodeResponse {
	/**
	 * Access token in format: 8 byte string base64 encoded. First authenticated API with this token must be Verify.
	 */
	authentication_token: string;

	/**
	 * 41 byte string ([0-9a-h])
	 */
	'challenge-response': string;
}

export interface VerifyRequest {
	/**
	 * (optional) value returned by login request.
	 */
	'challenge-response': string;
}

export interface DeviceDetailsResponse extends CodeResponse {
	/**
	 * (string) Twinkly
	 */
	product_name: string;
	/**
	 * (numeric string), e.g. “6”
	 */
	hardware_version: string;
	/**
	 * (number), 4
	 */
	bytes_per_led: number;
	/**
	 * (string), see section Hardware ID in Protocol details.
	 */
	hw_id: string;
	/**
	 * (number), 64
	 */
	flash_size: number;
	/**
	 * (number), 14
	 */
	led_type: number;
	/**
	 * (string), e.g. “TWS250STP”
	 */
	product_code: string;
	/**
	 * (string) “G”,
	 */
	fw_family: string;
	/**
	 * (string), name of the device - see section Device Name in Protocol details.
	 */
	device_name: string;
	/**
	 * (string) number as a string. Seconds since start. E.g. “60”
	 */
	uptime: string;
	/**
	 * (string) MAC address as six groups of two hexadecimal digits separated by colons (:).
	 */
	mac: string;
	/**
	 * (string) UUID of the device. Since firmware version: 2.0.8. Device in family “D” has value 00000000-0000-0000-0000-000000000000.
	 */
	uuid: string;
	/**
	 * (number), e.g. firmware family “D”: 180 in firmware version 1.99.20, 224 in 1.99.24, 228 in 1.99.30, 255 in 2.0.0 and newer.
	 */
	max_supported_led: number;
	/**
	 * (number), e.g. 105
	 */
	number_of_led: number;
	/**
	 * (string) “RGB”
	 */
	led_profile: string;
	/**
	 * (number), 25
	 */
	frame_rate: number;
	/**
	 * (number), e.g. 23.26. Since firmware version 2.5.6.
	 */
	measured_frame_rate: number;
	/**
	 * (number), e.g. 1984, since firmware version 2.4.14: 992
	 */
	movie_capacity: number;
	/**
	 * (integer), e.g. 1 or 4
	 */
	wire_type: number;
	/**
	 * (string) “LEDWORKS 2017”
	 */
	copyright: string;
}

export interface SetTimerRequest {
	/**
	 * (integer) current time in seconds after midnight
	 */
	time_now: number;

	/**
	 * (number) time when to turn lights on in seconds after midnight. -1 if not set
	 */
	time_on: number;

	/**
	 * (number) time when to turn lights off in seconds after midnight. -1 if not set
	 */
	time_off: number;
}

export interface GetTimerResponse extends CodeResponse {
	/**
	 * (integer) current time in seconds after midnight
	 */
	time_now: number;

	/**
	 * (number) time when to turn lights on in seconds after midnight. -1 if not set
	 */
	time_on: number;

	/**
	 * (number) time when to turn lights off in seconds after midnight. -1 if not set
	 */
	time_off: number;
}

export interface Layout {
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
}

export interface GetLayoutResponse extends Layout {
	/**
	 * (string), e.g. “00000000-0000-0000-0000-000000000000”
	 */
	uuid: string;
}

export type UploadLayoutRequest = Layout;

export interface UploadLayoutResponse extends CodeResponse {
	/**
	 * (integer)
	 */
	parsed_coordinates: number;
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

export enum LEDOperationMode {
	/**
	 * Turns off lights
	 */
	OFF = 'off',
	/**
	 * shows a static color
	 */
	COLOR = 'color',
	/**
	 * starts predefined sequence of effects that are changed after few seconds
	 */
	DEMO = 'demo',
	/**
	 * plays predefined or uploaded effect. If movie hasn’t been set (yet) code 1104 is returned.
	 */
	MOVIE = 'movie',
	/**
	 * receive effect in real time
	 */
	RT = 'rt',
	/**
	 * plays effect with effect_id
	 */
	EFFECT = 'effect',
	/**
	 * plays a movie from a playlist. Since firmware version 2.5.6.
	 */
	PLAYLIST = 'playlist',
}

export interface SetLEDOperationModeRequest {
	/**
	 * (string) mode of operation. See LED operating modes in Protocol details.
	 */
	mode: LEDOperationMode;

	/**
	 * (int), id of effect, e.g. 0. Set together with mode: effect.
	 */
	effect_id?: number;
}

export interface GetLEDColorResponse extends CodeResponse {
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

export interface GetCurrentLEDEffectResponse extends CodeResponse {
	/**
	 * (string), UUID. Since firmware version 2.5.6.
	 */
	unique_id: string;
	/**
	 * (integer), e.g. 0
	 */
	effect_id: number;
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

export interface GetDeviceNameResponse extends CodeResponse {
	/**
	 * (string) Device name.
	 */
	name: string;
}

export interface SetDeviceNameRequest {
	/**
	 * (string) Desired device name. At most 32 characters.
	 */
	name: string;
}

export interface SetCurrentLEDEffectRequest {
	/**
	 * (int), id of effect, e.g. 0.
	 */
	effect_id: number;
}

export interface LEDConfigString {
	/**
	 * (integer), e.g. 0
	 */
	first_led_id: number;
	/**
	 * (integer), e.g. 105
	 */
	length: number;
}

export interface GetLEDConfigResponse extends CodeResponse {
	strings: LEDConfigString[];
}

export interface SetLEDConfigRequest {
	strings: LEDConfigString[];
}

export interface UploadFullMovieResponse extends CodeResponse {
	/**
	 * (integer) number of received frames
	 */
	frames_number: number;
}

export interface GetLEDMovieConfigResponse extends CodeResponse {
	frame_delay: number;
	/**
	 * (integer) seems to be total number of LEDs to use
	 */
	leds_number: number;
	/**
	 * (integer), e.g. 0
	 */
	loop_type: number;
	/**
	 * (integer)
	 */
	frames_number: number;

	sync: {
		mode: string;
		/**
		 * (string), e.g. “”. Defined if mode is “slave”. Since firmware version 2.5.6 not present if empty
		 */
		slave_id: string;
		/**
		 * (string), e.g. “”. Defined if mode is “slave” or “master”. Since firmware version 2.5.6 not present if empty
		 */
		master_id: string;
		/**
		 * (number), default 0. Since firmware version 2.5.6.
		 */
		compat_mode: number;
	};
	/**
	 * (object), since firmware family “G” version 2.4.21 until 2.4.30 and firmware family “F” version 2.4.14 until 2.4.30.
	 */
	mic: {
		filters: unknown[];
		brightness_depth: number;
		hue_depth: number;
		value_depth: number;
		saturation_depth: number;
	};
}

export interface SetLEDMovieConfigRequest {
	/**
	 * (integer) the delay in milliseconds between two consecutive frames. For n fps, this is 1000 / n.
	 */
	frame_delay: number;
	/**
	 * (integer) seems to be total number of LEDs to use
	 */
	leds_number: number;
	frames_number: number;
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

export interface SetLEDBrightnessRequest {
	/**
	 * (string) one of “enabled”, “disabled”
	 */
	mode: 'enabled' | 'disabled';
	/**
	 * (string) either “A” for Absolute value or “R” for Relative value
	 */
	type: 'A' | 'R';
	/**
	 * (signed integer) brightness level in range of 0..100 if type is “A”, or change of level in range -100..100 if type is “R”
	 */
	value: number;
}

export interface GetLEDSaturationResponse extends CodeResponse {
	/**
	 * (string) one of “enabled” or “disabled”.
	 */
	mode: string;
	/**
	 * (integer) saturation level in range of 0..100
	 */
	value: number;
}

export interface SetLEDSaturationRequest {
	/**
	 * (string) one of “enabled”, “disabled”
	 */
	mode: string;
	/**
	 * (string) either “A” for Absolute value or “R” for Relative value
	 */
	type: string;
	/**
	 * (signed integer) saturation level in range of 0..100 if type is “A”, or change of level in range -100..100 if type is “R”
	 */
	value: number;
}

export interface SetLEDDriverParametersRequest {
	t0h: number;
	t0l: number;
	t1h: number;
	t1l: number;
	tendh: number;
	tendl: number;
}

export interface getFWVersion extends CodeResponse {
	version: string;
}

export interface UpdateFirmwareRequest {
	checksum: {
		/**
		 * (string) SHA1 digest of first stage.
		 */
		stage0_sha1sum: string;
		/**
		 * (string) SHA1 digest of second stage. Only used for generation I devices.
		 */
		stage1_sha1sum?: string;
	};
}

export interface UploadFirstStageFirmwareResponse {
	/**
	 * SHA1 digest of uploaded firmware.
	 */
	sha1sum: string;
}

export interface UploadSecondStageFirmwareResponse {
	/**
	 * SHA1 digest of uploaded firmware.
	 */
	sha1sum: string;
}

export interface Movie {
	/**
	 * (integer), e.g. 0
	 */
	id: number;
	/**
	 * (integer), e.g. 0
	 */
	name: string;
	/**
	 * (string), UUID
	 */
	unique_id: string;
	/**
	 * (string), e.g “rgbw_raw” for firmware family “G” or “rgb_raw” for firmware family “F”
	 */
	descriptor_type: string;
	/**
	 * (integer), e.g. 210
	 */
	leds_per_frame: number;
	/**
	 * (integer), e.g. 4
	 */
	frames_number: number;
	/**
	 * (integer), e.g. 0
	 */
	fps: number;
}

export interface GetMoviesResponse extends CodeResponse {
	movies: Movie[];
	/**
	 * (integer), e.g. 992
	 */
	available_frames: number;
	/**
	 * (integer), e.g. 992
	 */
	max_capacity: number;
}

export interface CreateMovieEntryRequest {
	/**
	 * (string)
	 */
	name: string;
	/**
	 * (string), UUID
	 */
	unique_id: string;
	/**
	 * (string), e.g “rgbw_raw”,
	 */
	descriptor_type: string;
	/**
	 * (integer), e.g. 210
	 */
	leds_per_frame: string;
	/**
	 * (integer), e.g. 4
	 */
	frames_number: number;
	/**
	 * (integer), e.g. 0
	 */
	fps: number;
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
 * Response seems to correspond with AT command CWLAP.
 */
export interface GetWiFiScanResultsResponse extends CodeResponse {
	networks: {
		ssid: string;
		mac: string;
		/**
		 * (number) negative number
		 */
		rssi: number;
		channel: number;
		/**
		 * One of numbers 0 (Open), 1 (WEP), 2 (WPA-PSK), 3 (WPA2-PSK), 4 (WPA-PSK + WPA2-PSK), 5 (WPA2-EAP).
		 */
		enc: 0 | 1 | 2 | 3 | 4 | 5;
	}[];
}

export interface GetNetworkStatusResponse extends CodeResponse {
	/**
	 * (enum) 1 or 2
	 */
	mode: 1 | 2;
	/**
	 * (object)
	 */
	station: {
		/**
		 * (string), SSID of a WiFi network to connect to
		 */
		ssid: string;
		/**
		 * (string), IP address of the device
		 */
		ip: string;
		/**
		 * (string), IP address of the gateway
		 */
		gw: string;
		/**
		 * (string), subnet mask
		 */
		mask: string;
		/**
		 * (integer), status of the network connection: 5 = connected, 255 = AP is used
		 */
		status?: number;
	};
	/**
	 * (object)
	 */
	ap: {
		/**
		 * (string), SSID of the device
		 */
		ssid: string;
		/**
		 * (integer), channel number
		 */
		channel: number;
		/**
		 * (string), IP address
		 */
		ip: string;
		/**
		 * (enum), 0 for no encryption, 2 for WPA1, 3 for WPA2, 4 for WPA1+WPA2
		 */
		enc: 0 | 2 | 3 | 4;
		/**
		 * (integer), default 0. Since firmware version 2.4.25.
		 */
		ssid_hidden: number;
		/**
		 * (integer), default 4. Since firmware version 2.4.25.
		 */
		max_connection: number;
		/**
		 * (integer), either hidden or set to 1 if default password for AP was changed.
		 */
		password_changed: number;
	};
}

export interface SetCurrentMovieRequest {
	/**
	 * (int), id of movie, in range 0 .. 15.
	 */
	id: number;
}

export interface SetNetworkStatusRequest {
	/**
	 * (enum), required: 1 or 2
	 */
	mode: 1 | 2;
	/**
	 * (object) optional, if mode set to 1 this parameter could provide additional details.
	 */
	station?: {
		/**
		 * (integer) 1
		 */
		dhcp: number;
		/**
		 * (string) SSID of a WiFi network until firmare version 2.4.25
		 */
		ssid: string;
		/**
		 * (string) encrypted SSID of a WiFi network since firmare version 2.4.30.
		 */
		encssid: string;
		/**
		 * (string) encrypted password.
		 */
		encpassword: string;
	};
	/**
	 * (object) optional, if mode set to 2 this parameter could provide additional details.
	 */
	ap?: {
		/**
		 * (string), required SSID of a WiFi network
		 */
		ssid: string;
		/**
		 * (string), optional encrypted password.
		 */
		encpassword?: string;
		/**
		 * (string), optional plaintext password. Since firmware version 2.4.25 (?).
		 */
		password?: string;
		/**
		 * (enum), optional type of encryption. See above in Get network status. Defaults to 0 if not part of the request. If a request has enc value 1, get will return 0 as well.
		 */
		enc?: number;
		/**
		 * (integer), optional
		 */
		channel?: number;
		/**
		 * (integer), optional, 0 to broadcast SSID, 1 to hide. Since firmware version 2.4.25.
		 */
		ssid_hidden?: number;
		/**
		 * (integer), optional, value from 1 to 4. Since firmware version 2.4.25.
		 */
		max_connection: number;
	};
}

export interface GetMQTTConfigResponse extends CodeResponse {
	/**
	 * (string), hostname of broker. By default mqtt.twinkly.com.
	 */
	broker_host: string;
	/**
	 * (integer), destination port of broker. By default “1883”.
	 */
	broker_port: number;
	/**
	 * (string), see section MQTT Client ID in Protocol details.
	 */
	client_id: string;
	/**
	 * (bool), by default “False”.  For firmware family "D" only.
	 */
	encryption_key_set?: boolean;
	/**
	 * (integer), by default “180” for firmware family "D", and defaults to
	 * "60" for firmware family "G" and above.
	 */
	keep_alive_interval: number;
	/**
	 * (string), by default “twinkly_noauth” for firmware family "D", and defaults to
	 * "twinkly32" for firmware family "G" and above
	 */
	user: string;
	/**
	 * (string), only in firmware family “F” since 2.4.2 until 2.4.14.
	 */
	password?: string;
}

/**
 * For firmware family “D” since firmware version 2.0.22 and firmware family “G” since firmware version 2.4.21 and firmware family “F” since version 2.4.2:
 */
export interface SetMQTTConfigRequest {
	/**
	 * (string), optional hostname of a broker
	 */
	broker_host?: string;
	/**
	 * (string), optional
	 */
	client_id?: string;
	/**
	 * (integer), optional
	 */
	keep_alive_interval?: number;
	/**
	 * (string), optional
	 */
	user?: string;
}

export interface PlaylistEntry {
	/**
	 * (integer), in seconds, e.g. 10
	 */
	duration: number;
	/**
	 * (string), UUID
	 */
	unique_id: number;
}

export interface GetPlaylistResponse extends CodeResponse {
	entries: PlaylistEntry[];
}

export interface CreatePlaylistRequest {
	entries: PlaylistEntry[];
}

export interface GetCurrentPlaylistEntryResponse extends CodeResponse {
	/**
	 * (integer), 0
	 */
	id: number;
	/**
	 * (string), UUID
	 */
	unique_id: string;
	/**
	 * (string)
	 */
	name: string;
}

export interface SetCurrentPlaylistEntryRequest {
	/**
	 * (int), id of movie to jump to, e.g. 0.
	 */
	id: number;
}

export interface GetMicConfigResponse extends CodeResponse {
	/**
	 * array of objects
	 */
	filters: unknown[];
	/**
	 * (integer), default 0
	 */
	silence_threshold: number;
	/**
	 * (integer), default 0
	 */
	active_range: number;
	/**
	 * (integer), default 255
	 */
	brightness_depth: number;
	/**
	 * (integer), default 255
	 */
	hue_depth: number;
	/**
	 * (integer), default 255
	 */
	value_depth: number;
	/**
	 * (integer), default 255
	 */
	saturation_depth: number;
}

export interface GetMicSampleResponse extends CodeResponse {
	/**
	 * (integer), e.g. 0
	 */
	sampled_value: number;
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

export interface GetMusicDriversResponse extends CodeResponse {
	/**
	 * (integer), e.g. 26
	 */
	drivers_number: number;

	/**
	 * (array), each entry is UUID string
	 */
	unique_ids: string[];
}

export interface MusicDriversSet {
	/**
	 * (integer)
	 */
	id: number;
	/**
	 * (integer)
	 */
	count: number;
	/**
	 * (array), each entry is UUID string
	 */
	unique_ids: string[];
}

export interface GetMusicDriversSetsResponse extends CodeResponse {
	/**
	 * (integer), e.g. 26
	 */
	current: number;
	/**
	 * (integer), e.g. 3
	 */
	count: number;

	driversets: MusicDriversSet[];
}

export interface GetCurrentMusicDriversetResponse extends CodeResponse {
	/**
	 * (integer), e.g. 0
	 */
	driverset_id: number;
}

/**
 * The Twinkly API client.
 */
export class TwinklyClient {
	private tokenData: LoginResponse | undefined;
	private globalOptions: InitOptions;

	/**
	 * Initialize the API with the IP address of the device.
	 */
	constructor(options: InitOptions) {
		this.globalOptions = options;
	}

	/**
	 * Fetch the token (if available)
	 */
	getToken() {
		return this.tokenData?.authentication_token;
	}

	/**
	 * Gets device name
	 * Since firmware version 1.99.18.
	 */
	async getDeviceName(): Promise<GetDeviceNameResponse> {
		return await this.request(paths.GET_DEVICE_NAME);
	}

	/**
	 * Obtain an auth token from the API.  As far as I can tell this is mostly theatre since there is no
	 * private key or token from the app required?
	 * @returns The token data
	 */
	async login(): Promise<LoginResponse> {
		const challengeBits = new Uint8Array(32);
		crypto.getRandomValues(challengeBits);
		const challenge = btoa(String.fromCharCode(...challengeBits));
		const res = await fetch(this.buildUrl(paths.LOGIN), {
			method: 'POST',
			body: JSON.stringify({ challenge }),
			headers: this.globalOptions?.additionalHeaders,
		});
		throwIfErr(res);
		const data = await res.json();
		return data;
	}

	/**
	 * Verify the token retrieved by Login. Successful call invalidates previous token, if it existed.
	 * Since firmware version 1.99.18.
	 */
	async verify(options?: VerifyRequest): Promise<CodeResponse> {
		return await this.request(paths.VERIFY, {
			method: 'POST',
			body: options ? JSON.stringify(options) : undefined,
		});
	}

	/**
	 * Probably invalidate access token. Doesn’t work.
	 * Since firmware version 1.99.18.
	 */
	async logout(): Promise<CodeResponse> {
		return await this.request(paths.LOGOUT, {
			method: 'POST',
		});
	}

	/**
	 * Gets information detailed information about the device.
	 * Since firmware version 1.99.18.
	 * @returns
	 */
	async getDeviceDetails(): Promise<DeviceDetailsResponse> {
		return await this.request(paths.GET_DEVICE_DETAILS);
	}

	/**
	 * Sets device name
	 */
	async setDeviceName(options: SetDeviceNameRequest): Promise<CodeResponse> {
		return await this.request(paths.SET_DEVICE_NAME, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Responds with requested message.
	 * Since firmware version 1.99.18.
	 */
	async echo<T extends object>(body: T): Promise<T> {
		return await this.request(paths.ECHO, {
			method: 'POST',
			body: JSON.stringify(body),
		});
	}

	/**
	 * Gets time when lights should be turned on and time to turn them off.
	 * Since firmware version 1.99.18.
	 */
	async getTimer(): Promise<GetTimerResponse> {
		return await this.request(paths.GET_TIMER);
	}

	async setTimer(options: SetTimerRequest): Promise<CodeResponse> {
		return await this.request(paths.SET_TIMER, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async getLayout(): Promise<GetLayoutResponse> {
		return await this.request(paths.GET_LAYOUT);
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async uploadLayout(
		options: UploadLayoutRequest,
	): Promise<UploadLayoutResponse> {
		return await this.request(paths.UPLOAD_LAYOUT, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	async deleteLayout(): Promise<CodeResponse> {
		return await this.request(paths.DELETE_LAYOUT, {
			method: 'DELETE',
		});
	}

	/**
	 * Gets current LED operation mode.
	 */
	async getLEDOperationMode(): Promise<GetLEDOperationModeResponse> {
		return await this.request(paths.GET_LED_OPERATION_MODE);
	}

	/**
	 * Changes LED operation mode.
	 * Since firmware version 1.99.18.
	 */
	async setLEDOperationMode(
		options: SetLEDOperationModeRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_LED_OPERATION_MODE, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Gets the color shown when in color mode.
	 * Since firmware version 2.7.1
	 */
	async getLEDColor(): Promise<GetLEDColorResponse> {
		return await this.request(paths.GET_LED_COLOR);
	}

	/**
	 * Sets the color shown when in color mode.
	 */
	async setLEDColor(options: SetLEDColorRequest): Promise<CodeResponse> {
		return await this.request(paths.SET_LED_COLOR, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Retrieve the identities of all available predefined effects.
	 *
	 * Since firmware version 1.99.18.
	 */
	async getLEDEffects(): Promise<GetLEDEffectsResponse> {
		return await this.request(paths.GET_LED_EFFECTS);
	}

	async getCurrentLEDEffect(): Promise<GetCurrentLEDEffectResponse> {
		return await this.request(paths.GET_CURRENT_LED_EFFECT);
	}

	/**
	 * Sets which effect to show when in effect mode.
	 * Since firmware version 1.99.18.
	 */
	async setCurrentLEDEffect(
		options: SetCurrentLEDEffectRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_CURRENT_LED_EFFECT, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async getLEDConfig(): Promise<GetLEDConfigResponse> {
		return await this.request(paths.GET_LED_CONFIG);
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async setLEDConfig(options: SetLEDConfigRequest): Promise<CodeResponse> {
		return await this.request(paths.SET_LED_CONFIG, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Effect is sent in body of the request. If mode is movie it starts playing this effect.
	 * Since firmware version 1.99.18.
	 */
	async uploadFullMovie(
		content: ArrayBuffer,
	): Promise<UploadFullMovieResponse> {
		return await this.request(paths.UPLOAD_FULL_MOVIE, {
			method: 'POST',
			body: content,
		});
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async getLEDMovieConfig(): Promise<GetLEDMovieConfigResponse> {
		return await this.request(paths.GET_LED_MOVIE_CONFIG);
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async setLEDMovieConfig(
		options: SetLEDMovieConfigRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_LED_MOVIE_CONFIG, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Gets the current brightness level.
	 * For devices with firmware family “D” since version 2.3.5.
	 * For devices with firmware family “F” since 2.4.2.
	 * For devices with firmware family “G” since version 2.4.21.
	 */
	async getLEDBrightness(): Promise<GetLEDBrightnessResponse> {
		return await this.request(paths.GET_LED_BRIGHTNESS);
	}

	/**
	 * Sets the brightness level.
	 * For devices with firmware family “D” since version 2.3.5.
	 * For devices with firmware family “F” since 2.4.2.
	 * For devices with firmware family “G” since version 2.4.21.
	 */
	async setLEDBrightness(
		options: SetLEDBrightnessRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_LED_BRIGHTNESS, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Gets the current saturation level.
	 * For devices with firmware family “D” since version 2.3.5.
	 * For devices with firmware family “F” since 2.4.2.
	 * For devices with firmware family “G” since version 2.4.21.
	 *
	 * Mode string displays if desaturation is applied. The led shines with full color regardless of what value is set if the mode is disabled. Saturation level value represents percent so 0 is completely black-and-white and 100 is full color.
	 */
	async getLEDSaturation(): Promise<GetLEDSaturationResponse> {
		return await this.request(paths.GET_LED_SATURATION);
	}

	/**
	 * Sets the saturation level.
	 * For devices with firmware family “D” since version 2.3.5.
	 * For devices with firmware family “F” since 2.4.2.
	 * For devices with firmware family “G” since version 2.4.21.
	 *
	 * When mode is “disabled” no desaturation is applied and the led works at full color. It is not necessary to submit all the parameters, basically it would work if only value or mode is supplied. type parameter can be omitted (“A” is the default). The saturation level value is in percent so 0 is completely black-and-white and maximum meaningful value is 100. Greater values are possible but don’t seem to have any effect.
	 */
	async setLEDSaturation(
		options: SetLEDSaturationRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_LED_SATURATION, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async setLEDDriverParameters(
		options: SetLEDDriverParametersRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_LED_DRIVER_PARAMETERS, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Maybe reboot?
	 */
	async resetLED(): Promise<CodeResponse> {
		return await this.request(paths.RESET_LED);
	}

	/**
	 * Maybe reboot?
	 */
	async resetLED2(): Promise<CodeResponse> {
		return await this.request(paths.RESET_LED2);
	}

	/**
	 * Used by application during lights mapping.
	 * Frame without any header is sent in the request body.
	 */
	async sendRealtimeFrame(content: ArrayBuffer): Promise<CodeResponse> {
		return await this.request(paths.SEND_REALTIME_FRAME, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
			},
			body: content,
		});
	}

	/**
	 * Note: no authentication needed.
	 * Since firmware version 1.99.18.
	 */
	async getFWVersion(): Promise<getFWVersion> {
		return await this.request(paths.GET_FW_VERSION);
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async getStatus(): Promise<CodeResponse> {
		return await this.request(paths.GET_STATUS);
	}

	/**
	 * Initiates firmware update.
	 * Since firmware version 1.99.18.
	 */
	async updateFirmware(options: UpdateFirmwareRequest): Promise<CodeResponse> {
		return await this.request(paths.UPDATE_FIRMWARE, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * First stage of firmware is uploaded in body of the request.
	 * Since firmware version 1.99.18.
	 */
	async uploadFirstStageFirmware(
		content: ArrayBuffer,
	): Promise<UploadFirstStageFirmwareResponse> {
		return await this.request(paths.UPLOAD_FIRST_STAGE_FIRMWARE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
			},
			body: content,
		});
	}

	/**
	 * Second stage of firmware is uploaded in body of the request.
	 * Since firmware version 1.99.18.
	 * Used only for generation I devices.
	 */
	async uploadSecondStageFirmware(
		content: ArrayBuffer,
	): Promise<UploadSecondStageFirmwareResponse> {
		return await this.request(paths.UPLOAD_SECOND_STAGE_FIRMWARE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
			},
			body: content,
		});
	}

	/**
	 * Retrieve the identities and parameters of all uploaded movies.
	 * Available since firmware version 2.5.6.
	 */
	async getMovies(): Promise<GetMoviesResponse> {
		return await this.request(paths.GET_MOVIES);
	}

	/**
	 * Remove all uploaded movies.
	 * Any existing playlist will be removed as well. This call only works if the device is not in movie or playlist mode.
	 * Available since firmware version 2.5.6.
	 */
	async deleteMovies(): Promise<CodeResponse> {
		return await this.request(paths.DELETE_MOVIES, {
			method: 'DELETE',
		});
	}

	/**
	 * Available since firmware version 2.5.6.
	 */
	async createMovieEntry(
		options: CreateMovieEntryRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.CREATE_MOVIE_ENTRY, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Available since firmware version 2.5.6.
	 * Effect is received in body of the request. This call must be preceeded by a call to movies/new.
	 */
	async uploadMovie(content: ArrayBuffer): Promise<CodeResponse> {
		return await this.request(paths.UPLOAD_MOVIE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
			},
			body: content,
		});
	}

	/**
	 * Gets the id of the movie shown when in movie mode.
	 */
	async getCurrentMovie(): Promise<GetCurrentMovieResponse> {
		return await this.request(paths.GET_CURRENT_MOVIE);
	}

	/**
	 * Sets which movie to show when in movie mode.
	 * Since firmware version 2.5.6.
	 */
	async setCurrentMovie(
		options: SetCurrentMovieRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_CURRENT_MOVIE, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async initiateWiFiNetworkScan(): Promise<CodeResponse> {
		return await this.request(paths.INITIATE_WIFI_NETWORK_SCAN);
	}

	/**
	 * Since firmware version 1.99.18.
	 */
	async getWiFiScanResults(): Promise<GetWiFiScanResultsResponse> {
		return await this.request(paths.GET_NETWORK_SCAN_RESULTS);
	}

	/**
	 * Gets network mode operation.
	 * Since firmware version 1.99.18.
	 */
	async getNetworkStatus(): Promise<GetNetworkStatusResponse> {
		return await this.request(paths.GET_NETWORK_STATUS);
	}

	async setNetworkStatus(
		options: SetNetworkStatusRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_NETWORK_STATUS, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * For devices with firmware family “D” since version 2.0.22.
	 * For devices with firmware family “F” since version 2.4.2.
	 * For devices with firmware family “G” since version 2.4.21.
	 */
	async getMQTTConfig(): Promise<GetMQTTConfigResponse> {
		return await this.request(paths.GET_MQTT_CONFIG);
	}

	/**
	 * Since firmware version: 2.0.22
	 */
	async setMQTTConfig(options: SetMQTTConfigRequest): Promise<CodeResponse> {
		return await this.request(paths.SET_MQTT_CONFIG, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Available since firmware version 2.5.6.
	 */
	async getPlaylist(): Promise<GetPlaylistResponse> {
		return await this.request(paths.GET_PLAYLIST);
	}

	/**
	 * Available since firmware version 2.5.6.
	 */
	async createPlaylist(options: CreatePlaylistRequest): Promise<CodeResponse> {
		return await this.request(paths.CREATE_PLAYLIST, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Available since firmware version 2.5.6.
	 */
	async deletePlaylist(): Promise<CodeResponse> {
		return await this.request(paths.DELETE_PLAYLIST, {
			method: 'DELETE',
		});
	}

	/**
	 * Gets which movie is currently played in playlist mode.
	 * Available since firmware version 2.5.6.
	 */
	async getCurrentPlaylistEntry(): Promise<GetCurrentPlaylistEntryResponse> {
		return await this.request(paths.GET_CURRENT_PLAYLIST_ENTRY);
	}

	/**
	 * Sets which movie to jump to when in playlist mode.
	 * When entering playlist mode, it always starts from the first entry in the playlist, so this call is only useful when already in playlist mode.
	 * Available since firmware version 2.5.6.
	 */
	async setCurrentPlaylistEntry(
		options: SetCurrentPlaylistEntryRequest,
	): Promise<CodeResponse> {
		return await this.request(paths.SET_CURRENT_PLAYLIST_ENTRY, {
			method: 'POST',
			body: JSON.stringify(options),
		});
	}

	/**
	 * Since firmware version 2.4.2 until 2.4.30.
	 */
	async getMicConfig(): Promise<GetMicConfigResponse> {
		return await this.request(paths.GET_MIC_CONFIG);
	}

	/**
	 * Since firmware version 2.4.2 until 2.4.30.
	 */
	async getMicSample(): Promise<GetMicSampleResponse> {
		return await this.request(paths.GET_MIC_SAMPLE);
	}

	/**
	 * Since firmware version 2.5.6.
	 */
	async getSummary(): Promise<GetSummaryResponse> {
		return await this.request(paths.GET_SUMMARY);
	}

	/**
	 * Since firmware version 2.5.6.
	 */
	async getMusicDrivers(): Promise<GetMusicDriversResponse> {
		return await this.request(paths.GET_MUSIC_DRIVERS);
	}

	/**
	 * Since firmware version 2.5.6.
	 */
	async getMusicDriversSets(): Promise<GetMusicDriversSetsResponse> {
		return await this.request(paths.GET_MUSIC_DRIVERS_SETS);
	}

	/**
	 * Since firmware version 2.5.6.
	 */
	async getCurrentMusicDriverset(): Promise<GetCurrentMusicDriversetResponse> {
		return await this.request(paths.GET_CURRENT_MUSIC_DRIVERSET);
	}

	/**
	 * Grab a url based on the path
	 */
	private buildUrl(url: string) {
		return url.startsWith('http://')
			? url
			: `http://${this.globalOptions.ip}${basePath}${url}`;
	}

	/**
	 * Make a request to the API automatically injecting the token if needed
	 * @param {*} url
	 * @param {*} options
	 * @returns The data from the successful request
	 */
	private async request(url: string, options: RequestInit = {}) {
		const newUrl = this.buildUrl(url);

		if (!this.tokenData) {
			this.tokenData = await this.login();
			await this.request(this.buildUrl(paths.VERIFY), { method: 'POST' });
		}

		options.headers = options.headers ?? {};
		Object.assign(options.headers, this.globalOptions?.additionalHeaders ?? {});
		(options.headers as Record<string, string>)['X-Auth-Token'] =
			this.tokenData.authentication_token;

		if (typeof options.body === 'object') {
			options.body = JSON.stringify(options.body);
		}

		const res = await fetch(newUrl, options);
		throwIfErr(res);
		const data = await res.json();
		return data;
	}
}

/**
 * Check if a given response is not OK, and if so throw a
 * detailed exception.
 */
async function throwIfErr(response: Response) {
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

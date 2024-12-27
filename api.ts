export const baseUrl = `http://10.0.0.167/xled/v1`;
export const paths = {
  ECHO: '/echo',
  LOGIN: `/login`,
  VERIFY: '/verify',  
  GET_DEVICE_DETAILS: `/gestalt`,
  GET_DEVICE_NAME: '/device_name',
  GET_LED_CONFIG: `/led/config`,
  GET_LED_EFFECTS: `/led/effects`,
  GET_LED_OPERATION_MODE: `/led/mode`,
  GET_LED_BRIGHTNESS: `/led/out/brightness`,
  GET_LAYOUT: '/led/layout/full',
  GET_CURRENT_LED_EFFECT: '/led/effects/current',
  GET_NETWORK_STATUS: '/network/status',
  SET_NETWORK_STATUS: '/network/status',
  SET_LED_COLOR: '/led/color',
  SET_LED_OPERATION_MODE: '/led/mode',
  SET_DEVICE_NAME: '/device_name',
  GET_MOVIES: '/movies',
  GET_CURRENT_MOVIE: '/led/movies/current',
  GET_SUMMARY: '/summary',
}

const TypedKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

for (const key of TypedKeys(paths)) {
  paths[key] = `${baseUrl}${paths[key]}`;
}

interface TokenData {
  authentication_token: string;
}


let tokenData: TokenData;

export async function getLEDConfig() {
  return await request(paths.GET_LED_CONFIG);
}

export async function getSummary() {
  return await request(paths.GET_SUMMARY);
}

export async function getCurrentMovie() {
  return await request(paths.GET_CURRENT_MOVIE);
}

export async function getMovies() {
  return await request(paths.GET_MOVIES);
}

export async function echo(body: unknown) {
  return await request(paths.ECHO, {
    method: 'POST',
    body,
  });
}

export async function getDeviceName() {
  return await request(paths.GET_DEVICE_NAME);
}

export async function setDeviceName(name: string) {
  return await request(paths.SET_DEVICE_NAME, {
    method: 'POST',
    body: {
      name,
    }
  })
}

export async function getDeviceDetails() {
  return await request(paths.GET_DEVICE_DETAILS);
}

export async function getLEDEffects() {
  return await request(paths.GET_LED_EFFECTS);
}

export async function getLEDOperationMode() {
  return await request(paths.GET_LED_OPERATION_MODE);
}

export async function getLEDBrightness() {
  return await request(paths.GET_LED_BRIGHTNESS);
}

export async function getLayout() {
  return await request(paths.GET_LAYOUT);
}

export async function getCurrentLEDEffect() {
  return await request(paths.GET_CURRENT_LED_EFFECT);
}

export async function setLEDColor(red: number, green: number, blue: number) {
  return await request(paths.SET_LED_COLOR, {
    method: 'POST',
    body: {
      red,
      green,
      blue,
    }
  });
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
export async function setLEDOperationMode(mode: string) {
  return await request(paths.SET_LED_OPERATION_MODE, {
    method: 'POST',
    body: {
      mode,
    }
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
    body: JSON.stringify({challenge}),
  });
  throwIfErr(res);
  const data = await res.json();
  return data;
}

function throwIfErr(res: Response) {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
}

/**
 * Make a request to the API automatically injecting the token if needed
 * @param {*} url 
 * @param {*} options 
 * @returns The data from the successful request
 */
async function request(url: string, options: any = {}) {
  if (!tokenData) {
    tokenData = await getTokenData();
    await request(paths.VERIFY, { method: 'POST' });
  }

  options = options ?? {};
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

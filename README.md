# twinklyjs

This is an unofficial TypeScript implementation for [Twinkly Lights](https://twinkly.com/).  Everything here is based on the excellent work at <https://xled-docs.readthedocs.io/en/latest/>.  

## CLI usage

With [Node.js](https://nodejs.org/en) installed, you can globally install `@twinklyjs/twinkly` and use it as a command line tool:

```sh
npm install -g @twinklyjs/twinkly
```

To discover twinkly devices running on your network, try out:

```sh
twinkly discover
```

Set the IP of your device once so all future commands use that IP:

```sh
twinkly config setip <IP>
```

Use `twinkly --help` to learn more:

```sh
Usage: twinkly [options] [command]

CLI tool for managing Twinkly smart lights

Options:
  -V, --version                                   output the version number
  -h, --help                                      display help for command

Commands:
  discover [options]                              Discover Twinkly devices on the network.
  config <action> [value]                         Manage configuration settings
  get-movie [options]                             Get the current movie
  get-movies [options]                            Get movies installed.
  set-movie [options] <id>                        Set LED color in RGB
  set-color [options] <red> <green> <blue>        Set LED color in RGB
  set-op-mode [options] <mode>                    Set the LED operation mode
  set-brightness [options] <mode> <type> <value>  Send http request for changing brightness.
  get-brightness [options]                        Get the brightness of the device.
  get-op-mode [options]                           Get the current LED operation mode of the device.
  get-color [options]                             Get the color of the device.
  get-details [options]                           Get the details of the device.
  get-device-name [options]                       Get the name of the device.
  set-device-name [options] <name>                Set the name of the device.
  get-timer [options]                             Get the timer set for the device.
  set-timer [options] <TimeOn> <TimeOff>          Send http request for setting timer.
  help [command]                                  display help for command
```

## API Usage

twinklyjs is also available as a library. Most operations are available on the `api` object, which supports basic HTTP calls.  Authentication is automatically handled.

```js
import {TwinklyClient} from '@twinklyjs/twinkly';

const client = new TwinklyClient({ip: '10.0.0.187'});
const details = await client.getDeviceDetails();
console.log(details);

await client.setLEDOperationMode({mode: 'color'});
await client.setLEDColor({r: 0, g: 255, b: 0});
const data = await client.getLEDOperationMode();
console.log(data);
```

### Discovery

Twinkly supports device discovery via UDP broadcasting. This is available in a slightly easier to use form:

```js
import {discover} from '@twinklyjs/twinkly';

const devices = await discover();
console.log(devices);
```

### Browser usage

This module is usable from the browser, with the exception of the following APIs which require UDP:

- Discovery
- Realtime

The HTTP server in twinkly devices do not provide CORS headers, so you will need to proxy requests through a backend.

## Examples

There are a few examples of API usage available in `/examples`.

| Example | Description |
|--|---|
| [realtime](./examples/realtime.js) | Use the realtime UPD API to send light frames |
|-|-|

## Contributing

This module currently only implements a subset of the available API.  We love contributions!  Feel free to open a PR, and reference the underlying part of the API you're trying to support.  See [CONTRIBUTING](CONTRIBUTING.md) to learn more.

Want to join in on the discussion?
visit our discord: <https://discord.gg/AtA98tr2ab>

## License

[MIT](LICENSE.md)

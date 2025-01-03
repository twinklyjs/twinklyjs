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
  -V, --version                            output the version number
  -h, --help                               display help for command

Commands:
  discover                                 Discover Twinkly devices on the network
  getmovie [options]                       Get the current movie
  getmovies [options]                      Get movies installed.
  setmovie [options] <id>                  Set LED color in RGB
  setcolor [options] <red> <green> <blue>  Set LED color in RGB
  setopmode [options] <mode>               Set the LED operation mode
  config <action> [value]                  Manage configuration settings
  help [command]                           display help for command
```

## API Usage

twinklyjs is also available as a library. Most operations are available on the `api` object, which supports basic HTTP calls.  Authentication is automatically handled.

```js
import {api} from '@twinklyjs/twinkly';

api.init('10.0.0.187');
const details = await api.getDeviceDetails();
console.log(details);

await api.setLEDOperationMode({mode: 'color'});
await api.setLEDColor({r: 0, g: 255, b: 0});
const data = await api.getLEDOperationMode();
console.log(data);
```

### Discovery

Twinkly supports device discovery via UDP broadcasting. This is available in a slightly easier to use form:

```js
import {discovery} from '@twinklyjs/twinkly';

const devices = await discovery.discover();
console.log(devices);
```

## Examples

There are a few examples of API usage available in `/examples`.

| Example | Description |
|--|---|
| [realtime](./examples/realtime.js) | Use the realtime UPD API to send light frames |
|-|-|

## Contributing

This module currently only implements a subset of the available API.  We love contributions!  Feel free to open a PR, and reference the underlying part of the API you're trying to support.  See [CONTRIBUTING](CONTRIBUTING.md) to learn more.

## License

[MIT](LICENSE.md)

# twinklyjs

This is an unofficial (and incomplete!) JavaScript implementation for [Twinkly Lights](https://twinkly.com/).  Everything here is based on the excellent work at https://xled-docs.readthedocs.io/en/latest/.  

## Basic usage

```js
import * as api from './api.js';

api.init('10.0.0.187');
const details = await api.getDeviceDetails();
console.log(details);

await api.setLEDOperationMode('color');
await api.setLEDColor(0, 255, 0);
const data = await api.getLEDOperationMode();
console.log(data);
```

### Discovery

```js
import {discover} from './discovery.js';

const devices = await discover();
console.log(devices);
```

## Contributing

This module currently only implements a subset of the available API.  I love contributions!  Feel free to open a PR, and reference the underlying part of the API you're trying to support.

### CLI usage

```
twinkly --ip <ip of twinkly> <command> <Parameters>

Config usage:
twinkly config  <set/get>ip <ip>

Positionals

config:
setip - Set the Default ip in config file.
getip - Get the currently set ip in config file.

Flags

--ip - followed by the ip used in the current instance (If ip not set in config, required for all commands aside from config and discover)

```

## License

[MIT](LICENSE.md)

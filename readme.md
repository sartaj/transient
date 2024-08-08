## Contributing

### Environment Setup

There is none. This is a pure web project with no bundler, package management, etc. To start, use your favorite web server, or try `npx http-server`.

### Release Management

- Update `module-config.json` with new cache name, and update any files moved around.

### Editable Files

One goal of this project is to be an easy template for other projects.

- **modules/** - Where main code lies.
- **module-config.json** - Naming convention to have configurations for different modules.
- **entry.js** - File that defines/starts the code.
- **app.webmanifest** - [Manifest definition](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- **icons** - App Icons

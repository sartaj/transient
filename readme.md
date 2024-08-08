## Contributing

### Environment Setup

There is none. Part of my goal here is to see how far I can push a pure web project with no bundler, package management, etc. To start, use your favorite web server, or try `npx http-server`.

### Release Management

- Update `service-worker.js` with new cache name, and update any files moved around.

### Editable Files

One goal of this project is to be an easy template for other projects.

- **modules/** - Where main code lies.
- **entry.js** - File that defines/starts the code.
- **style.css** - Global theming variables.
- **service-worker.js top of file** - Given the issues with importing on service-workers, currently have to manually update files in there.
- **app.webmanifest** - [Manifest definition](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- **icons** - App Icons

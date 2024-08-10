# Transient - Secure Notes

## Features

- Write notes that will automatically disappear after a few days. Great for temporary todo lists.
- App fully works offline, & notes are saved locally to your device. 
- (Coming Soon) Notes will be encrypted via passkey (i.e. biometrics).

## The Tech

This is a pure web project with no bundler, package management, etc. Part of the goal of this project is to see how much can be made with just the browser, meaning this project should have a very long shelf life.

- Notes are saved in Local Storage
- PWA Service Worker Used to work offline

## Contributing

### Environment Setup

There is none. To start, use your favorite web server, or try `npx http-server`.

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

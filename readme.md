## Transient - The Disappearing Notes App

Useful for things like grocery lists, daily todos, quick notes, etc.

### Features

- **💣 Self Destruct Note** Note will automatically delete in a few days.
- **📲 Installable:** Can install as an app on mobile and desktop devices.
- **😶‍🌫️ Fully private:** Works only offline and saves data on device.

## Tech - Bundle-less, Package management-less, Web Native Architecture

- **Will Always Just Work:** Project should be able to run for years to come without needing to deal with upgrades cycles or [dependecy hell](https://en.wikipedia.org/wiki/Dependency_hell).
- **No Config Setup:** Setup is nearly plug and play. Just download the repo, and open `index.html` in a web browser.
- **Learn Standards, Not Frameworks:** By being based on Web Standards, almost everything coded or learned within this project is standards based, meaning knowledge can last a long time (and not just based on a trend).
- **Web Pages Can Compete With Native Apps:** A webpage can do app-like experiences, including [Passkeys](https://github.com/w3c/webauthn/wiki/Explainer:-PRF-extension), [Offline](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers), [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API), and [way more](https://whatpwacando.today).

## Contributing

### Environment Setup

There is none. Part of my goal here is to see how far I can push a pure web project with no bundler, package management, etc.

To start, use your favorite web server, or try:

```
npx http-server
```

### Release Management

- Update `service-worker.js` with new cache name, and update any files moved around.
- Verify type cheecking passes if possible (see below).
- Push to `gh-pages` as it's main branch, which is [a way to publish a static site to Github Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

### Typechecking

Bottom line is I wanted type checking even though it's not technically a web standard, but coding without some type checker is a non starter for me.

Types with their docs are written in `.d.ts` manually next to the JS files, or within the JS Doc comments directly. This isn't too hard if you are already familiar with TypeScript. To verify types, you can do the following:

```
npm i -g typescript
npx tsc --allowJs --checkJs --noEmit --target esnext --module esnext --strict entry.js
```

### Editable Files

One goal of this project is to be an easy template for other projects.

- **modules/** - Where main code lies.
- **entry.js** - File that defines/starts the code.
- **style.css** - Global theming variables.
- **service-worker.js top of file** - Given the issues with importing on service-workers, currently have to manually update files in there.
- **app.webmanifest** - [Manifest definition](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- **icons** - App Icons

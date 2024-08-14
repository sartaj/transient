## Transient - The Disappearing Notes App

Useful for things like grocery lists, daily todos, quick notes, etc.

### Features

- **💣 Self Destruct Note** Note will automatically delete in a few days.
- **📲 Installable:** Can install as an app on mobile and desktop devices.
- **😶‍🌫️ Fully private:** Works only offline and saves data on device.

## Tech - Bundle-less, Package management-less, Web Standards Architecture

Part of my goal here is to see how far I can push a pure web project to have great features with no server, bundler, package management, etc.

- **Will Always Just Work:** Project should be able to run for years to come without needing to deal with upgrades cycles or [dependecy hell](https://en.wikipedia.org/wiki/Dependency_hell).
- **No Config Setup:** Setup is nearly plug and play. Just download the repo, and open `index.html` in a web browser.
- **Learn Standards, Not Frameworks:** By being based on Web Standards, almost everything coded or learned within this project is standards based, meaning knowledge can last a long time (and not just based on a trend).
- **Web Pages Can Compete With Native Apps:** A webpage can do app-like experiences, including [Passkeys](https://github.com/w3c/webauthn/wiki/Explainer:-PRF-extension), [Offline](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers), [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API), and [way more](https://whatpwacando.today).

### Some Paradigms / Design Patterns

- [Web Component Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) - For componetized architecture.
- [State-Action-Reducer Pattern](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers) - Doing unidirectional redux-like flow / [Elm Architecture](https://redux.js.org/understanding/history-and-design/prior-art#elm) for doing state management, making it easy for anyone to reason about the logic in a pure way. Web Components just listen to state and re-render. This also makes tests easier to write, as pure function tests can run in both node and the browser.
- Using `modules/*`: By having everything somewhat flat as `modules/*`, i.e. like node_modules, it makes importing much easier.

### Tradeoffs

- **No node_modules:** Not installing node_modules has the issue of having to write a lot of ceremonial code that would be easier with libraries. Silver lining is that all code that runs is within reach to see easily, which is inspired by [Golang's simplicty](https://go.dev/talks/2015/simplicity-is-complicated.slide).
- **No efficient rendering:** By being unidirectional and not having some efficient diffing as React has, we lose some optimizations here that wouldn't work in way more complex apps. This can be mitigated by using Web Component wrappers like [lit](https://lit.dev) or [ullr](https://github.com/aggre/ullr).
- **Types:** Coding without some type checker is a non starter for me, but we are able to [get types in this project without needing a bundle step](https://depth-first.com/articles/2021/10/20/types-without-typescript/).

## Contributing

### Environment Setup

There is none. To start, use your favorite web server, or try:

```
npx http-server
```

### Release Management

- Update `service-worker.js` with new cache name, and update any files moved around.
- Verify type cheecking passes if possible (see below).
- Push to `gh-pages` as it's main branch, which is [a way to publish a static site to Github Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

### Typechecking

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

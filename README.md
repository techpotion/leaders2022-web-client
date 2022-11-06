<img src="src/assets/illustrations/contest-logo.svg" height="80" alt="">

# Housing and communal services application monitoring

Application status monitoring service in the field of housing and communal
services.

Web-client for __TechPotion__'s solution for the _Digital Transformation
Leaders 2022_ contest.

## Build & run

### Dependencies & environment

First of all install dependencies:

```sh
npm install
```

Set up following environment variables in files
`src/environments/environment.ts` and `src/environments/environment.prod.ts`:
- `api.origin`;
- `map.token`;
- `map.style`;

### Development

For development purposes run

```sh
npm start
```

Browser will automatically open and navigate to `http://localhost:4200/`. The
app will automatically reload if you change any of the source files.

### Production

For production docker image can be build with

```sh
docker build -t hcsam-web .
```


Run it inside a container with

```sh
docker run -d -p <port>:80 --name hcsam-web-container hcsam-web
```

It will run application on `0.0.0.0:<port>` (where `<port>` is an OS port).

## Development tips

This project was generated with [Angular
CLI](https://github.com/angular/angular-cli) version 14.

All Angular instances are scaffoled without tests (`.spec.ts` files). To
generate with tests add `--skip-tests=false`.

All Angular components are generated with `OnPush` change detection strategy.

### Building

To build the project run

```sh
npm run build
```

The build artifacts will be stored in the `dist/` directory.


### Linting

To lint Typescript and HTML template files run

```sh
npm run lint
```

In case of linting SCSS files run

```sh
npm run lint:styles
```

// Export the server module directly as the default export for Angular SSR.
// Using `renderModule` returns a Promise<string>` which results in an
// undefined `ApplicationRef` during the bootstrap phase, causing runtime
// errors like `Cannot read properties of undefined (reading 'get')`.
// Angular expects the default export to be the `AppServerModule` itself so
// that it can bootstrap the module and access the injector correctly.

export { AppServerModule as default } from './app/app.server.module';

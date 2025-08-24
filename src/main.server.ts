import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './app/app.server.module';

const bootstrap = () =>
  renderModule(AppServerModule, { document: '<app-root></app-root>', url: '/' });

export default bootstrap;

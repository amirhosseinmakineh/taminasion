import { platformDynamicServer } from '@angular/platform-server';
import { AppModule } from './app/app.module';

const bootstrap = () => platformDynamicServer().bootstrapModule(AppModule);

export default bootstrap;

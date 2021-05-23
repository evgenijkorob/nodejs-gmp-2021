import { AppControllers, loadControllers } from './controller';
import { AppModels, loadModels } from './models';
import { configureServer } from './server';

const appLoaderLog = console.log.bind(console, '[APP LOADER LOG] ');
const appLoaderError = console.error.bind(console, '[APP LOADER ERROR] ');

export async function startupApplication(): Promise<void> {
  try {
    const models: AppModels = await loadModels();
    const controllers: AppControllers = loadControllers(models);

    configureServer(controllers);
    appLoaderLog('App started successfully');
  } catch (err) {
    appLoaderError('Cannot start app\n', err.original || err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}

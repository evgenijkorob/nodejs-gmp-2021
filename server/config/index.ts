import { Options as SequelizeOptions } from 'sequelize';
import path from 'path';

process.env['NODE_CONFIG_DIR'] = path.join(__dirname);

import config from 'config';

export interface ServerConfig {
  port: number;
}

export const dbConfig: SequelizeOptions = config.get('dbConfig');

export const serverConfig: ServerConfig = config.get('serverConfig');

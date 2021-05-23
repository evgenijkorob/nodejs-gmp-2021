import { Options as SequelizeOptions } from 'sequelize';

export const dbConfig: SequelizeOptions = {
  database: 'gmp_karabeinikau',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '11235813pstgrsql',
  dialect: 'postgres'
};

export const serverConfig = {
  port: 5000
};

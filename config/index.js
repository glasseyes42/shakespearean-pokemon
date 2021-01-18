import { resolve } from 'path';
import { promises as fs } from 'fs';
import _ from 'lodash';
import logger from '../src/lib/logger.js';

const env = process.env.NODE_ENV || 'local';
const defaultPath = resolve(process.cwd(), 'config', 'default.json');
const path = resolve(process.cwd(), 'config', `${env}.json`);

export default async () => {
  let defaultConfig = {};
  let envConfig = {};

  try {
    defaultConfig = JSON.parse(await fs.readFile(defaultPath));
  } catch (e) {
    logger.warn('Failed to load default configuration.');
  }

  try {
    envConfig = JSON.parse(await fs.readFile(path));
  } catch (e) {
    logger.warn(`Failed to load configuration for env [${env}].`);
  }

  return _.defaults({}, envConfig, defaultConfig);
};

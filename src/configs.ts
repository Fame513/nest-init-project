export const IS_PROD = false;
export const JWT_SECRET = process.env.JWT_SECRET;

const ORM_CONFIG = require('../ormconfig.json');
export const ORM_CONFIG_MEMORY = ORM_CONFIG.MEMORY_DB;
export const ORM_CONFIG_AWS_PROD = ORM_CONFIG.AWS_PROD_DB;

export const LOGGER_PROJECT_ID = IS_PROD ? '' : '';
export const LOGGER_KEY_FILENAME = IS_PROD ? '' : '';

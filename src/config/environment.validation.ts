import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),
  DB_PORT: Joi.number().port().default(5432),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_SYNC: Joi.string(),
  DB_AUTOLOAD: Joi.string(),
  PROFILE_API_KEY: Joi.string().required(),
});
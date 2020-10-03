require('dotenv').config();
const Joi = require('joi');

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: Joi.number()
      .default(4000),
    MONGOOSE_DEBUG: Joi.boolean()
      .when('NODE_ENV', {
        is: Joi.string().equal('development'),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false)
      }),
    JWT_SECRET: Joi.string().required()
      .description('JWT Secret required to sign'),
    MONGO_HOST: Joi.string().required()
      .description('Mongo DB host url'),
    MONGO_PORT: Joi.number()
      .default(27017)
  }).unknown()
    .required();
  
  const { error, value: envVars } = envVarsSchema.validate(process.env);
  console.log('envVars', envVars);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    jwtSecret: envVars.JWT_SECRET,
    mongo: {
      host: envVars.MONGO_HOST,
      port: envVars.MONGO_PORT
    }
  };

  module.exports = config;
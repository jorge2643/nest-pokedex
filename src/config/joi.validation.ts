
import { prototype } from 'events';
import * as Joi from 'joi';

//Esquema para variables de entorno

export const JoiValidationSchema = Joi.object({

    MONGODB: Joi.required(),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(6),

})
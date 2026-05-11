const Joi = require("joi");

const playerSchema = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required(),
    batting: Joi.string().required(),
    bowling: Joi.string().required(),
});

module.exports = playerSchema;
const Ajv = require('ajv');
const ajv = new Ajv();

const categorySchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        length: { type: 'string', enum: ['short', 'medium', 'long'] },
        faceshape: { type: 'string', enum: ['oval', 'square', 'round'] }
    },
    required: ['name', 'length', 'faceshape'],
    additionalProperties: false
};

const validateCategory = ajv.compile(categorySchema);

module.exports = validateCategory; 
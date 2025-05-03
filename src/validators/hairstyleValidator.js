const Ajv = require('ajv');
const ajv = new Ajv();

const hairstyleSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        lengthCategoryId: { type: 'string' },
        faceshapeCategoryId: { type: 'string' },
        note: { type: 'string' }
    },
    required: ['name', 'lengthCategoryId', 'faceshapeCategoryId'],
    additionalProperties: false
};

const validateHairstyle = ajv.compile(hairstyleSchema);

module.exports = validateHairstyle; 
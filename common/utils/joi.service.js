const Joi = require('joi').extend(require('@joi/date'));

const joiValidation = (data, schema) => {
  return schema.validate(data);
};

const usersSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .message('El nombre debe tener al menos 3 caracteres')
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .message('Ingrese una dirección de correo electrónico válida')
    .required(),
  phone: Joi.string().min(10).message('Número de teléfono inválido').required(),
  password: Joi.string()
    .min(8)
    .message('La contraseña debe tener al menos 8 caracteres')
    .required(),
  document: Joi.string()
    .min(8)
    .message('El documento debe tener al menos 8 caracteres')
    .required(),
  role: Joi.string().valid('Administrador', 'Operador').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(8).required(),
});

const vehicleTypeSchema = Joi.array().items({
  brand: Joi.string().required().messages({
    'string.required': 'La marca es requerida',
  }),
  model: Joi.array().items(Joi.string()).required().messages({
    'array.required': 'El modelo es requerido',
    'array.base': 'El modelo debe ser un array',
  }),
  yearInit: Joi.number().integer().allow(null),
  yearFinish: Joi.number().integer().allow(null),
  typeName: Joi.string()
    .valid('Espectacular', 'Pickup/Camioneta', 'Economico')
    .required()
    .messages({
      'string.valid':
        'El tipo de vehículo debe ser "Espectacular", "Pickup/Camioneta" o "Economico"',
      'string.required': 'El tipo de vehículo es requerido',
    }),
  deletedAt: Joi.date().allow(null).messages({
    'date.base': 'La fecha de eliminación debe ser una fecha válida',
  }),
});

const vehicleSchema = Joi.object({
  brand: Joi.string()
    .required()
    .min(3)
    .message('Brand must be at least 3 characters long.'),
  model: Joi.string()
    .required()
    .min(2)
    .message('Model must be at least 2 characters long.'),
  year: Joi.number()
    .integer()
    .min(1900, 'Year must be greater than or equal to 1900.')
    .max(new Date().getFullYear(), 'Year cannot be in the future.')
    .required('Year is required.'),
  color: Joi.string()
    .min(3)
    .message('Color must be at least 3 characters long.'),
  licensePlate: Joi.string()
    .min(3)
    .message('License plate is required.')
    .required(),
  userId: Joi.string().alphanum().required('User ID is required.'),
});

module.exports = {
  joiValidation,
  usersSchema,
  loginSchema,
  vehicleTypeSchema,
  vehicleSchema,
};

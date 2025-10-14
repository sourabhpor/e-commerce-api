import Joi from "joi";

const createProductValidation = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().optional(),
  stock: Joi.number().required(),
});

const updateProductValidation = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  description: Joi.string().optional(),
  stock: Joi.number().optional(),
});

export default { createProductValidation, updateProductValidation };

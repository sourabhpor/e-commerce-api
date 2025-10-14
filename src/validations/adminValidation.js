import Joi from "joi";

export const updateOrderStatusValidation = Joi.object({
  status: Joi.string().valid("SHIPPED", "DELIVERED").required(),
});

export default {
  updateOrderStatusValidation,
};

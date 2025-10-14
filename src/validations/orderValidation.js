import Joi from "joi";

const checkoutSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .required(),
  totalAmount: Joi.number().required(),
});

const paymentSchema = Joi.object({
  id: Joi.string().optional(),
});
export default { checkoutSchema, paymentSchema };

import Joi from 'joi';

export const createCouponSchema = Joi.object({
  business_id: Joi.string().trim().required().label('Business ID'),

  code: Joi.string().trim().required().label('Coupon Code'),

  type: Joi.string().valid('PERCENTAGE', 'FIXED').required().label('Type'),

  value: Joi.number().positive().required().label('Value'),

  start_date: Joi.date().iso().required().label('Start Date'),

  end_date: Joi.date()
    .iso()
    .greater(Joi.ref('start_date'))
    .required()
    .label('End Date'),

  usage_limit: Joi.number().integer().min(1).required().label('Usage Limit'),

  user_limit: Joi.number().integer().min(1).required().label('User Limit'),

  min_purchase: Joi.number().min(0).required().label('Minimum Purchase'),
});

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export interface CreateCouponProps {
  business_id: string;
  code: string;
  type: CouponType | null;
  value: number | null;
  start_date: string; // ISO 8601 format
  end_date: string; // ISO 8601 format
  usage_limit: number | null;
  user_limit: number | null;
  min_purchase: number | null;
}

export interface UpdateCouponProps extends Partial<CreateCouponProps> {}

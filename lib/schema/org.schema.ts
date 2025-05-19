import Joi from 'joi';

export const CreateBusinessProfileSchema = Joi.object({
  business_name: Joi.string().min(2).max(100).required(),
  business_size: Joi.string().valid('small', 'medium', 'large').required(),
  industry: Joi.string().min(2).max(100).required(),
  logo_url: Joi.string().uri().required(),
  location: Joi.string().min(5).max(200).required(),
});
export interface CreateBusinessProfileProps {
  business_name: string;
  business_size: string;
  industry: string;
  logo_url: string;
  location: string;
}

export const SaveBankAccountSchema = Joi.object({
  business_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),

  account_number: Joi.string()
    .pattern(/^\d{10}$/) // Assuming Nigerian 10-digit account numbers
    .required(),

  account_type: Joi.string()
    .valid('Savings Bank', 'Current', 'Fixed Deposit', 'Checking', 'Other') // extend as needed
    .required(),

  bank_name: Joi.string().min(2).max(100).required(),

  bank_code: Joi.string()
    .pattern(/^\d{3}$/) // assuming 3-digit bank codes in Nigeria
    .required(),
});
export interface SaveBankAccountProps {
  business_id: string;
  account_number: string;
  account_type: string;
  bank_name: string;
  bank_code: string;
}

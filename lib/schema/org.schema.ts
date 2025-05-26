import Joi from 'joi';

export const createBusinessProfileSchema = Joi.object({
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

export const saveBankAccountSchema = Joi.object({
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

export const inviteContactSchema = Joi.object({
  business_id: Joi.string().required(),
  email: Joi.string().required(),
});
export interface InviteContactProps {
  business_id: string;
  email: string;
}

export const acceptInviteSchema = Joi.object({
  name: Joi.string()
    .min(2) // Minimum 2 characters
    .max(100) // Maximum 100 characters
    .optional(),
  token: Joi.string() // Validates UUID v4 format
    .required(),
  password: Joi.string().min(8).optional(),
});
export interface AcceptInviteProps {
  name: string;
  token: string;
  password: string;
}

export const resolveAccountFormSchema = Joi.object({
  account_number: Joi.string().min(11).max(11).required(),
  bank_code: Joi.string().required(),
});
export interface ResolveAccountProps {
  account_number: string;
  bank_code: string;
}

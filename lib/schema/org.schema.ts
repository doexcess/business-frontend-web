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

export const InviteContactSchema = Joi.object({
  business_id: Joi.string()
    .guid({ version: ['uuidv4'] }) // Validates UUID v4 format
    .required()
    .messages({
      'string.guid': '{{#label}} must be a valid UUID',
      'any.required': '{{#label}} is required',
    }),

  email: Joi.string()
    .email() // Validates email format
    .required()
    .messages({
      'string.email': '{{#label}} must be a valid email',
      'any.required': '{{#label}} is required',
    }),
});
export interface InviteContactProps {
  business_id: string;
  email: string;
}

export const AcceptInviteSchema = Joi.object({
  name: Joi.string()
    .min(2) // Minimum 2 characters
    .max(100) // Maximum 100 characters
    .required()
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
      'any.required': 'Name is required',
    }),

  token: Joi.string()
    .guid({ version: ['uuidv4'] }) // Validates UUID v4 format
    .required()
    .messages({
      'string.guid': 'Token must be a valid UUID',
      'any.required': 'Token is required',
    }),

  password: Joi.string()
    .min(8) // Minimum 8 characters
    .max(30) // Maximum 30 characters
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // Requires 1 lowercase, 1 uppercase, 1 number, 1 special char
    )
    .required()
    .messages({
      'string.min': 'Password must be at least {#limit} characters',
      'string.max': 'Password cannot exceed {#limit} characters',
      'string.pattern.base':
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      'any.required': 'Password is required',
    }),
});
export interface AcceptInviteProps {
  name: string;
  token: string;
  password: string;
}

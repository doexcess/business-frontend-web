import Joi from 'joi';
import { Gender } from '../utils';

type InferType<T> = T extends Joi.ObjectSchema ? Joi.Schema<T> : never;

export const RegisterFormSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(8).required(),
  allowOtp: Joi.boolean().optional(),
});

export const VerifyEmailFormSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().required(),
});

export const LoginFormSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const VerifyLoginFormSchema = Joi.object({
  email: Joi.string().required(),
  otp: Joi.string().min(6).max(6).required(),
});

export const UserProfileSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty',
  }),
  profile_picture: Joi.string().uri().optional().messages({
    'string.uri': 'Profile picture must be a valid URL',
    'string.empty': 'Profile picture cannot be empty',
  }),
  address: Joi.string().optional().messages({
    'string.empty': 'Address cannot be empty',
  }),
  bio: Joi.string().optional().messages({
    'string.empty': 'Bio cannot be empty',
  }),
  date_of_birth: Joi.date().iso().less('now').optional().messages({
    'date.base': 'Date of birth must be a valid date',
    'date.format': 'Date of birth must be in YYYY-MM-DD format',
    'date.less': 'Date of birth must be in the past',
  }),
  gender: Joi.string()
    .valid(Object.values(Gender).join(', '))
    .optional()
    .messages({
      'string.empty': 'Gender cannot be empty',
      'any.only': 'Gender must be ' + Object.values(Gender).join(', '),
    }),
});
export interface UserProfileProps {
  name?: string;
  profile_picture?: string;
  address?: string;
  bio?: string;
  date_of_birth?: Date | string | null;
  gender?: Gender | null;
}

export const UpdatePasswordSchema = Joi.object({
  current_password: Joi.string().required().label('Current Password'),
  new_password: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d).+$'))
    .required()
    .label('New Password')
    .messages({
      'string.pattern.base':
        'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
  confirm_password: Joi.string()
    .valid(Joi.ref('new_password'))
    .required()
    .label('Confirm Password')
    .messages({
      'any.only': 'Confirm Password must match New Password',
    }),
});
export interface UpdatePasswordProps {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
export interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  allowOtp: boolean;
}
export interface VerifyEmailFormProps {
  token: string;
  email: string;
}

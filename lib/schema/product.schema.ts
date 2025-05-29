import Joi from 'joi';
import { EventType, ProductStatus, TicketTierStatus } from '../utils';
import { TicketPurchase } from '@/types/product';

export const CreateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),

  description: Joi.string().trim().min(10).required(),

  keywords: Joi.string().trim().optional(),

  metadata: Joi.object({
    level: Joi.string()
      .valid('Beginner', 'Intermediate', 'Advanced')
      .required(),
    tags: Joi.array().items(Joi.string().trim()).min(1).required(),
  }).optional(),

  multimedia_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),

  price: Joi.number().min(0).required(),

  category_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
});
export interface CreateCourseProps {
  title: string;
  description: string;
  keywords?: string;
  metadata?: string;
  multimedia_id: string;
  price: number | null;
  category_id: string;
}

export const UpdateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  price: Joi.number().min(0).required(),
  description: Joi.string().min(10).optional(),
  keywords: Joi.string().allow(null, '').optional(),
  metadata: Joi.object().unknown(true).allow(null).optional(), // if metadata is a JSON object
  category_id: Joi.string().uuid().optional(),
  multimedia_id: Joi.string().uuid().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
});
export interface UpdateCourseProps {
  title?: string;
  price?: number | null;
  description?: string;
  keywords?: string;
  metadata?: string;
  category_id?: string;
  multimedia_id?: string;
  status?: string;
}

export const createModuleContentSchema = Joi.object({
  title: Joi.string().trim().required(),
  position: Joi.number().integer().required(),
  multimedia_id: Joi.string().guid({ version: 'uuidv4' }).required(),
});
export const createModuleWithContentsSchema = Joi.object({
  title: Joi.string().trim().required(),
  position: Joi.number().integer().required(),
  course_id: Joi.string().guid({ version: 'uuidv4' }).required(),
  contents: Joi.array().items(createModuleContentSchema).min(1).required(),
});
export const createMultipleModulesSchema = Joi.object({
  modules: Joi.array().items(createModuleWithContentsSchema).min(1).required(),
});
export interface CreateModulesProps {
  modules: {
    title: string;
    position: number;
    course_id: string;
    contents: { title: string; position: number; multimedia_id: string }[];
  }[];
}

export const updateModuleContentSchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().required(),
  multimedia_id: Joi.string().uuid().required(),
  position: Joi.number().integer().min(1).required(),
});
export const updateModuleSchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().required(),
  position: Joi.number().integer().min(1).required(),
  contents: Joi.array().items(updateModuleContentSchema).required(),
});
export const updateModulesSchema = Joi.object({
  modules: Joi.array().items(updateModuleSchema).required(),
});
export interface UpdateModulesProps {
  modules: {
    id: string;
    title: string;
    position: number;
    course_id: string;
    contents: {
      id: string;
      title: string;
      position: number;
      multimedia_id: string;
    }[];
  }[];
}

// Ticket - Create
export const createTicketTierSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().required(),
  original_amount: Joi.number().required(),
  description: Joi.string().optional(),
  quantity: Joi.number().optional(),
  remaining_quantity: Joi.number().optional(),
  max_per_purchase: Joi.number().optional(),
  default_view: Joi.boolean().optional(),
  status: Joi.string()
    .valid(...Object.values(TicketTierStatus))
    .optional(),
});
export const createTicketSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  keywords: Joi.string().optional(),
  metadata: Joi.any().optional(),
  category_id: Joi.string().uuid().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .uppercase()
    .optional(),
  multimedia_id: Joi.string().uuid().required(),
  event_time: Joi.string().required(),
  event_start_date: Joi.date().required(),
  event_end_date: Joi.date().required(),
  event_location: Joi.string().required(),
  event_type: Joi.string()
    .valid(...Object.values(EventType))
    .uppercase()
    .required(),
  auth_details: Joi.string().optional(),
  ticket_tiers: Joi.array().items(createTicketTierSchema).required(),
});
export interface TicketTierProps {
  id?: string;
  name: string;
  amount: number | null;
  original_amount: number | null;
  description?: string;
  quantity?: number;
  remaining_quantity?: number;
  max_per_purchase?: number;
  default_view?: boolean;
  status?: TicketTierStatus;
  purchased_tickets?: TicketPurchase[];
}
export interface CreateTicketProps {
  title: string;
  description?: string;
  keywords?: string;
  metadata?: any;
  category_id: string;
  status?: ProductStatus | null;
  multimedia_id: string;
  event_time: string;
  event_start_date: Date | string | null;
  event_end_date: Date | string | null;
  event_location: string;
  event_type: EventType | null;
  auth_details?: string;
  ticket_tiers: TicketTierProps[];
}

// Ticket - Update
export const updateTicketTierSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  name: Joi.string().max(255).optional(),
  description: Joi.string().optional().allow(null, ''),
  quantity: Joi.number().integer().min(0).optional(),
  remaining_quantity: Joi.number().integer().min(0).optional(),
  max_per_purchase: Joi.number().integer().min(0).optional(),
  amount: Joi.number().precision(2).min(0).optional(),
  original_amount: Joi.number().precision(2).min(0).optional(),
  status: Joi.string()
    .valid(...Object.values(TicketTierStatus))
    .optional(),
  default_view: Joi.boolean().optional(),
  deleted: Joi.boolean().optional(),
});
export const updateTicketSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  keywords: Joi.string().optional(),
  metadata: Joi.any().optional(),
  category_id: Joi.string().uuid().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .uppercase()
    .optional(),
  multimedia_id: Joi.string().uuid().optional(),
  event_time: Joi.string().optional(),
  event_start_date: Joi.date().optional(),
  event_end_date: Joi.date().optional(),
  event_location: Joi.string().optional().allow(null, ''),
  event_type: Joi.string()
    .valid(...Object.values(EventType))
    .optional(),
  auth_details: Joi.string().optional().allow(null, ''),
  ticket_tiers: Joi.array().items(updateTicketTierSchema).optional(),
});
export interface UpdateTicketProps extends Partial<CreateTicketProps> {}

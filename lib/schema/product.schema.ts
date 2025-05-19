import Joi from 'joi';
import { ProductStatus } from '../utils';

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

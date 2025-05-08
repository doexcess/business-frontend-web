import Joi from 'joi';
import { ChatReadStatus } from '../utils';

export interface RetrieveChatsProps {
  token: string;
  status?: ChatReadStatus;
}

export interface RetrieveMessagesProps {
  token: string;
  chatBuddy: string;
}

export interface SendMessageProps {
  token: string;
  chatBuddy: string;
  message?: string;
  file?: string;
}

export const retrieveChatsSchema = Joi.object<RetrieveChatsProps>({
  token: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(ChatReadStatus))
    .optional(),
});

export const retrieveMessagesSchema = Joi.object<RetrieveMessagesProps>({
  token: Joi.string().required(),
  chatBuddy: Joi.string().required(),
});

export const sendMessageSchema = Joi.object<SendMessageProps>({
  token: Joi.string().required(),
  chatBuddy: Joi.string().required(),
  message: Joi.string().min(1).max(1000).optional(),
  file: Joi.string().optional(),
});

/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';
import moment from 'moment-timezone';
import { capitalize } from 'lodash';
import crypto from 'crypto';
import { TicketTier } from '@/types/product';
import Joi from 'joi';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timezones = moment.tz.names();

export const productTypes = [
  { type: 'Courses', count: 80, color: '#f43f5e' },
  { type: 'Tickets', count: 20, color: '#2265d8' },
];

export enum EmailTemplate {
  WAITLIST = 'waitlist',
  CUSTOM = 'custom',
}

export enum NotificationKind {
  IMMEDIATE = 'immediate',
  SCHEDULED = 'scheduled',
}

export enum NOTIFICATION_STATUS {
  NONE = 'none',
  PENDING = 'pending',
  CANCELED = 'canceled',
  SCHEDULED = 'scheduled',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum BusinessState {
  'registered',
  'deleted',
}

export enum ContactStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  PAYSTACK = 'PAYSTACK',
}

export enum PurchaseItemType {
  COURSE = 'COURSE',
  TICKET = 'TICKET',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

export enum ProductType {
  COURSE = 'COURSE',
  TICKET = 'TICKET',
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export enum CartType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SOLD_OUT = 'SOLD_OUT',
}

export enum MultimediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

export enum MultimediaProvider {
  CLOUDINARY = 'CLOUDINARY',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum SubscriptionPeriod {
  FREE = 'free',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUALLY = 'semi_annually',
  YEARLY = 'yearly',
}

export enum SystemRole {
  USER = 'user',
  BUSINESS_SUPER_ADMIN = 'business-super-administrator',
  BUSINESS_ADMIN = 'business-administrator',
}

export enum BusinessOwnerOrgRole {
  USER = 'user',
  BUSINESS_ADMIN = 'business-administrator',
}

export enum SignupRole {
  CUSTOMER = 'customer',
  BUSINESS_OWNER = 'business-owner',
}

export enum ChatReadStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export enum TicketTierStatus {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
}

export enum EventType {
  ONLINE = 'ONLINE',
  PHYSICAL = 'PHYSICAL',
  HYBRID = 'HYBRID',
}

export enum ContactInviteStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export const NotificationStatusTypes = [
  { slug: 'immediate', name: 'Immediate', template: EmailTemplate.CUSTOM },
  { slug: 'scheduled', name: 'Scheduled', template: EmailTemplate.WAITLIST },
];

export const notificationTemplates = ['custom'];

export const badgeColors = [
  {
    color: 'blue',
    for: [NOTIFICATION_STATUS.PENDING, EmailTemplate.WAITLIST] as Array<string>,
  },
  {
    color: 'red',
    for: [
      NOTIFICATION_STATUS.CANCELED,
      NOTIFICATION_STATUS.FAILED,
    ] as Array<string>,
  },
  { color: 'indigo', for: [NOTIFICATION_STATUS.SCHEDULED] as Array<string> },
  { color: 'green', for: [NOTIFICATION_STATUS.DELIVERED] as Array<string> },
  { color: 'pink', for: [EmailTemplate.CUSTOM] as Array<string> },
  { color: 'purple', for: [''] as Array<string> },
];

export const maskSensitiveData = (data: string, maskChar = '*') => {
  // If data length is too short, just return it
  if (data.length <= 4) return data;

  // Get the first two and last two characters
  const firstTwo = data.slice(0, 2);
  const lastTwo = data.slice(-2);

  // Mask the middle part with the specified mask character
  const maskedSection = maskChar.repeat(data.length - 4);

  // Return the combined result
  return `${firstTwo}${maskedSection}${lastTwo}`;
};

export const emailSplit = (email: string) => {
  return email.split('@');
};

export const getColor = (status: string) => {
  const details = badgeColors?.find(
    (badge: { color: string; for: Array<string> }) =>
      badge.for.includes(status?.toLowerCase())
  );

  return details?.color;
};

export const replaceAsterisk = (network: string) => {
  return network === '*' ? 'All' : capitalize(network);
};

export const formatMoney = (amount: number, currency = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrency = (amount: string, currency = 'NGN'): string => {
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

const algorithm = 'aes-256-cbc';
const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!; // Ensure this is exactly 32 characters
const secretKey = crypto.createHash('sha256').update(secret).digest(); // Converts it to a 32-byte key
const iv = crypto.randomBytes(16); // Initialization vector

// Encrypt Function
export const encryptInput = (input: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// Check if input is an encrypted string
export const isEncrypted = (input: string) => {
  if (!input.includes(':')) return false; // Must have IV and encrypted text
  const [ivHex, encryptedText] = input.split(':');
  return ivHex.length === 32 && /^[a-f0-9]+$/.test(encryptedText); // IV should be 16 bytes (hex = 32 chars)
};

// Decrypt Function
export const decryptInput = (encryptedInput: string): string => {
  if (!isEncrypted(encryptedInput)) {
    throw new Error('Invalid encrypted input');
  }

  try {
    const [ivHex, encrypted] = encryptedInput.split(':');
    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(ivHex, 'hex')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed. Invalid encrypted input.');
  }
};

export const getLeastTicketTierPrice = (
  ticketTiers: TicketTier[]
): number | 0 => {
  if (!ticketTiers.length) return 0;

  return Math.min(...ticketTiers.map((tier) => Number(tier.amount)));
};

export const getISODateString = (date: Date) => date.toISOString().slice(0, 16);
export const oneMonthAgo = () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return oneMonthAgo;
};
export const now = new Date();

export const shortenId = (id: string) => {
  return id.split('-')[0];
};

export enum ActionKind {
  CRITICAL = 'unsuspend',
  FAVORABLE = 'favorable',
}

export enum NotificationType {
  EMAIL = 'EMAIL',
}

export const actualRole = (role: SignupRole | string): SystemRole | string => {
  let roleName = '';
  if (role === SignupRole.CUSTOMER) {
    roleName = SystemRole.USER;
  } else if (role === SignupRole.BUSINESS_OWNER) {
    roleName = SystemRole.BUSINESS_SUPER_ADMIN;
  }
  return roleName;
};

export const truncate = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const getAvatar = (picture: string | null, name: string) => {
  return picture
    ? picture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&size=32`;
};

export enum TransactionType {
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum RefundStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum RefundType {
  REFUND = 'REFUND',
  CHARGEBACK = 'CHARGEBACK',
}

export const getPurchaseTypeLabel = (type: string) => {
  switch (type) {
    case 'COURSE':
      return 'Course';
    case 'TICKET':
      return 'Event Ticket';
    case 'SUBSCRIPTION':
      return 'Subscription';
    default:
      return 'Purchase';
  }
};

export const BUSINESS_INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Hospitality',
  'Transportation',
  'Construction',
  'Media & Entertainment',
  'Professional Services',
  'Agriculture',
  'Energy',
  'Telecommunications',
  'Food & Beverage',
  'Automotive',
  'Fashion & Apparel',
  'Sports & Fitness',
  'Arts & Crafts',
  'Legal Services',
  'Consulting',
  'Marketing & Advertising',
  'Non-Profit',
  'Other',
];

export type BusinessIndustry = (typeof BUSINESS_INDUSTRIES)[number];

export const reformatText = (text: string, separator: string) => {
  return text.split(separator).join(' ');
};

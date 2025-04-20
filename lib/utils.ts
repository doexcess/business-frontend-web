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

export const allTimeFeedbacks = [
  {
    id: 1,
    feature: 'buy',
    censored: 'Fast, easy and reliable.',
    original: 'Fast, easy and reliable.',
    date: '10/20/2024',
  },
  {
    id: 2,
    feature: 'sell',
    censored:
      'Smooth buying process, consider optimizing for better price accuracy.',
    original:
      'Smooth buying process, consider optimizing for better price accuracy.',
    date: '10/20/2024',
  },
  {
    id: 3,
    feature: 'send',
    censored: 'Efficient, but can improve by adding more payout options.',
    original: 'Efficient, but can improve by adding more payout options.',
    date: '10/20/2024',
  },
  {
    id: 4,
    feature: 'receive',
    censored: 'Fast and secure, but UX can be improved for large transactions.',
    original: 'Fast and secure, but UX can be improved for large transactions.',
    date: '10/20/2024',
  },
  {
    id: 5,
    feature: 'swap',
    censored: 'Seamless, but additional notification settings would be useful.',
    original: 'Seamless, but additional notification settings would be useful.',
    date: '10/20/2024',
  },
  {
    id: 6,
    feature: 'buy',
    censored:
      'Quick and reliable, but adding more currency pairs would enhance functionality.',
    original:
      'Quick and reliable, but adding more currency pairs would enhance functionality.',
    date: '10/20/2024',
  },
  {
    id: 7,
    feature: 'sell',
    censored: 'People told me it was messy but I found out that  it was not',
    original: 'People told me it was messy but I found out that  it was not',
    date: '10/20/2024',
  },
  {
    id: 8,
    feature: 'send',
    censored: 'So seamless',
    original: 'So seamless',
    date: '10/20/2024',
  },
  {
    id: 9,
    feature: 'receive',
    censored: 'Intuitive but could benefit from clearer fee breakdowns',
    original: 'Intuitive but could benefit from clearer fee breakdowns',
    date: '10/20/2024',
  },
  {
    id: 10,
    feature: 'swap',
    censored: 'Simple process, but integrating price alerts would be helpful.',
    original: 'Simple process, but integrating price alerts would be helpful.',
    date: '10/20/2024',
  },
];

export const ratingTypes = [
  { type: 'Good', count: 2, color: '#f43f5e' },
  { type: 'Average', count: 2, color: '#2265d8' },
  { type: 'Bad', count: 3, color: '#d946ef' },
  { type: 'Very good', count: 4, color: '#22c55e' },
  { type: 'Excellent', count: 3, color: '#f87171' },
];

export const productTypes = [
  { type: 'Courses', count: 80, color: '#f43f5e' },
  { type: 'Tickets', count: 20, color: '#2265d8' },
];

export const feedbackTypes = [
  { type: 'Buy', count: 2, color: '#f43f5e' },
  { type: 'Sell', count: 2, color: '#2265d8' },
  { type: 'Send', count: 3, color: '#d946ef' },
  { type: 'Receive', count: 4, color: '#22c55e' },
  { type: 'Swap', count: 3, color: '#f87171' },
];

export const suggestions = [
  {
    id: 1,
    censored:
      "This app is fine for some ****** but it has a few ******. I had a hard time with certain features and the ****** ****** wasn't very helpful. wasn't very helpful. wasn't very helpful.",
    original:
      "This app is fine for some tasks but it has a few issues. I had a hard time with certain features and the customer support wasn't very helpful.",
    date: '2024-10-12',
  },
  {
    id: 2,
    censored:
      "The interface could use some improvements. It's a ***** ***** to navigate and could benefit from a ***** ***** design.",
    original:
      "The interface could use some improvements. It's a bit confusing to navigate and could benefit from a more intuitive design.",
    date: '2024-10-12',
  },
  {
    id: 3,
    censored:
      'Functionality is okay, but there are ***** ***** that need fixing. It’s not as ***** as I hoped.',
    original:
      'Functionality is okay, but there are some bugs that need fixing. It’s not as reliable as I hoped.',
    date: '2024-10-12',
  },
  {
    id: 4,
    censored:
      'There are some aspects of this app that ****** ******, but overall it didn’t meet my expectations. I encountered several problems.',
    original:
      'There are some aspects of this app that work well, but overall it didn’t meet my expectations. I encountered several problems.',
    date: '2024-10-12',
  },
  {
    id: 5,
    censored:
      'It’s a decent app, but not without its ******. Some features are ****** or don’t work as intended.',
    original:
      'It’s a decent app, but not without its flaws. Some features are missing or don’t work as intended.',
    date: '2024-10-12',
  },
];

export const emails = [
  {
    id: 1,
    subject: 'Welcome to Our Service',
    preheader: "We're excited to have you!",
    template: 'waitlist',
    status: 'pending',
    schedule: '2024-09-20 10:00 AM',
    body: null,
  },
  {
    id: 2,
    subject: 'Your Spot is Ready',
    preheader: 'Your spot just opened up!',
    template: 'custom',
    status: 'scheduled',
    schedule: null,
    body: '<p><b>Congratulations, you can now access our service.</b></p>',
  },
  {
    id: 3,
    subject: 'Reminder: Your Subscription is Expiring',
    preheader: 'Don’t lose access!',
    template: 'custom',
    status: 'pending',
    schedule: null,
    body: `
      <h4 style="margin-left:40px;">
        <strong>Hello</strong>
      </h4>
      <blockquote>
        <h4>
          It's a. wonderful view. No llie about it
        </h4>
      </blockquote>
    `,
  },
  {
    id: 4,
    subject: 'Special Offer Just for You',
    preheader: 'Limited-time discount',
    template: 'custom',
    status: 'delivered',
    schedule: null,
    body: '<p>Get 20% off your next purchase!</p>',
  },
  {
    id: 5,
    subject: 'Waitlist Confirmation',
    preheader: 'You’re on the list!',
    template: 'waitlist',
    status: 'delivered',
    schedule: '2024-09-25 11:00 AM',
    body: null,
  },
  {
    id: 6,
    subject: 'Event Reminder',
    preheader: 'Don’t forget the upcoming event!',
    template: 'custom',
    status: 'canceled',
    schedule: null,
    body: '<p>Join us at the event tomorrow. See details inside!</p>',
  },
  {
    id: 7,
    subject: 'New Feature Announcement',
    preheader: 'Check out what’s new!',
    template: 'custom',
    status: 'scheduled',
    schedule: null,
    body: '<p>We’ve added exciting new features to our platform.</p>',
  },
  {
    id: 8,
    subject: 'Account Verification',
    preheader: 'Please verify your email',
    template: 'custom',
    status: 'delivered',
    schedule: null,
    body: '<p>Click the link below to verify your account.</p>',
  },
  {
    id: 9,
    subject: "You're in the Waitlist Queue",
    preheader: "Hang tight, you're almost there!",
    template: 'waitlist',
    status: 'pending',
    schedule: '2024-09-30 02:00 PM',
    body: null,
  },
  {
    id: 10,
    subject: 'Your Account Has Been Updated',
    preheader: 'Changes to your account',
    template: 'custom',
    status: 'delivered',
    schedule: null,
    body: '<p>Your account details have been successfully updated.</p>',
  },
];

export const pushNotificationData = [
  {
    id: 1,
    title: '🎉 Product Launch',
    body: '🚀 We are excited to announce the launch of our new product!',
    status: 'delivered',
    network: 'ethereum',
    image_url: 'https://example.com/images/product-launch.jpg',
  },
  {
    id: 2,
    title: '📰 Weekly Newsletter',
    body: '📬 Catch up with the latest news in our weekly newsletter.',
    status: 'scheduled',
    network: 'polygon',
    image_url: 'https://example.com/images/newsletter.jpg',
  },
  {
    id: 3,
    title: '🎁 Holiday Sale',
    body: '🎄 Enjoy up to 50% off during our holiday sale event!',
    status: 'canceled',
    network: 'optimism',
    image_url: 'https://example.com/images/holiday-sale.jpg',
  },
  {
    id: 4,
    title: '🛠️ System Maintenance',
    body: '⚙️ Scheduled maintenance will occur this weekend.',
    status: 'pending',
    network: 'arbitrum',
    image_url: 'https://example.com/images/system-maintenance.jpg',
  },
  {
    id: 5,
    title: '✍️ New Blog Post',
    body: '📰 Read our latest blog post about the future of tech.',
    status: 'delivered',
    network: 'smartchain',
    image_url: 'https://example.com/images/blog-post.jpg',
  },
  {
    id: 6,
    title: '💼 Job Opening',
    body: '📢 We are hiring! Check out our current job openings.',
    status: 'canceled',
    network: 'avalanche',
    image_url: 'https://example.com/images/job-opening.jpg',
  },
  {
    id: 7,
    title: '📅 Webinar Announcement',
    body: '🎤 Join us for a live webinar on modern development practices.',
    status: 'scheduled',
    network: 'base',
    image_url: 'https://example.com/images/webinar.jpg',
  },
  {
    id: 8,
    title: '💬 Customer Testimonial',
    body: '👥 Hear what our customers are saying about us!',
    status: 'delivered',
    network: 'fantom',
    image_url: 'https://example.com/images/testimonial.jpg',
  },
  {
    id: 9,
    title: '⚡ Feature Update',
    body: "🔧 We've updated our platform with new features.",
    status: 'pending',
    network: 'optimism',
    image_url: 'https://example.com/images/feature-update.jpg',
  },
  {
    id: 10,
    title: '🎥 Event Recap',
    body: '📸 Check out the highlights from our latest event!',
    status: 'delivered',
    network: '*',
    image_url: 'https://example.com/images/event-recap.jpg',
  },
];

export const systemPushData = [
  {
    id: 1,
    title: '🎨 Creative Workshop',
    body: '🖌️ Join us for a hands-on creative workshop this weekend!',
    network: 'polygon',
  },
  {
    id: 2,
    title: '🚀 Product Update',
    body: '🌟 Our latest product update brings exciting new features.',
    network: 'ethereum',
  },
  {
    id: 3,
    title: '🍕 Team Lunch Event',
    body: '🍽️ Get together with the team for a fun lunch event this Friday.',
    network: 'base',
  },
  {
    id: 4,
    title: '🔔 Important Announcement',
    body: '📢 Stay tuned for an important announcement coming soon.',
    network: 'arbitrum',
  },
  {
    id: 5,
    title: '📊 Quarterly Report',
    body: '🗂️ Our quarterly report is now available for download.',
    network: 'optimism',
  },
  {
    id: 6,
    title: '🎮 Game Night',
    body: '🎉 Join us for an exciting game night with prizes to be won!',
    network: 'fantom',
  },
  {
    id: 7,
    title: '🏆 Award Ceremony',
    body: '🏅 Celebrate with us as we honor the top performers of the year.',
    network: 'smartchain',
  },
  {
    id: 8,
    title: '🌱 Sustainability Webinar',
    body: '🌍 Learn more about our green initiatives in this special webinar.',
    network: 'avalanche',
  },
  {
    id: 9,
    title: '🎬 Movie Night',
    body: '🍿 Enjoy a movie night with your colleagues this weekend.',
    network: 'base',
  },
  {
    id: 10,
    title: '🛍️ Flash Sale',
    body: '🔥 Hurry! Our limited-time flash sale ends soon.',
    network: '*',
  },
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

export enum EventType {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
}

export enum MultimediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
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
      badge.for.includes(status.toLowerCase())
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

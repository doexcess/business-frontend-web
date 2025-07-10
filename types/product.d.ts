import { ProductStatus, ProductType, TicketTierStatus } from '@/lib/utils';
import { Media } from './multimedia';

export interface BusinessInfo {
  id: string;
  user_id: string;
  business_name: string;
  business_size: string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Role {
  id: string;
  name: string;
  role_id: string;
  role_group_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RoleBasic {
  name: string;
  role_id: string;
}

export interface Creator {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_identity: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TicketTier {
  id: string;
  ticket_id: string;
  name: string;
  amount: string;
  original_amount: string;
  currency: string;
  description: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  purchased_tickets: TicketPurchase[]; // At most one fetch
}

export interface Ticket {
  id: string;
  event_start_date: string;
  event_end_date: string;
  event_location: string;
  event_interface: string;
  ticket_tiers: TicketTier[];
}

export enum Productinterface {
  COURSE = 'COURSE',
  TICKET = 'TICKET',
}

// export enum ProductStatus {
//   DRAFT = 'DRAFT',
//   PUBLISHED = 'PUBLISHED',
//   ARCHIVED = 'ARCHIVED',
// }

export interface ProductDetails {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string;
  keywords: string | null;
  metadata: any | null;
  status: ProductStatus;
  interface: Productinterface;
  published_at: string;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  creator: Creator;
  category: Category;
  multimedia: Multimedia;
  ticket: Ticket;
  business_id: string;
  business_info: BusinessInfo;
}

export interface ProductsResponse {
  statusCode: number;
  data: ProductDetails[];
  count: number;
}

export interface CreatorBasic {
  id: string;
  name: string;
  role: RoleBasic;
}

export interface CategoryWithCreator {
  id: string;
  name: string;
  creator_id: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  creator: CreatorBasic;
}

export interface CategoryResponse {
  statusCode: number;
  data: CategoryWithCreator[];
  count: number;
}

export interface CreateProductResponse {
  statusCode: number;
  message: string;
  data: ProductDetails;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: string; // You can change this to `number` if it's numeric in actual use
  currency: string;
  keywords: string | null;
  metadata: any | null; // Define a specific shape if metadata has a known structure
  status: ProductStatus;
  readiness_percent: number | null;
  published_at: string | null;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  creator: CreatorBasic;
  multimedia: Multimedia;
  category: Category;
}

export interface CourseResponse {
  statusCode: number;
  data: Course[];
  count: number;
}

export interface CourseDetails {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  keywords: string | null;
  metadata: any | null;
  readiness_percent: number | null;
  status: ProductStatus;
  published_at: string | null;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  creator: Creator;
  multimedia: Multimedia;
  category: Category;
}

export interface CourseDetailsResponse {
  statusCode: number;
  data: CourseDetails;
}

export interface Module {
  id: string;
  title: string;
  position: number;
  course_id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
    role: {
      name: string;
      role_id: string;
    };
  };
  course: {
    id: string;
    business_id: string;
    category_id: string;
    creator_id: string;
    title: string;
    description: string;
    keywords: string | null;
    metadata: any; // Use a more specific type if known
    type: ProductType;
    status: ProductStatus;
    published_at: string;
    archived_at: string | null;
    price: string;
    currency: string;
    original_price: string | null;
    multimedia_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  contents: ModuleContent[];
}

export interface ModuleContent {
  id: string;
  title: string;
  module_id: string;
  creator_id: string;
  business_id: string;
  multimedia_id: string;
  multimedia: Media;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ModuleResponse {
  statusCode: number;
  data: Module[];
  count: number;
}

export interface ViewContentProps {
  contentId: string;
  moduleId: string;
}

export interface UpdateCourseResponse {
  statusCode: number;
  message: string;
  data: Course;
}

// TICKET
export interface TicketTier {
  id: string;
  ticket_id: string;
  name: string;
  description: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: TicketTierStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  currency: string;
  amount: string;
  original_amount: string;
}

export interface Ticket {
  id: string;
  product_id: string;
  event_time?: string;
  event_start_date: string;
  event_end_date: string;
  event_location: string;
  event_type: EventType;
  auth_details: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ticket_tiers: TicketTier[];
  purchased_tickets: TicketPurchase[]; // At most one fetch
}

export interface TicketPurchase {
  id: string;
  user_id: string;
  ticket_id: string;
  ticket_tier_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface TicketProduct {
  id: string;
  title: string;
  description: string;
  keywords: string | null;
  metadata: any;
  status: ProductStatus;
  published_at: string;
  archived_at: string | null;
  price: string;
  currency: string;
  multimedia_id: string;
  creator_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  creator: CreatorBasic;
  category: Category;
  multimedia: Media;
  ticket: Ticket;
  business_info: BusinessInfo;
}

export interface TicketProductResponse {
  statusCode: number;
  data: TicketProduct[];
  count: number;
}

export interface TicketDetailsResponse {
  statusCode: number;
  data: TicketProduct;
}

export interface UpdateTicketResponse {
  statusCode: number;
  message: string;
  data: TicketProduct;
}

export interface DeleteTicketTierResponse {
  statusCode: number;
  message: string;
  data: {
    ticket_tier_id: string;
    deleted: boolean;
  };
}

export interface DeleteTicketResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface TicketTierWithTicketAndProduct {
  id: string;
  ticket_id: string;
  name: string;
  description: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  currency: string;
  amount: string;
  original_amount: string;
  ticket: {
    id: string;
    product_id: string;
    event_time?: string;
    event_start_date: string;
    event_end_date: string;
    event_location: string;
    event_type: string;
    auth_details: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    product: {
      id: string;
      business_id: string;
      category_id: string;
      creator_id: string;
      title: string;
      description: string;
      keywords: string | null;
      metadata: any;
      type: string;
      status: string;
      readiness_percent: number | null;
      published_at: string;
      archived_at: string | null;
      price: string;
      currency: string;
      original_price: string | null;
      multimedia_id: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      business_info: BusinessInfo;
      multimedia: Media;
    };
  };
}

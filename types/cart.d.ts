import {
  Course,
  Ticket,
  TicketProduct,
  TicketTier,
  TicketTierWithTicketAndProduct,
} from './product';

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  product_type: 'COURSE' | 'TICKET' | string;
  quantity: number;
  price_at_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  course?: Course;
  // Add ticket/subscription fields as needed
  ticket_tier_id?: string;
  ticket_tier?: TicketTierWithTicketAndProduct;
}

export interface Cart {
  id: string;
  created_at: string;
  updated_at: string;
  items: CartItem[];
}

export interface CartResponse {
  statusCode: number;
  data: Cart;
  count: number;
}

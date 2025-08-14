import { ChatReadStatus } from '@/lib/utils';

export interface RetrieveChatsProps {
  token: string;
  status?: ChatReadStatus;
  q?: string;
}

export interface RetrieveMessagesProps {
  token: string;
  chatBuddy: string;
  page?: number;
}

export interface SendMessageProps {
  token: string;
  chatBuddy: string;
  message?: string;
  file?: string;
}

export interface Chat {
  id: string;
  last_message: string | null;
  last_message_at: string | null;
  is_archived: boolean;
  unread: number;
  is_group: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  initiator_id: string;
  chat_buddy_id: string | null;
  chat_group_id: string | null;
  initiator: {
    id: string;
    name: string;
    role: {
      id: string;
      name: string;
      role_group_id: string;
      description: string;
      created_at: string;
      updated_at: string;
      role_id: string;
      deleted_at: string | null;
    };
    profile: {
      profile_picture: string;
    };
  };
  chat_buddy: {
    id: string;
    name: string;
    role: {
      id: string;
      name: string;
      role_group_id: string;
      description: string;
      created_at: string;
      updated_at: string;
      role_id: string;
      deleted_at: string | null;
    };
    profile: {
      profile_picture: string | null;
    };
  } | null;
  chat_group: {
    id: string;
    name: string;
    description: string;
    multimedia_id: string;
    auto_created: boolean;
    subscription_plan_id: string | null;
    creator_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    multimedia: {
      id: string;
      url: string;
      creator_id: string;
      business_id: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      provider: string;
      type: string;
    };
    group_members: Array<{
      id: string;
      member_id: string;
      is_admin: boolean;
      group_id: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      member: {
        name: string;
        role: {
          name: string;
          role_id: string;
        };
        profile: {
          profile_picture: string | null;
        } | null;
      };
    }>;
  } | null;
  messages: Array<{
    id: string;
    message: string;
    file: string | null;
    read: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    chat_id: string;
    initiator_id: string;
    chat_buddy_id: string | null;
    chat_group_id: string | null;
  }>;
}

export interface Message {
  id: string;
  message: string;
  file: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  chat_id: string;
  initiator_id: string;
  chat_buddy_id: string;
  initiator?: {
    id: string;
    name: string;
    role: {
      id: string;
      name: string;
      role_group_id: string;
      description: string;
      created_at: string;
      updated_at: string;
      role_id: string;
      deleted_at: string | null;
    };
    profile: null | {
      profile_picture: string;
    };
  };
  chat_buddy?: {
    id: string;
    name: string;
    role: {
      id: string;
      name: string;
      role_group_id: string;
      description: string;
      created_at: string;
      updated_at: string;
      role_id: string;
      deleted_at: string | null;
    };
    profile: {
      profile_picture: string;
    };
  };
}

export interface ChatResponse {
  status: string;
  message: string;
  data: {
    result: Chat[];
    count: number;
  };
}

export interface MessagesResponse {
  status: string;
  message: string;
  data: {
    result: Message[];
    count: number;
    chatId?: string;
    chat: Chat;
    page?: number;
  };
}

export interface SentMessageResponse {
  status: string;
  message: string;
  data: Message;
}

export interface RecentChatRetrievedResponse {
  status: string;
  message: string;
  data: Chat & { messages: Message[] };
}

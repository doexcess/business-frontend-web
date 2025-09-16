import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { socketService } from '@/lib/services/socketService';
import {
  RetrieveChatsProps,
  RetrieveMessagesProps,
  SendMessageProps,
} from '@/lib/schema/chat.schema';
import { Chat, Message, ChatResponse, MessagesResponse } from '@/types/chat';
import api from '@/lib/api';

interface ChatState {
  chats: Chat[];
  messages: Message[];
  latestMessage: Message | null;
  currentChat: string | null;
  chat: Chat | null;
  loading: boolean;
  contactsLoading: boolean;
  error: string | null;
  onlineUsers: Set<string>;
  contacts: any[];
}

const initialState: ChatState = {
  chats: [],
  chat: null,
  messages: [],
  latestMessage: null,
  currentChat: null,
  loading: false,
  contactsLoading: false,
  error: null,
  onlineUsers: new Set(),
  contacts: [],
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (business_id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/fetch-contacts?business_id=${business_id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch contacts'
      );
    }
  }
);

export const fetchOrgContacts = createAsyncThunk(
  'contacts/fetchOrgContacts',
  async (business_id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/fetch-org-contacts?business_id=${business_id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch org contacts'
      );
    }
  }
);


// Helper function to sort chats by last message date (most recent first)
const sortChatsByLastMessage = (chats: Chat[]): Chat[] => {
  return [...chats].sort((a, b) => {
    const aDate = new Date(a.messages[0]?.updated_at || a.created_at);
    const bDate = new Date(b.messages[0]?.updated_at || b.created_at);
    return bDate.getTime() - aDate.getTime();
  });
};

export const retrieveChats = createAsyncThunk(
  'chat/retrieveChats',
  async (payload: RetrieveChatsProps, { rejectWithValue }) => {
    try {
      return await socketService.retrieveChats(payload);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const retrieveMessages = createAsyncThunk(
  'chat/retrieveMessages',
  async (payload: RetrieveMessagesProps, { rejectWithValue }) => {
    try {
      return await socketService.retrieveMessages(payload);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: SendMessageProps) => {
    return await socketService.sendMessage(payload);
  }
);


const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    chatsRetrieved: (state, action: PayloadAction<Chat[]>) => {
      state.chats = sortChatsByLastMessage(action.payload);
    },
    messagesRetrieved: (
      state: any,
      action: PayloadAction<{
        messages: Message[]
        chatId?: string
        chat: Chat
        page?: number
        isInitialLoad?: boolean
      }>,
    ) => {
      const { messages, chatId, chat, page, isInitialLoad } = action.payload

      if (isInitialLoad) {
        state.messages = messages
      } else {
        const existingMessageIds = new Set(state.messages.map((msg: Message) => msg.id))
        const newMessages = messages.filter((msg) => !existingMessageIds.has(msg.id))
        state.messages = [...newMessages, ...state.messages]
      }

      state.chat = chat
      state.currentChat = chatId || null
    },
    userOnline: (state, action: PayloadAction<string>) => {
      state.onlineUsers.add(action.payload);
    },
    userOffline: (state, action: PayloadAction<string>) => {
      state.onlineUsers.delete(action.payload);
    },
    messagesSent: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      state.latestMessage = action.payload;
      state.chats = sortChatsByLastMessage(
        state.chats.map((chat) => {
          if (chat.id === action.payload.chat_id) {
            return {
              ...chat,
              last_message: action.payload.message,
              created_at: action.payload.created_at,
            };
          }
          return chat;
        })
      );
    },
    recentChatRetrieved: (state, action: PayloadAction<Chat>) => {
      state.chats = sortChatsByLastMessage(
        state.chats.map((chat) => {
          if (chat.id === action.payload.id) {
            return {
              ...chat,
              last_message: action.payload.last_message,
              messages: action.payload.messages,
              created_at: action.payload.created_at,
            };
          }
          return chat;
        })
      );
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{
        messageId: string;
        read: boolean;
      }>
    ) => {
      state.messages = state.messages.map((msg) =>
        msg.id === action.payload.messageId
          ? { ...msg, read: action.payload.read }
          : msg
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // In your chatSlice.ts
    updateMessagesReadStatus: (state, action: PayloadAction<{
      chatId: string;
      readBy: string;
    }>) => {
      const { chatId, readBy } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);

      if (chat) {
        chat.messages.forEach(msg => {
          if (msg.initiator_id !== readBy) {
            msg.read = true;
          }
        });

        // Reset unread count
        chat.unread = 0;
      }
    },
    clearChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.contactsLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.contactsLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action: PayloadAction<any>) => {
        state.contactsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrgContacts.pending, (state) => {
        state.contactsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrgContacts.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.contactsLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchOrgContacts.rejected, (state, action: PayloadAction<any>) => {
        state.contactsLoading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const {
  chatsRetrieved,
  messagesRetrieved,
  messagesSent,
  recentChatRetrieved,
  userOnline,
  userOffline,
  updateMessageStatus,
  clearChatState,
  updateMessagesReadStatus
} = chatSlice.actions;

export default chatSlice.reducer;
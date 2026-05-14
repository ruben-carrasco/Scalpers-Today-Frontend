export type AssistantMessageRole = 'user' | 'assistant';

export interface AssistantMessage {
  id: string;
  role: AssistantMessageRole;
  content: string;
  createdAt: Date;
}

export interface AssistantChatContext {
  screen?: string;
  eventTitle?: string;
  country?: string;
  currency?: string;
  importance?: number;
  actual?: string;
  forecast?: string;
  previous?: string;
  aiSummary?: string;
}

import { AssistantChatContext } from '../../entities/AssistantMessage';

export interface IAssistantRepository {
  sendMessage(question: string, context?: AssistantChatContext): Promise<string>;
}

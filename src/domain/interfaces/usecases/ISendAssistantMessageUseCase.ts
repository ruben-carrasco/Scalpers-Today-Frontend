import { AssistantChatContext } from '../../entities/AssistantMessage';

export interface ISendAssistantMessageUseCase {
  execute(question: string, context?: AssistantChatContext): Promise<string>;
}

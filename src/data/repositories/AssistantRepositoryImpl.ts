import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/types';
import { ApiClient } from '../api/ApiClient';
import { ApiEndpointProvider } from '../api/ApiEndpointProvider';
import { AssistantChatContext } from '../../domain/entities/AssistantMessage';
import { IAssistantRepository } from '../../domain/interfaces/repositories/IAssistantRepository';

interface ApiAssistantChatResponse {
  answer: string;
  disclaimer: string;
}

@injectable()
export class AssistantRepositoryImpl implements IAssistantRepository {
  constructor(
    @inject(TYPES.ApiClient)
    private apiClient: ApiClient,
    @inject(TYPES.ApiEndpointProvider)
    private endpoints: ApiEndpointProvider
  ) {}

  async sendMessage(question: string, context?: AssistantChatContext): Promise<string> {
    const response = await this.apiClient.post<ApiAssistantChatResponse>(
      this.endpoints.assistantChat,
      {
        question,
        context: context ? this.mapContext(context) : undefined,
      }
    );
    return response.answer;
  }

  private mapContext(context: AssistantChatContext) {
    return {
      screen: context.screen,
      event_title: context.eventTitle,
      country: context.country,
      currency: context.currency,
      importance: context.importance,
      actual: context.actual,
      forecast: context.forecast,
      previous: context.previous,
      ai_summary: context.aiSummary,
    };
  }
}

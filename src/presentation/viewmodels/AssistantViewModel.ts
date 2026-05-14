import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { TYPES } from '../../core/types';
import { ApiError, NetworkError, translateApiError } from '../../core/errors';
import { AssistantChatContext, AssistantMessage } from '../../domain/entities/AssistantMessage';
import { ISendAssistantMessageUseCase } from '../../domain/interfaces/usecases/ISendAssistantMessageUseCase';

const WELCOME_MESSAGE: AssistantMessage = {
  id: 'assistant-welcome',
  role: 'assistant',
  content: 'Puedo ayudarte a entender eventos económicos, conceptos macro y análisis de la app. No doy recomendaciones de compra o venta.',
  createdAt: new Date(),
};

@injectable()
export class AssistantViewModel {
  isOpen = false;
  isLoading = false;
  error: string | null = null;
  messages: AssistantMessage[] = [WELCOME_MESSAGE];
  context: AssistantChatContext = {};

  constructor(
    @inject(TYPES.SendAssistantMessageUseCase)
    private sendAssistantMessageUseCase: ISendAssistantMessageUseCase
  ) {
    makeAutoObservable(this);
  }

  open(context?: AssistantChatContext): void {
    this.isOpen = true;
    this.error = null;
    if (context) {
      this.context = context;
    }
  }

  close(): void {
    this.isOpen = false;
    this.error = null;
  }

  clear(): void {
    this.messages = [WELCOME_MESSAGE];
    this.error = null;
  }

  setContext(context: AssistantChatContext): void {
    this.context = context;
  }

  async send(question: string): Promise<void> {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || this.isLoading) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: cleanQuestion,
      createdAt: new Date(),
    };

    this.messages.push(userMessage);
    this.isLoading = true;
    this.error = null;

    try {
      const answer = await this.sendAssistantMessageUseCase.execute(cleanQuestion, this.context);
      runInAction(() => {
        this.messages.push({
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: answer,
          createdAt: new Date(),
        });
      });
    } catch (err) {
      runInAction(() => {
        if (err instanceof NetworkError) {
          this.error = 'Sin conexión. Revisa internet e inténtalo de nuevo.';
        } else if (err instanceof ApiError) {
          this.error = translateApiError(err.message);
        } else if (err instanceof Error) {
          this.error = translateApiError(err.message);
        } else {
          this.error = 'No se pudo consultar el asistente.';
        }
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

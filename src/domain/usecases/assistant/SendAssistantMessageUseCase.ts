import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/types';
import { AssistantChatContext } from '../../entities/AssistantMessage';
import { IAssistantRepository } from '../../interfaces/repositories/IAssistantRepository';
import { ISendAssistantMessageUseCase } from '../../interfaces/usecases/ISendAssistantMessageUseCase';

@injectable()
export class SendAssistantMessageUseCase implements ISendAssistantMessageUseCase {
  constructor(
    @inject(TYPES.AssistantRepository)
    private assistantRepository: IAssistantRepository
  ) {}

  execute(question: string, context?: AssistantChatContext): Promise<string> {
    return this.assistantRepository.sendMessage(question, context);
  }
}

import { ValidationResult } from './ValidationResult';

export interface EmailValidationResult extends ValidationResult {
  normalizedEmail?: string;
}

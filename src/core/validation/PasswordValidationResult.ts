import { ValidationResult } from './ValidationResult';
import { RequirementStatus } from './RequirementStatus';

export interface PasswordValidationResult extends ValidationResult {
  requirements: RequirementStatus[];
}


import {
  PasswordRequirements,
  PasswordValidationResult,
  RequirementStatus,
} from './types';

export type { PasswordRequirements, PasswordValidationResult, RequirementStatus } from './types';

const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: false,
};

export class PasswordValidator {
  private requirements: PasswordRequirements;

  constructor(requirements: Partial<PasswordRequirements> = {}) {
    this.requirements = { ...DEFAULT_REQUIREMENTS, ...requirements };
  }

  validate(password: string): PasswordValidationResult {
    const errors: string[] = [];
    const requirements: RequirementStatus[] = [];

    const hasMinLength = password.length >= this.requirements.minLength;
    requirements.push({
      label: `Mínimo ${this.requirements.minLength} caracteres`,
      met: hasMinLength,
    });
    if (!hasMinLength) {
      errors.push(`La contraseña debe tener al menos ${this.requirements.minLength} caracteres`);
    }

    if (this.requirements.requireUppercase) {
      const hasUppercase = /[A-Z]/.test(password);
      requirements.push({
        label: 'Una letra mayúscula',
        met: hasUppercase,
      });
      if (!hasUppercase) {
        errors.push('Debe incluir al menos una letra mayúscula');
      }
    }

    if (this.requirements.requireLowercase) {
      const hasLowercase = /[a-z]/.test(password);
      requirements.push({
        label: 'Una letra minúscula',
        met: hasLowercase,
      });
      if (!hasLowercase) {
        errors.push('Debe incluir al menos una letra minúscula');
      }
    }

    if (this.requirements.requireDigit) {
      const hasDigit = /[0-9]/.test(password);
      requirements.push({
        label: 'Un número',
        met: hasDigit,
      });
      if (!hasDigit) {
        errors.push('Debe incluir al menos un número');
      }
    }

    if (this.requirements.requireSpecial) {
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      requirements.push({
        label: 'Un carácter especial',
        met: hasSpecial,
      });
      if (!hasSpecial) {
        errors.push('Debe incluir al menos un carácter especial');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      requirements,
    };
  }

  getRequirementsMessage(): string {
    const parts: string[] = [];
    parts.push(`${this.requirements.minLength}+ caracteres`);
    if (this.requirements.requireUppercase) parts.push('mayúscula');
    if (this.requirements.requireLowercase) parts.push('minúscula');
    if (this.requirements.requireDigit) parts.push('número');
    if (this.requirements.requireSpecial) parts.push('carácter especial');
    return parts.join(', ');
  }
}

export const passwordValidator = new PasswordValidator();

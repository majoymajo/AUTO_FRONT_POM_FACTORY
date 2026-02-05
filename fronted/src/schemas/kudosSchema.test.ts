import { describe, it, expect } from 'vitest';
import { kudosSchema } from './kudosSchema';

describe('kudosSchema', () => {
  it('should validate a correct message', () => {
    const validData = {
      message: 'This is a valid recognition message for the team.',
    };
    const result = kudosSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if message is too short', () => {
    const invalidData = {
      message: 'Short',
    };
    const result = kudosSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      // Use result.error.issues to get the array of errors in Zod
      expect(result.error.issues[0].message).toBe('El mensaje debe tener al menos 10 caracteres');
    }
  });

  it('should fail if message is missing', () => {
    const invalidData = {};
    const result = kudosSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

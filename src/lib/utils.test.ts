import { describe, expect, test } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  test('merges class names correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  test('handles undefined and null values', () => {
    expect(cn('btn', undefined, null, 'btn-primary')).toBe('btn btn-primary');
  });

  test('works with clsx conditional classes', () => {
    expect(cn('btn', { 'btn-active': true, 'btn-disabled': false })).toBe(
      'btn btn-active'
    );
    expect(cn('btn', { 'btn-active': false, 'btn-disabled': true })).toBe(
      'btn btn-disabled'
    );
  });

  test('merges with tailwind-merge deduplication', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6'); // tailwind-merge should deduplicate
  });
});

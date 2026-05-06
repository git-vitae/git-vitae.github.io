Run the Vitest test suite for this project. Use pnpm as the package manager.

## Commands

**Run all tests (single run):**
```
pnpm test
```
or equivalently:
```
pnpm vitest run
```

**Run tests in watch mode:**
```
pnpm test:watch
```
or:
```
pnpm vitest
```

**Run a single test file:**
```
pnpm vitest run <file-pattern>
```
Example: `pnpm vitest run src/lib/utils`

**Run with UI (browser-based reporter):**
```
pnpm test:ui
```
or:
```
pnpm vitest --ui
```

**Generate coverage report:**
```
pnpm test:coverage
```

## Current Test Setup

- **Framework:** Vitest 4.1.5 with happy-dom for browser-like DOM APIs
- **Config:** Uses inline Vite config (shared with build) — no separate vitest.config.js needed
- **Test pattern:** `**/*.{test,spec}.{ts,tsx}`
- **Aliases:** `@` resolves to `src/` (from vite.config.ts)
- **Location:** Test files co-located with source (e.g., `src/lib/utils.test.ts`)

## Example Test File

```ts
import { describe, expect, test } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  test('merges class names correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });
});
```

If the user asks you to run tests, execute the appropriate command above based on their intent.

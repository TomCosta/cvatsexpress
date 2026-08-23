import { createLocalId } from './local-id';

describe('createLocalId', () => {
  it('uses randomUUID when available', () => {
    expect(
      createLocalId({
        randomUUID: () => 'native-uuid',
      }),
    ).toBe('native-uuid');
  });

  it('creates a UUID with getRandomValues when randomUUID fails', () => {
    const id = createLocalId({
      randomUUID: () => {
        throw new Error('not available in this context');
      },
      getRandomValues: (bytes) => bytes.fill(0),
    });

    expect(id).toBe('00000000-0000-4000-8000-000000000000');
  });

  it('keeps local creation available without Web Crypto', () => {
    expect(createLocalId(null)).toMatch(/^local-[a-z0-9-]+$/);
  });
});

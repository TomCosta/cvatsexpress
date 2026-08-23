import { cloneJsonValue } from './json-clone';

describe('cloneJsonValue', () => {
  it('uses the native clone implementation when available', () => {
    const nativeClone = jasmine.createSpy('nativeClone').and.callFake(
      <T>(value: T) => JSON.parse(JSON.stringify(value)) as T,
    );
    const value = { id: 'resume-1' };

    expect(cloneJsonValue(value, nativeClone)).not.toBe(value);
    expect(nativeClone).toHaveBeenCalledWith(value);
  });

  it('falls back to JSON cloning when the native implementation fails', () => {
    const value = { id: 'resume-1', sections: [] as string[] };
    const cloned = cloneJsonValue(value, () => {
      throw new Error('unsupported value');
    });

    cloned.sections.push('experience');

    expect(value.sections).toEqual([]);
  });

  it('clones JSON-safe data when structuredClone is unavailable', () => {
    const value = { nested: { title: 'Meu currículo' }, items: ['one'] };
    const cloned = cloneJsonValue(value, null);

    cloned.nested.title = 'Alterado';
    cloned.items.push('two');

    expect(value).toEqual({
      nested: { title: 'Meu currículo' },
      items: ['one'],
    });
  });
});

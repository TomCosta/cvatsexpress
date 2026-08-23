import {
  LINKEDIN_PROFILE_PREFIX,
  normalizeLinkedInProfile,
  normalizeWebsite,
} from './profile-url';

describe('profile URL normalization', () => {
  it('adds the canonical LinkedIn prefix to a profile identifier', () => {
    expect(normalizeLinkedInProfile('tom-costa')).toBe(
      `${LINKEDIN_PROFILE_PREFIX}tom-costa`,
    );
    expect(normalizeLinkedInProfile('@tom-costa')).toBe(
      `${LINKEDIN_PROFILE_PREFIX}tom-costa`,
    );
  });

  it('canonicalizes common LinkedIn profile URL variants', () => {
    expect(normalizeLinkedInProfile('linkedin.com/in/tom-costa')).toBe(
      `${LINKEDIN_PROFILE_PREFIX}tom-costa`,
    );
    expect(
      normalizeLinkedInProfile('http://linkedin.com/in/tom-costa'),
    ).toBe(`${LINKEDIN_PROFILE_PREFIX}tom-costa`);
  });

  it('adds HTTPS to a portfolio without changing a complete URL', () => {
    expect(normalizeWebsite('portfolio.dev')).toBe('https://portfolio.dev');
    expect(normalizeWebsite('//portfolio.dev')).toBe('https://portfolio.dev');
    expect(normalizeWebsite('https://portfolio.dev/work')).toBe(
      'https://portfolio.dev/work',
    );
    expect(normalizeWebsite('http://portfolio.dev')).toBe(
      'http://portfolio.dev',
    );
  });

  it('keeps optional empty fields empty', () => {
    expect(normalizeLinkedInProfile('  ')).toBe('');
    expect(normalizeWebsite('  ')).toBe('');
  });
});

export const LINKEDIN_PROFILE_PREFIX = 'https://www.linkedin.com/in/';
export const WEBSITE_PREFIX = 'https://';

export function normalizeLinkedInProfile(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  const linkedinProfile = trimmed.match(
    /^https?:\/\/(?:www\.)?linkedin\.com\/in\/(.*)$/i,
  );
  if (linkedinProfile) {
    return `${LINKEDIN_PROFILE_PREFIX}${linkedinProfile[1]}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const profilePath = trimmed
    .replace(/^(?:www\.)?linkedin\.com\/in\//i, '')
    .replace(/^\/?in\//i, '')
    .replace(/^@/, '');

  return `${LINKEDIN_PROFILE_PREFIX}${profilePath}`;
}

export function normalizeWebsite(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `${WEBSITE_PREFIX}${trimmed.replace(/^\/\//, '')}`;
}

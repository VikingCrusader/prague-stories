export function getLocName(location, lang) {
  if (!location) return '';
  if (lang === 'en' || !location.localizedNames) return location.name || '';
  return location.localizedNames[lang] || location.name || '';
}

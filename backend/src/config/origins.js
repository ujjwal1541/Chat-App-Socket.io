function parseAllowedOrigins(rawOrigins) {
  return (rawOrigins || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim())
    .map((value) => value.replace(/\/$/, ''))
    .filter(Boolean);
}

function isOriginAllowed(origin, allowedOrigins) {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
}

module.exports = {
  parseAllowedOrigins,
  isOriginAllowed,
};

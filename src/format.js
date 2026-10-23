function formatWhen(iso, timeZone = 'America/Santiago') {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso || '');
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone,
  }).format(date);
}

function daysBetween(earlierIso, laterIso) {
  const ms = new Date(laterIso).getTime() - new Date(earlierIso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return 0;
  return Math.floor(ms / 86400000);
}

module.exports = {
  formatWhen,
  daysBetween,
};

const KEY = 'coding-adventure.v1';
const safeNumber = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
export function load(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(KEY) || '{}');
    const records = {};
    if (parsed?.records && typeof parsed.records === 'object') {
      for (const [key, value] of Object.entries(parsed.records)) {
        if (['escape','builder','debug','lab'].includes(key) || /^adventure:(front-end|back-end):(beginner|intermediate|advanced)$/.test(key)) {
          records[key] = { score: safeNumber(value?.score), streak: safeNumber(value?.streak), ...(value?.completed === true ? {completed:true} : {}) };
        }
      }
    }
    const path = ['front-end','back-end'].includes(parsed?.path) ? parsed.path : 'front-end';
    const difficulty = ['beginner','intermediate','advanced'].includes(parsed?.difficulty) ? parsed.difficulty : 'beginner';
    return { records, path, difficulty };
  } catch { return { records: {}, path: 'front-end', difficulty: 'beginner' }; }
}
export function save(storage, data) {
  try { storage.setItem(KEY, JSON.stringify(data)); return true; } catch { return false; }
}
export function updateRecord(data, key, score, streak) {
  const prior = data.records[key] || {};
  return { ...data, records: { ...data.records, [key]: { ...(prior.completed ? {completed:true} : {}), score: Math.max(safeNumber(prior.score), safeNumber(score)), streak: Math.max(safeNumber(prior.streak), safeNumber(streak)) } } };
}
export function browserStorage() {
  try { return window.localStorage; } catch { return null; }
}

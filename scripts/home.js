import './motion.js';
import { load, browserStorage } from './storage.js';
import { completedLevels, levels } from './progress.js';
const profile = load(browserStorage());
const completed = completedLevels(profile);
document.querySelector('#completed-count').textContent = completed.length;
for (const level of levels) {
  const done = completed.includes(level.id);
  const stop = document.querySelector(`[data-level="${level.id}"]`);
  stop.classList.toggle('completed',done);
  stop.querySelector('.level-status').textContent = done ? '✓ Completed' : 'Adventure awaits';
  const badge = document.createElement('a'); badge.href=level.file; badge.className=`journal-badge ${done?'earned':''}`;
  badge.textContent=done?'★':String(level.number); badge.setAttribute('aria-label',`${level.name}: ${done?'completed':'not yet completed'}`);
  document.querySelector('#completion-badges').append(badge);
}
document.querySelector('#score-best').textContent = Math.max(0,...Object.values(profile.records).map(r=>r.score));
document.querySelector('#streak-best').textContent = Math.max(0,...Object.values(profile.records).map(r=>r.streak));

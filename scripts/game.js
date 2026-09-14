import { reducedMotion } from './motion.js';
import { questions } from './questions.js';
import { createState, selectQuestions, answerQuestion, targetPosition } from './game-state.js';
import { load, save, browserStorage } from './storage.js';
import { $, element, focusHeading, renderQuestion } from './ui.js';
import { showResults } from './session-ui.js';

const mode = document.body.dataset.mode;
const storage = browserStorage();
let profile = load(storage);
let state = createState([]);
let path = profile.path, difficulty = profile.difficulty;
let currentId = null, currentIndex = 0, animation = 0, elapsed = 0, lastTime = 0;
let targets = [];
let paused = false, hover = false;

const dialog = $('#question-dialog');
const labelPath = () => path === 'front-end' ? 'Front-End' : 'Back-End';
const labelDifficulty = () => difficulty[0].toUpperCase() + difficulty.slice(1);
const recordKey = () => mode === 'escape' ? 'escape' : `adventure:${path}:${difficulty}`;

if (mode === 'adventure') {
  $(`input[name="path"][value="${path}"]`).checked = true;
  $(`input[name="difficulty"][value="${difficulty}"]`).checked = true;
  $('#adventure-form').addEventListener('submit', event => {
    event.preventDefault();
    path = $('input[name="path"]:checked').value;
    difficulty = $('input[name="difficulty"]:checked').value;
    profile = { ...profile, path, difficulty };
    save(storage, profile);
    start();
  });
} else {
  $('#start').addEventListener('click', start);
}
$('#restart').addEventListener('click', start);
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll('button:not(:disabled)')].filter(button => !button.hidden);
  const first = controls[0], last = controls.at(-1);
  if (event.shiftKey && (document.activeElement === first || document.activeElement.tagName === 'H2')) {
    event.preventDefault(); last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first?.focus();
  }
});
dialog.addEventListener('close', () => {
  if (currentId && state.completed.includes(currentId)) {
    const target = targets.find(target => target.id === currentId);
    if (target) {
      target.button.disabled=true;
      target.button.classList.add('cleared');
      if (reducedMotion.matches) target.button.hidden=true;
      else setTimeout(()=>{target.button.hidden=true;},350);
    }
    if (state.status === 'complete') finish();
    else targets.find(target => !target.button.disabled)?.button.focus({ preventScroll: true });
  }
  currentId = null;
});

function start() {
  // A running session may only be replaced by the explicit restart control.
  cancelAnimationFrame(animation);
  if (dialog.open) { currentId = null; dialog.close(); }
  const selected = selectQuestions(questions, mode === 'escape' ? 'general' : path, mode === 'escape' ? 'beginner' : difficulty, mode === 'escape' ? 6 : 5);
  const expected = mode === 'escape' ? 6 : 5;
  if (selected.length !== expected) selected.length = 0;
  state = createState(selected);
  $('#setup').hidden = true; $('#result').hidden = true;
  $('#data-error').hidden = selected.length > 0;
  $('#play').hidden = selected.length === 0;
  if (!selected.length) { focusHeading($('#data-error')); return; }
  currentIndex = 0; currentId = null; elapsed = 0; lastTime = 0; targets = []; hover = false; paused = reducedMotion.matches;
  $('#mission-label').textContent = mode === 'escape' ? 'LEVEL 1 · BUG FOREST' : `LEVEL 2 · ${labelPath()} · ${labelDifficulty()}`;
  $('#play-title').textContent = mode === 'escape' ? 'Catch all 6 bugs!' : 'Follow your coding trail.';
  $('#progress-label').textContent = mode === 'escape' ? 'BUGS CAUGHT' : 'CHECKPOINTS';
  updateHUD();
  if (mode === 'escape') renderArena(); else renderStage();
  focusHeading($('#play'));
}
function updateHUD() {
  $('#score').textContent = state.score;
  $('#streak').textContent = state.streak;
  $('#progress').textContent = `${state.completed.length} / ${state.questions.length}`;
  $('#best').textContent = profile.records[recordKey()]?.score || 0;
  $('#progress-bar').max = state.questions.length;
  $('#progress-bar').value = state.completed.length;
}
function answer(id, index) {
  state = answerQuestion(state, id, index);
  updateHUD();
  return state.completed.includes(id);
}
function renderArena() {
  const content = $('#mode-content');
  content.replaceChildren();
  const toolbar = element('div', 'arena-toolbar');
  toolbar.append(element('p', '', 'Catch a bug. Solve its question. Tab + Enter works too.'));
  const motion = element('button', 'button secondary', reducedMotion.matches ? 'Reduced motion on' : paused ? 'Resume movement' : 'Pause movement');
  motion.disabled = reducedMotion.matches;
  motion.setAttribute('aria-pressed', String(paused));
  motion.onclick = () => { paused = !paused; motion.textContent = paused ? 'Resume movement' : 'Pause movement'; motion.setAttribute('aria-pressed', String(paused)); };
  toolbar.append(motion);
  const arena = element('div', 'arena');
  arena.setAttribute('aria-label', 'Virus targets');
  arena.append(element('span', 'arena-stamp', 'PIP’S FIELD NOTES · EVERY BUG IS A NEW CHALLENGE'));
  state.questions.forEach((q, index) => {
    const button = element('button', `virus virus-${index % 3}`);
    button.setAttribute('aria-label', `Decode virus ${index + 1}`);
    button.append(element('span', 'virus-glyph', '{×}'), element('span', 'virus-number', String(index + 1).padStart(2, '0')));
    button.onclick = () => {
      if (dialog.open || state.completed.includes(q.id)) return;
      currentId = q.id;
      renderQuestion($('#dialog-content'), q, { titleId: 'dialog-title', onAnswer: index => answer(q.id, index), onContinue: () => dialog.close() });
      dialog.showModal();
      focusHeading(dialog);
    };
    arena.append(button);
    targets.push({ id: q.id, button, index });
  });
  arena.addEventListener('pointerenter', () => { hover = true; });
  arena.addEventListener('pointerleave', () => { hover = false; });
  content.append(toolbar, arena, element('p', 'scoring-note', '100 points per clear + 50 on your first try. Movement pauses while you aim or use the keyboard.'));
  function frame(time) {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    const frozen = paused || reducedMotion.matches || dialog.open || hover || arena.contains(document.activeElement) || document.hidden;
    if (!frozen) elapsed += dt;
    const width = arena.clientWidth, height = arena.clientHeight;
    for (const target of targets) {
      const pos = targetPosition(target.index, elapsed, width, height, !reducedMotion.matches);
      target.button.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }
    if (state.status !== 'complete') animation = requestAnimationFrame(frame);
  }
  animation = requestAnimationFrame(frame);
  reducedMotion.onchange = () => {
    motion.disabled = reducedMotion.matches;
    if (reducedMotion.matches) { paused = true; motion.textContent = 'Reduced motion on'; motion.setAttribute('aria-pressed', 'true'); }
    else { motion.textContent = paused ? 'Resume movement' : 'Pause movement'; }
  };
}
function renderStage() {
  const content = $('#mode-content');
  content.replaceChildren();
  const layout = element('div', 'adventure-layout');
  const journey = element('aside', 'journey');
  journey.setAttribute('aria-label', 'Adventure stages');
  journey.append(element('p', 'eyebrow', 'YOUR ADVENTURE TRAIL'), element('h2', '', labelPath()));
  const list = element('ol', 'stages');
  ['Base camp','Puzzle bridge','Discovery grove','Lookout hill','Summit flag'].forEach((name, index) => {
    const li = element('li', index < currentIndex ? 'done' : index === currentIndex ? 'active' : '');
    li.append(element('span', 'stage-dot', index < currentIndex ? '✓' : String(index + 1)), element('span', '', name));
    if (index === currentIndex) li.setAttribute('aria-current', 'step');
    list.append(li);
  });
  journey.append(list, element('p', 'journey-note', 'One challenge at a time. You’ve got this.'));
  const panel = element('section', 'question-panel');
  panel.append(element('p', 'eyebrow', `STAGE ${currentIndex + 1} / ${state.questions.length} · ${labelDifficulty()}`));
  const questionContent = element('div');
  const q = state.questions[currentIndex];
  renderQuestion(questionContent, q, { titleId: 'stage-question', onAnswer: index => answer(q.id, index), onContinue: () => {
    if (state.status === 'complete') finish();
    else { currentIndex++; renderStage(); focusHeading($('.question-panel')); }
  }});
  panel.append(questionContent);
  layout.append(journey, panel); content.append(layout);
}
function finish() {
  cancelAnimationFrame(animation);
  profile=showResults({mode,key:recordKey(),state,profile,
    title:mode==='escape'?'Bug forest is clear!':'You reached the summit!',
    subtitle:mode==='escape'?'Six bugs caught. Great thinking, explorer!':`${labelPath()} · ${labelDifficulty()} · Five checkpoints cleared.`,
    onReplay:start,
    onChange:mode==='adventure'?()=>{ $('#result').hidden=true;$('#setup').hidden=false;focusHeading($('#setup')); }:null
  });
}

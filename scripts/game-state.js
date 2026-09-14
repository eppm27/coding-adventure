export function validQuestion(q) {
  return Boolean(q && typeof q.id === 'string' && typeof q.question === 'string' && q.question.trim()
    && typeof q.explanation === 'string' && q.explanation.trim()
    && Array.isArray(q.options) && q.options.length >= 3 && q.options.every(o => typeof o === 'string' && o.trim())
    && new Set(q.options).size === q.options.length && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
}
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function selectQuestions(bank, category, difficulty, count, random = Math.random) {
  const seen = new Set();
  const pool = bank.filter(q => {
    if (!validQuestion(q) || q.category !== category || q.difficulty !== difficulty || seen.has(q.id)) return false;
    seen.add(q.id); return true;
  });
  return shuffle(pool, random).slice(0, count).map(q => {
    const choices = shuffle(q.options.map((text, index) => ({ text, correct: index === q.answer })), random);
    return { ...q, options: choices.map(o => o.text), answer: choices.findIndex(o => o.correct) };
  });
}
export function createState(questions) {
  return { questions, score: 0, streak: 0, bestStreak: 0, firstTryCorrect: 0, completed: [], attempts: {}, status: questions.length ? 'playing' : 'empty' };
}
// A solved question cannot award points twice. Wrong answers retain the same question.
export function answerQuestion(state, id, option) {
  const q = state.questions.find(q => q.id === id);
  if (state.status !== 'playing' || !q || state.completed.includes(id) || !Number.isInteger(option) || option < 0 || option >= q.options.length) return state;
  return completeChallenge(state,id,option === q.answer);
}
// Shared scoring for quizzes and deterministic ordering puzzles.
export function completeChallenge(state,id,correct) {
  if (state.status !== 'playing' || typeof correct !== 'boolean' || !state.questions.some(q=>q.id === id) || state.completed.includes(id)) return state;
  const attempts = { ...state.attempts, [id]: (state.attempts[id] || 0) + 1 };
  if (!correct) return { ...state, attempts, streak: 0 };
  const firstTry = attempts[id] === 1;
  const streak = firstTry ? state.streak + 1 : 0;
  const completed = [...state.completed, id];
  return { ...state, attempts, completed, score: state.score + 100 + (firstTry ? 50 : 0), streak,
    bestStreak: Math.max(state.bestStreak, streak), firstTryCorrect: state.firstTryCorrect + Number(firstTry),
    status: completed.length === state.questions.length ? 'complete' : 'playing' };
}
export function targetPosition(index, elapsed, width, height, moving = true) {
  // Each target owns one cell: no overlap, no offscreen spawns, including after resize.
  const columns = width < 500 ? 2 : 3;
  const rows = Math.ceil(6 / columns);
  const cellWidth = width / columns, cellHeight = height / rows;
  const xTravel = Math.max(0, cellWidth - 76), yTravel = Math.max(0, cellHeight - 76);
  return { x: Math.min(Math.max(0, width - 64), (index % columns) * cellWidth + 6 + xTravel * (moving ? (Math.sin(elapsed * .65 + index * 1.7) + 1) / 2 : .5)),
    y: Math.min(Math.max(0, height - 64), Math.floor(index / columns) * cellHeight + 6 + yTravel * (moving ? (Math.cos(elapsed * .48 + index * 1.3) + 1) / 2 : .5)) };
}

export const $ = selector => document.querySelector(selector);
export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
export function focusHeading(container) {
  const heading = container.querySelector('h1, h2');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    if (container.tagName === 'DIALOG') container.scrollTop = 0;
    else container.scrollIntoView({ block: 'start' });
  }
}
export function renderQuestion(container, question, { titleId, onAnswer, onContinue, solved = false }) {
  container.replaceChildren();
  const scene = element('p', 'scenario', question.scenario);
  const title = element('h2', 'question-title', question.question);
  title.id = titleId;
  const options = element('div', 'answer-options');
  const feedback = element('div', 'feedback');
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  const next = element('button', 'button continue-button', 'Continue →');
  next.hidden = !solved;
  next.onclick = () => { next.disabled = true; onContinue(); };
  const buttons = question.options.map((text, index) => {
    const button = element('button', 'answer');
    const key = element('span', 'answer-key', String.fromCharCode(65 + index));
    key.setAttribute('aria-hidden', 'true');
    button.append(key, element('span', '', text));
    button.disabled = solved;
    button.onclick = () => {
      const correct = onAnswer(index);
      feedback.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
      feedback.replaceChildren(element('strong', '', correct ? 'Correct. Nicely decoded!' : `Not quite. Correct answer: ${question.options[question.answer]}`), element('p', '', question.explanation));
      if (correct) {
        button.classList.add('is-correct');
        buttons.forEach(b => { b.disabled = true; });
        next.hidden = false;
        next.focus();
      } else {
        feedback.append(element('p', 'retry-note', 'Try the correct answer to continue.'));
      }
    };
    options.append(button);
    return button;
  });
  if (solved) {
    feedback.className = 'feedback correct';
    feedback.append(element('strong', '', 'Correct. Ready to continue.'), element('p', '', question.explanation));
  }
  container.append(scene, title, options, feedback, next);
}

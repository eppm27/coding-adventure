import { debugChallenges } from './challenges.js';
import { difficulties } from './new-game-state.js';
import { selectQuestions, createState, answerQuestion } from './game-state.js';
import { $, element, focusHeading, renderQuestion } from './ui.js';
import { updateHUD, showResults, showEmpty } from './session-ui.js';
let state=createState([]),current=0;
$('#start').onclick=start;$('#restart').onclick=start;
function start(){
  const selected=difficulties.flatMap(difficulty=>selectQuestions(debugChallenges,'debug',difficulty,2));
  if(selected.length!==6){showEmpty();return;}
  state=createState(selected);current=0;$('#setup').hidden=true;$('#result').hidden=true;$('#play').hidden=false;
  renderStage();focusHeading($('#play'));
}
function renderStage(){
  updateHUD(state,'debug');const content=$('#mode-content');content.replaceChildren();const question=state.questions[current];
  const panel=element('section','question-panel debug-panel');
  const header=element('div','debug-heading'),bug=element('img');bug.src='assets/bug.svg';bug.alt='A bug to fix';
  header.append(element('p','eyebrow',`BUG ${current+1} / 6 · ${question.difficulty.toUpperCase()}`),bug);
  const snippet=element('pre','code-snippet');snippet.append(element('code','',question.code));snippet.setAttribute('aria-label','Code to debug');
  const body=element('div');
  renderQuestion(body,question,{titleId:'debug-question',onAnswer:index=>{state=answerQuestion(state,question.id,index);updateHUD(state,'debug');if(state.completed.includes(question.id))bug.classList.add('bug-fixed');return state.completed.includes(question.id);},onContinue:()=>{if(state.status==='complete')showResults({mode:'debug',key:'debug',state,title:'Nice fixes, explorer!',subtitle:'Six bugs spotted. Your debugging instincts are growing.',onReplay:start});else{current++;renderStage();focusHeading($('.question-panel'));}}});
  panel.append(header,snippet,body);content.append(panel);
}

import { builderChallenges } from './challenges.js';
import { progressiveChallenges, shuffledOrder, moveBlock, isCorrectOrder, validBuilderChallenge } from './new-game-state.js';
import { createState, completeChallenge } from './game-state.js';
import { $, element, focusHeading } from './ui.js';
import { updateHUD, showResults, showEmpty } from './session-ui.js';
let state=createState([]),current=0,order=[],dragged=null,locked=false;
$('#start').onclick=start;$('#restart').onclick=start;
function start(){
  const selected=progressiveChallenges(builderChallenges.filter(validBuilderChallenge));
  if(selected.length!==3){showEmpty();return;}
  state=createState(selected);current=0;$('#setup').hidden=true;$('#result').hidden=true;$('#play').hidden=false;
  renderChallenge();focusHeading($('#play'));
}
function renderChallenge(){
  locked=false;dragged=null;const challenge=state.questions[current];order=shuffledOrder(challenge);
  updateHUD(state,'builder');const content=$('#mode-content');content.replaceChildren();
  const board=element('div','builder-board'),guide=element('aside','build-guide');
  const pip=element('img');pip.src='assets/mascot.svg';pip.alt='Pip, your build buddy';
  const copy=element('div');copy.append(element('h2','','Let’s build!'),element('p','','Read top to bottom. What needs to happen first?'));
  guide.append(pip,copy);
  const panel=element('section','question-panel');
  const title=element('h2','question-title',challenge.prompt);title.id='builder-prompt';
  panel.append(element('p','eyebrow',`BUILD ${current+1} / 3 · ${challenge.difficulty.toUpperCase()}`),title,element('p','scoring-note','Drag to reorder, or use ↑ and ↓. Keyboard: focus a block and press Alt + ↑ / ↓.'));
  const list=element('ol','block-list');list.id='block-list';list.setAttribute('aria-label','Code blocks in execution order');
  const announcement=element('p','sr-only');announcement.id='order-status';announcement.setAttribute('role','status');
  const feedback=element('div','feedback');feedback.id='builder-feedback';feedback.setAttribute('role','status');
  const actions=element('div','builder-actions');
  const check=element('button','button','Check answer');check.id='check-order';
  const next=element('button','button','Next build →');next.id='next-build';next.hidden=true;
  check.onclick=()=>{
    if(locked)return;
    const correct=isCorrectOrder(order,challenge.correctOrder);state=completeChallenge(state,challenge.id,correct);updateHUD(state,'builder');
    feedback.className=`feedback ${correct?'correct':'incorrect'}`;
    feedback.replaceChildren(element('strong','',correct?'Great build! The pieces fit.':'Not quite. Give that order another try.'),element('p','',correct?challenge.explanation:`Hint: start with ${challenge.blocks[challenge.correctOrder[0]]}`));
    if(correct){locked=true;check.disabled=true;renderBlocks();next.hidden=false;next.textContent=current===2?'Finish build →':'Next build →';next.focus();}
  };
  next.onclick=()=>{next.disabled=true;if(state.status==='complete')showResults({mode:'builder',key:'builder',state,title:'Brilliant building!',subtitle:'Three builds complete. You turned steps into working code.',onReplay:start});else{current++;renderChallenge();focusHeading($('.question-panel'));}};
  actions.append(check,next);panel.append(list,announcement,feedback,actions);board.append(guide,panel);content.append(board);renderBlocks();
}
function reorder(from,to){
  if(locked||from===to||to<0||to>=order.length)return;
  order=moveBlock(order,from,to);renderBlocks();
  $('#order-status').textContent=`Block moved from position ${from+1} to ${to+1}.`;
  $('#block-list').children[to].focus({preventScroll:true});
}
function renderBlocks(){
  const challenge=state.questions[current],list=$('#block-list');list.replaceChildren();
  order.forEach((id,index)=>{
    const row=element('li','code-block');row.tabIndex=0;row.draggable=!locked;row.dataset.block=String(id);
    row.setAttribute('aria-label',`Block ${index+1}: ${challenge.blocks[id]}`);
    row.append(element('span','block-number',String(index+1)),element('code','',challenge.blocks[id]));
    const controls=element('div','reorder-controls');
    for(const [label,step,symbol] of [['up',-1,'↑'],['down',1,'↓']]){
      const button=element('button','',symbol);button.setAttribute('aria-label',`Move block ${index+1} ${label}`);button.disabled=locked||index+step<0||index+step>=order.length;button.onclick=()=>reorder(index,index+step);controls.append(button);
    }
    row.append(controls);
    row.onkeydown=event=>{if(event.altKey&&['ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();reorder(index,index+(event.key==='ArrowUp'?-1:1));}};
    row.ondragstart=event=>{dragged=index;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',String(index));row.classList.add('dragging');};
    row.ondragend=()=>{dragged=null;row.classList.remove('dragging');list.querySelectorAll('.drag-over').forEach(e=>e.classList.remove('drag-over'));};
    row.ondragover=event=>{if(dragged!==null&&!locked){event.preventDefault();event.dataTransfer.dropEffect='move';row.classList.add('drag-over');}};
    row.ondragleave=()=>row.classList.remove('drag-over');
    row.ondrop=event=>{event.preventDefault();const from=dragged;dragged=null;if(from!==null)reorder(from,index);};
    list.append(row);
  });
}

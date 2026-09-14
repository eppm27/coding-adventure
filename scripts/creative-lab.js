import { reducedMotion as motion } from './motion.js';
import { labActions, executeProgram, initialLabState, labComplete, moveBlock } from './new-game-state.js';
import { $, element } from './ui.js';
import { load, save, browserStorage } from './storage.js';
import { markLevelComplete } from './progress.js';
let commands=[],timer=0,running=false,runToken=0;

for(const [id,action] of Object.entries(labActions)){
  const button=element('button','',action.label);button.type='button';button.onclick=()=>{if(commands.length<8&&!running){commands.push(id);renderProgram();$('#lab-log').textContent=`Added ${action.label.toLowerCase()}. ${commands.length} of 8 actions.`;}};$('#lab-add').append(button);
}
$('#background').onchange=()=>{$('#lab-stage').className=`lab-stage ${$('#background').value}`;};
$('#character').onchange=()=>{const image=$('#character-image');image.src=`assets/${$('#character').value}.svg`;image.alt=$('#character').value==='mascot'?'Pip the explorer':'A friendly bug';};
$('#starter').onclick=()=>{commands=['right','jump','say'];renderProgram();$('#lab-log').textContent='A starter plan is ready: move, jump, say hello. Try running it!';};
$('#run').onclick=run;
$('#mobile-run').onclick=()=>{run();$('#lab-stage').tabIndex=-1;$('#lab-stage').focus({preventScroll:true});$('#lab-stage').scrollIntoView({block:'start'});};
$('#stop').onclick=()=>{cancelRun();$('#lab-log').textContent='Stopped. Change a step, or run again from the start.';};
$('#reset-lab').onclick=()=>{
  cancelRun();commands=[];$('#background').value='forest';$('#character').value='mascot';$('#repeat').value='1';$('#background').onchange();$('#character').onchange();
  $('#lab-done').hidden=true;paint(initialLabState());renderProgram();$('#lab-log').textContent='A fresh canvas. What will you make?';
};
window.addEventListener('pagehide',cancelRun);
function renderProgram(focusIndex){
  const list=$('#lab-program');list.replaceChildren();
  commands.forEach((id,index)=>{
    const row=element('li');row.append(element('span','',`${index+1}. ${labActions[id].code}`));
    for(const [symbol,label,step] of [['↑','up',-1],['↓','down',1],['×','remove',0]]){
      const button=element('button','',symbol);button.type='button';button.setAttribute('aria-label',label==='remove'?`Remove action ${index+1}`:`Move action ${index+1} ${label}`);
      button.disabled=running||(step!==0&&(index+step<0||index+step>=commands.length));
      button.onclick=()=>{if(step)commands=moveBlock(commands,index,index+step);else commands.splice(index,1);renderProgram(Math.min(commands.length-1,index+step));$('#lab-log').textContent='Plan updated. Ready to try it?';};row.append(button);
    }
    list.append(row);
  });
  $('#empty-program').hidden=commands.length>0;$('#run').disabled=running||commands.length===0;$('#mobile-run').disabled=running||commands.length===0;
  $('#lab-add').querySelectorAll('button').forEach(button=>{button.disabled=running||commands.length>=8;});
  if(focusIndex>=0)list.children[focusIndex]?.querySelector('button:not(:disabled)')?.focus();
}
function setRunning(value){running=value;$('#lab-settings').disabled=value;$('#stop').disabled=!value;renderProgram();}
function cancelRun(){clearTimeout(timer);runToken++;setRunning(false);$('#lab-character').classList.remove('jumping');}
function paint(frame){
  const character=$('#lab-character');character.style.setProperty('--position',`${frame.x}%`);character.style.filter=`hue-rotate(${frame.color*100}deg)`;
  character.classList.remove('jumping');
  // The interpreter still performs jump steps with reduced motion, but without displacement.
  if(frame.pose==='jump'&&!motion.matches){void character.offsetWidth;character.classList.add('jumping');}
  $('#lab-speech').textContent=frame.message;$('#lab-speech').hidden=!frame.message;
}
function run(){
  if(running)return;
  const frames=executeProgram(commands,Number($('#repeat').value));
  if(!frames.length){$('#lab-log').textContent='Add a valid action before running your plan.';return;}
  $('#lab-done').hidden=true;paint(initialLabState());setRunning(true);const token=++runToken;let index=0;
  function next(){
    if(token!==runToken)return;
    if(index===frames.length){
      setRunning(false);$('#lab-character').classList.remove('jumping');
      const complete=labComplete(commands,frames);
      $('#lab-log').textContent=`Plan finished! ${frames.length} steps followed.${complete?' Great creating!':' Try 3 different actions to earn your completion star.'}`;
      if(complete){const profile=markLevelComplete(load(browserStorage()),'lab');const saved=save(browserStorage(),profile);$('#lab-done').hidden=false;$('#lab-saved').textContent=saved?'★ Creative Lab completed · Saved on this browser':'Storage is unavailable, but your creation still counts for this visit.';}
      return;
    }
    const frame=frames[index];paint(frame);$('#lab-log').textContent=`Step ${index+1} / ${frames.length}: ${labActions[frame.command].label}${frame.pose==='jump'&&motion.matches?' (reduced motion)':''}.`;
    index++;timer=setTimeout(next,motion.matches?250:700);
  }
  next();
}
renderProgram();

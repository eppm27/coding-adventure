import './motion.js';
import { $, element, focusHeading } from './ui.js';
import { load, save, updateRecord, browserStorage } from './storage.js';
import { markLevelComplete, levels } from './progress.js';
export function updateHUD(state,key,profile=load(browserStorage())) {
  $('#score').textContent=state.score; $('#streak').textContent=state.streak;
  $('#progress').textContent=`${state.completed.length} / ${state.questions.length}`;
  $('#best').textContent=profile.records[key]?.score || 0;
  $('#progress-bar').max=state.questions.length; $('#progress-bar').value=state.completed.length;
}
export function showResults({mode,key,state,title,subtitle,onReplay,onChange,profile=load(browserStorage())}) {
  if(state.status!=='complete')return profile;
  profile=markLevelComplete(updateRecord(profile,key,state.score,state.bestStreak),key);
  const saved=save(browserStorage(),profile);
  $('#play').hidden=true;
  const result=$('#result');result.hidden=false;result.replaceChildren();
  const mascot=element('img','result-mascot');mascot.src='assets/mascot.svg';mascot.alt='Pip celebrates your progress';
  const stars=Math.max(1,Math.ceil(state.firstTryCorrect/state.questions.length*3));
  const reward=element('div','completion-mark','★'.repeat(stars)+'☆'.repeat(3-stars));reward.setAttribute('aria-label',`${stars} of 3 first-try stars`);
  const heading=element('h1','',title);heading.id='result-title';
  result.append(mascot,element('p','eyebrow','LEVEL COMPLETE!'),reward,heading,element('p','result-subtitle',subtitle));
  const stats=element('div','result-stats');
  for(const [label,value] of [['Score',state.score],['First-try correct',`${state.firstTryCorrect} / ${state.questions.length}`],['Best streak',state.bestStreak]]){
    const item=element('div');item.append(element('span','',label),element('strong','',String(value)));stats.append(item);
  }
  result.append(stats,element('p','record-note',saved?`Personal best: ${profile.records[key].score} · Saved on this browser`:'Browser storage is unavailable. You can still keep playing, but this result won’t survive a refresh.'));
  const actions=element('div','result-actions');
  const replay=element('button','button','Play again →');replay.onclick=onReplay;
  const nextLevel=levels[(levels.findIndex(l=>l.id===mode)+1)%levels.length];
  const next=element('a','button',`Next game: ${nextLevel.name} →`);next.href=nextLevel.file;
  const home=element('a','button secondary','Choose another level');home.href='index.html#games';
  actions.append(replay,next,home);
  if(onChange){const change=element('button','button secondary','Change path or difficulty');change.onclick=onChange;actions.append(change);}
  result.append(actions);focusHeading(result);return profile;
}
export function showEmpty() {
  $('#setup').hidden=true;$('#play').hidden=true;$('#result').hidden=true;$('#data-error').hidden=false;focusHeading($('#data-error'));
}

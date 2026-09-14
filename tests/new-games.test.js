import test from 'node:test';
import assert from 'node:assert/strict';
import { builderChallenges, debugChallenges } from '../scripts/challenges.js';
import { progressiveChallenges, shuffledOrder, moveBlock, isCorrectOrder, executeProgram, labComplete, initialLabState } from '../scripts/new-game-state.js';
import { createState, completeChallenge, selectQuestions, answerQuestion, validQuestion } from '../scripts/game-state.js';
import { completedLevels, markLevelComplete } from '../scripts/progress.js';
import { load,save,updateRecord } from '../scripts/storage.js';
test('builder challenges have complete, unambiguous order permutations',()=>{
  assert.equal(builderChallenges.length,9);
  for(const challenge of builderChallenges){
    assert.ok(challenge.prompt&&challenge.explanation);
    assert.equal(challenge.correctOrder.length,challenge.blocks.length);
    assert.deepEqual([...challenge.correctOrder].sort((a,b)=>a-b),challenge.blocks.map((_,index)=>index));
    const order=shuffledOrder(challenge,()=>.99);
    assert.equal(isCorrectOrder(order,challenge.correctOrder),false);
    assert.deepEqual([...order].sort((a,b)=>a-b),challenge.correctOrder);
  }
});
test('builder selection increases difficulty and varies on replay',()=>{
  const first=progressiveChallenges(builderChallenges,1,()=>.1),second=progressiveChallenges(builderChallenges,1,()=>.9);
  assert.deepEqual(first.map(q=>q.difficulty),['beginner','intermediate','advanced']);assert.notDeepEqual(first.map(q=>q.id),second.map(q=>q.id));
});
test('keyboard and drag reorder use the same immutable operation',()=>{
  const initial=[2,0,1];assert.deepEqual(moveBlock(initial,0,2),[0,1,2]);assert.deepEqual(initial,[2,0,1]);
  for(const [from,to] of [[-1,0],[0,7],[1,.5]])assert.deepEqual(moveBlock(initial,from,to),initial);
  assert.equal(isCorrectOrder([0,1],[0,1,2]),false);assert.equal(isCorrectOrder([0,0,2],[0,1,2]),false);
});
test('builder scores retries once and completes exactly three challenges',()=>{
  const selected=progressiveChallenges(builderChallenges);let state=createState(selected);
  state=completeChallenge(state,selected[0].id,false);state=completeChallenge(state,selected[0].id,true);
  assert.equal(state.score,100);assert.equal(state.streak,0);
  state=completeChallenge(state,selected[1].id,true);state=completeChallenge(state,selected[2].id,true);
  assert.equal(state.score,400);assert.equal(state.bestStreak,2);assert.equal(state.status,'complete');
  assert.equal(completeChallenge(state,selected[2].id,true),state);
});
test('debug has 12 valid questions with code and increasing six-question sessions',()=>{
  assert.equal(debugChallenges.length,12);assert.ok(debugChallenges.every(q=>validQuestion(q)&&q.code));
  const selected=['beginner','intermediate','advanced'].flatMap(d=>selectQuestions(debugChallenges,'debug',d,2));
  assert.equal(selected.length,6);assert.deepEqual(selected.map(q=>q.difficulty),['beginner','beginner','intermediate','intermediate','advanced','advanced']);
  let state=createState(selected);for(const q of selected)state=answerQuestion(state,q.id,q.answer);
  assert.equal(state.status,'complete');assert.equal(state.score,900);assert.equal(state.bestStreak,6);
});
test('lab executes predefined commands in order with bounded repeats',()=>{
  const frames=executeProgram(['right','jump','say','color'],2);
  assert.equal(frames.length,8);assert.deepEqual(frames.map(f=>f.command),['right','jump','say','color','right','jump','say','color']);
  assert.equal(frames[0].x,70);assert.equal(frames[1].pose,'jump');assert.equal(frames[2].message,'Hello, world!');assert.equal(frames[7].color,2);
  assert.deepEqual(initialLabState(),{x:50,color:0,message:'',pose:'idle'});
});
test('lab cannot leave stage bounds or execute untrusted input',()=>{
  assert.ok(executeProgram(Array(8).fill('right'),4).every(f=>f.x<=90));
  assert.ok(executeProgram(Array(8).fill('left'),4).every(f=>f.x>=10));
  for(const invalid of [['alert(1)'],['__proto__'],['constructor'],[{}],Array(9).fill('jump')])assert.deepEqual(executeProgram(invalid,1),[]);
  for(const repeats of [0,5,1.5,'2'])assert.deepEqual(executeProgram(['jump'],repeats),[]);
  assert.deepEqual(executeProgram(null,1),[]);
});
test('lab completion rewards experimentation, not repeating one command',()=>{
  assert.equal(labComplete(['right','right','right'],executeProgram(['right','right','right'])),false);
  const commands=['right','jump','say'];assert.equal(labComplete(commands,executeProgram(commands)),true);assert.equal(labComplete(commands,[]),false);
});
test('five-mode completion and new records persist without deleting existing records',()=>{
  let profile=load(null);profile=updateRecord(profile,'escape',900,6);
  for(const key of ['escape','adventure:back-end:advanced','builder','debug','lab'])profile=markLevelComplete(profile,key);
  profile=updateRecord(profile,'builder',450,3);
  let stored;const storage={getItem:()=>stored,setItem:(_k,v)=>{stored=v;}};assert.equal(save(storage,profile),true);
  const restored=load(storage);assert.deepEqual(completedLevels(restored),['escape','adventure','builder','debug','lab']);
  assert.equal(restored.records.escape.score,900);assert.equal(restored.records.builder.score,450);assert.equal(restored.records.builder.completed,true);
});
test('completion marking is idempotent and does not inflate score',()=>{
  const initial=updateRecord(load(null),'debug',800,4);const once=markLevelComplete(initial,'debug');assert.deepEqual(markLevelComplete(once,'debug'),once);assert.equal(initial.records.debug.completed,undefined);
  assert.equal(updateRecord(once,'debug',100,1).records.debug.completed,true);
});
test('legacy completed-run scores still count toward the explorer journal',()=>{
  const profile=updateRecord(load(null),'escape',700,1);
  assert.deepEqual(completedLevels(profile),['escape']);
  assert.deepEqual(completedLevels(load(null)),[]);
});

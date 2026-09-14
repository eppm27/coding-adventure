import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../scripts/questions.js';
import { answerQuestion, createState, selectQuestions, validQuestion, targetPosition } from '../scripts/game-state.js';
import { load, save, updateRecord } from '../scripts/storage.js';
const sample = questions.slice(0, 3);
test('all 60 questions are complete, uniquely identified, and have valid answers', () => {
  assert.equal(questions.length, 60);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  assert.ok(questions.every(validQuestion));
  for (const path of ['front-end', 'back-end']) for (const difficulty of ['beginner','intermediate','advanced']) {
    assert.equal(questions.filter(q => q.category === path && q.difficulty === difficulty).length, 8);
  }
  assert.equal(questions.filter(q => q.category === 'general').length, 12);
});
test('selection filters category/difficulty, samples without repeats, and preserves correct answer text', () => {
  const selected = selectQuestions(questions, 'back-end', 'advanced', 5, () => .4);
  assert.equal(selected.length, 5);
  assert.equal(new Set(selected.map(q => q.id)).size, 5);
  for (const q of selected) {
    assert.equal(q.category, 'back-end'); assert.equal(q.difficulty, 'advanced');
    const original = questions.find(original => original.id === q.id);
    assert.equal(q.options[q.answer], original.options[original.answer]);
    assert.notEqual(q, original);
  }
  assert.notDeepEqual(selected.map(q => q.id), selectQuestions(questions, 'back-end', 'advanced', 5, () => .8).map(q => q.id));
});
test('invalid/duplicate data is excluded and missing pools give an empty state', () => {
  assert.deepEqual(selectQuestions([], 'general','beginner',6), []);
  assert.equal(createState([]).status, 'empty');
  assert.equal(selectQuestions([sample[0], sample[0], {...sample[1],answer:9}], 'front-end','beginner',6).length,1);
});
test('first-try scoring, streaks, retry scoring, and completion are predictable', () => {
  let state = createState(sample);
  state = answerQuestion(state,sample[0].id,0);
  assert.equal(state.score,150); assert.equal(state.streak,1);
  state = answerQuestion(state,sample[1].id,0);
  assert.equal(state.score,300); assert.equal(state.streak,2);
  state = answerQuestion(state,sample[2].id,1);
  assert.equal(state.score,300); assert.equal(state.streak,0); assert.equal(state.bestStreak,2);
  state = answerQuestion(state,sample[2].id,0);
  assert.equal(state.score,400); assert.equal(state.firstTryCorrect,2);
  assert.equal(state.streak,0); assert.equal(state.status,'complete');
});
test('duplicate answers and invalid inputs cannot award points or mutate state', () => {
  let state = createState(sample);
  for (const [id, option] of [['missing',0],[sample[0].id,-1],[sample[0].id,10],[sample[0].id,0.1]]) assert.equal(answerQuestion(state,id,option), state);
  state = answerQuestion(state,sample[0].id,0);
  assert.equal(answerQuestion(state,sample[0].id,0),state);
});
test('restart creates clean state without mutating a prior run', () => {
  const initial = createState(sample);
  const played = answerQuestion(initial,sample[0].id,0);
  assert.equal(initial.score,0); assert.equal(played.score,150);
  assert.deepEqual(createState(sample),initial);
});
test('records only improve and stay isolated by mode/path/difficulty', () => {
  const data = load(null);
  const first = updateRecord(data,'escape',900,6);
  const lower = updateRecord(first,'escape',600,3);
  const other = updateRecord(lower,'adventure:front-end:beginner',750,5);
  assert.deepEqual(other.records.escape,{score:900,streak:6});
  assert.deepEqual(other.records['adventure:front-end:beginner'],{score:750,streak:5});
  assert.deepEqual(data.records,{});
});
test('storage roundtrip and preference validation', () => {
  let value;
  const storage = { getItem: () => value, setItem: (_key,newValue) => { value=newValue; } };
  const data = {...updateRecord(load(null),'escape',900,6),path:'back-end',difficulty:'advanced'};
  assert.equal(save(storage,data),true); assert.deepEqual(load(storage),data);
  value = JSON.stringify({records:{escape:{score:-1,streak:'bad'},unknown:{score:10}},path:'invalid',difficulty:'wrong'});
  assert.deepEqual(load(storage),{records:{escape:{score:0,streak:0}},path:'front-end',difficulty:'beginner'});
});
test('blocked, corrupted, null, and quota-limited storage do not crash', () => {
  for (const text of ['bad json','null','[]','42']) assert.doesNotThrow(() => load({getItem:()=>text}));
  const blocked = {getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
  assert.deepEqual(load(blocked),load(null)); assert.equal(save(blocked,{}),false);
});
test('all six moving/static targets remain in bounds and never overlap at requested widths', () => {
  for (const width of [280,350,704,960,1136,1280,1440]) for (const height of [260,340,390,500]) for (const moving of [true,false]) {
    for (let time=0; time<40; time+=.25) {
      const positions=Array.from({length:6},(_,i)=>targetPosition(i,time,width,height,moving));
      for (const p of positions) { assert.ok(p.x>=0 && p.x+64<=width); assert.ok(p.y>=0 && p.y+64<=height); }
      positions.forEach((p,i)=>positions.slice(i+1).forEach(q=>assert.ok(Math.abs(p.x-q.x)>=64 || Math.abs(p.y-q.y)>=64)));
    }
  }
});

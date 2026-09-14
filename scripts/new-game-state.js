import { shuffle } from './game-state.js';
export const difficulties = ['beginner','intermediate','advanced'];
export function progressiveChallenges(bank, perDifficulty = 1, random = Math.random) {
  return difficulties.flatMap(difficulty => shuffle(bank.filter(q => q && q.difficulty === difficulty), random).slice(0, perDifficulty));
}
export function moveBlock(order, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= order.length || to >= order.length) return [...order];
  const result = [...order]; const [block] = result.splice(from,1); result.splice(to,0,block); return result;
}
export function isCorrectOrder(order, expected) {
  return Array.isArray(order) && order.length === expected.length && order.every((value,index)=>value === expected[index]);
}
export function shuffledOrder(challenge, random = Math.random) {
  const order = shuffle(challenge.correctOrder,random);
  return isCorrectOrder(order,challenge.correctOrder) ? [...order.slice(1),order[0]] : order;
}
export const labActions = Object.freeze({
  right: {label:'Move right',code:'MOVE RIGHT  →  20',type:'move'},
  left: {label:'Move left',code:'MOVE LEFT  ←  20',type:'move'},
  jump: {label:'Jump',code:'JUMP  ↑',type:'jump'},
  say: {label:'Say hello',code:'SAY  “Hello, world!”',type:'say'},
  color: {label:'Change color',code:'CHANGE COLOR',type:'color'},
  wait: {label:'Wait',code:'WAIT',type:'wait'}
});
export const initialLabState = () => ({x:50,color:0,message:'',pose:'idle'});
// A bounded interpreter for predefined command IDs. No user code is evaluated.
export function executeProgram(commands, repetitions = 1) {
  if (!Array.isArray(commands) || commands.length > 8 || !Number.isInteger(repetitions) || repetitions < 1 || repetitions > 4 || commands.some(id => !Object.hasOwn(labActions,id))) return [];
  let state = initialLabState(); const frames=[];
  for (let repeat=0;repeat<repetitions;repeat++) for (let index=0;index<commands.length;index++) {
    const command=commands[index]; state={...state,pose:'idle'};
    if(command==='right')state.x=Math.min(90,state.x+20);
    if(command==='left')state.x=Math.max(10,state.x-20);
    if(command==='jump')state.pose='jump';
    if(command==='say')state.message='Hello, world!';
    if(command==='color')state.color=(state.color+1)%3;
    frames.push({...state,command,index,repeat});
  }
  return frames;
}
export function labComplete(commands, frames) { return commands.length >= 3 && frames.length >= commands.length && new Set(commands).size >= 3; }

export function validBuilderChallenge(q) {
  return Boolean(q && typeof q.id==='string' && typeof q.prompt==='string' && typeof q.explanation==='string'
    && Array.isArray(q.blocks) && q.blocks.length>=2 && q.blocks.every(block=>typeof block==='string')
    && Array.isArray(q.correctOrder) && q.correctOrder.length===q.blocks.length
    && new Set(q.correctOrder).size===q.blocks.length && q.correctOrder.every(id=>Number.isInteger(id)&&id>=0&&id<q.blocks.length));
}

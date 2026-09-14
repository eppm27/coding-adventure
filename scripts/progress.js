export const levels = [
  {id:'escape',number:1,name:'Escape Room',file:'escaperoom.html',color:'blue'},
  {id:'adventure',number:2,name:'Choose Your Adventure',file:'chooseyouradventure.html',color:'green'},
  {id:'builder',number:3,name:'Code Builder',file:'codebuilder.html',color:'orange'},
  {id:'debug',number:4,name:'Debug Dash',file:'debugdash.html',color:'purple'},
  {id:'lab',number:5,name:'Creative Lab',file:'creativelab.html',color:'coral'}
];
export function completedLevels(profile) {
  return levels.filter(level=>Object.entries(profile.records).some(([key,record])=>(record.completed === true || record.score > 0) && (key === level.id || (level.id === 'adventure' && key.startsWith('adventure:'))))).map(level=>level.id);
}
export function markLevelComplete(profile,key) {
  return {...profile,records:{...profile.records,[key]:{score:0,streak:0,...profile.records[key],completed:true}}};
}

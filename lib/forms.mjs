const integers = new Set(['trips','duration_minutes','questions_done','commute_minutes','gym_weekly_target','study_weekly_target','uber_weekly_target']);
export function fieldLimits(name) {
 return {min:0, step:integers.has(name)?1:'any', max:name==='score_percent'?100:name==='duration_minutes'?1440:name==='commute_minutes'?240:name.endsWith('_weekly_target')?14:undefined};
}
export function prepareRow(table, row) {
 const result={...row};
 for (const [name,value] of Object.entries(result)) {
  if(typeof value!=='number')continue;
  const {max}=fieldLimits(name);
  if(!Number.isFinite(value)||value<0||(max!==undefined&&value>max)||(integers.has(name)&&!Number.isInteger(value)))throw Error('Revise os valores numéricos: há um valor fora do intervalo permitido.');
 }
 if(table==='work_shifts') {
  if(result.shift_type==='off'){result.start_time=null;result.end_time=null;}
  else if(!result.start_time||!result.end_time)throw Error('Informe entrada e saída para um dia de trabalho.');
 }
 return result;
}

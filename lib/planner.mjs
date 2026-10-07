export const minutes=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
export const time=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export function planDay({shift,settings={},energy=3,mode='auto',progress={}}){
 const sleep=minutes(settings.default_sleep_time||'23:00'),wake=minutes(settings.default_wake_time||'06:30'),commute=settings.commute_minutes??50;
 const off=shift?.shift_type==='off'; const start=minutes(shift?.start_time||settings.default_work_start||'08:40'),end=minutes(shift?.end_time||settings.default_work_end||'17:00');
 if(!off&&end<=start)return {mode:'rest',reason:'Turno atravessa a meia-noite. Planeje manualmente para preservar o descanso.',items:[]};
 let cursor=off?wake+90:Math.max(wake,end+commute+30);
 let chosen=mode==='auto'?(energy<=2?'rest':(progress.gym??0)<(settings.gym_weekly_target??3)?'gym_study':(progress.study??0)<(settings.study_weekly_target??3)?'study':'uber_return'):mode;
 const items=[];const add=(category,title,a,b)=>{if(a>=wake&&b<=sleep&&b>a)items.push({category,title,start_time:time(a),end_time:time(b)})};
 if(!off){add('commute','Deslocamento para o trabalho',start-commute,start);add('work','Trabalho',start,end);add('commute','Volta para casa',end,end+commute)}
 const task=(cat,title,duration)=>{if(cursor+duration<=sleep-30){add(cat,title,cursor,cursor+duration);cursor+=duration+20}};
 if(chosen.includes('gym'))task('gym','Academia',60);
 if(['gym_study','study'].includes(chosen))task('study','Estudo focado',45);
 if(chosen.startsWith('uber'))task('uber','Uber — janela sugerida',chosen==='uber_focused'?120:60);
 if(['rest','home'].includes(chosen))task('leisure','Descanso e tempo pessoal',60);
 return {mode:chosen,reason:'Sugestão baseada na escala, energia, metas e horário de dormir. Não usa demanda de corridas em tempo real.',items};
}

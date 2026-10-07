import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tracks,lessonTopic,studyProgress} from '../lib/study.mjs';
const track=tracks[0];
const record=(lesson,date,score=100)=>({subject:track.id,topic:lessonTopic(track,lesson),session_date:date,score_percent:score});
test('inicia na primeira aula e avança após domínio',()=>{
 assert.equal(studyProgress(track,[],'2026-10-07').next.id,track.lessons[0].id);
 const p=studyProgress(track,[record(track.lessons[0],'2026-10-07')],'2026-10-07');
 assert.equal(p.completed,1);assert.equal(p.next.id,track.lessons[1].id);
});
test('resultado baixo recomenda reforço e revisão retorna após três dias',()=>{
 assert.equal(studyProgress(track,[record(track.lessons[0],'2026-10-07',50)],'2026-10-07').completed,0);
 const p=studyProgress(track,[record(track.lessons[0],'2026-10-04')],'2026-10-07');
 assert.equal(p.review,true);assert.equal(p.next.id,track.lessons[0].id);
});
test('sessões futuras ou de outra trilha não avançam a trilha',()=>{
 const rows=[record(track.lessons[0],'2026-10-08'),{...record(track.lessons[0],'2026-10-07'),subject:'English'}];
 assert.equal(studyProgress(track,rows,'2026-10-07').completed,0);
});
test('todo material tem prática, cartões e questões com resposta válida',()=>{
 for(const t of tracks)for(const l of t.lessons){assert.ok(l.goal&&l.practice&&l.sections.length&&l.cards.length);for(const q of l.quiz)assert.ok(q.answer>=0&&q.answer<q.options.length&&q.explanation);}
});
test('PMPE usa Other no banco e mantém progresso separado por aula',()=>{
 const pmpe=tracks.find(t=>t.id==='PMPE');const lesson=pmpe.lessons[0];
 const row={subject:'Other',topic:lessonTopic(pmpe,lesson),session_date:'2026-10-07',score_percent:100};
 assert.equal(studyProgress(pmpe,[row],'2026-10-07').completed,1);
 assert.equal(studyProgress(track,[row],'2026-10-07').completed,0);
 assert.equal(pmpe.syllabus.length,7);
});

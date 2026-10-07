import {test} from 'node:test';
import assert from 'node:assert/strict';
import {prepareRow} from '../lib/forms.mjs';
test('folga remove horários preenchidos antes de gravar',()=>assert.deepEqual(prepareRow('work_shifts',{shift_type:'off',start_time:'08:40',end_time:'17:00'}),{shift_type:'off',start_time:null,end_time:null}));
test('turno de trabalho exige ambos os horários e permite turno noturno',()=>{
 assert.throws(()=>prepareRow('work_shifts',{shift_type:'regular',start_time:'08:40'}));
 assert.equal(prepareRow('work_shifts',{shift_type:'custom',start_time:'22:00',end_time:'07:00'}).end_time,'07:00');
});
test('valores respeitam limites e tipos do banco',()=>{
 for(const row of [{trips:1.5},{duration_minutes:1441},{commute_minutes:241},{gym_weekly_target:15},{score_percent:101},{gross_earnings:-1}])assert.throws(()=>prepareRow('test',row));
 assert.equal(prepareRow('uber_sessions',{trips:2,gross_earnings:10.5}).gross_earnings,10.5);
 assert.equal(prepareRow('routine_settings',{gym_weekly_target:14}).gym_weekly_target,14);
});
test('horários Uber são normalizados e exigem intervalo positivo',()=>{
 const row=prepareRow('uber_sessions',{started_at:'2026-10-07T12:00:00Z',ended_at:'2026-10-07T13:00:00Z'});assert.equal(row.started_at,'2026-10-07T12:00:00.000Z');assert.throws(()=>prepareRow('uber_sessions',{started_at:'2026-10-07T12:00:00Z'}));assert.throws(()=>prepareRow('uber_sessions',{started_at:'2026-10-07T12:00:00Z',ended_at:'2026-10-07T11:00:00Z'}));
});

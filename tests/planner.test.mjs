import {test} from 'node:test';import assert from 'node:assert/strict';import {planDay,minutes} from '../lib/planner.mjs';
test('não sobrepõe atividades e respeita o sono',()=>{const p=planDay({shift:{start_time:'08:40',end_time:'17:00'},mode:'gym_study'});for(let i=1;i<p.items.length;i++)assert.ok(minutes(p.items[i].start_time)>=minutes(p.items[i-1].end_time));assert.ok(p.items.every(a=>minutes(a.end_time)<=1380))});
test('energia baixa recomenda descanso',()=>assert.equal(planDay({energy:1}).mode,'rest'));
test('turno noturno exige planejamento manual',()=>assert.equal(planDay({shift:{start_time:'22:00',end_time:'07:00'}}).items.length,0));

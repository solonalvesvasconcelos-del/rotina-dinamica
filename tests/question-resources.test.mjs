import {test} from 'node:test';import assert from 'node:assert/strict';import {questionResources} from '../lib/question-resources.mjs';
test('referências têm origem, identificação e assuntos, sem gabaritos inventados',()=>{
 assert.equal(new Set(questionResources.map(q=>q.id)).size,questionResources.length);
 assert.ok(questionResources.length>=10);
 for(const q of questionResources){assert.match(q.id,/^Q\d+$/);assert.equal(new URL(q.url).hostname,'www.qconcursos.com');assert.equal(q.bank,'INSTITUTO AOCP');assert.ok(q.subject&&q.topics&&q.exam&&q.verifiedAt);assert.equal(q.answer,undefined);}
});

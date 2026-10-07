'use client';
import {useState} from 'react';
import {questionResources} from '../lib/question-resources.mjs';
export default function QuestionResources(){
 const [subject,setSubject]=useState('Todas'),[search,setSearch]=useState('');
 const subjects=[...new Set(questionResources.map(q=>q.subject))];
 const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const questions=questionResources.filter(q=>(subject==='Todas'||q.subject===subject)&&normalized(`${q.id} ${q.topics} ${q.institution} ${q.exam}`).includes(normalized(search)));
 return <section><p className="eyebrow">QUESTÕES REAIS · AOCP · NÍVEL MÉDIO</p><h2>Questões encontradas na internet</h2><p>Seleção de {questionResources.length} questões do acervo Qconcursos, consultado em 07/10/2026. Os assuntos foram comparados com o edital PMPE enviado. São questões de outros cargos; não representam um simulado completo de Soldado.</p>
 <div className="formgrid"><label>Filtrar disciplina<select value={subject} onChange={e=>setSubject(e.target.value)}><option>Todas</option>{subjects.map(s=><option key={s}>{s}</option>)}</select></label><label>Buscar assunto ou prova<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ex.: concordância, malware, lógica"/></label></div><p role="status">{questions.length} questões encontradas</p>
 <p>Abra a questão, responda sem consultar a solução e confira o gabarito na fonte. Depois explique o erro com suas próprias palavras. A fonte pode exigir conta e aplicar limites gratuitos; enunciados e gabaritos não foram importados para este sistema.</p>
 <div className="questionResourceList">{questions.map(q=><article className="studyCard" key={q.id}><p className="eyebrow">{q.subject} · {q.id}</p><h3>{q.topics}</h3><p>{q.exam}</p><p><small>{q.bank} · {q.level} · {q.year}</small></p><a href={q.url} target="_blank" rel="noreferrer">Resolver questão na fonte ↗</a></article>)}</div>{!questions.length&&<p>Não há questões nessa seleção com esses filtros. Tente outro termo.</p>}
 <p>História de Pernambuco e Direitos Humanos ainda aguardam questões com origem e compatibilidade verificadas.</p></section>
}

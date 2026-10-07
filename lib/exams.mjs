export const examSources=[{id:'pmpe-2023',name:'PMPE · Soldado · edital 2023',bank:'Instituto AOCP',official:'https://www.institutoaocp.org.br/concursos/588',documents:'https://link.institutoaocp.org.br/open-link?identificador=db6c4e9c-6d4f-497c-8078-86a05926a995',archive:'https://www.pciconcursos.com.br/provas/download/soldado-da-policia-militar-pm-pe-aocp-2023',fit:'Mesmo cargo e banca. Compare cada questão com o edital atual; legislação e programas de informática podem ter mudado.'}];
export function parseAnswerKey(text){
 const key={};
 for(const line of text.trim().split(/\n+/)){
  const match=line.trim().match(/^(\d+)\s*[-:;.)]?\s*([A-E]|X|ANULADA)\s*$/i);
  if(!match)throw Error('Use uma linha por questão: 1 A. Para anuladas, use 2 X.');
  const number=Number(match[1]);if(number<1||number>200||key[number])throw Error('Confira números duplicados ou fora do intervalo de 1 a 200.');
  key[number]=match[2].toUpperCase()==='ANULADA'?'X':match[2].toUpperCase();
 }
 return key;
}
export function gradeExam(key,answers){
 const valid=Object.keys(key).filter(n=>key[n]!=='X');
 const correct=valid.filter(n=>answers[n]===key[n]);
 const wrong=valid.filter(n=>answers[n]&&answers[n]!==key[n]);
 const blank=valid.filter(n=>!answers[n]);
 return {total:valid.length,correct:correct.length,wrong,blank,annulled:Object.keys(key).filter(n=>key[n]==='X'),percent:valid.length?Math.round(correct.length/valid.length*100):0};
}

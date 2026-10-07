export const financeSources = {airbnb:'Airbnb',uber:'Uber',inorpel:'Inorpel',personal:'Pessoal'};
export const financeKinds = {income:'Receita',expense:'Despesa',allocation:'Separar para reserva',release:'Retirar da reserva'};
export function moneyCents(value) {
 const text=String(value??'').trim().replace(',','.');
 if(!/^\d+(?:\.\d{1,2})?$/.test(text))throw Error('Informe um valor positivo com até duas casas decimais.');
 const [integer,decimal='']=text.split('.');const cents=Number(integer)*100+Number(decimal.padEnd(2,'0'));
 if(!Number.isSafeInteger(cents)||cents>999999999999)throw Error('Valor fora do limite permitido.');
 return cents;
}
export const currency=cents=>(cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
export function prepareFinanceRow(input) {
 const amount=moneyCents(input.amount);if(amount<=0)throw Error('O valor deve ser maior que zero.');
 if(!financeSources[input.source]||!financeKinds[input.kind])throw Error('Selecione a origem e o tipo do lançamento.');
 if(input.source==='uber'&&input.kind==='income')throw Error('Registre receitas Uber na área Uber; elas aparecem automaticamente em Finanças.');
 if(!input.description?.trim())throw Error('Informe uma descrição.');
 if(!validDate(input.transaction_date))throw Error('Informe uma data válida.');
 if(!['pending','settled'].includes(input.status))throw Error('Selecione a situação do lançamento.');
 if(input.status==='settled'&&!validDate(input.settled_date))throw Error('Informe a data de recebimento ou pagamento.');
 const reserve=['allocation','release'].includes(input.kind);
 if(reserve&&(!input.reserve_id||input.source!=='personal'||input.status!=='settled'))throw Error('Movimentações de reserva devem ser confirmadas, pessoais e vinculadas a uma reserva.');
 return {source:input.source,kind:input.kind,description:input.description.trim(),amount:(amount/100).toFixed(2),transaction_date:input.transaction_date,status:input.status,settled_date:input.status==='settled'?input.settled_date:null,category:input.category?.trim()||'Outros',property_name:input.source==='airbnb'?(input.property_name?.trim()||null):null,reserve_id:reserve?input.reserve_id:null};
}
export function ledgerEntries(transactions,uberSessions) {
 return [...transactions,...uberSessions.filter(s=>s.gross_earnings!=null&&Number(s.gross_earnings)>0).map(s=>({id:`uber:${s.id}`,source:'uber',kind:'income',description:`Sessão Uber · ${s.trips??0} corridas`,amount:s.gross_earnings,transaction_date:s.session_date,settled_date:s.session_date,status:'settled',category:'Corridas',automatic:true}))];
}
export function summarizeFinance(entries,month,asOfDate) {
 const paid=entries.filter(e=>e.status==='settled'&&e.settled_date?.slice(0,7)===month);
 const pending=entries.filter(e=>e.status==='pending'&&e.transaction_date.slice(0,7)===month);
 const sum=(rows,kind)=>rows.filter(e=>e.kind===kind).reduce((total,e)=>total+moneyCents(e.amount),0);
 const income=sum(paid,'income'),expenses=sum(paid,'expense'),allocated=sum(paid,'allocation'),released=sum(paid,'release');
 const sources=Object.keys(financeSources).map(source=>{const rows=paid.filter(e=>e.source===source);const revenue=sum(rows,'income'),cost=sum(rows,'expense');return {source,revenue,cost,net:revenue-cost};});
 const properties=[...new Set(paid.filter(e=>e.source==='airbnb').map(e=>e.property_name||'Sem imóvel informado'))].map(name=>{const rows=paid.filter(e=>e.source==='airbnb'&&(e.property_name||'Sem imóvel informado')===name);const revenue=sum(rows,'income'),cost=sum(rows,'expense');return {name,revenue,cost,net:revenue-cost};});
 return {income,expenses,net:income-expenses,allocated,released,available:income-expenses-allocated+released,pendingIncome:sum(pending,'income'),pendingExpenses:sum(pending,'expense'),sources,properties,overdue:entries.filter(e=>e.status==='pending'&&e.transaction_date<asOfDate).sort((a,b)=>a.transaction_date.localeCompare(b.transaction_date))};
}
export function reserveBalance(entries,reserveId,asOfDate) {
 return entries.filter(e=>e.reserve_id===reserveId&&e.status==='settled'&&e.settled_date<=asOfDate).reduce((total,e)=>total+(e.kind==='allocation'?1:e.kind==='release'?-1:0)*moneyCents(e.amount),0);
}
export function uberHourly(sessions,month) {
 const timed=sessions.filter(s=>s.session_date.slice(0,7)===month&&s.started_at&&s.ended_at&&Date.parse(s.ended_at)>Date.parse(s.started_at));
 const hours=timed.reduce((sum,s)=>sum+(Date.parse(s.ended_at)-Date.parse(s.started_at))/3600000,0);
 const cents=timed.reduce((sum,s)=>sum+moneyCents(s.gross_earnings??0),0);
 return {hours,count:timed.length,rate:hours?Math.round(cents/hours):null};
}
export function financeCsv(entries) {
 const cell=value=>'"'+String(value??'').replaceAll('"','""').replace(/^(?:\s*[=+@\-]|[\t\r])/,"'$&")+'"';
 const rows=[['Data prevista','Data realizada','Origem','Tipo','Descrição','Categoria','Imóvel','Situação','Valor (R$)'],...entries.map(e=>[e.transaction_date,e.settled_date,financeSources[e.source],financeKinds[e.kind],e.description,e.category,e.property_name,e.status==='settled'?'Confirmado':'Pendente',(moneyCents(e.amount)/100).toFixed(2).replace('.',',')])];
 return '\uFEFF'+rows.map(row=>row.map(cell).join(';')).join('\r\n');
}

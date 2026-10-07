import {test} from 'node:test';import assert from 'node:assert/strict';
import {moneyCents,prepareFinanceRow,ledgerEntries,summarizeFinance,reserveBalance,uberHourly,financeCsv} from '../lib/finance.mjs';
const row={source:'airbnb',kind:'income',description:'Reserva',amount:'100.00',transaction_date:'2026-09-20',settled_date:'2026-10-02',status:'settled',property_name:'Centro'};
test('valores em centavos evitam erro de ponto flutuante e entradas inválidas',()=>{assert.equal(moneyCents('0,30'),30);assert.equal(moneyCents('10.01'),1001);for(const v of ['-1','NaN','1.001','1e2','','10000000000'])assert.throws(()=>moneyCents(v));});
test('recebimentos entram no mês realizado; previstos não contaminam o saldo',()=>{
 const rows=[row,{...row,id:'pending',amount:50,status:'pending',settled_date:null,transaction_date:'2026-10-10'},{...row,kind:'expense',amount:20}];
 const october=summarizeFinance(rows,'2026-10','2026-10-07');assert.equal(october.income,10000);assert.equal(october.expenses,2000);assert.equal(october.pendingIncome,5000);assert.equal(october.net,8000);assert.equal(summarizeFinance(rows,'2026-09','2026-10-07').income,0);
});
test('Uber é integrado uma vez, manual duplicado é rejeitado e imóveis são separados',()=>{
 const entries=ledgerEntries([row],[{id:'u1',session_date:'2026-10-03',gross_earnings:30,trips:2}]);assert.equal(entries.length,2);assert.equal(summarizeFinance(entries,'2026-10','2026-10-07').income,13000);assert.equal(summarizeFinance(entries,'2026-10','2026-10-07').properties[0].net,10000);assert.throws(()=>prepareFinanceRow({...row,source:'uber'}));
});
test('reserva não é despesa e saldo da reserva atravessa meses',()=>{
 const entries=[row,{...row,kind:'allocation',source:'personal',reserve_id:'r',amount:30,settled_date:'2026-09-25'},{...row,kind:'release',source:'personal',reserve_id:'r',amount:10}];
 const totals=summarizeFinance(entries,'2026-10','2026-10-07');assert.equal(totals.expenses,0);assert.equal(totals.available,11000);assert.equal(reserveBalance(entries,'r','2026-10-07'),2000);assert.equal(reserveBalance(entries,'r','2026-09-30'),3000);
});
test('vencidos incluem meses anteriores e não incluem data de referência',()=>{
 const rows=[{...row,status:'pending',settled_date:null,transaction_date:'2026-09-01'},{...row,status:'pending',settled_date:null,transaction_date:'2026-10-07'}];assert.equal(summarizeFinance(rows,'2026-10','2026-10-07').overdue.length,1);
});
test('lançamento exige data real válida e normaliza centavos',()=>{
 assert.equal(prepareFinanceRow({...row,amount:'10,5'}).amount,'10.50');assert.equal(prepareFinanceRow({...row,status:'pending'}).settled_date,null);for(const v of [{...row,transaction_date:'2026-02-30'},{...row,amount:0},{...row,kind:'allocation',reserve_id:null},{...row,status:'other'}])assert.throws(()=>prepareFinanceRow(v));
});
test('ganho por hora usa somente receitas das sessões com duração conhecida',()=>{
 const sessions=[{session_date:'2026-10-01',gross_earnings:60,started_at:'2026-10-01T10:00:00Z',ended_at:'2026-10-01T12:00:00Z'},{session_date:'2026-10-02',gross_earnings:1000}];const h=uberHourly(sessions,'2026-10');assert.equal(h.rate,3000);assert.equal(h.hours,2);
});
test('CSV mantém casas decimais e neutraliza fórmulas de planilha',()=>{const csv=financeCsv([{...row,description:' =1+1'}]);assert.ok(csv.includes('100,00'));assert.ok(csv.includes("' =1+1"));});

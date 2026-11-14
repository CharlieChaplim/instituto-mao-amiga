const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { criarPaginacaoDoacoes } = require('../src/state/paginacaoDoacoes.ts');
const ponto = id => ({id, nome: id, endereco: 'Rua', bairro: 'Centro', horario: '8h', tipo: 'coleta'});
const page = (ids, number = 0, totalPages = 2) => ({content: ids.map(ponto), page: {number, totalPages, size: 10, totalElements: 20}});
function deferred() { let resolve, reject; const promise = new Promise((a,b) => {resolve=a;reject=b;}); return {promise,resolve,reject}; }

test('onEndReached simultâneo não duplica página e termina na última',async()=>{
  const req=deferred();const calls=[];
  const ctl=criarPaginacaoDoacoes(async p=>{calls.push(p);return p===0?req.promise:page(['b','c'],1);});
  const first=ctl.reiniciar('');await ctl.carregar();await ctl.carregar();assert.deepEqual(calls,[0]);
  req.resolve(page(['a','b']));await first;await ctl.carregar();await ctl.carregar();
  assert.deepEqual(calls,[0,1]);assert.deepEqual(ctl.snapshot().doacoes.map(p=>p.id),['a','b','c']);assert.equal(ctl.snapshot().temMais,false);
});
test('busca nova reinicia página e ignora resposta antiga fora de ordem',async()=>{
  const old=deferred();const calls=[];
  const ctl=criarPaginacaoDoacoes((p,f)=>{calls.push([p,f]);return f==='antiga'?old.promise:Promise.resolve(page(['novo'],0,1));});
  const pending=ctl.reiniciar('antiga');await ctl.reiniciar('nova');old.resolve(page(['antigo']));await pending;
  assert.deepEqual(calls,[[0,'antiga'],[0,'nova']]);assert.deepEqual(ctl.snapshot().doacoes.map(p=>p.id),['novo']);
});
test('erro de página preserva itens, bloqueia repetição automática e permite retry',async()=>{
  let fail=true;const calls=[];
  const ctl=criarPaginacaoDoacoes(async p=>{calls.push(p);if(p===1&&fail)throw new Error('API desligada');return page([p===0?'a':'b'],p);});
  await ctl.reiniciar('');await ctl.carregar();await ctl.carregar();
  assert.deepEqual(calls,[0,1]);assert.equal(ctl.snapshot().doacoes.length,1);assert.equal(ctl.snapshot().erro,'API desligada');
  fail=false;await ctl.carregar(true);assert.deepEqual(calls,[0,1,1]);assert.equal(ctl.snapshot().doacoes.length,2);
});
test('resultado vazio termina paginação e cancelamento ignora resposta pendente',async()=>{
  const pending=deferred();let count=0;
  const ctl=criarPaginacaoDoacoes(()=>{count++;return pending.promise;});const request=ctl.reiniciar('');ctl.cancelar();pending.resolve(page(['descartar']));await request;
  assert.equal(ctl.snapshot().doacoes.length,0);
  const empty=criarPaginacaoDoacoes(async()=>{count++;return page([],0,0);});await empty.reiniciar('');await empty.carregar();assert.equal(count,2);assert.equal(empty.snapshot().temMais,false);
});

test('serviço de doações envia filtro, ordem cronológica, UUID e CRUD',async()=>{
 const service=require('../src/services/doacoesService.ts');const original=global.fetch;const calls=[];
 global.fetch=async(url,o)=>{calls.push({url,...o});return o.method==='DELETE'?new Response(null,{status:204}):Response.json({});};
 try {await service.buscarPaginaDoacoes(2,' Roupas & sapatos ');await service.buscarDoacaoPorId('a/b');
 const dados={tipoItem:'Roupas',quantidade:2,pontoDestino:'A'};
 await service.cadastrarDoacao(dados);await service.editarDoacao('uuid',dados);await service.excluirDoacao('uuid');
 const url=new URL(calls[0].url);assert.equal(url.searchParams.get('filtro'),'Roupas & sapatos');assert.equal(url.searchParams.get('page'),'2');assert.deepEqual(url.searchParams.getAll('sort'),['criadoEm,desc','id,desc']);assert.ok(calls[1].url.endsWith('/a%2Fb'));assert.deepEqual(calls.map(c=>c.method),['GET','GET','POST','PUT','DELETE']);assert.deepEqual(JSON.parse(calls[2].body),dados);
 } finally {global.fetch=original;}
});
test('retorno ao histórico recarrega página zero com nova doação no topo',async()=>{
 let nova=false;const ctl=criarPaginacaoDoacoes(async()=>page(nova?['nova','antiga']:['antiga'],0,1));
 await ctl.reiniciar('');ctl.cancelar();nova=true;await ctl.reiniciar('');assert.deepEqual(ctl.snapshot().doacoes.map(d=>d.id),['nova','antiga']);
});

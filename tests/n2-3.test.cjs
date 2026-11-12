const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const api = require('../src/services/api.ts');
const service = require('../src/services/pontosService.ts');
const { criarPaginacaoPontos } = require('../src/state/paginacaoPontos.ts');
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });
const ponto = id => ({id, nome: id, endereco: 'Rua', bairro: 'Centro', horario: '8h', tipo: 'coleta'});
const page = (ids, number = 0, totalPages = 2) => ({content: ids.map(ponto), page: {number, totalPages, size: 10, totalElements: 20}});
function deferred() { let resolve, reject; const promise = new Promise((a,b) => {resolve=a;reject=b;}); return {promise,resolve,reject}; }

test('API envia métodos e JSON; DELETE 204 não exige corpo', async () => {
  const calls=[];
  global.fetch=async (url,options) => {calls.push({url,...options});return options.method==='DELETE' ? new Response(null,{status:204}) : Response.json({id:'uuid'});};
  await api.get('/pontos'); await api.post('/pontos',{nome:'Teste'}); await api.put('/pontos/uuid',{nome:'Novo'}); await api.del('/pontos/uuid');
  assert.deepEqual(calls.map(c=>c.method),['GET','POST','PUT','DELETE']);
  assert.equal(calls[1].headers['Content-Type'],'application/json');
  assert.deepEqual(JSON.parse(calls[1].body),{nome:'Teste'});
});
test('API preserva status 400 e 404 e identifica falha de conexão', async () => {
  for(const status of [400,404,500]) {
    global.fetch=async()=>new Response('',{status});
    await assert.rejects(api.get('/pontos'),e=>e instanceof api.ApiError && e.status===status);
  }
  global.fetch=async()=>{throw new TypeError('Failed to fetch');};
  await assert.rejects(api.get('/pontos'),e=>e.status===0 && /conexão/.test(e.message));
});
test('serviço codifica filtro e UUID e oferece todas as operações',async()=>{
  const calls=[];global.fetch=async(url,options)=>{calls.push({url,method:options.method});return options.method==='DELETE'?new Response(null,{status:204}):Response.json({});};
  await service.listarPontos();await service.buscarPaginaPontos(1,' São & João ');
  await service.buscarPontoPorId('id/seguro');await service.cadastrarPonto(ponto('x'));
  await service.editarPonto('uuid',ponto('x'));await service.excluirPonto('uuid');
  assert.match(calls[0].url,/\/api\/v1\/pontos$/);
  const url=new URL(calls[1].url);assert.equal(url.searchParams.get('filtro'),'São & João');assert.equal(url.searchParams.get('page'),'1');
  assert.match(calls[2].url,/id%2Fseguro$/);assert.deepEqual(calls.map(c=>c.method),['GET','GET','GET','POST','PUT','DELETE']);
});
test('onEndReached simultâneo não duplica página e termina na última',async()=>{
  const req=deferred();const calls=[];
  const ctl=criarPaginacaoPontos(async p=>{calls.push(p);return p===0?req.promise:page(['b','c'],1);});
  const first=ctl.reiniciar('');await ctl.carregar();await ctl.carregar();assert.deepEqual(calls,[0]);
  req.resolve(page(['a','b']));await first;await ctl.carregar();await ctl.carregar();
  assert.deepEqual(calls,[0,1]);assert.deepEqual(ctl.snapshot().pontos.map(p=>p.id),['a','b','c']);assert.equal(ctl.snapshot().temMais,false);
});
test('busca nova reinicia página e ignora resposta antiga fora de ordem',async()=>{
  const old=deferred();const calls=[];
  const ctl=criarPaginacaoPontos((p,f)=>{calls.push([p,f]);return f==='antiga'?old.promise:Promise.resolve(page(['novo'],0,1));});
  const pending=ctl.reiniciar('antiga');await ctl.reiniciar('nova');old.resolve(page(['antigo']));await pending;
  assert.deepEqual(calls,[[0,'antiga'],[0,'nova']]);assert.deepEqual(ctl.snapshot().pontos.map(p=>p.id),['novo']);
});
test('erro de página preserva itens, bloqueia repetição automática e permite retry',async()=>{
  let fail=true;const calls=[];
  const ctl=criarPaginacaoPontos(async p=>{calls.push(p);if(p===1&&fail)throw new Error('API desligada');return page([p===0?'a':'b'],p);});
  await ctl.reiniciar('');await ctl.carregar();await ctl.carregar();
  assert.deepEqual(calls,[0,1]);assert.equal(ctl.snapshot().pontos.length,1);assert.equal(ctl.snapshot().erro,'API desligada');
  fail=false;await ctl.carregar(true);assert.deepEqual(calls,[0,1,1]);assert.equal(ctl.snapshot().pontos.length,2);
});
test('resultado vazio termina paginação e cancelamento ignora resposta pendente',async()=>{
  const pending=deferred();let count=0;
  const ctl=criarPaginacaoPontos(()=>{count++;return pending.promise;});const request=ctl.reiniciar('');ctl.cancelar();pending.resolve(page(['descartar']));await request;
  assert.equal(ctl.snapshot().pontos.length,0);
  const empty=criarPaginacaoPontos(async()=>{count++;return page([],0,0);});await empty.reiniciar('');await empty.carregar();assert.equal(count,2);assert.equal(empty.snapshot().temMais,false);
});

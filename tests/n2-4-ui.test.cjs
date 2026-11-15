const {test, afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/',pretendToBeVisual:true});
for(const key of ['window','document','HTMLElement','Element','Node','MutationObserver','localStorage','ShadowRoot','getComputedStyle','MouseEvent','Event'])global[key]=dom.window[key];
Object.defineProperty(global,'navigator',{value:dom.window.navigator,configurable:true});
global.requestAnimationFrame=cb=>setTimeout(cb,0);global.cancelAnimationFrame=clearTimeout;
window.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
global.IS_REACT_ACT_ENVIRONMENT=true;
const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,f);
const React=require('react');
const rn=require('react-native-web');
const FocusContext=React.createContext(true);
const originalLoad=Module._load;
Module._load=function(name,parent,isMain){
 if(name==='react-native')return rn;
 if(name==='react-native-safe-area-context')return {SafeAreaView:({edges,...props})=>React.createElement(rn.View,props)};
 if(name==='@react-navigation/native')return {useFocusEffect:cb=>{const focused=React.useContext(FocusContext);React.useEffect(()=>focused?cb():undefined,[cb,focused]);}};
 return originalLoad.call(this,name,parent,isMain);
};
const {render,screen,fireEvent,waitFor,cleanup,act}=require('@testing-library/react');
const {AvisosProvider,useAvisos}=require('../src/contexts/AvisosContext.tsx');
const {TelaCadastroDoacao}=require('../src/screens/TelaCadastroDoacao.tsx');
const {TelaDetalheDoacao}=require('../src/screens/TelaDetalheDoacao.tsx');
const {TelaHistoricoDoacoes}=require('../src/screens/TelaHistoricoDoacoes.tsx');
const {TelaCadastroPonto}=require('../src/screens/TelaCadastroPonto.tsx');
const {TelaDetalhePonto}=require('../src/screens/TelaDetalhePonto.tsx');
const originalFetch=global.fetch;
afterEach(()=>{cleanup();window.localStorage.clear();global.fetch=originalFetch;});
const ponto={id:'uuid-ponto',nome:'Ponto A',endereco:'Rua 1',bairro:'Centro',horario:'8h às 17h',tipo:'coleta'};
function mount(Component,params){
 const nav={voltas:0,destinos:[],goBack(){this.voltas++;},navigate(...args){this.destinos.push(args);}};
 render(React.createElement(AvisosProvider,null,React.createElement(Component,{route:{params},navigation:nav})));
 return nav;
}
function mockApi(override){
 const calls=[];
 global.fetch=async(url,options)=>{calls.push({url,...options});if(override){const r=await override(url,options);if(r)return r;}
 return Response.json(url.endsWith('/pontos')&&options.method==='GET'?[ponto]:ponto);};return calls;
}
async function preencherPonto(){
 for(const [label,value] of [['Nome','Ponto novo'],['Endereço','Rua nova'],['Bairro','Sul'],['Horário','9h']])fireEvent.change(screen.getByLabelText(label),{target:{value}});
}

test('doação criada mostra aviso com item, salva uma vez e volta somente após OK',async()=>{
 const calls=mockApi();const nav=mount(TelaCadastroDoacao);
 await screen.findByText('○ Ponto A');
 await waitFor(()=>assert.equal(screen.getByRole('button',{name:'Cadastrar'}).getAttribute('aria-disabled'),null));
 fireEvent.change(screen.getByPlaceholderText('Ex.: roupas, alimentos'),{target:{value:'Roupas'}});
 fireEvent.change(screen.getByPlaceholderText('Ex.: 5'),{target:{value:'3'}});
 fireEvent.click(await screen.findByText('○ Ponto A'));
 fireEvent.click(screen.getByRole('button',{name:'Cadastrar'}));
 await screen.findByText('Doação de 3 unidade(s) de “Roupas” criada com sucesso.');
 assert.equal(window.localStorage.length,0);assert.equal(nav.voltas,0);
 const posts=calls.filter(c=>c.method==='POST');assert.equal(posts.length,1);assert.ok(posts[0].url.endsWith('/doacoes'));assert.deepEqual(JSON.parse(posts[0].body),{tipoItem:'Roupas',quantidade:3,pontoDestino:'Ponto A'});
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
test('validação da doação também mostra aviso na web e não grava',async()=>{
 mockApi();mount(TelaCadastroDoacao);await screen.findByText('○ Ponto A');
 await waitFor(()=>assert.equal(screen.getByRole('button',{name:'Cadastrar'}).getAttribute('aria-disabled'),null));
 fireEvent.click(screen.getByRole('button',{name:'Cadastrar'}));await screen.findByText('Preencha todos os campos.');
 assert.equal(window.localStorage.length,0);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));
 await screen.findByRole('button',{name:'Cadastrar'});
});
test('ponto valida campos e preserva texto quando a API recusa com 400',async()=>{
 const calls=mockApi((url,o)=>o.method==='POST'?new Response('',{status:400}):undefined);const nav=mount(TelaCadastroPonto);
 fireEvent.click(screen.getByRole('button',{name:'Cadastrar',exact:true}));await screen.findByText('Preencha nome, endereço, bairro e horário.');assert.equal(calls.length,0);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(screen.getByRole('button',{name:'Cadastrar',exact:true}).getAttribute('aria-disabled'),null));
 await preencherPonto();fireEvent.click(screen.getByRole('button',{name:'Cadastrar',exact:true}));
 await screen.findByText('Dados inválidos. Confira os campos informados.');assert.equal(screen.getByLabelText('Nome').value,'Ponto novo');assert.equal(nav.voltas,0);
});
test('cadastro de ponto envia tipo selecionado e evita envio duplo',async()=>{
 let resolve;const pending=new Promise(r=>resolve=r);
 const calls=mockApi((url,o)=>o.method==='POST'?pending:undefined);const nav=mount(TelaCadastroPonto);await preencherPonto();
 fireEvent.click(screen.getByRole('radio',{name:/Distribuição/}));
 const button=screen.getByRole('button',{name:'Cadastrar',exact:true});fireEvent.click(button);fireEvent.click(button);
 assert.equal(calls.length,1);assert.equal(JSON.parse(calls[0].body).tipo,'distribuição');
 resolve(Response.json({...ponto,nome:'Ponto novo'},{status:201}));await screen.findByText('Ponto “Ponto novo” cadastrado com sucesso.');
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
test('edição usa formulário preenchido e PUT com mesmo ID',async()=>{
 const calls=mockApi();const nav=mount(TelaCadastroPonto,{pontoId:ponto.id});await screen.findByDisplayValue('Ponto A');
 fireEvent.change(screen.getByLabelText('Nome'),{target:{value:'Ponto editado'}});
 fireEvent.click(screen.getByRole('button',{name:'Salvar alterações'}));await screen.findByText('Ponto “Ponto editado” atualizado com sucesso.');
 const put=calls.find(c=>c.method==='PUT');assert.ok(put.url.endsWith('/'+ponto.id));assert.equal(JSON.parse(put.body).nome,'Ponto editado');assert.equal(calls.some(c=>c.method==='POST'),false);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
test('excluir ponto: cancelar não envia DELETE, confirmar aceita 204 e volta',async()=>{
 const calls=mockApi((url,o)=>o.method==='DELETE'?new Response(null,{status:204}):undefined);const nav=mount(TelaDetalhePonto,{pontoId:ponto.id});
 fireEvent.click(await screen.findByRole('button',{name:'Excluir ponto'}));fireEvent.click(await screen.findByRole('button',{name:'Cancelar'}));
 await screen.findByRole('button',{name:'Excluir ponto'});assert.equal(calls.some(c=>c.method==='DELETE'),false);
 fireEvent.click(screen.getByRole('button',{name:'Excluir ponto'}));fireEvent.click(await screen.findByRole('button',{name:'Excluir',exact:true}));
 await screen.findByText('Ponto “Ponto A” excluído.');assert.equal(calls.filter(c=>c.method==='DELETE').length,1);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
test('API desligada ao salvar ou excluir não apresenta sucesso nem navega',async()=>{
 mockApi((url,o)=>{if(o.method==='POST')throw new TypeError('offline');});const nav=mount(TelaCadastroPonto);await preencherPonto();fireEvent.click(screen.getByRole('button',{name:'Cadastrar',exact:true}));
 await screen.findByText('Não foi possível acessar a API. Verifique o servidor e a conexão.');assert.equal(nav.voltas,0);assert.equal(screen.getByLabelText('Nome').value,'Ponto novo');
 cleanup();mockApi((url,o)=>{if(o.method==='DELETE')throw new TypeError('offline');});const detail=mount(TelaDetalhePonto,{pontoId:ponto.id});
 fireEvent.click(await screen.findByRole('button',{name:'Excluir ponto'}));fireEvent.click(await screen.findByRole('button',{name:'Excluir',exact:true}));
 await screen.findByText('Não foi possível acessar a API. Verifique o servidor e a conexão.');assert.equal(detail.voltas,0);assert.ok(screen.getByText('Ponto A'));
});

test('Android/iOS mantém Alert.alert com Cancelar e Excluir e resolve a escolha',async()=>{
 const descriptor=Object.getOwnPropertyDescriptor(rn.Platform,'OS');
 const alertOriginal=rn.Alert.alert;const alerts=[];const resultados=[];
 Object.defineProperty(rn.Platform,'OS',{configurable:true,value:'android'});
 rn.Alert.alert=(...args)=>alerts.push(args);
 function Harness(){const {confirmar}=useAvisos();return React.createElement('button',{onClick:async()=>resultados.push(await confirmar('Excluir','Confirmar?'))},'Abrir');}
 try {
  render(React.createElement(AvisosProvider,null,React.createElement(Harness)));
  fireEvent.click(screen.getByRole('button',{name:'Abrir'}));
  assert.deepEqual(alerts[0][2].map(b=>b.text),['Cancelar','Excluir']);
  await act(async()=>alerts[0][2][0].onPress());assert.deepEqual(resultados,[false]);
  fireEvent.click(screen.getByRole('button',{name:'Abrir'}));
  await act(async()=>alerts[1][2][1].onPress());assert.deepEqual(resultados,[false,true]);
 } finally {cleanup();Object.defineProperty(rn.Platform,'OS',descriptor);rn.Alert.alert=alertOriginal;}
});

for (const status of [400, 0]) test(`doação: falha ${status} preserva formulário e não grava localmente`, async()=>{
 mockApi((url,o)=>{if(o.method==='POST'){if(!status)throw new TypeError('offline');return new Response('',{status});}});
 const nav=mount(TelaCadastroDoacao);
 await screen.findByText('○ Ponto A');
 await waitFor(()=>assert.equal(screen.getByRole('button',{name:'Cadastrar'}).getAttribute('aria-disabled'),null));
 fireEvent.change(screen.getByPlaceholderText('Ex.: roupas, alimentos'),{target:{value:'Roupas'}});
 fireEvent.change(screen.getByPlaceholderText('Ex.: 5'),{target:{value:'3'}});
 fireEvent.click(await screen.findByText('○ Ponto A'));fireEvent.click(screen.getByRole('button',{name:'Cadastrar'}));
 await screen.findByText('Não foi possível salvar a doação. Seus dados continuam no formulário.');
 assert.equal(screen.getByPlaceholderText('Ex.: roupas, alimentos').value,'Roupas');assert.equal(screen.getByPlaceholderText('Ex.: 5').value,'3');assert.equal(nav.voltas,0);assert.equal(window.localStorage.length,0);
});
test('histórico distingue carregando, erro, retry e vazio; filtro vai para API',async()=>{
 let resolve;global.fetch=()=>new Promise(r=>resolve=r);mount(TelaHistoricoDoacoes);
 assert.ok(screen.getByText('Carregando doações...'));
 await act(async()=>resolve(new Response('',{status:500})));
 await screen.findByText('Não foi possível concluir a solicitação (HTTP 500).');
 assert.equal(screen.queryByText('Nenhuma doação cadastrada.'),null);
 const calls=mockApi(()=>Response.json({content:[],page:{totalPages:0}}));
 fireEvent.click(screen.getByText('Tentar novamente'));await screen.findByText('Nenhuma doação cadastrada.');
 fireEvent.change(screen.getByLabelText('Buscar por tipo de item'),{target:{value:' Roupas '}});
 await screen.findByText('Nenhuma doação encontrada para “Roupas”.');
 assert.equal(new URL(calls.at(-1).url).searchParams.get('filtro'),'Roupas');
});
test('detalhe busca doação por UUID e trata 404 sem usar dados locais',async()=>{
 const calls=mockApi(()=>new Response('',{status:404}));mount(TelaDetalheDoacao,{doacaoId:'uuid-doacao'});
 await screen.findByText('Doação não encontrada.');assert.ok(calls[0].url.endsWith('/doacoes/uuid-doacao'));assert.equal(screen.queryByText('Excluir doação'),null);
});

const doacaoApi={id:'uuid-doacao',tipoItem:'Roupas',quantidade:3,pontoDestino:'Ponto A',criadoEm:'2026-11-14T10:00:00'};
test('edição reaproveita formulário, envia PUT sem ID/data e só volta após aviso',async()=>{
 const calls=mockApi((url,o)=>url.includes('/doacoes/')?Response.json(doacaoApi):undefined);
 const nav=mount(TelaCadastroDoacao,{doacaoId:doacaoApi.id});
 await screen.findByDisplayValue('Roupas');
 await waitFor(()=>assert.equal(screen.getByRole('button',{name:'Salvar alterações'}).getAttribute('aria-disabled'),null));
 fireEvent.change(screen.getByPlaceholderText('Ex.: 5'),{target:{value:'5'}});
 fireEvent.click(screen.getByRole('button',{name:'Salvar alterações'}));
 await screen.findByText('Doação de 5 unidade(s) de “Roupas” atualizada com sucesso.');
 const put=calls.find(c=>c.method==='PUT');assert.ok(put.url.endsWith('/doacoes/uuid-doacao'));
 assert.deepEqual(JSON.parse(put.body),{tipoItem:'Roupas',quantidade:5,pontoDestino:'Ponto A'});
 assert.equal(calls.some(c=>c.method==='POST'),false);assert.equal(nav.voltas,0);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
test('cancelar edição não envia PUT; destino removido pode ser preservado',async()=>{
 const calls=mockApi((url,o)=>url.includes('/doacoes/')?Response.json({...doacaoApi,pontoDestino:'Destino antigo'}):undefined);
 const nav=mount(TelaCadastroDoacao,{doacaoId:doacaoApi.id});await screen.findByDisplayValue('Roupas');
 assert.ok(screen.getByText(/Destino original: Destino antigo/));
 fireEvent.click(screen.getByRole('button',{name:'Cancelar'}));assert.equal(nav.voltas,1);assert.equal(calls.some(c=>c.method==='PUT'),false);
});
test('excluir doação: cancelar não envia DELETE, confirmação envia uma vez e aceita 204',async()=>{
 const calls=mockApi((url,o)=>o.method==='DELETE'?new Response(null,{status:204}):Response.json(doacaoApi));
 const nav=mount(TelaDetalheDoacao,{doacaoId:doacaoApi.id});
 fireEvent.click(await screen.findByRole('button',{name:'Editar doação'}));assert.deepEqual(nav.destinos,[['Cadastro',{doacaoId:doacaoApi.id}]]);
 fireEvent.click(screen.getByRole('button',{name:'Excluir doação'}));fireEvent.click(await screen.findByRole('button',{name:'Cancelar'}));
 await screen.findByRole('button',{name:'Excluir doação'});assert.equal(calls.some(c=>c.method==='DELETE'),false);
 fireEvent.click(screen.getByRole('button',{name:'Excluir doação'}));fireEvent.click(await screen.findByRole('button',{name:'Excluir',exact:true}));
 await screen.findByText('Doação de “Roupas” excluída.');assert.equal(calls.filter(c=>c.method==='DELETE').length,1);assert.equal(nav.voltas,0);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
for(const method of ['PUT','DELETE']) test(`API desligada em ${method} de doação: avisa e permanece na tela`,async()=>{
 mockApi((url,o)=>{if(o.method===method)throw new TypeError('offline');if(url.includes('/doacoes/'))return Response.json(doacaoApi);});
 const nav=mount(method==='PUT'?TelaCadastroDoacao:TelaDetalheDoacao,{doacaoId:doacaoApi.id});
 if(method==='PUT'){
  await screen.findByDisplayValue('Roupas');await waitFor(()=>assert.equal(screen.getByRole('button',{name:'Salvar alterações'}).getAttribute('aria-disabled'),null));
  fireEvent.change(screen.getByPlaceholderText('Ex.: 5'),{target:{value:'9'}});fireEvent.click(screen.getByRole('button',{name:'Salvar alterações'}));
  await screen.findByText('Não foi possível salvar a doação. Seus dados continuam no formulário.');assert.equal(screen.getByPlaceholderText('Ex.: 5').value,'9');
 }else{
  fireEvent.click(await screen.findByRole('button',{name:'Excluir doação'}));fireEvent.click(await screen.findByRole('button',{name:'Excluir',exact:true}));
  await screen.findByText('Não foi possível excluir a doação. Verifique a API e tente novamente.');assert.ok(screen.getByText('Roupas'));
 }
 assert.equal(nav.voltas,0);assert.equal(screen.queryByText('Sucesso'),null);
});
test('edição de UUID inexistente mostra 404 e bloqueia salvar',async()=>{
 mockApi((url,o)=>url.includes('/doacoes/')?new Response('',{status:404}):undefined);
 mount(TelaCadastroDoacao,{doacaoId:'ausente'});await screen.findByText('Doação não encontrada.');
 assert.equal(screen.getByRole('button',{name:'Salvar alterações'}).getAttribute('aria-disabled'),'true');
});

for(const Component of [TelaDetalheDoacao,TelaHistoricoDoacoes]) test(`${Component.name}: voltar com foco busca valores atuais da API`,async()=>{
 let atual={...doacaoApi};const nav={goBack(){},navigate(){}};
 mockApi(()=>Response.json(Component===TelaDetalheDoacao?atual:{content:atual?[atual]:[],page:{totalPages:atual?1:0}}));
 const tree=focused=>React.createElement(FocusContext.Provider,{value:focused},React.createElement(AvisosProvider,null,React.createElement(Component,{route:{params:{doacaoId:doacaoApi.id}},navigation:nav})));
 const view=render(tree(true));await screen.findByText('Roupas');
 view.rerender(tree(false));atual={...atual,tipoItem:'Cobertores',quantidade:5};view.rerender(tree(true));
 await screen.findByText('Cobertores');assert.equal(screen.queryByText('Roupas'),null);
 if(Component===TelaHistoricoDoacoes){view.rerender(tree(false));atual=null;view.rerender(tree(true));await screen.findByText('Nenhuma doação cadastrada.');assert.equal(screen.queryByText('Cobertores'),null);}
});

const {TelaListaPontos}=require('../src/screens/TelaListaPontos.tsx');
const {TelaMeusPontos}=require('../src/screens/TelaMeusPontos.tsx');
const {favoritos}=require('../src/services/favoritosService.ts');
const {CHAVE_FAVORITOS}=require('../src/state/favoritos.ts');
test('coração salva somente ID, não abre detalhe, e Meus pontos permite desmarcar',async()=>{
 const calls=mockApi((url,o)=>url.includes('/filtro')?Response.json({content:[ponto],page:{totalPages:1}}):undefined);
 const nav=mount(TelaListaPontos);
 const heart=await screen.findByRole('button',{name:'Favoritar Ponto A'});
 await waitFor(()=>assert.equal(heart.getAttribute('aria-disabled'),null));fireEvent.click(heart);
 await screen.findByRole('button',{name:'Desmarcar Ponto A'});assert.equal(nav.destinos.length,0);
 assert.deepEqual(JSON.parse(window.localStorage.getItem(CHAVE_FAVORITOS)),[ponto.id]);
 fireEvent.click(screen.getByRole('button',{name:'Meus pontos'}));assert.deepEqual(nav.destinos,[['MeusPontos']]);
 cleanup();mount(TelaMeusPontos);await screen.findByText('Ponto A');
 assert.ok(calls.some(c=>c.url.endsWith('/pontos/'+ponto.id)));
 fireEvent.click(screen.getByRole('button',{name:'Desmarcar Ponto A'}));
 await screen.findByText('Nenhum ponto favorito disponível. Marque ♡ na lista de pontos.');
 assert.deepEqual(JSON.parse(window.localStorage.getItem(CHAVE_FAVORITOS)),[]);
});
test('Meus pontos ignora 404, distingue erro de conexão e recupera com retry',async()=>{
 await favoritos.definir('removido',true);await favoritos.definir('existe',true);
 let offline=true;
 mockApi((url)=>{if(url.endsWith('/removido'))return new Response('',{status:404});if(offline)throw new TypeError('offline');return Response.json({...ponto,id:'existe'});});
 mount(TelaMeusPontos);await screen.findByText('Não foi possível carregar todos os favoritos. Verifique a API e tente novamente.');
 assert.equal(screen.queryByText('Nenhum ponto favorito disponível. Marque ♡ na lista de pontos.'),null);
 offline=false;fireEvent.click(screen.getByRole('button',{name:'Tentar novamente'}));await screen.findByText('Ponto A');
 assert.equal(screen.queryByText('Não foi possível carregar todos os favoritos. Verifique a API e tente novamente.'),null);
 cleanup();await favoritos.definir('removido',false);await favoritos.definir('existe',false);
});

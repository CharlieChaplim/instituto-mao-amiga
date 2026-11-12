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
const originalLoad=Module._load;
Module._load=function(name,parent,isMain){
 if(name==='react-native')return rn;
 if(name==='react-native-safe-area-context')return {SafeAreaView:({edges,...props})=>React.createElement(rn.View,props)};
 if(name==='@react-navigation/native')return {useFocusEffect:cb=>React.useEffect(cb,[cb])};
 return originalLoad.call(this,name,parent,isMain);
};
const {render,screen,fireEvent,waitFor,cleanup,act}=require('@testing-library/react');
const {AvisosProvider,useAvisos}=require('../src/contexts/AvisosContext.tsx');
const {TelaCadastroDoacao}=require('../src/screens/TelaCadastroDoacao.tsx');
const {TelaDetalheDoacao}=require('../src/screens/TelaDetalheDoacao.tsx');
const {TelaCadastroPonto}=require('../src/screens/TelaCadastroPonto.tsx');
const {TelaDetalhePonto}=require('../src/screens/TelaDetalhePonto.tsx');
const storage=require('../src/services/doacoesStorage.ts');
const originalDelete=storage.excluirDoacao;
const originalFetch=global.fetch;
afterEach(()=>{cleanup();window.localStorage.clear();global.fetch=originalFetch;storage.excluirDoacao=originalDelete;});
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
 mockApi();const nav=mount(TelaCadastroDoacao);
 fireEvent.change(screen.getByPlaceholderText('Ex.: roupas, alimentos'),{target:{value:'Roupas'}});
 fireEvent.change(screen.getByPlaceholderText('Ex.: 5'),{target:{value:'3'}});
 fireEvent.click(await screen.findByText('○ Ponto A'));
 fireEvent.click(screen.getByRole('button',{name:'Cadastrar'}));
 await screen.findByText('Doação de 3 unidade(s) de “Roupas” criada com sucesso.');
 assert.equal((await storage.listarDoacoes()).length,1);assert.equal(nav.voltas,0);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
test('validação da doação também mostra aviso na web e não grava',async()=>{
 mockApi();mount(TelaCadastroDoacao);await screen.findByText('○ Ponto A');
 fireEvent.click(screen.getByRole('button',{name:'Cadastrar'}));await screen.findByText('Preencha todos os campos.');
 assert.equal((await storage.listarDoacoes()).length,0);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));
 await screen.findByRole('button',{name:'Cadastrar'});
});
test('exclusão de doação permite cancelar e só apaga após confirmação',async()=>{
 const doacao=await storage.salvarDoacao({tipoItem:'Alimentos',quantidade:2,pontoDestino:'Ponto A'});
 const nav=mount(TelaDetalheDoacao,{doacao});
 fireEvent.click(screen.getByRole('button',{name:'Excluir doação'}));await screen.findByText('Deseja excluir a doação de “Alimentos”?');
 fireEvent.click(screen.getByRole('button',{name:'Cancelar'}));await screen.findByRole('button',{name:'Excluir doação'});
 assert.equal((await storage.listarDoacoes()).length,1);assert.equal(nav.voltas,0);
 fireEvent.click(screen.getByRole('button',{name:'Excluir doação'}));fireEvent.click(await screen.findByRole('button',{name:'Excluir',exact:true}));
 await screen.findByText('Doação de “Alimentos” excluída.');assert.equal((await storage.listarDoacoes()).length,0);
 fireEvent.click(screen.getByRole('button',{name:'OK'}));await waitFor(()=>assert.equal(nav.voltas,1));
});
test('falha na exclusão da doação mostra erro e preserva o registro',async()=>{
 const doacao=await storage.salvarDoacao({tipoItem:'Roupas',quantidade:1,pontoDestino:'Ponto A'});
 storage.excluirDoacao=async()=>{throw new Error('disco indisponível');};const nav=mount(TelaDetalheDoacao,{doacao});
 fireEvent.click(screen.getByRole('button',{name:'Excluir doação'}));fireEvent.click(await screen.findByRole('button',{name:'Excluir',exact:true}));
 await screen.findByText('Não foi possível excluir a doação. Tente novamente.');assert.equal(nav.voltas,0);assert.equal((await storage.listarDoacoes()).length,1);
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

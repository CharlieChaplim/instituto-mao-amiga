const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {criarFavoritos,CHAVE_FAVORITOS}=require('../src/state/favoritos.ts');
function memoria(inicial=null){return {valor:inicial,async getItem(k){assert.equal(k,CHAVE_FAVORITOS);return this.valor;},async setItem(k,v){assert.equal(k,CHAVE_FAVORITOS);this.valor=v;}};}
test('favoritos persistem apenas IDs e são restaurados em nova instância',async()=>{
 const storage=memoria();const store=criarFavoritos(storage);await store.carregar();
 await Promise.all([store.definir('uuid-a',true),store.definir('uuid-b',true)]);
 assert.deepEqual(JSON.parse(storage.valor),['uuid-a','uuid-b']);
 const reaberto=criarFavoritos(storage);await reaberto.carregar();assert.deepEqual(reaberto.snapshot().ids,['uuid-a','uuid-b']);
 await reaberto.definir('uuid-a',false);assert.deepEqual(JSON.parse(storage.valor),['uuid-b']);
});
test('escritas em fila não duplicam nem perdem favoritos',async()=>{
 const storage=memoria();const store=criarFavoritos(storage);
 await Promise.all([store.definir('a',true),store.definir('a',true),store.definir('b',true),store.definir('a',false)]);
 assert.deepEqual(store.snapshot().ids,['b']);assert.deepEqual(JSON.parse(storage.valor),['b']);
});
test('falha de escrita preserva favoritos e permite tentar novamente',async()=>{
 const storage=memoria('["a"]');const original=storage.setItem;const store=criarFavoritos(storage);await store.carregar();
 storage.setItem=async()=>{throw new Error('disco');};await assert.rejects(store.definir('a',false),/salvar/);
 assert.deepEqual(store.snapshot().ids,['a']);assert.equal(store.snapshot().salvando,false);
 storage.setItem=original;await store.definir('a',false);assert.deepEqual(store.snapshot().ids,[]);
});
test('leitura inválida não sobrescreve dados e oferece retry',async()=>{
 const storage=memoria('{invalido');const store=criarFavoritos(storage);await store.carregar();
 assert.match(store.snapshot().erro,/ler os favoritos/);await assert.rejects(store.definir('a',true));assert.equal(storage.valor,'{invalido');
 storage.valor='["a","a"]';await store.carregar();assert.deepEqual(store.snapshot().ids,['a']);assert.equal(store.snapshot().erro,'');
});

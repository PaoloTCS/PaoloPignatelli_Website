import test from 'node:test';
import assert from 'node:assert/strict';
import {relationship,people} from '../relationships.js';
import {prepareAssessment,validateAnswer} from '../lib/jev.js';
import handler from '../api/relationship.js';

test('Paolo’s grandfather and reverse direction preserve evidence; Lucio stays unresolved',()=>{
 const r=relationship('person-0','person-2');assert.equal(r.label,'Grandchild');assert.equal(r.links.length,2);assert.ok(r.links.every(l=>l.kind==='Family testimony'));
 assert.equal(relationship('person-2','person-0').label,'Grandparent');
 assert.equal(relationship('person-0','lucio').status,'unresolved');
 assert.equal(relationship('person-0','person-17').links.length,17);
 assert.equal(relationship('person-0','person-0').links.length,0);
});
test('shared ancestor algorithm handles cousin removals and rejects cycles',()=>{
 const family=[{id:'root',parent:null},{id:'left',parent:'root'},{id:'right',parent:'root'},{id:'a',parent:'left'},{id:'b',parent:'right'},{id:'c',parent:'b'}];
 assert.equal(relationship('a','b',family).label,'Cousins · degree 1');
 assert.equal(relationship('a','c',family).label,'Cousins · degree 1 · 1 generation removed');
 assert.equal(relationship('a','c',family).common.id,'root');
 assert.throws(()=>relationship('x','x',[{id:'x',parent:'y'},{id:'y',parent:'x'}]),/Cyclic/);
});
test('book sibling and spouse links derive the in-law relationship in both directions',()=>{
 const r=relationship('person-0','guido-aquino');
 assert.equal(r.label,'Brother-in-law');assert.equal(r.pattern,'sibling,spouse');
 assert.deepEqual(r.path.map(p=>p.id),['person-0','natalia','guido-aquino']);
 assert.deepEqual(r.links.map(l=>l.type),['sibling','spouse']);assert.ok(r.links.every(l=>l.kind==='Published book'));
 assert.equal(relationship('guido-aquino','person-0').label,'Brother-in-law');
 assert.equal(relationship('natalia','person-0').label,'Sister');
 assert.equal(relationship('natalia','guido-aquino').label,'Spouse');
 assert.equal(relationship('guido-aquino','lucio').status,'unresolved');
 assert.equal(people.find(p=>p.id==='natalia').parent,null);
 assert.equal(people.find(p=>p.id==='person-1').detail,'1900–1967');
});
test('in-law computation generalizes to other people and does not treat a spouse as a parent',()=>{
 const records=[{id:'a',name:'A',parent:null,sex:'female'},{id:'b',name:'B',parent:null},{id:'c',name:'C',parent:null}];
 const links=[{id:'ab',from:'a',to:'b',type:'sibling',source:'libro'},{id:'bc',from:'b',to:'c',type:'spouse',source:'libro'}];
 assert.equal(relationship('a','c',records,links).label,'Sister-in-law');
 assert.equal(relationship('a','c',records,[]).status,'unresolved');
 const prepared=prepareAssessment({a:'person-0',b:'guido-aquino',link:'natalia-guido-aquino',attribution:'Book fixture',excerpt:'Natalia Pignatelli married Guido d’Aquino dei principi di Caramanico.'});
 assert.equal(prepared.request.state.relationship_type,'spouse');assert.match(prepared.claim,/recorded spouse/);assert.doesNotMatch(prepared.claim,/child of/);
 assert.throws(()=>prepareAssessment({a:'person-0',b:'guido-aquino',link:'parent:person-7',attribution:'Book',excerpt:'This deliberately unrelated excerpt contains enough characters.'}));
});
test('Jev only assesses selected recorded edges and validates a full distribution',()=>{
 const input={a:'person-0',b:'person-2',child:'person-0',attribution:'Test fixture',excerpt:'Paolo Pignatelli states that Guido Pignatelli was his father.'};
 const prepared=prepareAssessment(input);assert.match(prepared.request.questions.support.instructions,/not historical truth/);assert.equal(prepared.request.state.excerpt,input.excerpt);
 assert.throws(()=>prepareAssessment({...input,child:'person-7'}));assert.throws(()=>prepareAssessment({...input,b:'lucio'}));assert.throws(()=>prepareAssessment({...input,excerpt:'too short'}));
 const data={model:'fixture-only',answers:{support:{type:'choice',choice:'supports',confidence:.7,probabilities:{supports:.8,contradicts:0,ambiguous:.1,unrelated:.1}}}};
 assert.equal(validateAnswer(data).answer.choice,'supports');
 assert.throws(()=>validateAnswer({...data,answers:{support:{...data.answers.support,probabilities:{supports:1.2,contradicts:0,ambiguous:0,unrelated:0}}}}));
});
test('endpoint rejects off-origin requests and reports missing Jev configuration without calling provider',async()=>{
 const previous=process.env.TYPESAFE_API_KEY;delete process.env.TYPESAFE_API_KEY;
 try{
  const response=()=>({code:0,body:null,setHeader(){},status(n){this.code=n;return this;},json(v){this.body=v;return this;}});
  const input={a:'person-0',b:'person-2',child:'person-0',attribution:'Test fixture',excerpt:'Paolo Pignatelli states that Guido Pignatelli was his father.'};
  const good=response();await handler({method:'POST',headers:{host:'example.test',origin:'https://example.test'},body:input},good);assert.equal(good.code,503);assert.match(good.body.error,/not configured/);
  const bad=response();await handler({method:'POST',headers:{host:'example.test',origin:'https://other.test'},body:input},bad);assert.equal(bad.code,403);
 }finally{if(previous!==undefined)process.env.TYPESAFE_API_KEY=previous;}
});

 test('Elena’s maternal and spouse connections retain separate source links',()=>{
 const r=relationship('person-0','elena-naryshkina');
 assert.equal(r.label,'Grandchild');
 assert.equal(relationship('elena-naryshkina','person-0').label,'Grandparent');
 assert.equal(relationship('elena-naryshkina','person-2').label,'Spouse');
 assert.equal(r.links.at(-1).source[1],'https://americanaristocracy.com/people/elena-naryshkina-pignatelli');
 assert.equal(people.find(p=>p.id==='person-1').parent,'person-2');
 });

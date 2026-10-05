import test from 'node:test';
import assert from 'node:assert/strict';
import {relationship} from '../relationships.js';
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

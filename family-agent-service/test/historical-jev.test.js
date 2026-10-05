import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareHistoricalAssessment,validateHistoricalAnswer} from '../lib/historical-jev.js';
import handler from '../api/historical.js';
const candidates={A:'Elena is an ancestor of Felix.',B:'Felix is an ancestor of Elena.',C:'Elena and Felix share a named common ancestor.',D:'Elena and Felix are connected by a documented marriage.'};
const input={a:'Elena Naryshkina Pignatelli',b:'Felix Yusupov',candidates,attribution:'Book X, page 10',excerpt:'The book explicitly discusses the household and their ancestry, including both named people and the exact claimed relationship.'};
function response(){return {code:null,payload:null,setHeader(){},status(code){this.code=code;return this;},json(payload){this.payload=payload;return this;}};}
test('Jev receives a fixed A–D and none choice before seeing evidence',()=>{
 const a=prepareHistoricalAssessment(input);assert.deepEqual(Object.keys(a.request.questions.support.criteria),['A','B','C','D','none']);assert.equal(a.request.state.evidence[0].excerpt,input.excerpt);
 const later=prepareHistoricalAssessment({...input,evidence:[{attribution:'Book X',excerpt:input.excerpt},{attribution:'Archive Y',excerpt:input.excerpt}]});assert.equal(later.request.state.evidence.length,2);assert.deepEqual(later.sources,['Book X','Archive Y']);
 assert.throws(()=>prepareHistoricalAssessment({...input,candidates:{...candidates,D:candidates.C}}));
 assert.throws(()=>prepareHistoricalAssessment({...input,candidates:{...candidates,A:''}}));
 const result=validateHistoricalAnswer({model:'jev-latest',answers:{support:{type:'choice',choice:'none',confidence:.5,probabilities:{A:.05,B:.05,C:.05,D:.05,none:.8}}}});assert.equal(result.answer.choice,'none');
 assert.throws(()=>validateHistoricalAnswer({model:'jev-latest',answers:{support:{type:'choice',choice:'A',confidence:.5,probabilities:{A:.05,B:.05,C:.05,D:.05,none:.8}}}}));
});
test('historical assessment requires same origin and configured key before any provider call',async()=>{
 const original=process.env.TYPESAFE_API_KEY;delete process.env.TYPESAFE_API_KEY;
 try{const rejected=response();await handler({method:'POST',headers:{origin:'https://other.example',host:'family.example'},body:input},rejected);assert.equal(rejected.code,403);
 const unavailable=response();await handler({method:'POST',headers:{origin:'https://family.example',host:'family.example'},body:input},unavailable);assert.equal(unavailable.code,503);assert.match(unavailable.payload.error,/No probability/);
 }finally{if(original===undefined)delete process.env.TYPESAFE_API_KEY;else process.env.TYPESAFE_API_KEY=original;}
});

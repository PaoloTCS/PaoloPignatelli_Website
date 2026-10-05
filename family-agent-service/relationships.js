export const sources = {
 recent:['The Heirs of Europe','https://heirsofeurope.blogspot.com/2016/11/pignatelli-di-montecalvo.html'],
 montecalvo:['Genmarenostrum · Montecalvo','https://www.genmarenostrum.com/pagine-lettere/letterap/PIGNATELLI/PIGNATELLI%20DUCHI%20DI%20MONTECALVO.htm'],
 casalnuovo:['Genmarenostrum · Casalnuovo','https://www.genmarenostrum.com/pagine-lettere/letterap/PIGNATELLI/PIGNATELLI%20MARCHESI%20DI%20CASALNUOVO.htm'],
 branches:['Pignatelli della Leonessa · Family history','https://www.pignatellidellaleonessa.com/famiglia/']
};
const lineage = [
 ['Paolo Pignatelli','di Montecalvo','family'],
 ['Guido Pignatelli','1906–1967','family'],
 ['Pompeo Pignatelli','1868–1960','recent'],
 ['Giuseppe Pignatelli','1831–1870 · Marchese di Paglieta','recent'],
 ['Carlo Pignatelli','1803–1878 · 8th Duca di Montecalvo','recent'],
 ['Giuseppe Pignatelli','1762–1842 · 7th Duca di Montecalvo','recent'],
 ['Carlo Pignatelli','1714–1781 · 5th Duca di Montecalvo','montecalvo'],
 ['Giovanni Battista Pignatelli','1677–1715 · 3rd Duca di Montecalvo','montecalvo'],
 ['Pompeo Pignatelli','1632–1705 · 2nd Duca di Montecalvo','montecalvo'],
 ['Giovanni Battista Pignatelli','1617–1658 · 3rd Marchese di Paglieta','montecalvo'],
 ['Pompeo Pignatelli','Born 1580 · 2nd Marchese di Paglieta','montecalvo'],
 ['Carlo Pignatelli','1st Marchese di Paglieta','montecalvo'],
 ['Federico Pignatelli','Lord of Paglieta','montecalvo'],
 ['Marco Antonio Pignatelli','Son of Annibale','montecalvo'],
 ['Annibale Pignatelli','Montecalvo line','casalnuovo'],
 ['Cesare Pignatelli','Lord of Orta and Toritto','casalnuovo'],
 ['Stefano Pignatelli','Living after 1448','branches'],
 ['Tommaso Pignatelli','Father of Stefano, Carlo, and Palamede','none']
];

export const people = lineage.map((p,i)=>({id:`person-${i}`,name:p[0],detail:p[1],parent:i<lineage.length-1?`person-${i+1}`:null,source:p[2]}));
people.push({id:'lucio',name:'Lucio Pignatelli',detail:'Traditionally 1102 · identity disputed',parent:null,source:'none'});
export const personLabel = p => `${p.name} · ${p.detail}`;
export function relationship(aId,bId,records=people) {
 const byId=new Map(records.map(p=>[p.id,p]));
 if(!byId.has(aId)||!byId.has(bId))throw new Error('Unknown person');
 const ancestors=id=>{const path=[],seen=new Set();while(id){if(seen.has(id))throw new Error('Cyclic family data');seen.add(id);const p=byId.get(id);if(!p)throw new Error('Missing parent record');path.push(p);id=p.parent;}return path;};
 const a=ancestors(aId),b=ancestors(bId);const i=a.findIndex(p=>b.some(q=>q.id===p.id));
 if(i<0)return {status:'unresolved',label:'No recorded path',links:[],paths:[a,b]};
 const j=b.findIndex(p=>p.id===a[i].id),common=a[i];
 let label;
 if(i===0&&j===0)label='The same person';
 else if(j===0)label=i===1?'Child':i===2?'Grandchild':`Descendant (${i} generations)`;
 else if(i===0)label=j===1?'Parent':j===2?'Grandparent':`Ancestor (${j} generations)`;
 else if(i===1&&j===1)label='Sibling through a recorded parent';
 else if(Math.min(i,j)===1)label=i===1?`Aunt or uncle line (${j-1} generation${j===2?'':'s'} below a sibling)`:`Niece or nephew line (${i-1} generation${i===2?'':'s'} below a sibling)`;
 else label=`Cousins · degree ${Math.min(i,j)-1}${i===j?'':` · ${Math.abs(i-j)} generation${Math.abs(i-j)===1?'':'s'} removed`}`;
 const links=[...a.slice(0,i),...b.slice(0,j)].map(child=>({child,parent:byId.get(child.parent),kind:child.source==='family'?'Family testimony':'Published genealogy',source:sources[child.source]||null}));
 return {status:'recorded',label,common,distances:[i,j],links,paths:[a.slice(0,i+1),b.slice(0,j+1)]};
}

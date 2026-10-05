export const sources = {
 recent:['The Heirs of Europe','https://heirsofeurope.blogspot.com/2016/11/pignatelli-di-montecalvo.html'],
 montecalvo:['Genmarenostrum · Montecalvo','https://www.genmarenostrum.com/pagine-lettere/letterap/PIGNATELLI/PIGNATELLI%20DUCHI%20DI%20MONTECALVO.htm'],
 casalnuovo:['Genmarenostrum · Casalnuovo','https://www.genmarenostrum.com/pagine-lettere/letterap/PIGNATELLI/PIGNATELLI%20MARCHESI%20DI%20CASALNUOVO.htm'],
 branches:['Pignatelli della Leonessa · Family history','https://www.pignatellidellaleonessa.com/famiglia/'],
 libro:['Libro d’Oro della Nobiltà Italiana · XIX edition · p. 1257','https://paolopignatelli.com/family-ai.html#libro-doro-note']
};
const lineage = [
 ['Paolo Pignatelli','di Montecalvo','family'],
 ['Guido Pignatelli','1900–1967','family'],
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
people[0].sex='male';
people.push({id:'natalia',name:'Natalia Pignatelli',detail:'Born 8 July 1951 · Paolo’s sister',parent:null,sex:'female',source:'libro'});
people.push({id:'guido-aquino',name:'Guido d’Aquino di Caramanico',detail:'Natalia’s husband · marriage recorded 30 June 1975',parent:null,sex:'male',source:'libro'});
// These are explicit sibling and marriage statements, not invented parent links.
export const familyLinks=[
 {id:'paolo-natalia',type:'sibling',from:'person-0',to:'natalia',source:'libro'},
 {id:'natalia-guido-aquino',type:'spouse',from:'natalia',to:'guido-aquino',source:'libro',date:'1975-06-30',place:'Naples'}
];
export const personLabel = p => `${p.name} · ${p.detail}`;
export const linkClaim = l => l.type==='parent'?`${personLabel(l.child)} is the child of ${personLabel(l.parent)}.`:l.type==='sibling'?`${personLabel(l.from)} is the sibling of ${personLabel(l.to)}.`:`${personLabel(l.from)} is the recorded spouse of ${personLabel(l.to)}${l.date?` (married ${l.date} in ${l.place})`:''}.`;
export const linkLabel = l => l.type==='parent'?`${personLabel(l.child)} → ${personLabel(l.parent)}`:`${personLabel(l.from)} — ${l.type==='sibling'?'sibling':'spouse'} — ${personLabel(l.to)}`;
function parentLink(child,byId){return {id:`parent:${child.id}`,type:'parent',child,parent:byId.get(child.parent),kind:child.source==='family'?'Family testimony':'Published genealogy',source:sources[child.source]||null};}
function connectedPath(aId,bId,byId,relations){
 const adjacency=new Map([...byId.keys()].map(id=>[id,[]]));
 const add=(from,to,direction,link)=>adjacency.get(from).push({to,direction,link});
 for(const child of byId.values())if(child.parent){const link=parentLink(child,byId);add(child.id,child.parent,'parent',link);add(child.parent,child.id,'child',link);}
 for(const edge of relations){if(!byId.has(edge.from)||!byId.has(edge.to))throw new Error('Missing family link endpoint');if(!['sibling','spouse'].includes(edge.type))throw new Error('Unknown family link type');const link={...edge,from:byId.get(edge.from),to:byId.get(edge.to),kind:'Published book',source:sources[edge.source]||null};add(edge.from,edge.to,edge.type,link);add(edge.to,edge.from,edge.type,link);}
 const queue=[{id:aId,path:[],nodes:[byId.get(aId)]}],seen=new Set([aId]);
 for(let index=0;index<queue.length;index++){const current=queue[index];if(current.id===bId){const pattern=current.path.map(e=>e.direction).join(','),person=byId.get(aId);let label='Recorded family connection';
   if(pattern==='spouse')label='Spouse';
   else if(pattern==='sibling')label=person.sex==='male'?'Brother':person.sex==='female'?'Sister':'Sibling';
   else if(['sibling,spouse','spouse,sibling'].includes(pattern))label=person.sex==='male'?'Brother-in-law':person.sex==='female'?'Sister-in-law':'Sibling-in-law';
   return {status:'recorded',label,basis:'family-links',pattern,links:current.path.map(e=>e.link),path:current.nodes};
  }
  for(const edge of adjacency.get(current.id))if(!seen.has(edge.to)){seen.add(edge.to);queue.push({id:edge.to,path:[...current.path,edge],nodes:[...current.nodes,byId.get(edge.to)]});}
 }
 return null;
}
export function relationship(aId,bId,records=people,relations=records===people?familyLinks:[]) {
 const byId=new Map(records.map(p=>[p.id,p]));
 if(!byId.has(aId)||!byId.has(bId))throw new Error('Unknown person');
 const ancestors=id=>{const path=[],seen=new Set();while(id){if(seen.has(id))throw new Error('Cyclic family data');seen.add(id);const p=byId.get(id);if(!p)throw new Error('Missing parent record');path.push(p);id=p.parent;}return path;};
 const a=ancestors(aId),b=ancestors(bId);const i=a.findIndex(p=>b.some(q=>q.id===p.id));
 if(i<0)return connectedPath(aId,bId,byId,relations)||{status:'unresolved',label:'No recorded path',links:[],paths:[a,b]};
 const j=b.findIndex(p=>p.id===a[i].id),common=a[i];
 let label;
 if(i===0&&j===0)label='The same person';
 else if(j===0)label=i===1?'Child':i===2?'Grandchild':`Descendant (${i} generations)`;
 else if(i===0)label=j===1?'Parent':j===2?'Grandparent':`Ancestor (${j} generations)`;
 else if(i===1&&j===1)label='Sibling through a recorded parent';
 else if(Math.min(i,j)===1)label=i===1?`Aunt or uncle line (${j-1} generation${j===2?'':'s'} below a sibling)`:`Niece or nephew line (${i-1} generation${i===2?'':'s'} below a sibling)`;
 else label=`Cousins · degree ${Math.min(i,j)-1}${i===j?'':` · ${Math.abs(i-j)} generation${Math.abs(i-j)===1?'':'s'} removed`}`;
 const links=[...a.slice(0,i),...b.slice(0,j)].map(child=>parentLink(child,byId));
 return {status:'recorded',label,common,distances:[i,j],links,paths:[a.slice(0,i+1),b.slice(0,j+1)]};
}

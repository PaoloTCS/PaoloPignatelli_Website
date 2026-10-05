import {people,personLabel,relationship,linkLabel} from './relationships.js?v=20261005-crest';

const root=document.getElementById('relationship-widget');
if(root){
 const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 const a=root.querySelector('#relative-a'),b=root.querySelector('#relative-b'),result=root.querySelector('#relationship-result');
 let form=root.querySelector('#jev-form');
 const linkSelect=root.querySelector('#evidence-link'),status=root.querySelector('#jev-status'),review=root.querySelector('#jev-review-link');
 const kind=root.querySelector('#relationship-kind'),filterNote=root.querySelector('#relationship-filter-note');
 let controller;
 const matches=(id)=>{const r=relationship(a.value,id);if(!kind||kind.value==='all')return true;if(kind.value==='unresolved')return r.status==='unresolved';if(r.status!=='recorded'||a.value===id)return false;
 if(kind.value==='marriage')return r.pattern?.includes('spouse');
 if(kind.value==='siblings')return r.pattern==='sibling'||r.label.startsWith('Sibling');
 if(kind.value==='branches')return r.label.startsWith('Cousins');
 return r.basis==='family-links'?/^(parent|child)(,(parent|child))*$/.test(r.pattern):r.distances.some(d=>d===0);
 };
 function filterPeople(){const old=b.value;b.replaceChildren();for(const p of people)if(matches(p.id)){const opt=node('option',personLabel(p));opt.value=p.id;b.append(opt);}if([...b.options].some(o=>o.value===old))b.value=old;
 const empty=!b.options.length;b.disabled=empty;root.querySelector('#swap-relatives').disabled=empty;
 if(filterNote)filterNote.textContent=empty?'No matching connection has been entered yet. Try another relationship, or help us add your branch.':'';
 if(empty){controller?.abort();result.replaceChildren(node('p','No recorded matches for this selection.'));if(form)form.hidden=true;if(review)review.hidden=true;}else update();
 }
 for(const p of people){for(const select of [a,b]){const opt=node('option',personLabel(p));opt.value=p.id;select.append(opt);}}
 const query=new URLSearchParams(location.search);
 a.value=people.some(p=>p.id===query.get('a'))?query.get('a'):'person-0';
 b.value=people.some(p=>p.id===query.get('b'))?query.get('b'):'person-2';
 function update(){
  controller?.abort();controller=null;
  if(form)form.querySelector('button').disabled=false;
  const r=relationship(a.value,b.value),pa=people.find(p=>p.id===a.value),pb=people.find(p=>p.id===b.value);
  result.replaceChildren(node('h3',r.status==='unresolved'?'Connection unresolved':`${pa.name} → ${pb.name}: ${r.label}`));
  if(r.status==='unresolved'){
   result.append(node('p','This limited dataset contains no connecting path. That does not mean these people are unrelated. The route to Lucio remains unresolved and his historical identification is disputed.'));
  }else if(r.links.length){
   result.append(node('p',r.basis==='family-links'?`${r.links.length} recorded family links. ${r.pattern.includes('spouse')?'This connection passes through marriage.':''}`:r.distances.every(d=>d>0)?`Recorded common ancestor: ${personLabel(r.common)}.`:`${r.links.length} parent–child link${r.links.length===1?'':'s'} in the recorded path.`));
   if(r.basis==='family-links'){const path=node('p',r.path.map(p=>p.name).join(' → '));path.className='relationship-path';result.append(path);}
   const details=node('details'),summary=node('summary',`Inspect ${r.links.length} link${r.links.length===1?'':'s'} and sources`),list=node('ol');
   details.append(summary,list);
   for(const l of r.links){const li=node('li');li.append(node('strong',linkLabel(l)),node('p',l.kind));
    if(l.source){const source=node('a',l.source[0]);source.href=l.source[1];source.target='_blank';source.rel='noopener noreferrer';li.append(source);}else li.append(node('p','Paolo’s attributed family testimony, 4 October 2026.'));
    list.append(li);
   }
   result.append(details,node('p',r.links.every(l=>l.kind==='Family testimony')?'Paolo confirmed his father and grandfather. These links are attributed family testimony.':r.links.every(l=>l.kind==='Published book')?'Both links are reported in the photographed Libro d’Oro entry, XIX edition, page 1257. The sibling and marriage statements are recorded separately.':'This path includes relationships reported in published compilations. Original supporting records have not been checked in this project.'));
  }
  if(review){const url=new URL('https://pignatelli-family-agents.vercel.app/');url.searchParams.set('a',a.value);url.searchParams.set('b',b.value);url.hash='relationship-widget';review.href=url.href;review.hidden=!r.links.length;}
  if(form){linkSelect.replaceChildren();for(const l of r.links){const opt=node('option',linkLabel(l));opt.value=l.id;linkSelect.append(opt);}form.hidden=!r.links.length;status.replaceChildren(node('p','Jev assesses one supplied excerpt at a time. No assessment has run for this pair.'));}
 }
 a.addEventListener('change',filterPeople);b.addEventListener('change',update);kind?.addEventListener('change',filterPeople);
 root.querySelector('#swap-relatives').addEventListener('click',()=>{const previous=a.value;a.value=b.value;if(kind)kind.value='all';filterPeople();b.value=previous;update();});
 if(form){
  const clear=()=>{controller?.abort();controller=null;form.querySelector('button').disabled=false;status.textContent='Evidence changed. No current assessment.';};
  form.addEventListener('input',clear);form.addEventListener('change',clear);
  form.addEventListener('submit',async e=>{
   e.preventDefault();controller?.abort();const current=new AbortController();controller=current;const button=form.querySelector('button');button.disabled=true;status.textContent='Asking Jev to assess the supplied excerpt…';
   try{
    const response=await fetch('/api/relationship',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({a:a.value,b:b.value,link:linkSelect.value,attribution:form.querySelector('#evidence-source').value,excerpt:form.querySelector('#evidence-excerpt').value}),signal:current.signal});
    const data=await response.json();if(controller!==current)return;
    if(!response.ok)throw new Error(data.error||'Assessment unavailable. No score generated.');
    const labels={supports:'Supports',contradicts:'Contradicts',ambiguous:'Ambiguous identity or relationship',unrelated:'Does not address the link'};
    status.replaceChildren(node('h3',`Jev’s excerpt assessment: ${labels[data.answer.choice]}`),node('p',data.claim));
    const table=node('table'),caption=node('caption','Model probabilities for this excerpt’s textual support'),head=node('tr');head.append(node('th','Assessment'),node('th','Probability'));const thead=node('thead');thead.append(head);table.append(caption,thead);const body=node('tbody');
    for(const [key,label]of Object.entries(labels)){const tr=node('tr');tr.append(node('td',label),node('td',`${(data.answer.probabilities[key]*100).toFixed(1)}%`));body.append(tr);}table.append(body);status.append(table);
    status.append(node('p',`Model confidence: ${data.answer.confidence.toFixed(3)} (distribution concentration). This is not a probability of biological kinship or historical truth. Human review is required.`),node('p',`Model: ${data.model} · Rubric: ${data.rubricVersion} · ${data.completedAt} · Source supplied: ${data.attribution}`));
   }catch(error){if(error.name!=='AbortError'&&controller===current)status.textContent=error.message;}
   finally{if(controller===current){button.disabled=false;controller=null;}}
  });
  if(location.hostname==='paolopignatelli.com'){
   form.remove();form=null;status.textContent='Jev assessments run in the private research room. This is an interface preview.';
   const anchor=node('a','Open the private research room');anchor.href='https://pignatelli-family-agents.vercel.app/#relationship-widget';status.append(node('p'),anchor);
  }
 }
 update();
}

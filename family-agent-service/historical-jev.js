const form=document.getElementById('historical-jev-form');
if(form&&location.hostname==='paolopignatelli.com'){form.closest('section').remove();}
else if(form){
 const result=document.getElementById('historical-jev-result'),rounds=document.getElementById('historical-rounds');let controller,number=0,evidence=[],candidateSignature='';
 form.addEventListener('input',()=>{controller?.abort();result.textContent='Alternatives or evidence changed. This is a new round; no current assessment.';});
 form.addEventListener('submit',async event=>{
  event.preventDefault();controller?.abort();const current=new AbortController();controller=current;const button=form.querySelector('button[type=submit]');button.disabled=true;result.textContent='Jev is comparing the five named choices with this passage…';
  const candidates=Object.fromEntries(['A','B','C','D'].map(k=>[k,form.querySelector(`#history-${k.toLowerCase()}`).value]));
  const names=[form.querySelector('#history-person-a').value,form.querySelector('#history-person-b').value],signature=JSON.stringify({names,candidates});
  const next={attribution:form.querySelector('#history-attribution').value,excerpt:form.querySelector('#history-excerpt').value};
  const packet=signature===candidateSignature?[...evidence,next]:[next];
  const data={a:names[0],b:names[1],candidates,evidence:packet};
  try{const response=await fetch('/api/historical',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:current.signal});const answer=await response.json();if(current!==controller)return;if(!response.ok)throw new Error(answer.error||'Jev did not return an assessment.');
   const summary=document.createElement('p');summary.textContent=`Jev chose ${answer.answer.choice === 'none'?'none of the above':answer.answer.choice} for this passage. These values compare textual support among the five alternatives.`;
   const table=document.createElement('table'),caption=document.createElement('caption');caption.textContent='Jev probabilities conditional on this passage and candidate set';table.append(caption);const body=document.createElement('tbody');for(const [key,label] of Object.entries(answer.candidates)){const row=document.createElement('tr'),name=document.createElement('th'),value=document.createElement('td');name.textContent=`${key}: ${label}`;value.textContent=`${(answer.answer.probabilities[key]*100).toFixed(1)}%`;row.append(name,value);body.append(row);}table.append(body);
   const note=document.createElement('p');note.textContent=`${answer.limit} Source supplied: ${answer.attribution}. Model: ${answer.model}; completed ${answer.completedAt}.`;
   result.replaceChildren(summary,table,note);evidence=packet;candidateSignature=signature;
   const past=document.createElement('article'),heading=document.createElement('h4'),detail=document.createElement('small');heading.textContent=`Round ${++number} · ${answer.completedAt}`;detail.textContent=`Sources: ${answer.sources.join(' · ')}. Candidate set and probabilities: ${JSON.stringify({candidates:answer.candidates,probabilities:answer.answer.probabilities})}`;past.append(heading,detail);rounds.prepend(past);
  }catch(error){if(error.name!=='AbortError'&&current===controller)result.textContent=error.message;}finally{if(current===controller){controller=null;button.disabled=false;}}
 });
 document.getElementById('history-research-again').addEventListener('click',()=>{document.getElementById('goal').value='history';document.getElementById('mission').scrollIntoView({behavior:'smooth'});document.getElementById('run-status').textContent='Historical investigation selected. Start it to have the agent seek other public paths; review its suggestions before a new Jev round.';});
}

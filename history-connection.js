import {relationship,people} from './family-agent-service/relationships.js?v=20261005-crest';
const select=document.getElementById('history-person');
if(select){
 const path=document.getElementById('history-path'),prompt=document.getElementById('history-prompt'),status=document.getElementById('history-copy-status');
 const el=(tag,value)=>{const n=document.createElement(tag);if(value)n.textContent=value;return n;};
 const oxford='https://www.univ.ox.ac.uk/news/the-assassination-of-rasputin/';
 const elena='https://americanaristocracy.com/people/elena-naryshkina-pignatelli';
 function update(){
  const person=people.find(p=>p.id===select.value),r=relationship(person.id,'elena-naryshkina');
  const names=person.id==='elena-naryshkina'?[person.name]:r.basis==='family-links'?r.path.map(p=>p.name):[];
  path.replaceChildren();
  const list=el('ol');list.className='historical-steps';
  if(r.status==='recorded'&&names.length){const item=el('li',names.join(' → '));item.append(el('small',person.id==='elena-naryshkina'?'Your selected starting point.':`${names.length-1} recorded family link${names.length===2?'':'s'} in this starting segment; inspect sources in the relationship explorer above.`));list.append(item);}
  const open=el('li','Elena Naryshkina Pignatelli → Felix Yusupov: connection to establish');open.className='open';open.append(el('small','Unknown number of degrees: no sourced route between these two people is in the current family graph.'));list.append(open);
  const event=el('li','Felix Yusupov → Rasputin assassination (1916)');event.append(el('small','Historical role reported by University College Oxford.'));list.append(event);path.append(list);
  prompt.value=`Investigate how ${person.name} may be connected by family relationships to Prince Felix Yusupov, a participant in the 1916 assassination of Rasputin. We are looking for a documented path, not a story inferred from a shared surname.\n\nStarting evidence: our family graph records ${names.join(' → ')}. Paolo Pignatelli identifies Elena Naryshkina Pignatelli as his grandmother. A published genealogy lists Elena as Pompeo Pignatelli’s spouse and Guido Pignatelli’s mother: ${elena}. University College Oxford reports Felix Yusupov’s role in the assassination: ${oxford}. These statements do not establish a relationship between Elena and Felix.\n\nFind source-backed candidate links from Elena to Felix, one generation or marriage at a time. For each proposed link give the people, exact relationship, source title, edition/page or archive reference, URL, and what text you actually inspected. Separate original records from later compilations and distinguish descent from a link by marriage. Do not use web search snippets or AI summaries as evidence. If the path cannot be established, show exactly where it stops and propose one useful document to seek next. Discuss the historical event only from public sources. Do not request private family papers. Return a short, readable story followed by a relationship-and-evidence table.`;
  status.textContent='Question ready. No AI model or Jev assessment has run on this page.';
 }
 select.addEventListener('change',update);update();
 document.getElementById('copy-history-prompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(prompt.value);status.textContent='Question copied. Paste it into ChatGPT to begin the investigation.';}catch{prompt.focus();prompt.select();status.textContent='Select and copy the question, then paste it into ChatGPT.';}});
}

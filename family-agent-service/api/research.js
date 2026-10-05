import {runInvestigation,validateInput} from '../lib/agents.js';

export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.status(405).json({error:'Start an investigation from the research room.'});return;}
 // Browser requests stay on this deployment. This endpoint is not a public CORS service.
 const origin=req.headers.origin;const host=req.headers.host;
 let sameOrigin=false;try{sameOrigin=!!origin && new URL(origin).host===host;}catch{}
 if(!sameOrigin){res.status(403).json({error:'Open the research room to start an investigation.'});return;}
 let input;try{input=validateInput(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch{res.status(400).json({error:'Choose a valid investigation and language.'});return;}
 const token=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
 if(!token){res.status(503).json({error:'The research service is waiting for its model connection. No agent has run.'});return;}
 const disconnect=new AbortController();res.on('close',()=>disconnect.abort());
 const timeout=AbortSignal.any([AbortSignal.timeout(110000),disconnect.signal]);
 const call=async(body)=>{
  const r=await fetch('https://ai-gateway.vercel.sh/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({...body,store:false,include:['reasoning.encrypted_content'],reasoning:{effort:'low'}}),signal:timeout});
  if(!r.ok){const e=new Error('model_service_unavailable');e.status=r.status;throw e;}return r.json();
 };
 let model;
 try {
  const r=await fetch('https://ai-gateway.vercel.sh/v1/models',{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw new Error('models_unavailable');
  const data=await r.json();model=(data.data||data.models||[]).find(m=>m.id==='openai/gpt-5.4')?.id;
  if(!model)throw new Error('model_unavailable');
 }catch{res.status(503).json({error:'The selected OpenAI model is unavailable. No agent has run.'});return;}
 res.statusCode=200;res.setHeader('Content-Type','application/x-ndjson; charset=utf-8');res.setHeader('X-Accel-Buffering','no');
 const emit=event=>{if(!res.destroyed)res.write(JSON.stringify(event)+'\n');};
 emit({type:'started',model});
 try {const run=await runInvestigation(input,{call,emit,model});emit({type:'complete',run:{...run,sources:run.sources.map(({excerpt,...s})=>s)}});}
 catch(e){emit({type:'error',message:e.status===402?'The model service has no available research credit. No purchase was made.':e.status===429?'The model service is busy. Please try later.':'The investigation stopped before completing. Any visible partial findings remain unreviewed.'});}
 res.end();
}

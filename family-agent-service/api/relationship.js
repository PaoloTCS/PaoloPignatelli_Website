import {prepareAssessment,validateAnswer} from '../lib/jev.js';

export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Use the relationship widget.'});
 let sameOrigin=false;try{sameOrigin=new URL(req.headers.origin).host===req.headers.host;}catch{}
 if(!sameOrigin)return res.status(403).json({error:'Open the private research room to assess evidence.'});
 let assessment;try{assessment=prepareAssessment(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch{return res.status(400).json({error:'Choose two people, one recorded link, a source name, and an excerpt of 40–6000 characters.'});}
 const key=process.env.TYPESAFE_API_KEY;
 if(!key)return res.status(503).json({error:'The Jev connection is not configured. No assessment or score was generated.'});
 try{
  const r=await fetch('https://api.typesafe.ai/v1/systemone',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(assessment.request),signal:AbortSignal.timeout(45000)});
  if(!r.ok)return res.status(503).json({error:r.status===401?'The Jev server credential needs attention. No score was generated.':r.status===429||r.status===529?'Jev is busy. Try again later; no score was generated.':'Jev could not complete this assessment. No score was generated.'});
  const result=validateAnswer(await r.json());
  return res.status(200).json({...result,claim:assessment.claim,attribution:assessment.attribution,completedAt:new Date().toISOString(),rubricVersion:'family-relationship-excerpt-v2',limit:'Textual support in a supplied excerpt; source authenticity and historical truth are unverified. Human review required.'});
 }catch{return res.status(503).json({error:'The Jev assessment could not complete. No score was generated.'});}
}

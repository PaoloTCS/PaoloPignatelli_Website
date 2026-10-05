import {prepareHistoricalAssessment,validateHistoricalAnswer} from '../lib/historical-jev.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Use the historical evidence form.'});
 let sameOrigin=false;try{sameOrigin=new URL(req.headers.origin).host===req.headers.host;}catch{}
 if(!sameOrigin)return res.status(403).json({error:'Open the private research room to assess evidence.'});
 let assessment;try{assessment=prepareHistoricalAssessment(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch{return res.status(400).json({error:'Provide two people, four named alternatives, a source reference, and an excerpt of 40–6000 characters.'});}
 const key=process.env.TYPESAFE_API_KEY;
 if(!key)return res.status(503).json({error:'The Jev connection is not configured. No probability or assessment was generated.'});
 try{
  const response=await fetch('https://api.typesafe.ai/v1/systemone',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(assessment.request),signal:AbortSignal.timeout(45000)});
  if(!response.ok)return res.status(503).json({error:response.status===401?'The Jev server credential needs attention. No probability was generated.':response.status===429||response.status===529?'Jev is busy. No probability was generated.':'Jev could not complete the assessment. No probability was generated.'});
  const answer=validateHistoricalAnswer(await response.json());
  return res.status(200).json({...answer,candidates:assessment.candidates,attribution:assessment.attribution,sources:assessment.sources,completedAt:new Date().toISOString(),rubricVersion:'historical-alternatives-excerpt-v1',limit:'Textual support for this exact claim in a supplied excerpt; source authenticity, historical truth, and overall kinship remain unverified. Human review required.'});
 }catch{return res.status(503).json({error:'The Jev assessment could not complete. No probability was generated.'});}
}

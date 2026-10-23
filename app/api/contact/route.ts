import {NextResponse} from 'next/server';

export const runtime='nodejs';

type ContactPayload={name?:unknown;email?:unknown;category?:unknown;message?:unknown;website?:unknown};
const allowedCategories=new Set(['A software project','A job opportunity','Design & creative work','Collaboration','Something else']);
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(s:unknown)=>typeof s==='string'?s.trim():'';
const escapeHtml=(s:string)=>s.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]||ch));
const invalid=(error:string,status=400)=>NextResponse.json({error},{status,headers:{'Cache-Control':'no-store'}});

export async function POST(request:Request){
  const origin=request.headers.get('origin');
  if(origin){
    try{if(new URL(origin).host!==new URL(request.url).host)return invalid('Origin not permitted.',403)}
    catch{return invalid('Origin not permitted.',403)}
  }
  if(!request.headers.get('content-type')?.startsWith('application/json'))return invalid('Expected JSON.');
  if(Number(request.headers.get('content-length')||0)>12000)return invalid('Message too large.',413);
  let payload:ContactPayload;
  try{payload=await request.json() as ContactPayload}catch{return invalid('Invalid request.');}
  if(clean(payload.website))return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}}); // Spam trap; no email sent.
  const name=clean(payload.name),email=clean(payload.email),category=clean(payload.category),message=clean(payload.message);
  if(name.length<2||name.length>100)return invalid('Please enter a valid name.');
  if(email.length>254||!emailPattern.test(email))return invalid('Please enter a valid email address.');
  if(!allowedCategories.has(category))return invalid('Choose an inquiry type.');
  if(message.length<10||message.length>1500)return invalid('Please enter a message between 10 and 1500 characters.');
  const apiKey=process.env.RESEND_API_KEY;
  const to=process.env.CONTACT_TO_EMAIL;
  const from=process.env.CONTACT_FROM_EMAIL;
  if(!apiKey||!to||!from)return invalid('The contact inbox is not connected yet. Please try again later.',503);
  const plain=`New portfolio inquiry\n\nName: ${name}\nEmail: ${email}\nType: ${category}\n\n${message}`;
  try{
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({from,to:[to],reply_to:email,subject:`Portfolio inquiry: ${category}`,
        text:plain,
        html:`<h2>New portfolio inquiry</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Type:</b> ${escapeHtml(category)}</p><pre style="font:inherit;white-space:pre-wrap">${escapeHtml(message)}</pre>`}),
      cache:'no-store',
    });
    if(!response.ok){console.error('Contact provider rejected request',response.status);return invalid('Message delivery is unavailable right now. Please try again later.',502);}
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch(err){console.error('Contact provider unreachable',err);return invalid('Message delivery is unavailable right now. Please try again later.',502);}
}

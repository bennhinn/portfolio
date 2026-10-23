import {disciplines} from './data';

export function attachAbout(root) {
 const query=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 let paused=false,disposed=false;
 try{paused=localStorage.getItem('bennhinn-about-depth')==='paused';}catch{}
 const listeners=[],animations=new Set();
 const on=(target,type,fn,options)=>{target.addEventListener(type,fn,options);listeners.push(()=>target.removeEventListener(type,fn,options));};
 const enabled=()=>!paused&&!preference.matches&&!document.hidden;
 const surfaces=all('[data-aa-surface]');
 function reset(surface){['--aa-rx','--aa-ry'].forEach(k=>surface.style.setProperty(k,'0deg'));['--aa-x','--aa-y'].forEach(k=>surface.style.setProperty(k,'0px'));['--aa-light-x','--aa-light-y'].forEach(k=>surface.style.setProperty(k,'50%'));}
 function refresh(){
  root.dataset.aaMotion=enabled()?'on':'off';
  const button=query('[data-aa-motion]');
  button.textContent=preference.matches?'Reduced motion on':paused?'▷ Resume depth':'Ⅱ Pause depth';
  button.setAttribute('aria-pressed',String(paused||preference.matches));
  if(!enabled()||!fine.matches){surfaces.forEach(reset);animations.forEach(a=>a.cancel());animations.clear();}
 }
 on(query('[data-aa-motion]'),'click',()=>{if(preference.matches)return;paused=!paused;try{localStorage.setItem('bennhinn-about-depth',paused?'paused':'on');}catch{}refresh();});
 on(preference,'change',refresh);on(fine,'change',refresh);on(document,'visibilitychange',refresh);
 surfaces.forEach(surface=>{
  on(surface,'pointermove',event=>{
   if(!enabled()||!fine.matches||event.pointerType!=='mouse')return;
   const box=surface.getBoundingClientRect();
   if(!box.width||!box.height)return;
   const x=Math.max(-.5,Math.min(.5,(event.clientX-box.left)/box.width-.5));
   const y=Math.max(-.5,Math.min(.5,(event.clientY-box.top)/box.height-.5));
   const depth=Number(surface.dataset.aaDepth)||4;
   surface.style.setProperty('--aa-rx',(-y*depth*2).toFixed(2)+'deg');
   surface.style.setProperty('--aa-ry',(x*depth*2).toFixed(2)+'deg');
   surface.style.setProperty('--aa-x',(x*14).toFixed(2)+'px');
   surface.style.setProperty('--aa-y',(y*14).toFixed(2)+'px');
   surface.style.setProperty('--aa-light-x',((x+.5)*100).toFixed(1)+'%');
   surface.style.setProperty('--aa-light-y',((y+.5)*100).toFixed(1)+'%');
  },{passive:true});
  on(surface,'pointerleave',()=>reset(surface));
  on(surface,'pointercancel',()=>reset(surface));
 });
 function animate(el,frames,options){
  if(!enabled()||!el.animate)return;
  const a=el.animate(frames,options);animations.add(a);a.finished.then(()=>animations.delete(a),()=>animations.delete(a));
 }
 let selected=0;
 function choose(index){
  const d=disciplines[index];if(!d)return;
  all('[data-aa-select]').forEach(b=>{const active=Number(b.dataset.aaSelect)===index;b.setAttribute('aria-pressed',String(active));b.classList.toggle('is-active',active);});
  query('[data-aa-num]').textContent=d.number+' / 03';query('[data-aa-mark]').textContent=d.mark;
  query('[data-aa-sub]').textContent=d.sub;query('[data-aa-title]').textContent=d.title;query('[data-aa-body]').textContent=d.text;
  query('[data-aa-methods]').replaceChildren(...d.methods.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  if(index!==selected)animate(query('.aa-insight'),[{opacity:.4,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,.75,.22,1)'});
  selected=index;
 }
 all('[data-aa-select]').forEach(button=>on(button,'click',()=>choose(Number(button.dataset.aaSelect))));
 let observer;
 if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{if(disposed)return;entries.forEach(entry=>{if(!entry.isIntersecting)return;animate(entry.target,[{opacity:.4,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:750,easing:'cubic-bezier(.22,.75,.22,1)'});observer.unobserve(entry.target);});},{threshold:.12});all('[data-aa-reveal]').forEach(el=>observer.observe(el));}
 refresh();
 return()=>{disposed=true;listeners.forEach(off=>off());observer?.disconnect();animations.forEach(a=>a.cancel());surfaces.forEach(reset);delete root.dataset.aaMotion;};
}

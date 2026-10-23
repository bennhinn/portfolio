'use client';
import {useState,useEffect,Suspense,lazy,useRef} from 'react';
const SplineKeyCanvas=lazy(()=>import('./SplineKeyCanvas'));
const Arrow=()=> <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 19 19 5M9 5h10v10"/></svg>;
/** Keeps Spline visual-only and the real controls keyboard/touch accessible. */
export default function GlassKey({href,splineScene}:{href:string;splineScene?:string}){
 const [open,setOpen]=useState(false),[pressing,setPressing]=useState(false),[hovered,setHovered]=useState(false),[sceneReady,setSceneReady]=useState(false),[reduced,setReduced]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');setReduced(m.matches);const handler=()=>setReduced(m.matches);m.addEventListener('change',handler);return()=>{m.removeEventListener('change',handler);if(timer.current)clearTimeout(timer.current)}},[]);
 const onPress=()=>{
  if(timer.current)clearTimeout(timer.current);
  if(open){setOpen(false);setPressing(false);return}
  setPressing(true);
  timer.current=setTimeout(()=>{setPressing(false);setOpen(true)},reduced?0:200);
 };
 return <div className={'key-slot'+(open?' is-open':'')}>
  <button type="button" className={'key-trigger'+(pressing?' pressing':'')} onClick={onPress} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocus={()=>setHovered(true)} onBlur={()=>setHovered(false)} aria-expanded={open} aria-controls="hero-work-link" aria-label={open?'Close View My Work reveal':'Press glass key to reveal View My Work'}>
   <span className="key-3d" aria-hidden="true"><span className="key-base"/><span className="key-top"><Arrow/></span></span>
  </button>
  <a className="work-reveal" id="hero-work-link" href={href} aria-hidden={!open} tabIndex={open?0:-1}><span>View My Work</span><Arrow/></a>
  {splineScene && !reduced && <div className={'spline-visual'+(sceneReady?' ready':'')} aria-hidden="true"><div className="spline-scale"><Suspense fallback={null}><SplineKeyCanvas scene={splineScene} active={open} hovered={hovered} onReady={()=>setSceneReady(true)}/></Suspense></div></div>}
  <span className="key-prompt" aria-hidden="true">PRESS TO REVEAL</span>
 </div>;
}

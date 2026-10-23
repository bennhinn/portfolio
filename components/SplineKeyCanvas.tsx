'use client';

import { useCallback, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';

/** The scene is optional until Bennhinn publishes his Spline code-export URL.
 * Keep the visible HTML button as the single input target. The canvas is only
 * a visual layer: no trapped focus, no competing navigation, no layout shift.
 */
export default function SplineKeyCanvas({scene,active,hovered,onReady}:{
  scene:string;active:boolean;hovered:boolean;onReady:()=>void
}) {
  const appRef=useRef<Application|null>(null);
  const pivotRef=useRef<ReturnType<Application['findObjectByName']>|null>(null);
  const activeRef=useRef(active), hoveredRef=useRef(hovered);
  useEffect(()=>{activeRef.current=active;hoveredRef.current=hovered},[active,hovered]);
  const onLoad=useCallback((app:Application)=>{
    appRef.current=app;
    pivotRef.current=app.findObjectByName('Glass Key Press Pivot');
    if(pivotRef.current)onReady();
  },[onReady]);
  useEffect(()=>{
    let frame=0,alive=true;
    function tick(){
      if(!alive)return;
      const o=pivotRef.current;
      if(o){
        const open=activeRef.current,hover=hoveredRef.current;
        const dx=open?-18:0,dy=open?-7:(hover?8:0),dz=open?-8:(hover?9:0);
        const ease=.12;
        o.position.x+=(dx-o.position.x)*ease;
        o.position.y+=(dy-o.position.y)*ease;
        o.position.z+=(dz-o.position.z)*ease;
      }
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return()=>{alive=false;cancelAnimationFrame(frame)};
  },[]);
  return <Spline scene={scene} onLoad={onLoad} renderOnDemand={false}/>;
}

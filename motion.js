function setDashboardMotion(enabled){
 if(!enabled&&document.body.hasAttribute('data-dashboard-motion'))dashboardMotionFinish();
 document.body.dataset.dashboardMotion=enabled?'on':'off';
 try{localStorage.setItem('093_dashboard_motion',enabled?'on':'off')}catch{}
 document.querySelectorAll('[data-motion-toggle]').forEach(button=>{
  button.textContent=enabled?'Tắt hoạt cảnh':'Bật hoạt cảnh';
  button.setAttribute('aria-pressed',String(enabled));
 });
}

// Animate only navigation and its asynchronous chart loads; filtering stays immediate.
let dashboardMotionNavigation=false,dashboardMotionObserver=null,dashboardPrinting=false;
const dashboardMotionSeen=new WeakSet(),dashboardMotionJobs=new Set();
const dashboardReducedMotion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
function dashboardMotionAllowed(){return document.body.dataset.dashboardMotion==='on'&&!dashboardPrinting&&!dashboardReducedMotion?.matches;}
function dashboardMotionFinish(){for(const job of [...dashboardMotionJobs])job.finish();}
function dashboardMotionFilter(){dashboardMotionNavigation=false;dashboardMotionFinish();}
function dashboardMotionNavigate(){dashboardMotionFinish();dashboardMotionNavigation=true;}
function dashboardTrackAnimation(element,frames,options,cleanup=()=>{}){
 if(typeof element.animate!=='function'){cleanup();return;}
 const animation=element.animate(frames,{easing:'cubic-bezier(.22,.75,.25,1)',fill:'backwards',...options});
 animation.finished?.catch(()=>{});
 let done=false;const job={finish(){if(done)return;done=true;animation.cancel();cleanup();dashboardMotionJobs.delete(job);}};
 dashboardMotionJobs.add(job);animation.onfinish=()=>job.finish();animation.oncancel=()=>{if(!done){done=true;cleanup();dashboardMotionJobs.delete(job);}};
}
function dashboardMotionNumber(element){
 if(element.closest('[aria-live]'))return;
 const final=element.textContent,match=final.trim().match(/^(-?[\d.]+(?:,\d+)?)(\s*(?:%|triệu|tỷ|đ|hồ sơ|vụ))?$/u);if(!match)return;
 const value=Number(match[1].replaceAll('.','').replace(',','.'));if(!Number.isFinite(value)||value===0)return;
 const decimals=(match[1].split(',')[1]||'').length,format=new Intl.NumberFormat('vi-VN',{minimumFractionDigits:decimals,maximumFractionDigits:decimals}),start=performance.now();let frame;
 const previousLabel=element.getAttribute('aria-label');element.setAttribute('aria-label',final);
 const job={finish(){cancelAnimationFrame(frame);element.textContent=final;if(previousLabel===null)element.removeAttribute('aria-label');else element.setAttribute('aria-label',previousLabel);dashboardMotionJobs.delete(job);}};dashboardMotionJobs.add(job);
 const tick=now=>{if(!element.isConnected||!dashboardMotionAllowed()){job.finish();return;}const t=Math.min(1,Math.max(0,(now-start)/950));if(t===1){job.finish();return;}element.textContent=format.format(value*(1-Math.pow(1-t,3)))+(match[2]||'');frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
}
let dashboardRingId=0;
function dashboardMotionRing(svg){
 if(typeof requestAnimationFrame!=='function')return;
 const ns='http://www.w3.org/2000/svg',slices=[...svg.querySelectorAll('.ring-slice')];if(!slices.length)return;
 const clip=document.createElementNS(ns,'clipPath'),path=document.createElementNS(ns,'path'),group=document.createElementNS(ns,'g'),id='motion-ring-'+(++dashboardRingId);clip.id=id;clip.append(path);svg.querySelector('defs')?.append(clip);slices[0].before(group);slices.forEach(s=>group.append(s));group.setAttribute('clip-path','url(#'+id+')');
 const start=performance.now();let frame;
 const job={finish(){cancelAnimationFrame(frame);group.removeAttribute('clip-path');clip.remove();dashboardMotionJobs.delete(job);}};dashboardMotionJobs.add(job);
 const tick=now=>{if(!svg.isConnected||!dashboardMotionAllowed()){job.finish();return;}const t=Math.min(1,Math.max(0,(now-start)/1100));if(t===1){job.finish();return;}const end=(1-Math.pow(1-t,3))*Math.PI*2,coords=['M160,143','L160,-37'];for(let a=0;a<end;a+=.08)coords.push('L'+(160+180*Math.sin(a))+','+(143-180*Math.cos(a)));coords.push('L'+(160+180*Math.sin(end))+','+(143-180*Math.cos(end)),'Z');path.setAttribute('d',coords.join(' '));frame=requestAnimationFrame(tick);};path.setAttribute('d','M160,143 L160,-37 Z');frame=requestAnimationFrame(tick);
}
function dashboardMotionSweep(){
 const host=document.getElementById('content');if(!host||!dashboardMotionNavigation||!dashboardMotionAllowed())return;
 let stagger=0;
 for(const element of host.querySelectorAll('.card,.panel,.service-hero,.service-kpis>div,.health-panel')){
  if(dashboardMotionSeen.has(element))continue;dashboardMotionSeen.add(element);
  dashboardTrackAnimation(element,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:Math.min(stagger++,7)*55});
 }
 for(const element of host.querySelectorAll('.card strong,.service-kpis b,.money')){if(dashboardMotionSeen.has(element))continue;dashboardMotionSeen.add(element);dashboardMotionNumber(element);}
 for(const element of host.querySelectorAll('.animated-column,.xo-cylinder,.history-svg svg rect,.track>span')){
  if(dashboardMotionSeen.has(element))continue;dashboardMotionSeen.add(element);let target=element;
  if(element.tagName.toLowerCase()==='g'){
   const shapes=[...element.children].filter(n=>['rect','ellipse','path'].includes(n.tagName.toLowerCase()));
   if(shapes.length){target=document.createElementNS('http://www.w3.org/2000/svg','g');shapes[0].before(target);shapes.forEach(n=>{dashboardMotionSeen.add(n);target.append(n);});}
  }
  const horizontal=element.matches('.track>span');target.style.transformBox='fill-box';target.style.transformOrigin=horizontal?'0% 50%':'50% 100%';
  const origin=element.getAttribute('data-motion-origin');if(origin){target.style.transformBox='view-box';target.style.transformOrigin=origin;}
  dashboardTrackAnimation(target,[{transform:horizontal?'scaleX(.001)':'scaleY(.001)',opacity:.25},{transform:horizontal?'scaleX(1)':'scaleY(1)',opacity:1}],{duration:900});
 }
 for(const path of host.querySelectorAll('.history-svg path[fill="none"],.cohort-chart path[fill="none"]')){
  if(dashboardMotionSeen.has(path))continue;dashboardMotionSeen.add(path);if(typeof path.getTotalLength!=='function')continue;
  let length;try{length=path.getTotalLength()}catch{continue}if(!length)continue;
  const oldArray=path.style.strokeDasharray,oldOffset=path.style.strokeDashoffset;path.style.strokeDasharray=String(length);
  dashboardTrackAnimation(path,[{strokeDashoffset:String(length)},{strokeDashoffset:'0'}],{duration:1100},()=>{path.style.strokeDasharray=oldArray;path.style.strokeDashoffset=oldOffset;});
 }
 for(const svg of host.querySelectorAll('.depth-ring svg')){if(dashboardMotionSeen.has(svg))continue;dashboardMotionSeen.add(svg);dashboardMotionRing(svg);}
 for(const line of host.querySelectorAll('.health-line')){
  if(dashboardMotionSeen.has(line))continue;
  dashboardMotionSeen.add(line);
  dashboardTrackAnimation(line,[{strokeDasharray:'0 1'},{strokeDasharray:'1 0'}],{duration:780});
 }
 for(const area of host.querySelectorAll('.health-area')){if(dashboardMotionSeen.has(area))continue;dashboardMotionSeen.add(area);dashboardTrackAnimation(area,[{opacity:0},{opacity:.24}],{duration:1100});}
}
function dashboardMotionRender(){
 const host=document.getElementById('content');if(!host)return;
 if(!dashboardMotionObserver&&typeof MutationObserver==='function'){dashboardMotionObserver=new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))dashboardMotionSweep();});dashboardMotionObserver.observe(host,{childList:true,subtree:true});}
 dashboardMotionSweep();
}
document.addEventListener('input',e=>{if(e.target.closest('.filters,.history-filters,.health-heading,.history-cost-controls'))dashboardMotionFilter();},true);
document.addEventListener('change',e=>{if(e.target.closest('.filters,.history-filters,.health-heading,.history-cost-controls')||e.target.id==='dim')dashboardMotionFilter();},true);
window.addEventListener('beforeprint',()=>{dashboardPrinting=true;dashboardMotionFinish();});
window.addEventListener('afterprint',()=>{dashboardPrinting=false;});
dashboardReducedMotion?.addEventListener?.('change',()=>{if(dashboardReducedMotion.matches)dashboardMotionFilter();});

try{setDashboardMotion(localStorage.getItem('093_dashboard_motion')!=='off')}catch{setDashboardMotion(true)}

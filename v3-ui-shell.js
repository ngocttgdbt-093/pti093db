/* V3 mobile navigation adapter. Presentation only: reuses existing go(page). */
(function(){
 'use strict';
 const primary=['Tổng quan','Giám định viên','Phân tích HS tồn','Phân tích CP & BT'];
 const secondary=['Cải tiến CLDV','Tra cứu hồ sơ','Quản trị hệ thống'];
 const icons=['⌂','♙','▤','▥'];
 function setup(){
   const nav=document.getElementById('nav');
   if(!nav||nav.dataset.v3Ready==='1'||!primary.every(name=>[...nav.children].some(b=>b.textContent.trim()===name)))return false;
   nav.dataset.v3Ready='1';
   [...nav.children].forEach(b=>{const i=primary.indexOf(b.textContent.trim());if(i>=0){b.dataset.v3Icon=icons[i];b.setAttribute('aria-label',b.textContent.trim());}});
   const more=document.createElement('button');more.type='button';more.className='v3-more-button';more.textContent='Thêm';more.dataset.v3Icon='☷';more.setAttribute('aria-haspopup','dialog');more.setAttribute('aria-expanded','false');nav.appendChild(more);
   const sheet=document.createElement('div');sheet.className='v3-more-sheet';sheet.setAttribute('aria-hidden','true');sheet.innerHTML='<div class="v3-more-inner" role="dialog" aria-modal="true" aria-label="Các chức năng khác"><div class="v3-more-top"><span>Chức năng khác</span><button type="button" class="v3-more-close">Đóng ✕</button></div><div class="v3-more-items"></div></div>';
   document.body.appendChild(sheet);
   const close=()=>{sheet.setAttribute('aria-hidden','true');more.setAttribute('aria-expanded','false');more.focus({preventScroll:true})};
   const open=()=>{sheet.setAttribute('aria-hidden','false');more.setAttribute('aria-expanded','true');sheet.querySelector('.v3-more-close').focus({preventScroll:true})};
   more.addEventListener('click',()=>sheet.getAttribute('aria-hidden')==='true'?open():close());
   sheet.querySelector('.v3-more-close').addEventListener('click',close);
   sheet.addEventListener('click',e=>{if(e.target===sheet)close()});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.getAttribute('aria-hidden')==='false')close()});
   const items=sheet.querySelector('.v3-more-items');
   secondary.forEach(name=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',()=>{close();if(typeof window.go==='function')window.go(name)});items.appendChild(b)});
   function sync(){
     const active=[...nav.children].find(b=>b.getAttribute('aria-current')==='page');
     const isMore=active&&secondary.includes(active.textContent.trim());
     more.classList.toggle('v3-more-active',!!isMore);
     items.querySelectorAll('button').forEach(b=>{if(active&&b.textContent===active.textContent)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
   }
   const observer=new MutationObserver(sync);
   [...nav.children].forEach(b=>{if(b!==more)observer.observe(b,{attributes:true,attributeFilter:['aria-current']})});
   sync();return true;
 }
 if(!setup()){
   const observer=new MutationObserver(()=>{if(setup())observer.disconnect()});
   observer.observe(document.documentElement,{childList:true,subtree:true});
   document.addEventListener('DOMContentLoaded',setup,{once:true});
 }
})();

function setDashboardMotion(enabled){
 document.body.dataset.dashboardMotion=enabled?'on':'off';
 try{localStorage.setItem('093_dashboard_motion',enabled?'on':'off')}catch{}
 document.querySelectorAll('[data-motion-toggle]').forEach(button=>{
  button.textContent=enabled?'Tắt hoạt cảnh':'Bật hoạt cảnh';
  button.setAttribute('aria-pressed',String(enabled));
 });
}
try{setDashboardMotion(localStorage.getItem('093_dashboard_motion')!=='off')}catch{setDashboardMotion(true)}

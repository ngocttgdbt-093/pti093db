let datasetSyncBlocked=false,datasetSyncPoll=null,datasetSyncChecking=false;
function showDatasetSyncNotice(){
 let dialog=document.getElementById('datasetSyncScreen');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='datasetSyncScreen';dialog.className='dataset-sync-screen';dialog.setAttribute('aria-labelledby','datasetSyncTitle');dialog.innerHTML='<div class="dataset-sync-card"><div class="dataset-sync-spinner" aria-hidden="true"></div><p class="dataset-sync-brand">PTI093 · HẢI PHÒNG</p><h1 id="datasetSyncTitle">Dữ liệu đang được cập nhật và đồng bộ tự động</h1><p>Vui lòng quay lại sau ít phút.</p><p class="dataset-sync-hint" role="status" aria-live="polite">Hệ thống sẽ tự mở lại khi đồng bộ kết thúc.</p><button type="button" onclick="location.reload()">Kiểm tra lại</button></div>';dialog.addEventListener('cancel',e=>e.preventDefault());document.body.append(dialog);}
 if(!dialog.open)dialog.showModal();
}
function hideDatasetSyncNotice(){const dialog=document.getElementById('datasetSyncScreen');if(dialog){dialog.close();dialog.remove();}}
async function waitForDatasetSync(){
 showDatasetSyncNotice();
 while(true){
  try{const r=await authFetch('/api/sync-status');if(r.ok){const state=await r.json();if(!state.running){hideDatasetSyncNotice();return;}}}catch(error){if(!sessionStorage.getItem('pti093_auth'))throw error;}
  await new Promise(resolve=>setTimeout(resolve,5000));
 }
}
async function checkDatasetSync(){
 if(datasetSyncChecking||!sessionStorage.getItem('pti093_auth'))return;datasetSyncChecking=true;
 try{const r=await authFetch('/api/sync-status');if(!r.ok)return;const state=await r.json();
  if(state.running){if(typeof importBusy!=='undefined'&&importBusy)return;datasetSyncBlocked=true;showDatasetSyncNotice();return;}
  if(typeof importBusy!=='undefined'&&importBusy)return;
  if(datasetSyncBlocked||(typeof REPORT_META!=='undefined'&&state.activeDate&&state.activeDate!==REPORT_META.date)){location.reload();return;}
  hideDatasetSyncNotice();
 }catch{}finally{datasetSyncChecking=false;}
}
function startDatasetSyncWatch(){if(datasetSyncPoll)return;checkDatasetSync();datasetSyncPoll=setInterval(checkDatasetSync,10000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkDatasetSync()});window.addEventListener('focus',checkDatasetSync);}

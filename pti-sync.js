let ptiSyncStatus=null,ptiSyncConfigBusy=false,ptiManualBusy=false;
const ptiSyncTime=v=>v?new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'short',timeStyle:'short'}).format(new Date(v)):'Chưa có';
function ptiSyncPanel(){return `<section class="panel pti-sync-panel"><div class="pti-sync-heading"><div><h2>Kết nối hệ thống báo cáo PTI</h2><p>Lưu tài khoản PTI để chuẩn bị lấy ba nguồn báo cáo của phòng 093.</p></div><button class="import-primary" onclick="openPtiSyncConfig()">Cấu hình tài khoản PTI</button></div><div class="pti-manual-update"><button type="button" class="import-primary" id="ptiManualUpdate" onclick="requestPtiManualUpdate()" ${ptiManualBusy?'disabled':''}>Cập nhật từ PTI</button><p class="note">Xác nhận bằng mật khẩu cập nhật dữ liệu như Local/Drive. Hệ thống tự lấy ba báo cáo PTI, đối soát và cập nhật. Giữ trang mở đến khi hoàn tất.</p><p id="ptiManualFeedback" role="status" aria-live="polite"></p></div><div id="ptiSyncStatus" aria-live="polite">Đang đọc trạng thái…</div><p class="note">Lịch yêu cầu: 06:00 hằng ngày; thử lại lúc 12:30 cùng ngày nếu lần sáng lỗi. Giờ Việt Nam. Chỉ cập nhật khi lấy và đối soát đủ ba báo cáo. Khi lỗi, hệ thống tiếp tục dùng dữ liệu hiện tại.</p></section>`}
function drawPtiSyncStatus(){
 const s=ptiSyncStatus;if(!s)return;
 const host=$('ptiSyncStatus'),banner=$('ptiSyncBanner'),run=s.lastSync,enabled=s.schedule?.enabled;
 const state=s.connection==='verified'?'Đã xác thực tài khoản':s.connection==='checking'?'Đang kiểm tra kết nối':s.connection==='rejected'?'Kết nối PTI lỗi':'Chưa cấu hình tài khoản PTI';
 if(host){host.innerHTML=`<div class="pti-sync-state ${s.connection==='rejected'||['failed','interrupted'].includes(run?.status)?'failed':''}"><b>${esc(state)}</b><p>${esc(s.message)}</p><dl><div><dt>Lần lưu tài khoản</dt><dd>${esc(ptiSyncTime(s.updatedAt))}</dd></div><div><dt>Kiểm tra kết nối</dt><dd>${esc(ptiSyncTime(s.checkedAt))}</dd></div><div><dt>Dữ liệu đang dùng</dt><dd>${esc(s.activeDate?.split('-').reverse().join('/')||'—')}</dd></div><div><dt>Lịch tự động</dt><dd>${enabled?'Đang bật · 06:00; thử lại 12:30 khi lần sáng lỗi':'Chưa kích hoạt — chờ kiểm thử xuất báo cáo'}</dd></div></dl>${run?`<div class="pti-sync-last"><b>Lần đồng bộ gần nhất: ${esc(run.status==='succeeded'?'Thành công':run.status==='running'?'Đang thực hiện':'Chưa thành công')}</b><p>${esc(run.message)}</p><p>Bắt đầu ${esc(ptiSyncTime(run.startedAt))}${run.finishedAt?' · Kết thúc '+esc(ptiSyncTime(run.finishedAt)):''} · Ngày báo cáo ${esc(run.reportDate?.split('-').reverse().join('/')||'—')}</p>${run.result?.counts?`<p>${esc(String(run.result.counts.f))} Phát sinh · ${esc(String(run.result.counts.g))} Giải quyết · ${esc(String(run.result.counts.t))} Tồn</p>`:''}</div>`:''}</div>`;}
 if(banner)banner.remove();
}
async function loadPtiSyncStatus(){try{const r=await authFetch('/api/pti-sync/status');if(!r.ok)throw Error();ptiSyncStatus=await r.json();drawPtiSyncStatus()}catch{const h=$('ptiSyncStatus');if(h)h.textContent='Chưa đọc được trạng thái kết nối PTI. Dữ liệu báo cáo hiện tại vẫn được giữ nguyên.';}}
async function openPtiSyncConfig(){
 if(ptiSyncConfigBusy)return;ptiSyncConfigBusy=true;
 try{const token=await requestDatabasePassword();if(!token)return;await showPtiCredentialForm(token)}finally{ptiSyncConfigBusy=false}
}
function showPtiCredentialForm(token){return new Promise(resolve=>{
 const dialog=document.createElement('dialog');dialog.className='db-admin-dialog pti-credentials-dialog';dialog.setAttribute('aria-labelledby','ptiCredentialsTitle');
 dialog.innerHTML=`<form class="db-admin-card"><header><p class="db-admin-brand">PTI093 · HẢI PHÒNG</p><h2 id="ptiCredentialsTitle">Tài khoản hệ thống báo cáo PTI</h2><p>Thông tin được mã hóa và chỉ dùng để kết nối dor.pti.com.vn qua cổng IPAS.</p></header><label for="ptiUsername">Tài khoản PTI</label><input id="ptiUsername" name="ptiUsername" autocomplete="off" autocapitalize="none" spellcheck="false" required maxlength="150" placeholder="Nhập tài khoản PTI"><label for="ptiPassword">Mật khẩu PTI</label><div class="db-admin-field"><input id="ptiPassword" name="ptiPassword" type="password" autocomplete="off" required maxlength="200" placeholder="Nhập mật khẩu PTI"><button type="button" class="db-admin-show" aria-label="Hiện mật khẩu PTI" aria-pressed="false">◉</button></div><p class="db-admin-feedback" role="status" aria-live="polite"></p><button type="submit" class="db-admin-submit">Lưu và kiểm tra kết nối</button><button type="button" class="db-admin-cancel">Đóng</button><footer>Không thay đổi dữ liệu báo cáo trong bước này</footer></form>`;
 document.body.append(dialog);let busy=false,consumed=false;
 const form=dialog.querySelector('form'),user=dialog.querySelector('#ptiUsername'),pass=dialog.querySelector('#ptiPassword'),submit=dialog.querySelector('[type="submit"]'),cancel=dialog.querySelector('.db-admin-cancel'),message=dialog.querySelector('[role="status"]');
 dialog.addEventListener('close',()=>{user.value='';pass.value='';token='';dialog.remove();resolve()},{once:true});
 dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault()});
 dialog.addEventListener('click',e=>{e.stopPropagation();if(e.target===dialog&&!busy){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 cancel.onclick=()=>{if(!busy)dialog.close()};
 dialog.querySelector('.db-admin-show').onclick=function(){const show=pass.type==='password';pass.type=show?'text':'password';this.setAttribute('aria-label',show?'Ẩn mật khẩu PTI':'Hiện mật khẩu PTI');this.setAttribute('aria-pressed',String(show))};
 form.onsubmit=async e=>{e.preventDefault();if(busy||consumed)return;busy=true;submit.disabled=true;cancel.disabled=true;submit.textContent='Đang lưu và kiểm tra…';message.textContent='Đang kết nối cổng đăng nhập PTI. Bước này có thể mất một lúc.';
  try{const response=await authFetch('/api/pti-sync/config',{method:'POST',headers:{'Content-Type':'application/json','X-Database-Authorization':token},body:JSON.stringify({username:user.value,password:pass.value})});pass.value='';const result=await response.json();consumed=true;token='';if(!response.ok)throw Error(result.error||'Chưa lưu được cấu hình.');ptiSyncStatus=result;drawPtiSyncStatus();message.textContent='Đã lưu tài khoản. '+result.message;submit.textContent='Đã lưu';user.disabled=true;pass.disabled=true;}
  catch(error){consumed=true;token='';pass.value='';message.textContent=error.message+' Đóng cửa sổ và xác nhận quản trị lại để thử lại.';submit.textContent='Cần xác nhận lại';}
  finally{busy=false;cancel.disabled=false;loadPtiSyncStatus()}
 };
 dialog.showModal();user.focus();
})}

async function requestPtiManualUpdate(){
 if(ptiManualBusy || (typeof importBusy!=='undefined' && importBusy))return;
 ptiManualBusy=true;
 const feedback=text=>{const node=document.getElementById('ptiManualFeedback');if(node)node.textContent=text;};
 const button=document.getElementById('ptiManualUpdate');if(button)button.disabled=true;
 let databaseToken=null,runToken=null;
 try{
  databaseToken=await requestDatabasePassword();if(!databaseToken)return;
  if(typeof importBusy!=='undefined')importBusy=true;
  feedback('Đang bắt đầu cập nhật từ PTI…');
  const post=async(path,options)=>{const response=await authFetch(path,{method:'POST',...options});let body;try{body=await response.json()}catch{throw Error('Máy chủ chưa phản hồi hợp lệ. Hãy kiểm tra trạng thái cập nhật.');}if(!response.ok)throw Error(body.error||'Chưa thực hiện được cập nhật PTI.');return body;};
  let run=await post('/api/pti-sync/manual',{headers:{'X-Database-Authorization':databaseToken}});
  databaseToken=null;runToken=run.runToken;
  if(!run.id||!runToken)throw Error('Chưa nhận được phiên cập nhật PTI.');
  const runId=run.id;
  while(!run.finished){
   feedback('Đang lấy và đối soát ba báo cáo PTI · Bước '+Math.min((run.step||0)+1,4)+'/4. Vui lòng giữ trang mở.');
   run=await post('/api/pti-sync/manual-step',{headers:{'Content-Type':'application/json'},body:JSON.stringify({runId,runToken})});
   if(run.busy)await new Promise(resolve=>setTimeout(resolve,2000));
  }
  if(run.status!=='succeeded')throw Error(run.message||'Cập nhật chưa hoàn tất.');
  feedback(run.message);
  await loadPtiSyncStatus();
  if(!run.result?.unchanged)location.reload();
 }catch(error){feedback((error.message||'Cập nhật bị gián đoạn.')+' Hãy kiểm tra trạng thái trước khi thử lại.');await loadPtiSyncStatus();}
 finally{
  databaseToken=null;runToken=null;ptiManualBusy=false;
  if(typeof importBusy!=='undefined')importBusy=false;
  const currentButton=document.getElementById('ptiManualUpdate');if(currentButton)currentButton.disabled=false;
 }
}

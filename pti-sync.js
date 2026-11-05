let ptiSyncStatus=null,ptiSyncConfigBusy=false;
const ptiSyncTime=v=>v?new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'short',timeStyle:'short'}).format(new Date(v)):'Chưa có';
function ptiSyncPanel(){return `<section class="panel pti-sync-panel"><div class="pti-sync-heading"><div><h2>Kết nối hệ thống báo cáo PTI</h2><p>Lưu tài khoản PTI để chuẩn bị lấy ba nguồn báo cáo của phòng 093.</p></div><button class="import-primary" onclick="openPtiSyncConfig()">Cấu hình tài khoản PTI</button></div><div id="ptiSyncStatus" aria-live="polite">Đang đọc trạng thái…</div><p class="note">Lịch yêu cầu: 06:00 hằng ngày; thử lại lúc 12:30 cùng ngày nếu lần sáng lỗi. Giờ Việt Nam. Chỉ kích hoạt sau khi kiểm thử lấy và đối soát đủ ba báo cáo. Khi lỗi, hệ thống tiếp tục dùng dữ liệu hiện tại.</p></section>`}
function drawPtiSyncStatus(){
 const s=ptiSyncStatus;if(!s)return;
 const host=$('ptiSyncStatus'),banner=$('ptiSyncBanner');
 const state=s.connection==='verified'?'Đã xác thực tài khoản':s.connection==='checking'?'Đang kiểm tra kết nối':s.connection==='rejected'?'Kết nối PTI lỗi':'Chưa cấu hình tài khoản PTI';
 if(host){host.innerHTML=`<div class="pti-sync-state ${s.connection==='rejected'?'failed':''}"><b>${esc(state)}</b><p>${esc(s.message)}</p><dl><div><dt>Lần lưu tài khoản</dt><dd>${esc(ptiSyncTime(s.updatedAt))}</dd></div><div><dt>Kiểm tra kết nối</dt><dd>${esc(ptiSyncTime(s.checkedAt))}</dd></div><div><dt>Dữ liệu đang dùng</dt><dd>${esc(s.activeDate?.split('-').reverse().join('/')||'—')}</dd></div><div><dt>Lịch tự động</dt><dd>Chưa kích hoạt — chờ kiểm thử xuất báo cáo</dd></div></dl></div>`;}
 if(banner){banner.hidden=false;banner.classList.toggle('failed',s.connection==='rejected');banner.textContent='Kết nối PTI: '+state+'. Lịch tự động chưa kích hoạt.';}
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

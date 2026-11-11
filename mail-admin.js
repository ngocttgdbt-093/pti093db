let mailAdminToken='',mailConfig=null;
function mailAdminPanel(){return `<section class="panel" id="mailAdmin"><div class="mail-admin-heading"><div><h2>Quản trị GĐV & báo cáo email</h2><p>Cấu hình người nhận, vai trò lãnh đạo và lịch gửi theo giờ Việt Nam. Mỗi GĐV nhận một thư riêng.</p></div></div><p id="mailMessage" role="status" aria-live="polite"></p><div id="mailSettings"></div></section>`}
async function mailApi(path='',options={}){const token=mailAdminToken;const headers=new Headers(options.headers);headers.set('X-Database-Authorization',mailAdminToken);const r=await authFetch('/api/email-admin'+path,{...options,headers});const body=await r.json();if(!token||token!==mailAdminToken)throw Error('Phiên quản trị đã kết thúc.');if(!r.ok){if(body.code==='EMAIL_ADMIN_REQUIRED')mailAdminToken='';throw Error(body.error||'Chưa thực hiện được yêu cầu.')}return body}
function mailMessage(text){const el=document.getElementById('mailMessage');if(el)el.textContent=text}
async function mailLogin(){return adminLogin();}
async function loadMailAdmin(){if(!mailAdminToken)return;try{const token=mailAdminToken,config=await mailApi();if(token!==mailAdminToken||!token)return;mailConfig=config;drawMailAdmin()}catch(e){mailMessage(e.message)}}
function mailRow(r={code:'',name:'',email:'',role:'gdv',enabled:true}){return `<tr><td><input data-field="code" aria-label="Mã GĐV" value="${esc(r.code)}" maxlength="60" required></td><td><input data-field="name" aria-label="Họ tên" value="${esc(r.name)}" maxlength="120" required></td><td><input data-field="email" type="email" aria-label="Email" value="${esc(r.email)}" maxlength="254" required></td><td><select data-field="role" aria-label="Vai trò"><option value="gdv" ${r.role==='gdv'?'selected':''}>GĐV</option><option value="leader" ${r.role==='leader'?'selected':''}>Lãnh đạo</option></select></td><td><input data-field="enabled" type="checkbox" aria-label="Nhận thư" ${r.enabled?'checked':''}></td><td><button type="button" onclick="this.closest('tr').remove()">Xóa</button></td></tr>`}
function drawMailAdmin(){const c=mailConfig,host=document.getElementById('mailSettings');if(!host)return;host.innerHTML=`<p class="mail-sender">Địa chỉ gửi: <b>${esc(c.sender)}</b> · Thử nghiệm: <b>${c.testVerified?'Đã được Gmail tiếp nhận':'Chưa xác nhận thành công'}</b></p><form id="mailConfigForm"><div class="mail-controls mail-schedule"><label>Giờ gửi hằng ngày<select id="mailHour">${Array.from({length:24},(_,h)=>`<option value="${h}" ${h===c.sendHour?'selected':''}>${String(h).padStart(2,'0')}:30</option>`).join('')}</select></label><label class="mail-toggle"><input id="mailEnabled" type="checkbox" ${c.enabled?'checked':''}> Bật tự động</label></div><p class="note">Chọn giờ tại phút 30. Chỉ gửi khi bộ dữ liệu ngày hôm trước đã đối soát hợp lệ. Cần đúng một lãnh đạo; đổi danh sách phải gửi thử lại.</p><div class="mail-table"><table><thead><tr><th>Mã GĐV</th><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Nhận thư</th><th></th></tr></thead><tbody id="mailRows">${c.recipients.map(mailRow).join('')}</tbody></table></div><div class="mail-controls mail-save"><button type="button" onclick="document.getElementById('mailRows').insertAdjacentHTML('beforeend',mailRow())">Thêm GĐV</button> <button type="submit" class="mail-primary">Lưu cấu hình</button></div></form><div class="mail-controls"><button onclick="mailTest()">Gửi thử riêng cho lãnh đạo</button><select id="mailPreviewCode" aria-label="Người xem trước">${c.recipients.map(r=>`<option value="${esc(r.code)}">${esc(r.name)}</option>`).join('')}</select><button onclick="mailPreview()">Xem trước báo cáo</button><button onclick="loadMailAdmin()">Làm mới nhật ký</button><button onclick="mailLock()">Khóa quản trị</button></div><p class="note">Thư thử được xếp hàng; bộ gửi xử lý ở lượt kiểm tra định kỳ tiếp theo. Nhật ký chỉ ghi thành công sau khi Gmail trả mã xác nhận. Không gửi lại thư có kết quả chưa rõ.</p><h3>Nhật ký gửi</h3><div class="mail-table"><table><thead><tr><th>Ngày số liệu</th><th>Người nhận</th><th>Loại</th><th>Trạng thái</th><th>Thời điểm gửi</th></tr></thead><tbody>${c.log.map(r=>`<tr><td>${esc(r.data_date)}</td><td>${esc(r.recipient_email)}</td><td>${r.kind==='test'?'Thử nghiệm':'Hằng ngày'}</td><td>${esc(({pending:'Đang chờ',sending:'Đang gửi',sent:'Gmail đã tiếp nhận',failed:'Không gửi được',uncertain:'Cần xác minh thư đã gửi',cancelled:'Đã hủy'})[r.status]||r.status)}</td><td>${esc(r.sent_at?new Date(r.sent_at).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}):'—')}</td></tr>`).join('')||'<tr><td colspan="5">Chưa có lượt gửi.</td></tr>'}</tbody></table></div>`;document.getElementById('mailHour').value=String(c.sendHour);document.getElementById('mailConfigForm').onsubmit=mailSave}
async function mailSave(e){e.preventDefault();const button=e.submitter;button.disabled=true;try{const recipients=[...document.querySelectorAll('#mailRows tr')].map(tr=>Object.fromEntries([...tr.querySelectorAll('[data-field]')].map(el=>[el.dataset.field,el.type==='checkbox'?el.checked:el.value])));mailConfig=await mailApi('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:mailConfig.revision,sendHour:Number(document.getElementById('mailHour').value),enabled:document.getElementById('mailEnabled').checked,recipients})});drawMailAdmin();mailMessage('Đã lưu cấu hình.')}catch(e){mailMessage(e.message)}finally{button.disabled=false}}
async function mailTest(){try{const result=await mailApi('/test',{method:'POST'});mailMessage(result.message);await loadMailAdmin()}catch(e){mailMessage(e.message)}}
async function mailPreview(){try{const b=await mailApi('/preview?code='+encodeURIComponent(document.getElementById('mailPreviewCode').value));const d=document.createElement('dialog');d.className='mail-preview';const close=document.createElement('button');close.textContent='Đóng';close.onclick=()=>d.close();const frame=document.createElement('iframe');frame.title='Xem trước báo cáo';frame.setAttribute('sandbox','');frame.srcdoc=b.html;d.append(close,frame);document.body.append(d);d.addEventListener('close',()=>d.remove(),{once:true});d.showModal()}catch(e){mailMessage(e.message)}}
function mailLock(){return adminLogout();}

function emailDataLogPanel(){return `<section class="panel" id="emailDataLog"><div class="tablehead"><h2>Nhật ký gửi báo cáo email</h2><button onclick="loadEmailDataLog()">Làm mới nhật ký</button></div><div id="emailDataLogBody" role="status" aria-live="polite">Đang đọc nhật ký gửi email…</div><p class="note">Lịch sử chi tiết được lưu tại GĐV & Email.</p></section>`}
function emailLogTime(value){return value==null?'—':new Date(value).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}
const emailStatusReasons={
 DATA_UPDATING:'Dữ liệu đang cập nhật',
 DATA_UNAVAILABLE:'Chưa có bộ dữ liệu',
 DATA_INVALID:'Dữ liệu chưa đạt đối soát',
 DATA_NOT_FRESH:'Chưa có dữ liệu hợp lệ cho kỳ gửi',
 SYSTEM_ERROR:'Lỗi hệ thống',
 PROVIDER_REJECTED:'Dịch vụ email từ chối',
 RETRY_REJECTED:'Lượt gửi lại không thành công',
 RESULT_UNCONFIRMED:'Cần đối chiếu thư đã gửi',
 CONFIG_CHANGED:'Cấu hình gửi đã thay đổi'
};
function emailDate(day){return day?day.split('-').reverse().join('/'):'';}
function emailDataLogContent(status,now=Date.now()){
 const today=new Date(now+7*3600000).toISOString().slice(0,10);
 const minute=status.sendMinute??30;
 const dailyAt=Date.parse(today+'T00:00:00+07:00')+(status.sendHour*60+minute)*60000;
 const noonAt=Date.parse(today+'T12:30:00+07:00');
 const logs=(status.log||[]).filter(row=>row.kind!=='test');
 const batch=[...(status.batches||[])].sort((a,b)=>b.startedAt-a.startedAt)[0];
 const blocked=logs.filter(row=>row.status==='blocked').sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0];
 const batchLogs=batch?logs.filter(row=>row.report_day===batch.reportDay&&row.data_date===batch.dataDate&&row.kind==='daily'):[];
 const batchTime=batch?Math.max(batch.startedAt,...batchLogs.map(row=>new Date(row.timestamp).getTime())):0;
 const latestBlocked=blocked&&new Date(blocked.timestamp).getTime()>batchTime;
 const retry=batch?.reportDay===today?batch.issues.map(issue=>issue.retryAt).filter(Boolean).sort((a,b)=>a-b)[0]:null;
 const recentToday=latestBlocked?blocked.report_day===today:batch?.reportDay===today;
 let label='Chưa có lượt gửi',detail='',tone='';
 if(latestBlocked){
  label='Lượt gần nhất chưa gửi';
  tone='warning';
  detail=[emailLogTime(blocked.timestamp),emailStatusReasons[blocked.error_code]||'Chưa đủ điều kiện gửi'].join(' · ');
 }else if(batch){
  const complete=batch.sent===batch.total;
  const inProgress=batch.waiting>0||batch.issues.some(issue=>issue.status==='sending');
  label=complete?'Gửi thành công':inProgress?'Đang xử lý lượt gửi':'Lượt gần nhất có lỗi';
  tone=complete?'success':'warning';
  detail='Số liệu '+emailDate(batch.dataDate)+' · '+batch.sent+'/'+batch.total+' người nhận · '+emailLogTime(batchTime);
  if(!complete&&batch.issues.length){
   const reason=batchLogs.find(row=>row.error_code&&emailStatusReasons[row.error_code]);
   if(reason)detail+=' · '+emailStatusReasons[reason.error_code];
  }
 }
 let plan;
 if(!status.enabled)plan='Gửi tự động đang tắt.';
 else if(status.testVerified===false)plan='Chờ xác nhận gửi thử trước khi gửi tự động.';
 else if(retry&&!latestBlocked)plan='Thử gửi lại từ '+emailLogTime(retry)+' ở lượt chạy kế tiếp.';
 else if(recentToday&&!latestBlocked&&(batch?.waiting||batch?.issues.some(issue=>issue.status==='sending')))plan='Tiếp tục xử lý lượt gửi hiện tại.';
 else if(latestBlocked&&recentToday&&now<noonAt&&['DATA_UPDATING','DATA_UNAVAILABLE','DATA_INVALID','DATA_NOT_FRESH'].includes(blocked.error_code))plan='Kiểm tra lại khi có dữ liệu hợp lệ. Lịch đồng bộ dự phòng lúc 12:30 nếu lượt sáng lỗi.';
 else {
  const next=recentToday||now>=dailyAt?dailyAt+86400000:dailyAt;
  plan='Lượt định kỳ '+emailLogTime(next)+' nếu dữ liệu đạt đối soát.';
 }
 return `<div class="mail-status-compact"><div class="mail-status-card ${tone}"><strong>${esc(label)}</strong>${detail?`<p>${esc(detail)}</p>`:''}</div><div class="mail-status-next"><strong>Kế hoạch tiếp theo</strong><p>${esc(plan)}</p></div></div>`;
}
async function loadEmailDataLog(){const host=document.getElementById('emailDataLogBody');if(!host)return;try{const r=await authFetch('/api/email-status'),s=await r.json();if(!r.ok)throw Error(s.error||'Không đọc được nhật ký email.');if(host.isConnected)host.innerHTML=emailDataLogContent(s)}catch(e){if(host.isConnected)host.textContent=e.message}}

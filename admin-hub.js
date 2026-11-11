let adminSessionToken='',adminEpoch=0,adminTab='data',adminLoginPending=false,adminContentState=null;
const adminTabs=[['data','Dữ liệu báo cáo'],['duty','Lịch trực'],['documents','Kho tài liệu'],['mail','GĐV & Email']];
function adminHubPanel(dataHtml='', locked=false){
 if(locked||!adminSessionToken)return `<section class="panel admin-locked"><div class="admin-lock-icon">🔐</div><h2>Quản trị hệ thống</h2><p>Đăng nhập để cập nhật dữ liệu, lịch trực, tài liệu và cấu hình GĐV/email.</p><button class="import-primary" onclick="adminLogin()">Đăng nhập quản trị</button><p class="note">Dùng mật khẩu quản trị hiện hành. Quyền quản trị tự khóa khi chuyển sang menu khác.</p></section>`;
 const content=adminTab==='data'?dataHtml:adminTab==='mail'?mailAdminPanel():adminContentPanel(adminTab==='duty'?'duty':'document');
 return `<div class="admin-toolbar"><div><strong>Quản trị hệ thống</strong><small>Đã đăng nhập · Tự khóa khi chuyển menu</small></div><button onclick="adminLogout()">Đăng xuất quản trị</button></div><nav class="admin-tabs" aria-label="Các mục quản trị">${adminTabs.map(([id,label])=>`<button type="button" class="${adminTab===id?'active':''}" aria-pressed="${adminTab===id}" onclick="adminSelectTab('${id}')">${label}</button>`).join('')}</nav><div class="admin-content">${content}</div>`;
}
async function adminLogin(){
 if(adminLoginPending||adminSessionToken)return;
 adminLoginPending=true;const epoch=adminEpoch;
 try{
  const token=await requestDashboardPassword({title:'Đăng nhập Quản trị hệ thống',subtitle:'Một phiên dùng cho dữ liệu, lịch trực, tài liệu và GĐV/email',action:'Đăng nhập',endpoint:'/api/admin/auth',tokenKey:'adminToken'});
  if(!token)return;
  if(epoch!==adminEpoch||page!=='Quản trị hệ thống'){await authFetch('/api/admin/logout',{method:'POST',headers:{'X-Database-Authorization':token},keepalive:true});return;}
  adminSessionToken=token;mailAdminToken=token;render();
 }finally{adminLoginPending=false;}
}
async function requireAdminSession(){
 if(!adminSessionToken||page!=='Quản trị hệ thống')throw Error('Vui lòng đăng nhập Quản trị hệ thống.');
 return adminSessionToken;
}
function adminClearSession(){
 adminEpoch++;const token=adminSessionToken;adminSessionToken='';mailAdminToken='';mailConfig=null;adminContentState=null;
 const dialog=document.querySelector('.db-admin-dialog');if(dialog?.open)dialog.close();
 document.querySelectorAll('.mail-preview').forEach(d=>{d.close();d.remove();});
 return token;
}
async function adminLogout(){
 const token=adminClearSession();if(typeof page!=='undefined'&&page==='Quản trị hệ thống')render();
 if(token){try{const r=await authFetch('/api/admin/logout',{method:'POST',headers:{'X-Database-Authorization':token},keepalive:true});if(!r.ok)throw Error();}catch{if(page==='Quản trị hệ thống'){const host=document.querySelector('.admin-locked');if(host)host.insertAdjacentHTML('beforeend','<p role="alert">Mất kết nối khi khóa phiên trên máy chủ. Vui lòng đăng xuất dashboard để kết thúc phiên.</p>');}}}
}
function adminSelectTab(tab){if(!adminTabs.some(([id])=>id===tab)||!adminSessionToken)return;if(adminContentState?.busy)return;adminTab=tab;adminContentState=null;render();}
function adminAfterRender(){
 if(!adminSessionToken)return;
 mailAdminToken=adminSessionToken;
 if(adminTab==='data'){loadEmailDataLog();showImportProgress();loadPtiSyncStatus();loadXoReport();}
 else if(adminTab==='mail')loadMailAdmin();
 else{drawAdminPreview();loadAdminContentStatus();}
}
function adminContentPanel(kind){
 const duty=kind==='duty',state=adminContentState?.kind===kind?adminContentState:null;
 return `<section class="panel admin-upload"><h2>${duty?'Cập nhật lịch trực':'Cập nhật tài liệu'}</h2><p>${duty?'Đọc lịch trực Excel và đồng bộ vào chatbot, tệp tải về, nhắc lịch trong email.':'Tự đọc nội dung, phân nhóm, lập chỉ mục và tạo câu hỏi gợi ý cho chatbot; giữ tệp gốc để tải về.'}</p><form onsubmit="event.preventDefault();adminPreviewContent('${kind}')"><div class="admin-upload-grid"><label>Tệp ${duty?'Excel lịch trực':'tài liệu'}<input type="file" id="adminContentFile" onchange="adminInvalidatePreview()" accept="${duty?'.xlsx':'.pdf,.docx,.xlsx,.txt,.md'}" required ${state?.busy?'disabled':''}><small>${duty?'Excel .xlsx, tối đa 1 MB':'PDF, Word .docx, Excel .xlsx, TXT, Markdown · Tối đa 20 MB'}</small></label><label>${duty?'Mô tả quy tắc (không bắt buộc)':'Mô tả / hướng dẫn phân loại (không bắt buộc)'}<textarea id="adminContentDescription" oninput="adminInvalidatePreview()" maxlength="4000" rows="5" placeholder="${duty?'Để trống để giữ quy tắc đang áp dụng. Ví dụ: đổi cột trực thay sang cột C.':'Để trống để hệ thống tự đọc và phân loại. Có thể ghi nhóm tài liệu hoặc nội dung cần ưu tiên tra cứu.'}" ${state?.busy?'disabled':''}></textarea></label></div><button class="import-primary" ${state?.busy?'disabled':''}>Đọc tệp & xem trước</button><p class="note">Kiểm tra kết quả bên dưới rồi chọn “Xác nhận cập nhật”.</p></form><div id="adminContentPreview" aria-live="polite"></div></section><section class="panel"><h2>${duty?'Lịch trực đang áp dụng':'Lịch sử cập nhật tài liệu'}</h2><div id="adminContentStatus" aria-live="polite">Đang đọc thông tin…</div></section>`;
}
async function adminApi(options={}){
 const token=await requireAdminSession(),epoch=adminEpoch;
 const headers=new Headers(options.headers);headers.set('X-Database-Authorization',token);
 const r=await authFetch('/api/admin-content',{...options,headers}),body=await r.json();
 if(epoch!==adminEpoch||!adminSessionToken)throw Error('Phiên quản trị đã kết thúc.');
 if(!r.ok){if(body.code==='EMAIL_ADMIN_REQUIRED'){adminClearSession();render();}throw Error(body.error||'Chưa thực hiện được yêu cầu.');}
 return body;
}
async function adminPdfText(file){
 const pdfjs=await import('./vendor/pdfjs/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.mjs',document.baseURI).href;
 const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,disableFontFace:true});
 const pdf=await task.promise;let text='';
 try{if(pdf.numPages>500)throw Error('PDF vượt quá 500 trang. Vui lòng chia nhỏ.');for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),content=await page.getTextContent();text+=content.items.map(item=>item.str+(item.hasEOL?'\n':' ')).join('')+'\n';if(text.length>500000)throw Error('PDF vượt giới hạn văn bản. Vui lòng chia nhỏ.');}return text;}finally{await pdf.destroy();}
}
async function adminPreviewContent(kind){
 if(adminContentState?.busy)return;
 const file=document.getElementById('adminContentFile')?.files[0],description=document.getElementById('adminContentDescription')?.value||'';
 if(!file)return;
 const epoch=adminEpoch;adminContentState={kind,busy:true,message:'Đang đọc tệp và diễn giải nội dung…'};drawAdminPreview();
 try{
  if(file.size>(kind==='duty'?1:20)*1048576)throw Error('Tệp vượt giới hạn '+(kind==='duty'?'1':'20')+' MB.');
  const form=new FormData();form.set('file',file);form.set('kind',kind);form.set('description',description);
  if(/\.pdf$/i.test(file.name))form.set('pdfText',await adminPdfText(file));
  const preview=await adminApi({method:'POST',body:form});
  if(epoch===adminEpoch)adminContentState={kind,busy:false,preview};
 }catch(e){if(epoch===adminEpoch)adminContentState={kind,busy:false,error:e.message};}
 if(epoch===adminEpoch)drawAdminPreview();
}
function drawAdminPreview(){
 const host=document.getElementById('adminContentPreview'),s=adminContentState;if(!host||!s)return;
 host.innerHTML=s.error?`<p class="import-error" role="alert">${esc(s.error)}</p>`:s.busy?`<p class="admin-working" role="status">${esc(s.message||'Đang cập nhật…')}</p>`:s.published?`<div class="import-success"><strong>✓ Đã cập nhật ${s.kind==='duty'?'lịch trực':'tài liệu'}</strong><p>${s.kind==='duty'?'Chatbot, tệp tải về và nhắc lịch email đã dùng lịch mới.':'Tài liệu đã có trong kho tải về và sẵn sàng cho chatbot tra cứu.'}</p></div>`:s.preview?adminPreviewMarkup(s.preview):'';
 const busy=!!s.busy;document.querySelectorAll('.admin-upload form input,.admin-upload form textarea,.admin-upload form button').forEach(el=>el.disabled=busy);
}
function adminPreviewMarkup(p){
 return `<div class="admin-preview"><h3>Hệ thống hiểu như sau…</h3><p><b>${esc(p.title)}</b></p><p>${esc(p.explanation)}</p>${p.kind==='duty'?`<p><b>${esc(p.start.split('-').reverse().join('/'))} – ${esc(p.end.split('-').reverse().join('/'))}</b> · ${p.count} ngày</p><details><summary>Xem toàn bộ phân công</summary><div class="mail-table"><table><thead><tr><th>Ngày</th><th>Trực chính</th><th>Trực thay</th></tr></thead><tbody>${p.days.map(d=>`<tr><td>${esc(d.date.split('-').reverse().join('/'))}</td><td>${esc(PTIGdv.gdvLabel(d.primary))}</td><td>${d.backup?esc(PTIGdv.gdvLabel(d.backup)):''}</td></tr>`).join('')}</tbody></table></div></details>`:`<p>Nhóm: <b>${esc(p.category)}</b> · Đã đọc ${num(p.characters)} ký tự</p><p>${esc(p.summary)}</p><h4>Câu hỏi gợi ý</h4><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`}<button class="import-primary" onclick="adminPublishContent()">Xác nhận cập nhật</button></div>`;
}
async function adminPublishContent(){
 const s=adminContentState;if(s?.busy||!s?.preview)return;
 const epoch=adminEpoch,id=s.preview.id;s.busy=true;s.message='Đang lưu và đồng bộ…';drawAdminPreview();
 try{await adminApi({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'publish',id})});if(epoch===adminEpoch){s.published=true;s.busy=false;drawAdminPreview();await loadAdminContentStatus();}}
 catch(e){if(epoch===adminEpoch){s.busy=false;s.error=e.message;drawAdminPreview();}}
}
async function loadAdminContentStatus(){
 const host=document.getElementById('adminContentStatus');if(!host)return;
 try{const s=await adminApi();if(!host.isConnected)return;
 host.innerHTML=adminTab==='duty'?`<p><b>${esc(s.duty.filename)}</b></p><p>Từ ${esc(s.duty.start.split('-').reverse().join('/'))} đến hết <b>${esc(s.duty.end.split('-').reverse().join('/'))}</b> · ${s.duty.count} ngày</p><p>Trực chính cột ${esc(s.duty.rules.primaryColumn)} · Trực thay ${s.duty.rules.backupColumn?'cột '+esc(s.duty.rules.backupColumn):'không sử dụng'} · Cảnh báo hết lịch trước ${s.duty.rules.expiryNoticeDays} ngày</p>`:'';
 const log=s.log.filter(r=>r.kind===(adminTab==='duty'?'duty':'document'));
 host.innerHTML+=log.length?`<div class="mail-table"><table><thead><tr><th>Thời điểm cập nhật</th><th>Tệp / tài liệu</th><th>Kết quả</th></tr></thead><tbody>${log.map(r=>`<tr><td>${esc(new Date(r.publishedAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}))}</td><td>${esc(r.title)}</td><td>Đã cập nhật</td></tr>`).join('')}</tbody></table></div>`:adminTab==='duty'?'':'<p>Chưa có lượt cập nhật tài liệu từ menu này.</p>';
 }catch(e){if(host.isConnected)host.textContent=e.message;}
}
// Never retain administrator capability across page reload or tab close.
window.addEventListener('pagehide',()=>{const token=adminClearSession();if(token)authFetch('/api/admin/logout',{method:'POST',headers:{'X-Database-Authorization':token},keepalive:true}).catch(()=>{});});

function adminInvalidatePreview(){if(adminContentState?.busy)return;adminContentState=null;document.getElementById('adminContentPreview')?.replaceChildren();}

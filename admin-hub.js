let adminSessionToken='',adminEpoch=0,adminTab='data',adminLoginPending=false,adminContentState=null;
const adminTabs=[['data','Dữ liệu báo cáo'],['duty','Lịch trực'],['documents','Kho tài liệu'],['mail','GĐV & Email']];
function adminHubPanel(dataHtml='', locked=false){
 if(locked||!adminSessionToken)return `<section class="panel admin-locked"><div class="admin-lock-icon">🔐</div><h2>Quản trị hệ thống</h2><p>Đăng nhập để cập nhật dữ liệu, lịch trực, tài liệu và cấu hình GĐV/email.</p><button class="import-primary" onclick="adminLogin()">Đăng nhập quản trị</button><p class="note">Dùng mật khẩu quản trị hiện hành. Quyền quản trị tự khóa khi chuyển sang menu khác.</p></section>`;
 const content=adminTab==='data'?dataHtml:adminTab==='mail'?mailAdminPanel():adminContentPanel(adminTab==='duty'?'duty':'document');
 return `<div class="admin-toolbar"><div><strong>Quản trị hệ thống</strong><small>Đã đăng nhập · Tự khóa khi chuyển menu</small></div><button onclick="adminLogout()">Đăng xuất quản trị</button></div><div class="admin-tabs" role="group" aria-label="Các mục quản trị">${adminTabs.map(([id,label])=>`<button type="button" class="${adminTab===id?'active':''}" aria-pressed="${adminTab===id}" onclick="adminSelectTab('${id}')">${label}</button>`).join('')}</div><div class="admin-content">${content}</div>`;
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
 if(kind==='document')return adminDocumentPanel();
 return `<section class="panel admin-upload"><h2>Cập nhật lịch trực</h2><p>Đọc lịch trực Excel và đồng bộ vào chatbot, tệp tải về, nhắc lịch trong email.</p><form onsubmit="event.preventDefault();adminPreviewContent('duty')"><div class="admin-upload-grid"><label>Tệp Excel lịch trực<input type="file" id="adminContentFile" onchange="adminInvalidatePreview()" accept=".xlsx" required><small>Excel .xlsx, tối đa 1 MB</small></label><label>Mô tả quy tắc (không bắt buộc)<textarea id="adminContentDescription" oninput="adminInvalidatePreview()" maxlength="4000" rows="5" placeholder="Để trống để giữ quy tắc đang áp dụng. Ví dụ: đổi cột trực thay sang cột C."></textarea></label></div><button class="import-primary">Đọc tệp & xem trước</button><p class="note">Kiểm tra kết quả bên dưới rồi chọn “Xác nhận cập nhật”.</p></form><div id="adminContentPreview" aria-live="polite"></div></section><section class="panel"><h2>Lịch trực đang áp dụng</h2><div id="adminContentStatus" aria-live="polite">Đang đọc thông tin…</div></section>`;
}
function adminDocumentPanel(){
 const state=adminContentState?.kind==='document'?adminContentState:null;
 return `<section class="panel admin-upload"><h2>Cập nhật tài liệu</h2><p>Đọc nội dung, phân nhóm và tạo câu hỏi gợi ý cho chatbot. Tệp gốc được lưu để tải về.</p>
 <form onsubmit="event.preventDefault();adminPreviewDocuments()">
 <div class="admin-upload-grid"><label>Tệp tài liệu<input type="file" id="adminContentFile" onchange="adminInvalidatePreview()" accept=".pdf,.docx,.xlsx,.txt,.md" multiple required><small>PDF, Word .docx, Excel .xlsx, TXT, Markdown · Tối đa 20 MB mỗi tệp</small></label>
 <label>Mô tả chung cho các tệp (không bắt buộc)<textarea id="adminContentDescription" oninput="adminInvalidatePreview()" maxlength="4000" rows="5" placeholder="Có thể ghi nhóm tài liệu hoặc nội dung cần ưu tiên tra cứu.">${esc(state?.description||'')}</textarea></label></div>
 <div class="admin-upload-actions"><button class="import-primary" id="adminDocumentPreviewButton">Đọc tệp & xem trước</button><button type="button" class="import-primary" id="adminDocumentUploadButton" onclick="adminPublishDocuments()" disabled>Tải lên</button></div>
 <p class="note">PDF scan được tự nhận dạng chữ tiếng Việt. Kiểm tra kết quả trước khi tải lên.</p></form>
 <div id="adminDocumentProgress" class="admin-document-progress">${adminDocumentProgress(state)}</div>
 <p id="adminDocumentStatus" role="status"></p><div id="adminContentPreview"></div></section>
 <section class="panel"><h2>Lịch sử cập nhật tài liệu</h2><div id="adminContentStatus" aria-live="polite">Đang đọc thông tin…</div></section>`;
}
function adminDocumentProgress(state){
 const files=state?.files||[],readable=files.filter(f=>f.read&&!f.readError),ready=files.filter(f=>f.preview);
 const stages=[
  ['Đọc và kiểm tra',files.filter(f=>f.read).length,files.length],
  ['Phân tích',readable.filter(f=>f.preview||f.analysisError).length,readable.length],
  ['Tải lên',ready.filter(f=>f.published).length,ready.length]
 ];
 return stages.map(([label,count,total])=>`<label><span>${label} <strong>${total?`${count}/${total}`:'Chờ xử lý'}</strong></span><progress value="${count}" max="${total||1}" aria-label="${label}"></progress></label>`).join('');
}
async function adminPreviewDocuments(){
 if(adminContentState?.busy)return;
 const files=Array.from(document.getElementById('adminContentFile')?.files||[],file=>({file}));
 if(!files.length)return;
 const epoch=adminEpoch,description=document.getElementById('adminContentDescription')?.value||'';
 const state=adminContentState={kind:'document',files,description,busy:true,status:'Đang đọc và kiểm tra tệp…'};
 drawAdminDocuments();
 for(const entry of files){
  try{
   const file=entry.file;
   if(!file.size)throw Error('Tệp rỗng.');
   if(file.size>20*1048576)throw Error('Tệp vượt giới hạn 20 MB.');
   if(!/\.(pdf|docx|xlsx|txt|md)$/i.test(file.name))throw Error('Định dạng tệp chưa được hỗ trợ.');
   if(/\.pdf$/i.test(file.name)){
    const {readDocumentPdf}=await import('./document-pdf.mjs?v=20261112-ocr');
    const result=await readDocumentPdf(file,(page,total)=>{
     state.status=`Đang OCR tiếng Việt: ${file.name} · trang ${page}/${total}`;
     const status=document.getElementById('adminDocumentStatus');
     if(epoch===adminEpoch&&status)status.textContent=state.status;
    },()=>epoch===adminEpoch);
    entry.pdfText=result.text;
    entry.ocrPages=result.ocrPages;
    entry.ocrSample=result.ocrSample;
   }
  }catch(e){entry.readError=e?.message||String(e||'Không đọc được tệp.');}
  if(epoch!==adminEpoch)return;
  entry.read=true;
  drawAdminDocuments();
 }
 state.status='Đang phân tích tài liệu…';
 drawAdminDocuments();
 for(const entry of files.filter(f=>!f.readError)){
  try{
   const form=new FormData();
   form.set('file',entry.file);form.set('kind','document');form.set('description',description);
   if(entry.pdfText!==undefined)form.set('pdfText',entry.pdfText);
   entry.preview=await adminApi({method:'POST',body:form});
  }catch(e){entry.analysisError=e.message;}
  if(epoch!==adminEpoch)return;
  delete entry.pdfText;
  drawAdminDocuments();
 }
 state.busy=false;
 const ready=files.filter(f=>f.preview).length;
 state.status=`Xem trước xong · ${ready}/${files.length} tệp sẵn sàng tải lên.`;
 drawAdminDocuments();
}
function drawAdminDocuments(){
 const progress=document.getElementById('adminDocumentProgress');
 if(!progress)return;
 const state=adminContentState?.kind==='document'?adminContentState:null;
 const files=state?.files||[],busy=!!state?.busy;
 const selected=document.getElementById('adminContentFile');
 const pending=files.filter(f=>f.preview&&!f.published);
 progress.innerHTML=adminDocumentProgress(state);
 document.getElementById('adminDocumentStatus').textContent=state?.status||(selected.files.length?`Đã chọn ${selected.files.length} tệp.`:'');
 document.getElementById('adminDocumentPreviewButton').disabled=busy||!selected.files.length||files.some(f=>f.preview);
 const upload=document.getElementById('adminDocumentUploadButton');
 upload.disabled=busy||!pending.length;
 upload.textContent=pending.some(f=>f.uploadError)?'Thử tải lại tệp lỗi':'Tải lên';
 selected.disabled=busy;
 document.getElementById('adminContentDescription').disabled=busy;
 document.getElementById('adminContentPreview').innerHTML=files.map(f=>{
  const error=f.readError||f.analysisError||f.uploadError;
  const errorLabel=f.readError?'Lỗi đọc tệp':f.analysisError?'Lỗi phân tích':'Lỗi tải lên';
  const result=f.published?'<p class="import-success">Đã tải lên</p>':f.preview?adminPreviewMarkup(f.preview,false):'';
  return `<article class="admin-document-result${error?' admin-document-failed':''}"><h3>${esc(f.file.name)}</h3>${error?`<details class="admin-document-error"><summary>${errorLabel}</summary><p>${esc(error)}</p></details>`:''}${f.ocrPages?`<details><summary>Văn bản mẫu từ OCR · ${f.ocrPages} trang nhận dạng được</summary><p style="white-space:pre-wrap">${esc(f.ocrSample)}</p></details>`:''}${result}</article>`;
 }).join('');
}
async function adminPublishDocuments(){
 const state=adminContentState;
 if(state?.kind!=='document'||state.busy)return;
 const pending=state.files.filter(f=>f.preview&&!f.published);
 if(!pending.length)return;
 const epoch=adminEpoch;
 state.busy=true;
 for(const entry of pending){
  state.status=`Đang tải lên: ${entry.file.name}`;
  delete entry.uploadError;
  drawAdminDocuments();
  try{
   await adminApi({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'publish',id:entry.preview.id})});
   entry.published=true;
  }catch(e){entry.uploadError=e.message;}
  if(epoch!==adminEpoch)return;
  drawAdminDocuments();
 }
 const published=state.files.filter(f=>f.published).length;
 const failed=state.files.filter(f=>f.uploadError).length;
 state.status=`Đã tải lên ${published}/${state.files.length} tệp.${failed?` ${failed} tệp tải lên lỗi.`:''}`;
 state.busy=false;
 drawAdminDocuments();
 await loadAdminContentStatus();
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
 const pdfjs=await import('./vendor/pdfjs/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.mjs?v=5.6.205-complete',document.baseURI).href;
 const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,disableFontFace:true});
 let text='';
 try{const pdf=await task.promise;if(pdf.numPages>500)throw Error('PDF vượt quá 500 trang. Vui lòng chia nhỏ.');for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),content=await page.getTextContent();text+=content.items.map(item=>item.str+(item.hasEOL?'\n':' ')).join('')+'\n';if(text.length>500000)throw Error('PDF vượt giới hạn văn bản. Vui lòng chia nhỏ.');}return text;}finally{await task.destroy().catch(()=>{});}
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
 if(adminTab==='documents'){drawAdminDocuments();return;}
 const host=document.getElementById('adminContentPreview'),s=adminContentState;if(!host||!s)return;
 host.innerHTML=s.error?`<p class="import-error" role="alert">${esc(s.error)}</p>`:s.busy?`<p class="admin-working" role="status">${esc(s.message||'Đang cập nhật…')}</p>`:s.published?`<div class="import-success"><strong>✓ Đã cập nhật ${s.kind==='duty'?'lịch trực':'tài liệu'}</strong><p>${s.kind==='duty'?'Chatbot, tệp tải về và nhắc lịch email đã dùng lịch mới.':'Tài liệu đã có trong kho tải về và sẵn sàng cho chatbot tra cứu.'}</p></div>`:s.preview?adminPreviewMarkup(s.preview):'';
 const busy=!!s.busy;document.querySelectorAll('.admin-upload form input,.admin-upload form textarea,.admin-upload form button').forEach(el=>el.disabled=busy);
}
function adminPreviewMarkup(p,showPublish=true){
 return `<div class="admin-preview"><h3>Hệ thống hiểu như sau…</h3><p><b>${esc(p.title)}</b></p><p>${esc(p.explanation)}</p>${p.kind==='duty'?`<p><b>${esc(p.start.split('-').reverse().join('/'))} – ${esc(p.end.split('-').reverse().join('/'))}</b> · ${p.count} ngày</p><details><summary>Xem toàn bộ phân công</summary><div class="mail-table"><table><thead><tr><th>Ngày</th><th>Trực chính</th><th>Trực thay</th></tr></thead><tbody>${p.days.map(d=>`<tr><td>${esc(d.date.split('-').reverse().join('/'))}</td><td>${esc(PTIGdv.gdvLabel(d.primary))}</td><td>${d.backup?esc(PTIGdv.gdvLabel(d.backup)):''}</td></tr>`).join('')}</tbody></table></div></details>`:`<p>Nhóm: <b>${esc(p.category)}</b> · Đã đọc ${num(p.characters)} ký tự</p><p>${esc(p.summary)}</p><h4>Câu hỏi gợi ý</h4><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`}${showPublish?'<button class="import-primary" onclick="adminPublishContent()">Xác nhận cập nhật</button>':''}</div>`;
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

function adminInvalidatePreview(){if(adminContentState?.busy)return;adminContentState=null;if(adminTab==='documents')drawAdminDocuments();else document.getElementById('adminContentPreview')?.replaceChildren();}

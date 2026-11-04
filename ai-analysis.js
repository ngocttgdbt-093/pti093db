let aiAnalysisScope='',aiAnalysisCache=new Map(),aiAnalysisTimer=null,aiAnalysisBusy=false,aiAnalysisEpoch=0;
function aiAnalysisKey(){return REPORT_META.date+'|'+aiAnalysisScope}
function aiAnalysisPanel(){
 const selected=aiAnalysisScope;
 return `<section class="panel ai-analysis" aria-labelledby="aiAnalysisTitle"><div class="ai-analysis-heading"><div class="ai-analysis-robot" aria-hidden="true"><span class="robo-head"><i></i><i></i><em></em></span></div><div><h2 id="aiAnalysisTitle">PHÂN TÍCH CỦA AI</h2><p>Điểm nóng · Điểm nghẽn · Khuyến nghị chất lượng dịch vụ</p></div><svg class="ai-analysis-bulb" width="49" height="54" viewBox="0 0 48 54" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path class="ai-bulb-rays" d="M24 2v5M7 10l4 4M1 27h6M41 27h6M37 14l4-4"/><path fill="#ffdc70" d="M13 25a11 11 0 1 1 22 0c0 7-7 9-7 15h-8c0-6-7-8-7-15Z"/><path d="M20 44h8M21 48h6M22 51h4"/></g></svg></div><div class="ai-analysis-controls"><p id="aiAnalysisScopeNote">Chốt ${esc(reportLabel())} · Phân tích toàn bộ nghiệp vụ trong phạm vi GĐV bên cạnh.</p><div class="ai-analysis-options"><button class="motion-toggle" type="button" data-motion-toggle aria-pressed="${document.body.dataset.dashboardMotion!=='off'}" onclick="setDashboardMotion(document.body.dataset.dashboardMotion==='off')">${document.body.dataset.dashboardMotion==='off'?'Bật hoạt cảnh':'Tắt hoạt cảnh'}</button><label>Phạm vi phân tích<select id="aiAnalysisGdv" onchange="aiAnalysisChangeScope(this.value)"><option value="">Tất cả GĐV</option>${[...new Set(ROWS.map(r=>r['GĐV thụ lý']))].sort().map(code=>`<option value="${esc(code)}"${code===selected?' selected':''}>${esc(PTIGdv.gdvLabel(code))}</option>`).join('')}</select></label></div></div><div id="aiAnalysisBody" class="ai-analysis-body" aria-live="polite">${aiAnalysisContent(aiAnalysisCache.get(aiAnalysisKey()))}</div></section>`;
}
function aiAnalysisContent(state){
 if(!state)return '<p class="note">Đang kiểm tra bản phân tích cho bộ dữ liệu hiện tại…</p>';
 let html='';
 if(state.status==='ready'&&state.result){
  const result=state.result;
  html=`<p class="ai-analysis-meta">${esc(result.scope)} · Chốt ${esc(state.date.split('-').reverse().join('/'))} · Phân tích lúc ${esc(new Date(state.generatedAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}))}</p><p class="ai-analysis-intro">${esc(result.summary)}</p>`;
  html+=result.comparison?`<p class="note">Đối chiếu kỳ trước: ${esc(result.comparison.previousDate.split('-').reverse().join('/'))} → ${esc(state.date.split('-').reverse().join('/'))}.</p>`:'<p class="note">Chưa có bộ dữ liệu kỳ trước để đối chiếu; nhận định dưới đây dựa trên hiện trạng.</p>';
  html+='<div class="ai-analysis-table"><table><thead><tr><th>Ưu tiên / Điểm nóng</th><th>Căn cứ đã đối soát</th><th>Nhận định</th><th>Khuyến nghị hành động</th><th>Theo dõi đề xuất</th></tr></thead><tbody>'+result.items.map((item,i)=>`<tr><td data-label="Điểm nóng"><b class="ai-priority">${i+1}</b><strong>${esc(item.title)}</strong></td><td data-label="Căn cứ">${item.evidence.map(f=>`<p><b>${f.unit==='VNĐ'?money(f.value):num(f.value)+' '+esc(f.unit)}</b> · ${esc(f.label)}</p>`).join('')}</td><td data-label="Nhận định"><p>${esc(item.assessment)}</p>${item.hypothesis?`<p class="ai-hypothesis"><b>Cần xác minh:</b> ${esc(item.hypothesis)}</p>`:''}</td><td data-label="Hành động"><p>${esc(item.action)}</p>${item.owner?`<small><b>Phối hợp đề xuất:</b> ${esc(item.owner)}</small>`:''}</td><td data-label="Theo dõi"><p>${esc(item.timing)}</p><p>${esc(item.measure)}</p></td></tr>`).join('')+'</tbody></table></div><p class="ai-analysis-foot">AI phân tích từ số liệu tổng hợp. Khuyến nghị và thời gian là đề xuất để người phụ trách xem xét; nguyên nhân cần xác minh, không thay thế quyết định nghiệp vụ.</p>';
  return html;
 }
 const errors={AI_QUOTA:'Đã hết hạn mức AI miễn phí. Có thể thử lại vào ngày tiếp theo.',AI_RATE_LIMIT:'Đã đạt giới hạn phân tích trong ngày.',AI_NOT_CONFIGURED:'Kết nối AI chưa được cấu hình.',AI_CONFIGURATION:'Kết nối AI chưa được xác thực.',AI_FORMAT:'AI chưa trả về bản phân tích hợp lệ.',AI_RETRY_LIMIT:'Đã thử phân tích bộ dữ liệu này 3 lần trong ngày; có thể tải lại trang và thử vào ngày tiếp theo.',DATA_CHANGED:'Bộ dữ liệu trên máy chủ đã thay đổi. Hãy tải lại trang để đồng bộ báo cáo và phân tích.',AI_UNAVAILABLE:'AI tạm thời chưa phản hồi.'};
 if(state.status==='error')html=`<div class="ai-analysis-status"><b>Chưa có phân tích AI cho bộ ngày ${esc(state.date?.split('-').reverse().join('/')||reportLabel())}</b><p>${esc(errors[state.errorCode]||'Chưa tạo được phân tích. Dữ liệu báo cáo đã lưu vẫn sử dụng bình thường.')}</p>${state.errorCode==='DATA_CHANGED'?'<button onclick="location.reload()">Tải lại dữ liệu</button>':state.errorCode==='AI_RETRY_LIMIT'?'':`<button type="button" onclick="loadAiAnalysis(true)"${state.retryAfter>0?' disabled':''}>${state.retryAfter>0?'Có thể thử lại sau '+state.retryAfter+' giây':'Thử phân tích lại'}</button>`}</div>`;
 else html='<div class="ai-analysis-status"><span class="ai-analysis-spinner" aria-hidden="true"></span><div><b>AI đang tổng hợp và phân tích…</b><p>Kết quả sẽ được lưu theo bộ dữ liệu và dùng chung cho mọi người. Bạn có thể tiếp tục xem báo cáo.</p></div></div>';
 if(state.previous)html+=`<p class="note">Có bản phân tích kỳ ${esc(state.previous.date.split('-').reverse().join('/'))}, chưa phải kết quả cho bộ hiện tại:</p><details><summary>Xem nhận định kỳ trước</summary><p>${esc(state.previous.result.summary)}</p></details>`;
 return html;
}
function aiAnalysisChangeScope(value){aiAnalysisScope=value;aiAnalysisEpoch++;clearTimeout(aiAnalysisTimer);aiAnalysisBusy=false;const body=$('aiAnalysisBody');if(body)body.innerHTML=aiAnalysisContent(aiAnalysisCache.get(aiAnalysisKey()));loadAiAnalysis()}
async function loadAiAnalysis(retry=false){
 const body=$('aiAnalysisBody');if(!body||aiAnalysisBusy)return;
 const key=aiAnalysisKey(),cached=aiAnalysisCache.get(key),epoch=aiAnalysisEpoch,scope=aiAnalysisScope;
 if(cached?.status==='ready'&&!retry){body.innerHTML=aiAnalysisContent(cached);return}
 if(cached?.status==='error'&&!retry){body.innerHTML=aiAnalysisContent(cached);return}
 aiAnalysisBusy=true;clearTimeout(aiAnalysisTimer);
 try{
  let response=await authFetch('/api/analysis?gdv='+encodeURIComponent(scope)+'&date='+encodeURIComponent(REPORT_META.date));let state=await response.json();
  if(!response.ok)state={status:'error',date:REPORT_META.date,errorCode:state.errorCode||'AI_UNAVAILABLE'};
  if(['missing','interrupted'].includes(state.status)||retry&&state.status==='error'&&!(state.retryAfter>0)){
   response=await authFetch('/api/analysis?gdv='+encodeURIComponent(scope)+'&date='+encodeURIComponent(REPORT_META.date),{method:'POST'});state=await response.json();
  }
  if(epoch!==aiAnalysisEpoch||key!==aiAnalysisKey())return;
  aiAnalysisCache.set(key,state);const current=$('aiAnalysisBody');if(current)current.innerHTML=aiAnalysisContent(state);
  if(['running','missing','interrupted'].includes(state.status))aiAnalysisTimer=setTimeout(()=>loadAiAnalysis(),3000);
  else if(state.status==='error'&&state.retryAfter>0)aiAnalysisTimer=setTimeout(()=>{const s=aiAnalysisCache.get(key);if(s){s.retryAfter=0;const el=$('aiAnalysisBody');if(el&&key===aiAnalysisKey())el.innerHTML=aiAnalysisContent(s)}},state.retryAfter*1000);
 }catch{if(epoch===aiAnalysisEpoch){const state={status:'error',date:REPORT_META.date,errorCode:'AI_UNAVAILABLE'};aiAnalysisCache.set(key,state);const current=$('aiAnalysisBody');if(current)current.innerHTML=aiAnalysisContent(state)}}
 finally{if(epoch===aiAnalysisEpoch)aiAnalysisBusy=false}
}

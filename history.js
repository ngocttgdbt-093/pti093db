function historyColumnDepth(x, top, width, height, color, showTop = true) {
 if (height <= 0) return '';
 const depth = Math.min(5, width / 4), rise = depth * .65, right = x + width, bottom = top + height;
 return `<g aria-hidden="true" pointer-events="none"><path d="M${right},${top} l${depth},-${rise} V${bottom-rise} l-${depth},${rise} Z" fill="${color}" style="filter:brightness(.77)"/>${showTop ? `<path d="M${x},${top} h${width} l${depth},-${rise} h-${width} Z" fill="${color}" style="filter:brightness(1.2)"/>` : ''}</g>`;
}
function historyTrendDepth(path, color) {
 return `<path class="chart-depth-ribbon" d="${path}" transform="translate(2 3)" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" opacity=".36" aria-hidden="true" pointer-events="none"/>`;
}
let historyEpoch=0,historyCache=new Map(),historyReportState=null;
const historyUi={range:'7',comparison:'previous',from:'',percent:false,cost:'gdv',basis:'cumulative'};
const historyDefinitions=[['over90','Tồn trên 90 ngày','red'],['over45','Tồn 45–90 ngày','orange'],['tnds','TNDS chưa giải quyết','orange'],['assessment','Giám định chi tiết','orange'],['guarantee','Đã bảo lãnh từ 7 ngày','orange'],['check','Check ĐNTT từ 7 ngày','yellow'],['approve','Chờ duyệt ĐNTT từ 7 ngày','yellow']];
const costMoney=n=>n==null?'—':num(Math.round(n))+' đ';
const historyDay=s=>s?s.split('-').reverse().join('/'):'—',historyDelta=n=>n===null||n===undefined?'—':(n>0?'+':'')+num(n);
function historyScope(){return $('gdv')?.value||''}
function historyOptions(){return `<div class="history-filters"><label>Khoảng theo dõi<select aria-label="Khoảng theo dõi" onchange="historySet('range',this.value)">${[['7','7 kỳ gần nhất'],['30','30 ngày'],['90','3 tháng (90 ngày)'],['all','Toàn bộ lịch sử']].map(([v,t])=>`<option value="${v}"${historyUi.range===v?' selected':''}>${t}</option>`).join('')}</select></label><label>Mốc đối chiếu<select aria-label="Mốc đối chiếu" onchange="historySet('comparison',this.value)">${[['previous','Lần cập nhật trước'],['month','Cuối tháng trước'],['custom','Chọn kỳ đã lưu']].map(([v,t])=>`<option value="${v}"${historyUi.comparison===v?' selected':''}>${t}</option>`).join('')}</select></label>${historyUi.comparison==='custom'?`<label>Ngày đối chiếu<select aria-label="Ngày đối chiếu" onchange="historySet('from',this.value)"><option value="">Chọn ngày</option>${(historyReportState?.dates||[]).filter(d=>d<REPORT_META.date).map(d=>`<option value="${d}"${historyUi.from===d?' selected':''}>${historyDay(d)}</option>`).join('')}</select></label>`:''}</div>`}
function historyPanel(){return `<section class="panel history-panel" aria-labelledby="historyTitle"><div class="history-heading"><small>THEO DÕI NHIỀU KỲ · HIỆU QUẢ XỬ LÝ</small><h2 id="historyTitle">DIỄN BIẾN & SỨC KHỎE HỒ SƠ</h2><p>Theo GĐV đang chọn · Toàn bộ nghiệp vụ, không áp dụng ô tìm kiếm và bộ lọc nghiệp vụ.</p></div>${historyOptions()}<div id="historyBody" aria-live="polite"><p class="note">Đang đọc lịch sử các ngày chốt đã lưu…</p></div></section>`}
function smallCostPanel(){return cohortCostPanel()}
function historySet(key,value){historyUi[key]=value;historyEpoch++;render()}
async function historyFetch(scope,range=historyUi.range,comparison=historyUi.comparison,from=historyUi.from){const key=JSON.stringify([REPORT_META.date,scope,range,comparison,from]);if(historyCache.has(key))return historyCache.get(key);const p=new URLSearchParams({gdv:scope,range,comparison,from,date:REPORT_META.date});const r=await authFetch('/api/history?'+p);const body=await r.json();if(!r.ok)throw Error(body.errorCode||'HISTORY_UNAVAILABLE');historyCache.set(key,body);return body}
function historyError(e){return `<div class="banner">${e.message==='DATA_CHANGED'?'Máy chủ có bộ dữ liệu mới. Hãy tải lại trang để xem cùng ngày chốt.':'Chưa đọc được lịch sử. Không suy đoán số liệu kỳ trước.'} <button onclick="location.reload()">Tải lại trang</button></div>`}
async function loadHistoryPanels(){const epoch=++historyEpoch,scope=historyScope();if($('smallCostBody'))loadCohortCosts();if(!$('historyBody'))return;try{const report=await historyFetch(scope);if(epoch!==historyEpoch||scope!==historyScope())return;historyReportState=report;if($('historyBody'))$('historyBody').innerHTML=historyContent(report)}catch(e){if(epoch===historyEpoch&&$('historyBody'))$('historyBody').innerHTML=historyError(e)}}
function historyCompare(report){const d=report.comparison;if(!d)return `<p class="history-empty">${report.comparisonMode==='month'?'Chưa có bộ dữ liệu chốt thuộc tháng trước.':report.comparisonMode==='custom'?'Chọn một kỳ cũ đã lưu để đối chiếu.':'Chưa có bộ dữ liệu kỳ trước để đối chiếu.'} Hiện có ${report.dates.length} ngày chốt.</p>`;
 const click=(key,mode,date=report.date)=>`historyOpen(${esc(JSON.stringify({scope:report.scope,date,from:d.from,key,mode}))})`;
 return `<p class="history-period">Đối chiếu <b>${historyDay(d.from)} → ${historyDay(d.to)}</b> · ${d.days} ngày lịch · Mốc thực tế đã lưu</p><div class="history-scroll"><table class="history-comparison"><thead><tr><th>Phát sinh và 7 chỉ số cảnh báo</th><th>Kỳ trước</th><th>Hiện tại</th><th>Tăng/giảm</th><th>Mới vào nhóm</th><th>Ra khỏi nhóm</th></tr></thead><tbody><tr><td><i class="history-dot green" aria-hidden="true"></i>PS giữa 2 kỳ bc</td><td>—</td><td>${num(d.intake)}</td><td>—</td><td>—</td><td>—</td></tr>${d.changes.map(x=>`<tr><td><i class="history-dot ${x.color}"></i>${esc(x.label)}</td><td>${num(x.previous)}</td><td><button type="button" class="history-number" aria-label="${esc('Xem hồ sơ hiện tại · '+x.label+' · '+num(x.current))}" onclick="${click(x.key,'current')}">${num(x.current)}</button></td><td class="${x.delta>0?'history-up':x.delta<0?'history-down':''}">${historyDelta(x.delta)}</td><td><button class="history-number" onclick="${click(x.key,'entered')}">${num(x.entered)}</button></td><td><button class="history-number" onclick="${click(x.key,'left')}">${num(x.left)}</button><small>${x.solved} GQ · ${x.cancelled} huỷ · ${x.transferred} chuyển GĐV · ${x.moved} chuyển nhóm/kết thúc khác · ${x.missing} thiếu nguồn</small></td></tr>`).join('')}</tbody></table></div><p class="note">Giảm nhóm cảnh báo chưa chắc do giải quyết: cần xem các hồ sơ ra nhóm. Các nhóm cảnh báo có thể giao nhau.</p>`}
function historyContent(report){const c=report.current,d=report.comparison,s=report.series;return `<div class="history-scope">${esc(report.scopeLabel)} · Chốt ${historyDay(report.date)} · ${report.dates.length} kỳ đã lưu</div><div class="history-kpis"><div><small>TỔNG HỒ SƠ TỒN</small><b>${num(c.backlog)}</b><span>${d?'Biến động '+historyDelta(d.delta)+' HS':'Chưa có mốc đối chiếu'}</span></div><div><small>ƯỚC BT CÒN TỒN</small><b>${money(c.backlogMoney)}</b><span>Không phải tiền đã chi trả</span></div><div><small>TỒN 45–90 NGÀY</small><b>${c.over45Rate===null?'—':num(c.over45Rate)+'%'}</b><span>${num(c.over45)} hồ sơ · Trên 90: ${num(c.alerts.over90)}</span></div><div><small>TỒN 0–30 NGÀY</small><b>${c.under30Rate===null?'—':num(c.under30Rate)+'%'}</b><span>Cần xét cùng lượng tiếp nhận mới</span></div></div>${historyCompare(report)}<div class="history-chart-toolbar"><h3>Diễn biến qua các ngày chốt</h3><label><input type="checkbox" ${historyUi.percent?'checked':''} onchange="historySet('percent',this.checked)">Xem tỷ trọng tuổi tồn (%)</label></div><div class="history-charts"><div><h3>Cơ cấu tuổi hồ sơ tồn</h3>${historyAgeChart(s,report.scope)}</div><div><h3>Tiếp nhận – Giải quyết giữa hai kỳ</h3>${historyFlowChart(s)}</div></div>${historyHeatmap(report)}${historyAssessment(report)}<p class="history-method">${esc(report.method)}</p>`}
function historyAgeChart(series,scope){const colors=['#28af98','#f0c044','#f39442','#e45d71','#a6b3c1'],labels=['0–30 ngày','31–44 ngày','45–90 ngày','Trên 90 ngày','Thiếu tuổi'];const max=historyUi.percent?100:Math.max(1,...series.map(x=>x.backlog));const w=Math.max(560,series.length*70),h=250,left=48,bottom=208,top=20,plot=188,gap=(w-left-20)/series.length,bw=Math.min(42,gap*.65);const bars=series.map((x,i)=>{let y=bottom;const columnX=left+gap*i+(gap-bw)/2, topGroup=x.ages.findLastIndex(n=>n>0);const rects=x.ages.map((n,j)=>{const value=historyUi.percent?(x.backlog?100*n/x.backlog:0):n,hh=value/max*plot;y-=hh;return `${historyColumnDepth(columnX,y,bw,hh,colors[j],j===topGroup)}<rect x="${columnX}" y="${y}" width="${bw}" height="${hh}" fill="${colors[j]}"><title>${historyDay(x.date)} · ${labels[j]}: ${num(n)} HS</title></rect>`}).join('');return `<g role="button" tabindex="0" aria-label="Xem tồn ngày ${x.date}" onclick="historyOpen(${esc(JSON.stringify({scope,date:x.date,key:'backlog',mode:'current'}))})" onkeydown="if(event.key==='Enter')this.click()">${rects}<text x="${left+gap*(i+.5)}" y="${Math.max(15,bottom-(historyUi.percent?100:x.backlog)/max*plot-7)}" text-anchor="middle">${historyUi.percent?(x.backlog?'100%':'0%'):num(x.backlog)}</text><text x="${left+gap*(i+.5)}" y="230" text-anchor="middle">${x.date.slice(8)}/${x.date.slice(5,7)}</text></g>`}).join('');return `<div class="history-svg"><svg viewBox="0 0 ${w} ${h}" style="min-width:${w}px" role="img" aria-label="Cột chồng cơ cấu tuổi tồn theo ngày chốt">${[0,.5,1].map(t=>`<line x1="${left}" x2="${w-10}" y1="${bottom-plot*t}" y2="${bottom-plot*t}" stroke="#e2eaf1"/><text x="${left-7}" y="${bottom-plot*t+4}" text-anchor="end">${Math.round(max*t)}${historyUi.percent?'%':''}</text>`).join('')}${bars}</svg></div><div class="history-legend">${labels.map((l,i)=>`<span><i style="background:${colors[i]}"></i>${l}</span>`).join('')}</div>`}
function historyFlowChart(series){const flows=series.filter(x=>x.flow);if(!flows.length)return '<div class="history-empty">Cần ít nhất hai bộ dữ liệu để đối chiếu đầu vào – đầu ra.</div>';const max=Math.max(1,...flows.flatMap(x=>[x.flow.intake,x.flow.completed])),w=Math.max(560,flows.length*95),gap=(w-65)/flows.length;return `<div class="history-svg"><svg viewBox="0 0 ${w} 250" style="min-width:${w}px" role="img" aria-label="Cột tiếp nhận và ghi nhận giải quyết giữa các kỳ">${[0,.5,1].map(t=>`<line x1="45" x2="${w-10}" y1="${208-188*t}" y2="${208-188*t}" stroke="#e2eaf1"/><text x="38" y="${212-188*t}" text-anchor="end">${Math.round(max*t)}</text>`).join('')}${flows.map((x,i)=>[x.flow.intake,x.flow.completed].map((n,j)=>{const barX=45+gap*i+gap/2+(j-1)*26;return `${historyColumnDepth(barX,208-n/max*188,21,n/max*188,j?'#27ac98':'#4288cd')}<rect x="${barX}" y="${208-n/max*188}" width="21" height="${n/max*188}" rx="3" fill="${j?'#27ac98':'#4288cd'}"><title>${historyDay(x.flow.from)} → ${historyDay(x.date)} (${x.flow.days} ngày): ${j?'Ghi nhận giải quyết':'Tiếp nhận mới'} ${n}</title></rect><text x="${barX+10}" y="${201-n/max*188}" text-anchor="middle">${num(n)}</text>`}).join('')+`<text x="${45+gap*(i+.5)}" y="231" text-anchor="middle">${x.date.slice(8)}/${x.date.slice(5,7)}</text>`).join('')}</svg></div><div class="history-legend"><span><i style="background:#4288cd"></i>Tiếp nhận mới</span><span><i style="background:#27ac98"></i>Ghi nhận giải quyết</span></div><p class="note">Mỗi cặp cột là khoảng giữa hai ngày chốt, có thể dài ngắn khác nhau. Huỷ, điều chuyển và bổ sung chưa xác minh được tách riêng.</p>`}
function historyHeatmap(report){const series=report.series;return `<h3 class="history-subtitle">Bản đồ nhiệt · 7 dấu hiệu cảnh báo</h3><div class="history-scroll"><table class="history-heat"><thead><tr><th>Chỉ số</th>${series.map(x=>`<th>${historyDay(x.date)}</th>`).join('')}</tr></thead><tbody>${historyDefinitions.map(([key,label,color])=>{const max=Math.max(1,...series.map(s=>s.alerts[key]));return `<tr><th><i class="history-dot ${color}"></i>${label}</th>${series.map(x=>`<td style="--heat:${x.alerts[key]?(.12+.58*x.alerts[key]/max):0}"><button onclick="historyOpen(${esc(JSON.stringify({scope:report.scope,date:x.date,key,mode:'current'}))})">${num(x.alerts[key])}</button></td>`).join('')}</tr>`}).join('')}</tbody></table></div><p class="note">Trong từng hàng: nhạt = ít hồ sơ, đậm = nhiều hồ sơ so với các kỳ đang xem; 0 không tô. Không so độ đậm giữa các hàng. Chấm đỏ/cam/vàng là loại cảnh báo. Thang màu thay đổi theo phạm vi ngày/GĐV. Bấm ô xem hồ sơ đúng kỳ.</p>`}
function historyAssessment(report){const s=report.series,first=s[0],last=s.at(-1),d=report.comparison;let notes=[];if(s.length<2)notes.push('Mới có một ngày chốt: chỉ mô tả hiện trạng, chưa đủ đánh giá diễn biến.');else{notes.push(`${s.length<3?'Biến động giữa hai kỳ':'Diễn biến '+s.length+' kỳ'} từ ${historyDay(first.date)} đến ${historyDay(last.date)}: tổng tồn ${num(first.backlog)} → ${num(last.backlog)}; tỷ trọng tồn 45–90 ngày ${first.over45Rate===null?'—':num(first.over45Rate)+'%'} → ${last.over45Rate===null?'—':num(last.over45Rate)+'%'}.`);for(const [key,label]of historyDefinitions){const t=report.trends[key];if(t.consecutiveIntervals>=2)notes.push(`${label} ${t.direction>0?'tăng':'giảm'} liên tiếp ${t.consecutiveIntervals} khoảng cập nhật. Số hiện tại ${num(t.last)}; cần đối chiếu hồ sơ ra/vào nhóm.`)}}if(d){notes.push(`Khoảng ${historyDay(d.from)}–${historyDay(d.to)}: ${num(d.intake)} tiếp nhận mới, ${num(d.completed)} ghi nhận giải quyết, ${num(d.canceled)} nhập huỷ; tồn đầu kỳ trên 45 ngày đã giải quyết ${num(d.oldResolved)}.`);notes.push(`${num(d.aged45)} hồ sơ cùng phạm vi chuyển qua 45 ngày; ${num(d.aged90)} chuyển qua 90 ngày. Điều chuyển vào/ra ${num(d.transferIn)}/${num(d.transferOut)}; mở lại ${num(d.reopened)}; bổ sung chưa xác minh ${num(d.unverifiedAdditions)}, thiếu nguồn ${num(d.disappeared)}, bổ sung GQ cần đối soát ${num(d.closedCorrections)}.`);if(d.aged90>0)notes.push('Ưu tiên rà soát các hồ sơ mới vượt 90 ngày; nhóm 45–90 giảm không được coi là cải thiện nếu do chuyển tuổi.');if(d.oldResolved>0)notes.push('Có ghi nhận giải quyết hồ sơ tồn cũ. Cần tiếp tục xem phần tồn cũ còn lại và những hồ sơ mới chuyển nhóm tuổi cao.');}return `<div class="history-assessment"><h3>Đánh giá diễn biến từ số liệu</h3><ul>${notes.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p>Chưa có dữ liệu nguyên nhân chờ, nhân sự và độ phức tạp để kết luận chất lượng toàn diện hoặc quy trách nhiệm GĐV.</p></div>`}
let historyDetailRequest=null;
async function historyOpen(options){historyDetailRequest=options;const dialog=$('detail');$('detailBody').innerHTML='<h2>Đối chiếu hồ sơ theo kỳ</h2><p>Đang đọc danh sách…</p>';if(!dialog.open)dialog.showModal();await historyDetailPage(0)}
async function historyDetailPage(offset){const request=historyDetailRequest,p=new URLSearchParams({...request,gdv:request.scope||'',offset:String(offset),records:'1'});try{const r=await authFetch('/api/history?'+p),d=await r.json();if(request!==historyDetailRequest)return;if(!r.ok)throw Error(d.errorCode);$('detailBody').innerHTML=`<h2>Hồ sơ ${request.mode==='left'?'ra khỏi nhóm':request.mode==='entered'?'mới vào nhóm':'tại ngày chốt'}</h2><p>${historyDay(d.from)} → ${historyDay(d.date)} · ${num(d.total)} hồ sơ · ${esc(request.scope?PTIGdv.gdvLabel(request.scope):'Tất cả GĐV')}</p><p class="note">Dữ liệu tại kỳ đã chọn; hồ sơ ra nhóm hiển thị tuổi/trạng thái đầu kỳ và lý do đối chiếu ở cuối dòng.</p><div class="history-detail-scroll"><table class="history-detail"><thead><tr><th>Số HSBT</th><th>GĐV</th><th>Gara</th><th>Trạng thái tại kỳ</th><th>Tuổi tồn</th><th>Tiền duyệt/ước</th><th>Kết quả đối chiếu</th></tr></thead><tbody>${d.rows.map(x=>`<tr><td>${esc(x.id)}</td><td>${esc(PTIGdv.gdvLabel(x.gdv))}</td><td>${esc(x.garageLabel)}</td><td>${esc(x.status)}</td><td>${x.age===null?'—':num(x.age)}</td><td>${money(x.estimate)}</td><td>${esc(x.reason)}</td></tr>`).join('')||'<tr><td colspan="7">Không có hồ sơ.</td></tr>'}</tbody></table></div><div class="history-pagination">${offset?`<button onclick="historyDetailPage(${Math.max(0,offset-250)})">Trang trước</button>`:''}<span>${d.total?offset+1:0}–${Math.min(d.total,offset+250)} / ${num(d.total)}</span>${offset+250<d.total?`<button onclick="historyDetailPage(${offset+250})">Trang sau</button>`:''}</div>`}catch(e){if(request===historyDetailRequest)$('detailBody').innerHTML=historyError(e)}}
let alertHistoryEpoch=0;
async function loadAlertHistory(){
 const dialog=$('alertsDialog');
 if(!dialog.open)return;
 const epoch=++alertHistoryEpoch,scope=alertState.gdv;
 try{
  const report=await historyFetch(scope,'7','previous','');
  if(epoch!==alertHistoryEpoch||!dialog.open||!report.comparison)return;
  document.querySelectorAll('#alertsGroups .alert-group').forEach((button,i)=>{
   const group=alertState.model.categories[i];
   const change=report.comparison.changes.find(x=>x.key===group?.key);
   const small=button.querySelector('small');
   if(!change||!small||small.querySelector('.history-inline-delta'))return;
   const span=document.createElement('span');
   span.className='history-inline-delta';
   span.textContent=' · '+historyDelta(change.delta)+' so với kỳ trước';
   small.append(span);
  });
 }catch{/* Cảnh báo hiện tại vẫn dùng được khi thiếu kỳ đối chiếu. */}
}
let backlogHistoryEpoch=0,backlogHistoryState=null,healthMonth='',monthlyBacklogMonth='';
function backlogHistoryPanel(){return `<section class="panel backlog-history-panel"><h2>DIỄN BIẾN HỒ SƠ TỒN THEO NGÀY SỐ LIỆU</h2><p class="note">Theo GĐV đang chọn · Toàn bộ nghiệp vụ · Chỉ hiển thị các ngày có báo cáo thực tế.</p><div id="backlogHistoryBody" aria-live="polite">Đang đọc lịch sử tổng hợp…</div>${healthPanel()}</section>`;}
async function loadBacklogHistory(){
 const hosts=['backlogHistoryBody','healthHistoryBody','monthlyBacklogBody'];
 if(!hosts.some(id=>$(id)))return;const epoch=++backlogHistoryEpoch,scope=historyScope();
 backlogHistoryState=null;
 try{const r=await authFetch('/api/backlog-history?'+new URLSearchParams({gdv:scope,date:REPORT_META.date,healthScale:'400'}));const d=await r.json();if(!r.ok)throw Error(d.errorCode);if(epoch!==backlogHistoryEpoch||scope!==historyScope()||!hosts.some(id=>$(id)))return;backlogHistoryState=d;
 if($('backlogHistoryBody'))$('backlogHistoryBody').innerHTML=`<div class="backlog-history-charts"><div><h3>Tỷ lệ hồ sơ theo nhóm tuổi</h3>${backlogTrendChart(d.series,true)}</div><div><h3>Tổng số hồ sơ tồn theo ngày</h3>${backlogTrendChart(d.series,false)}</div></div><p class="note">${esc(d.method)}</p>`;
 drawHealthHistory();
 drawMonthlyBacklogHistory();
 }catch(e){if(epoch===backlogHistoryEpoch){for(const id of hosts)if($(id))$(id).innerHTML=historyError(e);}}
}

function setMonthlyBacklogGdv(value){
 const filter=$('gdv');
 if(filter.value===value)return;
 filter.value=value;
 return render();
}
function monthlyBacklogPanel(){
 const selected=historyScope();
 const options=Array.from($('gdv').options,option=>{
  const label=option.value?PTIGdv.gdvLabel(option.value):option.text;
  return `<option value="${esc(option.value)}"${option.value===selected?' selected':''}>${esc(label)}</option>`;
 }).join('');
 return `<section class="panel monthly-backlog-panel" aria-labelledby="monthlyBacklogTitle">
  <div class="health-heading"><h2 id="monthlyBacklogTitle">HỒ SƠ TỒN THEO NGÀY</h2>
  <div class="monthly-backlog-filters">
   <label>Giám định viên<select id="monthlyBacklogGdv" aria-label="Giám định viên của biểu đồ tồn" onchange="setMonthlyBacklogGdv(this.value)">${options}</select></label>
   <label>Tháng theo dõi<select id="monthlyBacklogMonth" aria-label="Tháng hồ sơ tồn" disabled onchange="monthlyBacklogMonth=this.value;drawMonthlyBacklogHistory()"></select></label>
  </div></div>
  <div id="monthlyBacklogBody" aria-live="polite">Đang đọc lịch sử hồ sơ tồn…</div>
 </section>`;
}
function drawMonthlyBacklogHistory(){
 const host=$('monthlyBacklogBody'),select=$('monthlyBacklogMonth');
 if(!host||!select)return;
 const series=backlogHistoryState?.series||[];
 const months=[...new Set(series.map(day=>day.date.slice(0,7)))].sort().reverse();
 if(!months.includes(monthlyBacklogMonth))monthlyBacklogMonth=months[0]||'';
 select.disabled=!months.length;
 select.innerHTML=months.map(month=>`<option value="${month}"${month===monthlyBacklogMonth?' selected':''}>${month.slice(5)}/${month.slice(0,4)}</option>`).join('');
 if(!months.length){host.innerHTML='<p class="history-empty">Chưa có kỳ báo cáo được lưu.</p>';return;}
 const label=historyScope()?PTIGdv.gdvLabel(historyScope()):'Toàn đơn vị';
 const days=series.filter(day=>day.date.startsWith(monthlyBacklogMonth));
 const unknown=days.reduce((total,day)=>total+day.unknown,0);
 host.innerHTML=`<p class="health-scope">${esc(label)} · Toàn bộ nghiệp vụ · ${days.length} ngày có số liệu</p>
  ${monthlyBacklogChart(monthlyBacklogMonth,days)}
  <p class="note">Số trên cột là tổng hồ sơ tồn. Ngày chưa có báo cáo được để trống.${unknown?' Hồ sơ thiếu tuổi tồn chỉ tính trong tổng và được ghi riêng ở chi tiết từng ngày.':''}</p>`;
}
function monthlyBacklogChart(month,days){
 const [year,monthNumber]=month.split('-').map(Number);
 const slots=new Date(Date.UTC(year,monthNumber,0)).getUTCDate();
 const left=48,right=left+slots*36,width=right+16,bottom=222,top=24;
 const peak=Math.max(0,...days.map(day=>day.total));
 const max=Math.max(50,Math.ceil(peak/0.75/50)*50);
 const x=day=>left+(day-.5)*36,y=value=>bottom-value/max*(bottom-top);
 const groups=[
  {index:2,label:'Trên 90 ngày',fill:'#d94356',light:'#ff9298',line:'#a92033'},
  {index:1,label:'45–90 ngày',fill:'#e98627',light:'#ffb472'},
  {index:0,label:'Dưới 45 ngày',fill:'#229b73',light:'#80d6b6',line:'#126749',dashed:true}
 ];
 const columns=[...days].sort((a,b)=>a.date.localeCompare(b.date)).map(entry=>{
  const day=Number(entry.date.slice(8)),counts=groups.map(group=>entry.counts[group.index]);
  const levels=[counts[0],counts[0]+counts[1],counts[0]+counts[1]+counts[2]];
  return {entry,day,counts,levels};
 });
 const axes=`<path d="M${left},${top} V${bottom} H${right}" fill="none" stroke="#b9cbd7"/>${[0,max].map(value=>`<line x1="${left-4}" x2="${left}" y1="${y(value)}" y2="${y(value)}" stroke="#b9cbd7"/><text x="${left-8}" y="${y(value)+4}" text-anchor="end">${num(value)}</text>`).join('')}`;
 const gradients=groups.map((group,i)=>`<linearGradient id="monthly-backlog-fill-${i}"><stop stop-color="${group.fill}"/><stop offset=".45" stop-color="${group.light}"/><stop offset="1" stop-color="${group.fill}"/></linearGradient>`).join('');
 const labels=Array.from({length:slots},(_,i)=>`<text x="${x(i+1)}" y="244" text-anchor="middle">${String(i+1).padStart(2,'0')}</text>`).join('');
 const bars=columns.map(({entry,day,counts,levels})=>{
  const detail=`${historyDay(entry.date)} · Tổng: ${num(entry.total)} hồ sơ · ${groups.map((group,i)=>group.label+': '+num(counts[i])).join(' · ')}${entry.unknown?' · Thiếu tuổi tồn: '+num(entry.unknown):''}`;
  const center=x(day),topGroup=counts.findLastIndex(count=>count>0),capY=y(levels[2]);
  const rects=groups.map((group,i)=>counts[i]?`<rect x="${center-10}" y="${y(levels[i])}" width="20" height="${y(levels[i-1]||0)-y(levels[i])}" fill="url(#monthly-backlog-fill-${i})"/>`:'').join('');
  const cap=topGroup<0?'':`<ellipse cx="${center}" cy="${capY}" rx="10" ry="3.5" fill="${groups[topGroup].light}" stroke="${groups[topGroup].fill}"/>`;
  return `<g role="button" tabindex="0" aria-label="${esc(detail)}" onclick="backlogHistoryPoint('${entry.date}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();backlogHistoryPoint('${entry.date}')}">
   <title>${esc(detail)}</title><rect x="${x(day)-13}" y="${top}" width="26" height="${bottom-top+8}" fill="transparent"/>
   <g class="monthly-backlog-column">${rects}${cap}<text x="${center}" y="${capY-9}" text-anchor="middle">${num(entry.total)}</text></g>
  </g>`;
 }).join('');
 const lines=groups.map((group,i)=>{
  if(!group.line)return '';
  const path=columns.map(({day,levels},j)=>`${columns[j-1]?.day===day-1?'L':'M'}${x(day)},${y(levels[i])}`).join(' ');
  const dots=columns.map(({day,levels})=>`<circle cx="${x(day)}" cy="${y(levels[i])}" r="2.5" fill="${group.line}"/>`).join('');
  return `<path d="${path}" fill="none" stroke="${group.line}" stroke-width="2"${group.dashed?' stroke-dasharray="6 4"':''}/>${dots}`;
 }).join('');
 return `<div class="history-svg"><svg viewBox="0 0 ${width} 256" style="min-width:${width}px" role="group" aria-label="Cột chồng hồ sơ tồn từng ngày trong tháng">
  <defs>${gradients}</defs>${axes}${labels}${bars}<g class="monthly-backlog-lines" pointer-events="none" aria-hidden="true">${lines}</g>
 </svg></div><div class="history-legend">${groups.map(group=>`<span><i style="background:${group.fill}"></i>${group.label}</span>`).join('')}</div>`;
}
function backlogTrendChart(series,percent){
 if(!series.length)return '<p class="history-empty">Chưa có kỳ báo cáo được lưu.</p>';
 const ordered=[...series].sort((a,b)=>a.date.localeCompare(b.date)),day=s=>Date.parse(s+'T00:00:00Z')/86400000,start=day(ordered[0].date),span=day(ordered.at(-1).date)-start;
 const w=Math.max(560,(span+1)*54),h=260,l=48,right=w-24,top=20,bottom=205,max=percent?100:Math.max(1,...ordered.map(s=>s.total));
 const x=d=>span?l+(day(d)-start)/span*(right-l):(l+right)/2,y=v=>bottom-v/max*(bottom-top);
 const colors=percent?['#229b73','#e39b25','#d94356']:['#2479b7'],labels=percent?['Dưới 45 ngày','45–90 ngày','Trên 90 ngày']:['Tổng hồ sơ tồn'];
 const lines=labels.map((label,j)=>{let previous=null;const points=ordered.map(s=>{const v=percent?s.rates[j]:s.total;if(v===null){previous=null;return '';}const join=previous&&day(s.date)-day(previous)===1?'L':'M';previous=s.date;return join+x(s.date)+','+y(v);}).join(' ');
 return `${historyTrendDepth(points,colors[j])}<path d="${points}" fill="none" stroke="${colors[j]}" stroke-width="2.5"/>`+ordered.map(s=>{const v=percent?s.rates[j]:s.total;if(v===null)return '';return `<circle cx="${x(s.date)}" cy="${y(v)}" r="4.5" fill="${colors[j]}" tabindex="0" role="button" aria-label="${esc(label+' ngày '+historyDay(s.date)+': '+v+(percent?'%':' hồ sơ'))}" onclick="backlogHistoryPoint('${s.date}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><title>${historyDay(s.date)} · ${label}: ${num(v)}${percent?'%':' HS'}${percent?' · '+num(s.counts[j])+' / '+num(s.total)+' HS':''}</title></circle>`;}).join('');}).join('');
 return `<div class="history-svg"><svg viewBox="0 0 ${w} ${h}" style="min-width:${w}px" role="img" aria-label="${percent?'Tỷ lệ hồ sơ tồn theo ba nhóm tuổi':'Tổng số hồ sơ tồn'} theo ngày số liệu">${[0,.25,.5,.75,1].map(t=>`<line x1="${l}" x2="${right}" y1="${y(max*t)}" y2="${y(max*t)}" stroke="#dae5ee"/><text x="${l-7}" y="${y(max*t)+4}" text-anchor="end">${Math.round(max*t)}${percent?'%':''}</text>`).join('')}${lines}${ordered.map(s=>`<text x="${x(s.date)}" y="230" text-anchor="middle">${s.date.slice(8)}/${s.date.slice(5,7)}</text>`).join('')}</svg></div><div class="history-legend">${labels.map((label,j)=>`<span><i style="background:${colors[j]}"></i>${label}</span>`).join('')}</div>`;
}
function backlogHistoryPoint(date){
 const s=backlogHistoryState?.series.find(s=>s.date===date);if(!s)return;
 if(date===REPORT_META.date){historyOpen({scope:historyScope(),date,key:'backlog',mode:'current'});return;}
 $('detailBody').innerHTML=`<h2>Hồ sơ tồn ngày ${historyDay(date)}</h2><p>Tổng: <b>${num(s.total)}</b> hồ sơ.</p><ul>${['Dưới 45 ngày','45–90 ngày','Trên 90 ngày'].map((label,j)=>`<li>${label}: ${num(s.counts[j])} hồ sơ · ${s.rates[j]===null?'—':num(s.rates[j])+'%'}</li>`).join('')}</ul><p>Thiếu tuổi tồn: ${num(s.unknown)} hồ sơ. Kỳ cũ hiển thị số liệu tổng hợp.</p>`;if(!$('detail').open)$('detail').showModal();
}
function healthPanel(){return '<section class="health-panel" aria-labelledby="healthTitle"><div class="health-heading"><h2 id="healthTitle">CHỈ SỐ SỨC KHỎE HỒ SƠ</h2><label>Tháng theo dõi<select id="healthMonth" aria-label="Tháng chỉ số sức khỏe" onchange="healthMonth=this.value;drawHealthHistory()"></select></label></div><div id="healthHistoryBody" aria-live="polite">Đang đọc số liệu sức khỏe…</div></section>';}
function drawHealthHistory(){
 const host=$('healthHistoryBody'),select=$('healthMonth'),months=backlogHistoryState?.health||[];if(!host||!select)return;
 if(!months.length){host.innerHTML='<p class="history-empty">Chưa có số liệu báo cáo để tính sức khỏe.</p>';return;}
 if(!months.some(m=>m.month===healthMonth))healthMonth=months.at(-1).month;
 select.innerHTML=months.map(m=>`<option value="${m.month}"${m.month===healthMonth?' selected':''}>${m.month.slice(5)}/${m.month.slice(0,4)}</option>`).join('');
 const month=months.find(m=>m.month===healthMonth),label=historyScope()?PTIGdv.gdvLabel(historyScope()):'Toàn đơn vị';
 if(month.status!=='ready'){host.innerHTML=`<p class="health-scope">${esc(label)}</p><div class="history-empty">${month.status==='missing_baseline'?'Chưa có báo cáo ngày '+historyDay(month.baselineDate)+' để làm mốc cuối tháng trước.':'Mốc ngày '+historyDay(month.baselineDate)+' có hồ sơ thiếu tuổi tồn.'} Chưa tính điểm sức khỏe tháng này; không dùng ngày khác thay cho mốc còn thiếu.</div>`;return;}
 const max=month.maxScore??100,latest=month.points.at(-1),missing=month.points.filter(p=>p.score===null).length;
 host.innerHTML=`<div class="health-scope">${esc(label)} · Mốc ${historyDay(month.baselineDate)} · ${latest?.score==null?'Ngày báo cáo mới nhất chưa đủ dữ liệu':`Điểm ngày ${historyDay(latest.date)}: <b style="color:${healthColor(latest.score,max)}">${num(latest.score)}/${max}</b>${latest.clipped?' · Điểm gốc '+num(latest.rawScore):''}`}</div>${healthTrendChart(month)}${missing?`<p class="note">${missing} kỳ có hồ sơ thiếu tuổi tồn: để trống điểm, không suy đoán.</p>`:''}<p class="note">Điểm gốc có thể vượt thang 0–${max} do cộng dồn biến động theo số hồ sơ. Các điểm chạm giới hạn có viền đứt; chọn hoặc rê vào điểm để xem giá trị gốc. Chỉ vẽ các ngày có báo cáo; ngắt đường khi thiếu ngày.</p><p class="note">Điểm = ${month.startScore} − (biến động dưới 45 ngày × 1 + biến động 45–90 ngày × 3 + biến động trên 90 ngày × 5), so với ngày mốc. Điểm càng cao càng tốt.</p>`;
}
function healthColor(score,max=100){
 const stops=[[217,65,81],[235,181,38],[31,157,112]],t=Math.max(0,Math.min(max,score))/(max/2),a=t<=1?stops[0]:stops[1],b=t<=1?stops[1]:stops[2],f=t<=1?t:t-1;
 return 'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*f)).join(',')+')';
}
function healthTrendChart(month){
 const baseline={date:month.baselineDate,score:month.startScore,rawScore:month.startScore,changes:[0,0,0],baseline:true};
 const max=month.maxScore??100,mid=month.startScore;
 const points=[baseline,...month.points],day=d=>Date.parse(d+'T00:00:00Z')/86400000,first=day(points[0].date),slots=Math.max(10,day(points.at(-1).date)-first+1),w=760,left=56,right=w-30,top=22,bottom=224;
 const x=d=>left+(day(d)-first)/(slots-1)*(right-left),y=score=>bottom-score/max*(bottom-top),segments=[];let segment=[];
 for(const p of points){if(p.score===null){if(segment.length)segments.push(segment);segment=[];continue;}if(segment.length&&day(p.date)-day(segment.at(-1).date)>1){segments.push(segment);segment=[];}segment.push(p);}if(segment.length)segments.push(segment);
 const paths=segments.map(group=>{const line=group.map((p,i)=>{
  const px=x(p.date),py=y(p.score);
  if(!i)return `M${px},${py}`;
  const previous=group[i-1],midX=(x(previous.date)+px)/2;
  return `C${midX},${y(previous.score)} ${midX},${py} ${px},${py}`;
 }).join(' '),area=line+' L'+x(group.at(-1).date)+','+bottom+' L'+x(group[0].date)+','+bottom+' Z';return `<path class="health-area" d="${area}" fill="url(#healthGradient)" opacity=".24"/>${historyTrendDepth(line,'url(#healthGradient)')}<path class="health-line" d="${line}" pathLength="1" fill="none" stroke="url(#healthGradient)" stroke-width="3"/>`;}).join('');
 const dots=points.filter(p=>p.score!==null).map(p=>{const detail=`${historyDay(p.date)}: ${p.score}/${max}${p.baseline?' · Mốc đầu tháng':''} · Điểm gốc ${p.rawScore}${p.clipped?' (vượt thang hiển thị)':''} · Biến động ba nhóm: ${p.changes.map(n=>(n>0?'+':'')+n).join(' / ')} · Mốc ${historyDay(month.baselineDate)}`;return `<circle class="health-point${p.baseline?' health-baseline':''}" cx="${x(p.date)}" cy="${y(p.score)}" r="5" fill="${healthColor(p.score,max)}"${p.clipped?' stroke="#254e66" stroke-width="1.5" stroke-dasharray="2 1"':''} tabindex="0" aria-label="${esc(detail)}"><title>${esc(detail)}</title></circle>`;}).join('');
 return `<div class="history-svg"><svg viewBox="0 0 ${w} 280" style="min-width:520px" role="img" aria-label="Chỉ số sức khỏe tháng ${month.month}, 0 cần ưu tiên, ${mid} trung tính, ${max} tốt"><defs><linearGradient id="healthGradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${bottom}" y2="${top}"><stop offset="0" stop-color="${healthColor(0,max)}"/><stop offset=".5" stop-color="${healthColor(mid,max)}"/><stop offset="1" stop-color="${healthColor(max,max)}"/></linearGradient></defs>${Array.from({length:slots},(_,i)=>{const column=left+i*(right-left)/(slots-1);return `<line x1="${column}" x2="${column}" y1="${top}" y2="${bottom}" stroke="#eef3f6"/>`;}).join('')}${[0,max/4,mid,3*max/4,max].map(n=>`<line x1="${left}" x2="${right}" y1="${y(n)}" y2="${y(n)}" stroke="${n===mid?'#b68a24':'#dfe7ec'}"${n===mid?' stroke-dasharray="6 4" stroke-width="1.5"':''}/><text x="${left-8}" y="${y(n)+4}" text-anchor="end">${n}</text>`).join('')}${paths}${dots}${points.map(p=>`<text x="${x(p.date)}" y="${slots>22?250+(day(p.date)-first)%2*14:250}" text-anchor="middle">${p.date.slice(8)}/${p.date.slice(5,7)}</text>`).join('')}</svg></div><div class="health-scale"><span style="color:${healthColor(0,max)}">0 · Cần ưu tiên</span><span style="color:${healthColor(mid,max)}">${mid} · Trung tính</span><span style="color:${healthColor(max,max)}">${max} · Tốt</span></div>`;
}

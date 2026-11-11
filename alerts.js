// Alerts use the report cutoff, never the wall clock. Rules are independent of menu filters.
function alertDate(value) {
 if(typeof value==='number'&&Number.isFinite(value)&&value>=1) return (Math.floor(value)-25569)*86400000;
 const text=String(value??'').trim();
 let match=text.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s.*)?$/),year,month,day;
 if(match) [,day,month,year]=match;
 else {match=text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);if(!match)return null;[,year,month,day]=match;}
 const result=Date.UTC(+year,+month-1,+day),date=new Date(result);
 return date.getUTCFullYear()===+year&&date.getUTCMonth()===+month-1&&date.getUTCDate()===+day?result:null;
}
function alertAge(row,cutoff) {
 const raw=row['Số ngày tồn'];
 if(raw!=null&&String(raw).trim()!==''&&raw!=='-'&&Number.isFinite(Number(raw))&&Number(raw)>=0)return Number(raw);
 const opened=alertDate(row['Ngày mở HSBT']);return opened!==null&&opened<=cutoff?Math.floor((cutoff-opened)/86400000):null;
}
function alertModel(data,cutoffDate,gdv='') {
 const cutoff=alertDate(cutoffDate);if(cutoff===null)throw Error('Ngày chốt cảnh báo không hợp lệ.');
 const index=PTIClaimLogic.claimIndex(data),f=new Map(data.f.map(r=>[PTIClaimLogic.claimId(r),r])),pool=new Map();
 for(const row of data.f) {const key=PTIClaimLogic.claimId(row);if(!index.resolved.has(key))pool.set(key,{...row,...index.backlog.get(key)});}
 for(const row of data.t) {const key=PTIClaimLogic.claimId(row);if(!index.resolved.has(key)&&!pool.has(key))pool.set(key,{...row});}
 const definitions=[
  {key:'over90',label:'Hồ sơ tồn trên 90 ngày',color:'red',test:(r,age)=>age!==null&&age>90},
  {key:'over45',label:'Hồ sơ tồn từ 45 đến 90 ngày',color:'orange',test:(r,age)=>age!==null&&age>=45&&age<=90},
  {key:'tnds',label:'TNDS chưa giải quyết',color:'orange',test:r=>PTIClaimLogic.claimResult(r,index).status==='TNDS chưa giải quyết'},
  {key:'assessment',label:'Giám định chi tiết',color:'orange',state:'Giám định chi tiết'},
  {key:'guarantee',label:'Đã bảo lãnh từ 7 ngày',color:'orange',state:'Đã bảo lãnh',dateField:'Ngày bảo lãnh'},
  {key:'check',label:'Check ĐNTT từ 7 ngày',color:'yellow',state:'Check đề nghị thanh toán',dateField:'Ngày trình ĐNTT'},
  {key:'approve',label:'Chờ duyệt ĐNTT từ 7 ngày',color:'yellow',state:'Chờ duyệt đề nghị thanh toán',dateField:'Ngày check ĐNTT'}
 ];
 const groups=definitions.map(d=>({...d,items:[]})),missing=[],rows=[...pool.values()].filter(r=>!gdv||r['GĐV thụ lý']===gdv);
 for(const raw of rows) {
  const key=PTIClaimLogic.claimId(raw),row={...raw,_state:'Tồn',_year:f.has(key)?String(new Date(cutoff).getUTCFullYear()):'Trước '+new Date(cutoff).getUTCFullYear()},age=alertAge(row,cutoff),status=PTIClaimLogic.claimResult(row,index).status;
  if(age===null)missing.push({row,age,waiting:null,reason:'Thiếu ngày mở / số ngày tồn'});
  for(const group of groups) {
   if(group.state&&status!==group.state)continue;
   let waiting=null;
   if(group.dateField) {
    const date=alertDate(row[group.dateField]);
    if(date===null||date>cutoff) {missing.push({row,age,waiting:null,reason:(date===null?'Thiếu hoặc sai ':'Ngày sau ngày chốt: ')+group.dateField});continue;}
    waiting=Math.floor((cutoff-date)/86400000);if(waiting<7)continue;
   } else if(group.test&&!group.test(row,age))continue;
   group.items.push({row,age,waiting,dateField:group.dateField});
  }
 }
 const oldest=(a,b)=>(b.age??-1)-(a.age??-1)||(b.waiting??-1)-(a.waiting??-1)||PTIClaimLogic.claimId(a.row).localeCompare(PTIClaimLogic.claimId(b.row));
 groups.forEach(g=>g.items.sort(oldest));missing.sort(oldest);
 const categories=groups.filter(g=>g.items.length),unique=new Set(categories.flatMap(g=>g.items.map(i=>PTIClaimLogic.claimId(i.row))));
 return {gdv,cutoffDate,groups,categories,missing,total:rows.length,unique:unique.size};
}
let alertState={gdv:'',seen:{},model:null,category:null};
try {alertState.gdv=sessionStorage.getItem('093_alert_gdv')||'';alertState.seen=JSON.parse(sessionStorage.getItem('093_alert_seen')||'{}');if(!alertState.seen||typeof alertState.seen!=='object')alertState.seen={};}catch{}
function alertSignature(model) {return model.cutoffDate+'|'+model.categories.map(g=>g.key+':'+g.items.map(x=>PTIClaimLogic.claimId(x.row)).join(',')).join('|');}
function refreshAlerts() {
 const select=$('alertGdv');if(!select||!DATA)return;
 const gdvs=[...new Set(ROWS.map(r=>r['GĐV thụ lý']))].sort();
 if(alertState.gdv&&!gdvs.includes(alertState.gdv))alertState.gdv='';
 select.innerHTML='<option value="">Tất cả GĐV</option>'+gdvs.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('');select.value=alertState.gdv;
 select.onchange=()=>{alertState.gdv=select.value;try{sessionStorage.setItem('093_alert_gdv',select.value)}catch{}refreshAlerts();if(page==='Giám định viên')setMonthlyBacklogGdv(select.value);};
 const model=alertModel(DATA,REPORT_META.date,alertState.gdv);alertState.model=model;
 const badge=$('alertBadge'),button=$('alertBell'),unread=model.categories.length>0&&alertState.seen[model.gdv]!==alertSignature(model);
 badge.textContent=model.categories.length;badge.hidden=!model.categories.length;
 button.classList.toggle('alert-active',model.categories.length>0);button.classList.toggle('alert-unread',unread);button.setAttribute('aria-label',`Cảnh báo: ${model.categories.length} đầu mục · ${model.gdv||'Tất cả GĐV'}`);
 button.title=model.categories.length?`${model.categories.length} đầu mục · ${model.unique} hồ sơ không trùng · Chốt ${reportLabel()}`:'Không có cảnh báo · Chốt '+reportLabel();
 if($('alertsDialog').open){drawAlertSummary();loadAlertHistory();}
 if($('alertRecordsDialog').open)drawAlertRecords(alertState.category);
}
function drawAlertSummary() {
 const model=alertState.model;
 $('alertsScope').textContent=(model.gdv||'Tất cả GĐV')+' · Chốt '+reportLabel();
 $('alertsSummary').textContent=`${model.categories.length} đầu mục · ${num(model.unique)} hồ sơ không trùng · Xét ${num(model.total)} hồ sơ chưa giải quyết`;
 $('alertsGroups').innerHTML=model.categories.length?model.categories.map((g,i)=>`<button class="alert-group" onclick="openAlertRecords('${g.key}')"><span class="alert-dot ${g.color}" aria-label="${g.color==='red'?'Đỏ':g.color==='orange'?'Cam':'Vàng'}"></span><span><b>${esc(g.label)}</b><small>Ưu tiên ${i+1}${g.dateField?' · Từ '+esc(g.dateField):''}</small></span><strong>${num(g.items.length)}</strong><span aria-hidden="true">›</span></button>`).join(''):'<div class="alert-empty">✓ Không có cảnh báo trong phạm vi đã chọn.</div>';
 $('alertsMissing').innerHTML=model.missing.length?`<button class="alert-missing" onclick="openAlertRecords('missing')">${num(new Set(model.missing.map(x=>id(x.row))).size)} hồ sơ cần đối soát ngày · Bấm để xem</button>`:'';
}
function openAlerts() {
 drawAlertSummary();const dialog=$('alertsDialog');if(!dialog.open)dialog.showModal();
 alertState.seen[alertState.gdv]=alertSignature(alertState.model);try{sessionStorage.setItem('093_alert_seen',JSON.stringify(alertState.seen))}catch{}
 $('alertBell').classList.remove('alert-unread');loadAlertHistory();
}
function openAlertRecords(key) {alertState.category=key;drawAlertRecords(key);const dialog=$('alertRecordsDialog');if(!dialog.open)dialog.showModal();}
function drawAlertRecords(key) {
 const model=alertState.model,group=key==='missing'?{label:'Hồ sơ cần đối soát ngày',items:model.missing}:model.groups.find(g=>g.key===key);
 if(!group)return;
 $('alertRecordsTitle').textContent=group.label;
 $('alertRecordsNote').textContent=`${model.gdv||'Tất cả GĐV'} · ${num(group.items.length)} ${key==='missing'?'mục cần đối soát':'hồ sơ'} · Chốt ${reportLabel()} · Số ngày tồn giảm dần`;
 const dateColumn=group.dateField;
 $('alertRecordsBody').innerHTML=`<table><thead><tr>${['STT','Số HSBT / Biển số','GĐV','Trạng thái','Số ngày tồn',...(dateColumn?[dateColumn,'Số ngày chờ bước này']:[]),...(key==='missing'?['Cần đối soát']:[]),'Giá trị BT báo cáo'].map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${group.items.map((x,i)=>`<tr tabindex="0" role="button" aria-label="Mở chi tiết hồ sơ ${esc(id(x.row))}" onclick="showRecord(${esc(JSON.stringify(id(x.row)))})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><td>${i+1}</td><td><b>${esc(x.row['Biển số xe'])}</b><small>${esc(id(x.row))}</small></td><td>${esc(x.row['GĐV thụ lý'])}</td><td>${esc(reportStatus(x.row))}</td><td><b>${x.age===null?'Thiếu ngày':num(x.age)}</b></td>${dateColumn?`<td>${esc(x.row[dateColumn])}</td><td>${num(x.waiting)} ngày</td>`:''}${key==='missing'?`<td>${esc(x.reason)}</td>`:''}<td>${money(reportAmount(x.row))}</td></tr>`).join('')||'<tr><td colspan="9" class="alert-empty">Không còn hồ sơ phù hợp.</td></tr>'}</tbody></table>`;
 $('alertRecordsBody').scrollTop=0;
}


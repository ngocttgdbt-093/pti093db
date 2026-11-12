const TL_STOP=new Set(('la gi the nao cua cho co khong duoc khi thi va cac nhung can phai bao nhieu nhu mot nay do de voi '+
  'trong ra vao ve o tai len xuong theo hay hoac nhe oi minh toi em anh chi ban giup cach lam sao bi da se dang roi nua '+
  'cung lai tu hon nhat moi ai dau vay ha nen neu xe ho cai viec di thoi a u uh ok').split(' '));
// Viết tắt hay dùng → thêm dạng đầy đủ vào câu hỏi trước khi so khớp
const TL_ABBR={tnds:'trach nhiem dan su',vcx:'vat chat xe',nt3:'nguoi thu ba',gdv:'giam dinh vien',hsbt:'ho so boi thuong',
  bt:'boi thuong',bh:'bao hiem',ht:'hien truong',dntt:'de nghi thanh toan',cng:'cong nhan gia',gcnbh:'giay chung nhan bao hiem',
  hdbh:'hop dong bao hiem',gplx:'giay phep lai xe',ndbh:'nguoi duoc bao hiem',cqcn:'co quan chuc nang',xcg:'xe co gioi',
  tn:'tai nan',gd:'giam dinh',lpx:'lai phu xe',nntx:'nguoi ngoi tren xe',pvbh:'pham vi bao hiem',mkt:'muc khau tru',
  grlk:'gara lien ket',gr:'gara',garage:'gara',kh:'khach hang',bb:'bien ban',hs:'ho so',tbtn:'thong bao tai nan',
  ycbt:'yeu cau boi thuong',tct:'tong cong ty',cv:'cong van',ld:'lanh dao',tp:'truong phong',bl:'bao lanh'};
const TL_STEP_NAME={B2:'Bước 1–2 · Tiếp nhận, hiện trường',B3:'Bước 3 · Giám định chi tiết',B4:'Bước 4 · Bảng kê, phương án',
  B5:'Bước 5 · Thông báo, giám sát, chứng từ',B6:'Bước 6 · Thanh toán',B7:'Bước 7 · Sau bồi thường',NT3:'Thế quyền đòi NT3 (PL.20.04)'};
let TL_IDX=null, TL_LOG=[], tlReady=false;

function tlEsc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function tlEl(id){return document.getElementById(id)}
function tlKB(){return Array.isArray(window.TL_KB)?window.TL_KB:[]}
// Bỏ dấu + chỉ giữ chữ/số; giữ dấu chấm giữa hai chữ số (mã mẫu 20.35).
// "tổn thất" gộp thành "tonthat" để không lẫn với "tồn" (hồ sơ tồn) sau khi bỏ dấu.
function tlNorm(s){
  return norm(s).replace(/(\d)\.(?=\d)/g,'$1§').replace(/[^a-z0-9§\s]/g,' ')
    .replace(/§/g,'.').replace(/\s+/g,' ').trim().replace(/(^| )ton that(?= |$)/g,'$1tonthat');
}
function tlTok(s){return tlNorm(s).split(' ').filter(t=>t&&(t.length>1||/\d/.test(t))&&!TL_STOP.has(t))}
function tlExpand(qn){
  const add=qn.split(' ').map(t=>TL_ABBR[t]).filter(Boolean);
  return add.length?qn+' '+add.join(' '):qn;
}
function tlBuildIndex(){
  if(TL_IDX)return TL_IDX;
  const kb=tlKB(), df={};
  kb.forEach(e=>{
    e._qn=tlExpand(tlNorm(e.q));   // mở rộng viết tắt như câu hỏi người dùng, để khớp đúng câu chuẩn có "TNDS", "VCX"…
    e._k=(e.k||[]).map(tlNorm).filter(Boolean);
    e._qt=new Set(tlTok(e.q));
    e._kt=new Set(e._k.join(' ').split(' ').filter(t=>t&&!TL_STOP.has(t)));
    e._at=new Set(tlTok(e.a+' '+(e.s||'')));
    new Set([...e._qt,...e._kt,...e._at]).forEach(t=>{df[t]=(df[t]||0)+1});
  });
  const N=kb.length||1;
  TL_IDX={idf:t=>Math.log(1+N/(df[t]||0.5))};
  return TL_IDX;
}
function tlScore(e,qn,qt,idf){
  let s=e._qn===qn?100:0;
  const pad=' '+qn+' ';
  // Cụm từ khoá khớp; cụm nằm trọn trong cụm dài hơn cũng khớp thì chỉ tính cụm dài (tránh cộng điểm 2 lần)
  const hits=e._k.filter(kw=>pad.includes(' '+kw+' '));
  hits.filter(kw=>!hits.some(o=>o.length>kw.length&&(' '+o+' ').includes(' '+kw+' ')))
    .forEach(kw=>{s+=2+1.5*kw.split(' ').length});
  qt.forEach(t=>{const w=idf(t);if(e._qt.has(t))s+=1.2*w;else if(e._kt.has(t))s+=.8*w;else if(e._at.has(t))s+=.2*w});
  return s;
}
function tlSearch(q){
  const ix=tlBuildIndex(), qn=tlExpand(tlNorm(q)), qt=[...new Set(tlTok(qn))];
  return tlKB().map(e=>({e,s:tlScore(e,qn,qt,ix.idf)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
}

// Định dạng rút gọn của bộ tri thức: "- " gạch đầu dòng · "|a|b|" bảng · "!! " lưu ý · **đậm**
function tlFmt(txt){
  const inl=s=>tlEsc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
  const out=[]; let ul=null, tb=null;
  const endUl=()=>{if(ul){out.push('<ul>'+ul.join('')+'</ul>');ul=null}};
  const endTb=()=>{if(tb){out.push('<table>'+tb.join('')+'</table>');tb=null}};
  String(txt||'').split('\n').forEach(raw=>{
    const l=raw.trim();
    if(!l){endUl();endTb();return}
    if(l.startsWith('|')){
      endUl();
      const tag=tb?'td':'th';
      (tb=tb||[]).push('<tr>'+l.replace(/^\||\|$/g,'').split('|').map(c=>`<${tag}>${inl(c.trim())}</${tag}>`).join('')+'</tr>');
      return;
    }
    endTb();
    if(l.startsWith('- ')){(ul=ul||[]).push('<li>'+inl(l.slice(2))+'</li>');return}
    endUl();
    if(l.startsWith('!! ')){out.push('<div class="tl-warn">⚠ '+inl(l.slice(3))+'</div>');return}
    out.push('<p>'+inl(l)+'</p>');
  });
  endUl();endTb();
  return out.join('');
}
let roboLog=[],roboMy='',roboDrag=false,roboBusy=false,roboEpoch=0,roboController=null;
let roboAiConfigured=false;
// Conversation stays only in page memory; old persistent histories are erased.
const roboRead=k=>{if(k==='093_robo_log_v1')return null;try{return JSON.parse(localStorage.getItem(k))}catch{return null}},roboWrite=(k,v)=>{try{if(k==='093_robo_log_v1'){localStorage.removeItem(k);sessionStorage.removeItem(k);return;}localStorage.setItem(k,JSON.stringify(v))}catch{}};
try{localStorage.removeItem('093_robo_log_v1');sessionStorage.removeItem('093_robo_log_v1');}catch{}
if(typeof window!=='undefined'&&typeof window.addEventListener==='function')window.addEventListener('pagehide',()=>{roboEpoch++;roboController?.abort();roboLog=[];roboWrite('093_robo_log_v1',[]);});
if(typeof window!=='undefined'&&typeof window.addEventListener==='function')window.addEventListener('pageshow',e=>{if(e.persisted){roboLog=[];roboSetBusy(false);if(document.getElementById('roboLog'))roboDraw();}});
function roboChips(entries){return entries.map(e=>`<button data-entry="${esc(e.id)}">${esc(e.q)}</button>`).join('')}
function roboEntry(e){return `<h3>${esc(e.q)}</h3>${tlFmt(e.a)}${e.x==='forms'?roboForms():''}<p class="robo-source">Nguồn: ${esc(e.s||'Kho hướng dẫn mẫu PTI')} · Nội dung tham khảo, đối chiếu văn bản gốc trước khi áp dụng.</p><div class="robo-chips">${roboChips((e.r||[]).map(k=>tlKB().find(e=>e.id===k)).filter(Boolean))}</div>`}
function roboForms(){const forms=window.TL_FORMS||[];return forms.length?'<div class="robo-table"><table><tr><th>Mã</th><th>Biểu mẫu có tệp</th></tr>'+forms.map(f=>`<tr><td>${esc(f.code)}</td><td><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.name)}</a></td></tr>`).join('')+'</table></div>':''}
// Match the first numeric segment exactly after removing leading zeroes.
// Never search the branch/year segments or arbitrary substrings for a short ID.
function roboClaimQuery(q){
 const full=String(q).match(/\b\d{5,}\/[^\s?,;!]+/);
 if(full)return {full:full[0].replace(/[.)]+$/,'')};
 const n=tlNorm(q),bare=n.match(/^\d{3,}$/),explicit=n.match(/\b(?:hsbt|ho so|hs|xem|tim|tra cuu)\s*(?:so\s*)?(\d{3,})\b/);
 const value=bare?.[0]||explicit?.[1];
 if(!value)return null;
 // Counts, ages, amounts and reporting periods are not claim identifiers.
 if(/\b(?:bao nhieu|co bao|thong ke|tong|tren|duoi|hon|ngay|dong|vnd|trieu|ty|thang|nam|den|tu)\b/.test(n))return null;
 return {short:value.replace(/^0+(?=\d)/,'')};
}
function roboClaimMatches(value,query){
 const full=String(value||'').trim();
 if(query.full)return full.toUpperCase()===query.full.toUpperCase();
 const first=full.match(/^(\d+)\//)?.[1];
 return !!first&&first.replace(/^0+(?=\d)/,'')===query.short;
}
function roboData(q,source=ROWS){const n=tlNorm(q),compact=v=>norm(v).replace(/[^a-z0-9]/g,''),keys=q.match(/\d{2}[a-zA-Z]{1,2}[\s.-]*\d[\d\s.-]{3,8}/g),hs=roboClaimQuery(q),named=PTIGdv.resolveGdvs(q),code=named[0]||[...new Set(source.map(r=>r['GĐV thụ lý']))].find(k=>n.includes(tlNorm(k))),mine=/cua toi|cua minh/.test(n),gdv=code||(mine?roboMy:'');const facts=/ton|qua han|dang xu ly|chua giai quyet|da giai quyet|tong quan|thong ke|bao nhieu|danh sach|tnds/.test(n);if(!keys&&!hs&&/(la gi|dinh nghia|cach tinh|quy uoc|khi nao|thoi han|quy trinh)/.test(n))return null;if(!keys&&!hs&&!facts&&!code&&!mine)return null;if(mine&&!gdv)return '<p>Chọn “GĐV của tôi” ở phía trên rồi hỏi lại.</p>';let rs=source;if(gdv)rs=rs.filter(r=>(named.length?named:[gdv]).includes(r['GĐV thụ lý']));if(keys)rs=rs.filter(r=>keys.some(k=>compact(r['Biển số xe']).includes(compact(k))));if(hs)rs=rs.filter(r=>roboClaimMatches(id(r),hs));if(!keys&&!hs){if(/tnds/.test(n)){const label=/nhap huy|da huy/.test(n)?'TNDS nhập huỷ':/chua giai quyet|ton/.test(n)?'TNDS chưa giải quyết':/da giai quyet/.test(n)?'TNDS đã giải quyết':null;rs=rs.filter(r=>label?reportStatus(r)===label:reportStatus(r).startsWith('TNDS '))}if(/ton|qua han|dang xu ly|chua giai quyet/.test(n))rs=rs.filter(r=>r._state==='Tồn');else if(/da giai quyet/.test(n))rs=rs.filter(r=>r._state==='Đã giải quyết');const m=n.match(/(?:tren|hon|tu|>=|>)\s*(\d+)\s*ngay/);if(m)rs=rs.filter(r=>r._state==='Tồn'&&(/tren|hon|>/.test(m[0])&&!m[0].includes('>=')?Number(r['Số ngày tồn'])>+m[1]:Number(r['Số ngày tồn'])>=+m[1]))}const s=stats(rs);rs.sort((a,b)=>(b._state==='Tồn'?Number(b['Số ngày tồn']): -1)-(a._state==='Tồn'?Number(a['Số ngày tồn']):-1));return `<h3>${keys||hs?'Kết quả tra cứu hồ sơ':'Tổng hợp dữ liệu 093'}</h3><p><b>${num(rs.length)} hồ sơ</b>${gdv?' · '+esc((named.length?named:[gdv]).map(PTIGdv.gdvLabel).join(', ')):''}: ${num(s.g.length)} đã giải quyết, ${num(s.t.length)} tồn.</p><p>Ước BT tồn: <b>${money(s.tMoney)}</b> · Giá trị BT đã giải quyết: <b>${money(s.gMoney)}</b>.</p>${rs.slice(0,15).map(r=>`<button class="robo-record" data-record="${esc(id(r))}"><b>${esc(r['Biển số xe'])}</b> · ${esc(r['GĐV thụ lý'])}<br>${esc(id(r))}<br>${esc(reportStatus(r))} · ${r._state==='Tồn'?num(r['Số ngày tồn'])+' ngày tồn':'Đã giải quyết'}</button>`).join('')}${rs.length>15?'<p>Hiển thị 15 hồ sơ đầu; dùng menu Tra cứu hồ sơ để lọc và tải đầy đủ.</p>':''}<p class="robo-source">3 nguồn đã đối soát · Chốt ${reportLabel()} · Tra toàn bộ dữ liệu, không theo bộ lọc của menu. CHINHND gộp NMN04; TNDS trạng thái “-” được đối chiếu nguồn và tiền trả KH; nhập huỷ tính 0.</p>`}
function roboAnswer(q){const cost=tlNorm(q);if(/xo\s*[.,]?\s*4|vcx|vat chat/.test(cost)&&/thang|nam 20/.test(cost)&&/trieu|10000000|vu nho/.test(cost))return '<p>Câu hỏi này cần truy vấn máy chủ theo tháng và khoảng tiền. Hãy gửi lại câu hỏi khi có kết nối để nhận số liệu chính xác; tra cứu dự phòng không thay bằng tổng hồ sơ.</p>';const form=q.match(/(?:^|\s)(?:BM\.?\s*)?(20[.,]\d{2}[a-g]?)(?:$|\s)/i);if(form){const f=window.TL_FORMS.find(f=>f.code.toUpperCase()===form[1].replace(',','.').toUpperCase());if(f&&f.url)return `<h3>Biểu mẫu ${esc(f.code)}</h3><p><a href="${esc(f.url)}" target="_blank" rel="noopener">Xem ${esc(f.name)}</a></p><p><a href="${esc(f.downloadUrl||f.url)}" target="_blank" rel="noopener">Mở / tải tệp</a></p>`;return '<p>Thư viện máy chủ chưa có tệp biểu mẫu này để xem hoặc tải. Danh mục sẽ được cập nhật khi có tài liệu.</p>'}const named=PTIGdv.resolveGdvs(q);if(named.length&&/(la ai|ten day du|ma gdv|ma cua|ten cua)/.test(tlNorm(q)))return '<h3>Giám định viên</h3>'+named.map(c=>'<p>'+esc(PTIGdv.gdvLabel(c))+'</p>').join('');const data=roboData(q);if(data)return data;const a=tlSearch(q);if(!a.length||a[0].s<4.5)return '<p>Chưa tìm thấy hướng dẫn phù hợp. Thử diễn đạt khác hoặc chọn chủ đề; trợ lý không tự suy đoán quy định.</p>';return roboEntry(a[0].e)}
function roboAlignNewest(){
 const log=$('roboLog'),last=log?.querySelector('.robo-msg:nth-last-child(2)'),space=log?.querySelector('.robo-scroll-space');
 if(!log||!log.clientHeight||!last||!space)return;
 space.style.height=Math.max(0,log.clientHeight-last.offsetHeight-24)+'px';
 log.scrollTop+=last.getBoundingClientRect().top-log.getBoundingClientRect().top-12;
}
function roboDraw(){const log=$('roboLog');log.innerHTML=roboLog.map(m=>`<div class="robo-msg ${m.role}">${m.role==='user'?esc(m.text):m.html}</div>`).join('')+'<div class="robo-scroll-space" aria-hidden="true"></div>';roboAlignNewest()}
function roboPush(role,text){roboLog.push(role==='user'?{role,text}:{role,html:text});roboLog=roboLog.slice(-40);roboWrite('093_robo_log_v1',roboLog.filter(m=>m.role==='user'));roboDraw()}
function roboLocalLookup(q){return !!roboClaimQuery(q)||/\d{2}[a-zA-Z]{1,2}[\s.-]*\d[\d\s.-]{3,8}|\d{5,}\/[^\s]+|(?:^|\s)(?:BM\.?\s*)?20[.,]\d{2}[a-g]?(?:$|\s)/i.test(q)}
function roboSetBusy(busy){roboBusy=busy;const send=$('roboForm')?.querySelector('button[type="submit"]');if(send)send.disabled=busy;const input=$('roboInput');if(input)input.disabled=busy;const log=$('roboLog');if(log)log.setAttribute('aria-busy',String(busy))}
async function roboCheckAi(){try{const r=await authFetch('/api/assistant');const state=await r.json();roboAiConfigured=r.ok&&state.configured===true}catch{roboAiConfigured=false}const label=$('roboPanel')?.querySelector('.robo-top small');if(label)label.textContent=roboAiConfigured?'AI · Hướng dẫn & số liệu 093':'Tra cứu dự phòng · Hướng dẫn & hồ sơ'}
function roboFallback(q,code){const messages={AI_QUOTA:'AI đã hết hạn mức miễn phí hôm nay.',AI_RATE_LIMIT:'AI đang tạm giới hạn số lượt hỏi; hãy thử lại sau.',AI_CONFIGURATION:'Kết nối AI chưa được xác thực.',AI_NOT_CONFIGURED:'AI chưa được cấu hình.',DATA_UNAVAILABLE:'Chưa tải được dữ liệu cho AI.'};let html;try{html=roboAnswer(q)}catch{html='<p>Chưa tra cứu được. Hãy dùng menu Tra cứu hồ sơ.</p>'}return '<p class="tl-warn">'+esc(messages[code]||'AI tạm thời không phản hồi.')+' Đang dùng trợ lý tra cứu dự phòng.</p>'+html}
function roboDutyIntent(q){
 return /\b(lich truc|ai truc|truc (?:chinh|thay|hien truong|giam dinh|ngoai gio|trong gio)|(?:hom nay|ngay mai|toi nay) (?:ai )?truc|truc (?:ngay|hom nay|hom qua|hom nao|mai|cuoi tuan|khi nao|toi nay|dem nay))\b/.test(tlNorm(q));
}
const roboPriorityDocuments = {
 109:{label:'QĐ109 – Quy tắc bảo hiểm vật chất xe ô tô',query:'Quy tắc bảo hiểm vật chất xe ô tô',title:/\bvat chat xe o to\b/},
 110:{label:'QĐ110 – Quy tắc bảo hiểm trách nhiệm đối với phụ xe, người ngồi trên xe ô tô',query:'Quy tắc bảo hiểm phụ xe người ngồi trên xe ô tô',title:/\bquy tac\b.*\bphu xe\b.*\bo to\b/},
 123:{label:'QĐ123 – Quy tắc bảo hiểm trách nhiệm đối với người ngồi trên xe máy',query:'Quyết định 123 Quy tắc bảo hiểm trách nhiệm người ngồi trên xe máy',title:/^quy tac\b.*\bnguoi ngoi tren xe may\b/},
 'pl01':{label:'PL01 – Bảng tỷ lệ trả tiền bồi thường thiệt hại về người',query:'Bảng tỷ lệ trả tiền bồi thường thiệt hại về người',title:/\bbang ty le\b.*\bboi thuong\b.*\bthiet hai ve nguoi\b/}
};
function roboInjuryQuery(q){
 return tlNorm(q).replace(/\bgay cham\b/g,'gay chan');
}
function roboInjuryClarification(q){
 const n=roboInjuryQuery(q);
 if(!/\bgay\b/.test(n))return '';
 const broad=n.match(/\bgay (?:xuong )?(tay|chan)\b/)?.[1];
 if(!broad||/\b(canh tay|cang tay|quay|tru|co tay|ban tay|ngon tay|dui|cang chan|chay|mac|co chan|ban chan|ngon chan)\b/.test(n))return '';
 return broad==='tay'
  ?'Anh/chị cho biết gãy xương nào theo chẩn đoán, ví dụ xương cánh tay, xương quay, xương trụ, xương bàn tay hay ngón tay?'
  :'Anh/chị cho biết gãy xương nào theo chẩn đoán, ví dụ xương đùi, xương chày, xương mác, xương bàn chân hay ngón chân?';
}
function roboPriorityDocument(q){
 const n=roboInjuryQuery(q);
 const code=n.match(/\b(?:qd|quyet dinh)\s*(109|110|123)\b/)?.[1];
 if(code)return code;
 if(/\bgay (?:xuong )?(?:tay|chan|xuong|canh tay|cang tay|quay|tru|co tay|ban tay|ngon tay|dui|cang chan|chay|mac|co chan|ban chan|ngon chan)\b/.test(n))return 'pl01';
 if(/\bpl\s*01\b|\bbang ty le\b.*\bboi thuong\b.*\b(?:thiet hai ve nguoi|thuong tat)\b/.test(n))return 'pl01';
 if(/\b(ho so ton|bao nhieu ho so|thong ke|doanh thu|tong tien|ty le boi thuong)\b/.test(n)&&!/\b(quy tac|dieu khoan|loai tru)\b/.test(n))return '';
 if(/\b(phu xe|nguoi ngoi tren (?:xe )?o to)\b/.test(n))return '110';
 if(/\b(nntx may|nguoi ngoi tren xe may)\b/.test(n))return '123';
 if(/\b(vcx|vat chat)\b/.test(n))return '109';
 if(/\btu nguyen\b/.test(n)&&/\bo to\b/.test(n)&&!/\b(tnds|trach nhiem)\b/.test(n))return '109';
 return '';
}
function roboMatchesPriorityDocument(item,key){
 const value=tlNorm([item.title,item.filename,item.id].filter(Boolean).join(' '));
 if(key==='pl01')return /\bpl\s*01\b/.test(value)||roboPriorityDocuments[key].title.test(value);
 const code=value.match(/\b(?:qd|quyet dinh)\s*(109|110|123)\b/)?.[1];
 return code?code===key:roboPriorityDocuments[key].title.test(tlNorm(item.title||''));
}
function roboDocumentIntent(q){
 const n=tlNorm(q);
 if(/^(?:(?:mo|xem|tim|vao|cho toi xem) )?(?:kho|danh muc) tai lieu(?: (?:o )?dau)?$/.test(n))return 'catalog';
 if(/\b(loai tru|ngoai tru)\b/.test(n)&&/\b(tnds|trach nhiem dan su|bao hiem|vat chat xe|dang kiem)\b/.test(n))return 'source';
 if(/\b(dieu \d{1,3}[a-z]?|bao nhieu van ban|quy dinh gi|noi dung gi)\b/.test(n)&&
    /\b(luat|thong tu|nghi dinh|cong van|van ban|tai lieu)\b/.test(n))return 'source';
 if(/\b(ho so ton|bao nhieu ho so|thong ke|ty le|doanh thu|tong tien)\b/.test(n)&&!/\b(tai lieu|bieu mau|van ban)\b/.test(n))return '';
 if(/\b(tai nan|tngt|t n g t|va cham|dam xe|tong xe)\b/.test(n)&&
    /\b(trach nhiem|nghia vu|lam gi|roi hien truong|giu hien truong|xu ly the nao)\b/.test(n))return 'source';
 if(/\bluat (?:duong bo|(?:trat tu an toan )?(?:giao thong|gtdb|gt db|g t d b))\b/.test(n))return 'source';
 if(/\b(?:bm[ .,-]*pti[ .,-]*xcg[ .,-]*)?20[.,-]\d{2}[a-z]?\b/i.test(q)||
  /\b(bieu mau|tai lieu|van ban nao|file|tep)\b/.test(n)||
  /\b(tai|gui|xin|cho toi|tim)\b.*\b(mau|bien ban|quy dinh|quy tac|thong tu|qd)\b/.test(n))return 'direct';
 return /\b(quy dinh|quy tac|quy trinh|huong dan|nghi dinh|thong tu|tam ung|bao lanh|bien ban|chung tu|tham quyen|muc khau tru)\b/.test(n)?'source':'';
}
async function roboFindChatDocuments(q,signal){
 try{
  const response=await authFetch('/api/document-catalog?'+new URLSearchParams({mode:'chat',q}),{signal:AbortSignal.any([signal,AbortSignal.timeout(7500)])});
  if(!response.ok)return null;
  const result=await response.json();
  return Array.isArray(result.items)?result.items:[];
 }catch{return null}
}
function roboDocumentCards(items){
 return '<h3>Tài liệu liên quan trong kho 093</h3>'+items.map(item=>
  '<article class="robo-catalog-result"><p><b>'+esc(item.title)+'</b><br><small>'+esc(item.cat+(item.old?' · Bản cũ, dùng để đối chiếu':''))+'</small></p>'+
  (item.text?'<details><summary>Xem đoạn trích</summary>'+tlFmt(item.text)+'</details>':'')+
  (item.available?'<button type="button" data-document-download="'+esc(item.id)+'">Tải tài liệu</button><small role="status"></small>':'')+'</article>').join('');
}
async function roboDownloadDocument(id,button,status){
 button.disabled=true;status.textContent='Đang tải tài liệu…';
 try{
  const file=await authFetch('/api/document-catalog?'+new URLSearchParams({download:id}));
  if(!file.ok)throw Error();
  const name=file.headers.get('Content-Disposition')?.split("UTF-8''")[1];
  const url=URL.createObjectURL(await file.blob()),link=document.createElement('a');
  link.href=url;link.download=name?decodeURIComponent(name):'tai-lieu-093';
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
  status.textContent='Đã chuyển tệp cho trình duyệt để tải.';
 }catch{status.textContent='Chưa tải được tài liệu. Vui lòng thử lại.'}
 finally{button.disabled=false}
}
async function roboAsk(q){
 q=q.trim().slice(0,1000);if(!q||roboBusy)return;
 const duty=roboDutyIntent(q),intent=duty?'':roboDocumentIntent(q);
 const priority=!duty&&intent!=='catalog'?roboPriorityDocument(q):'';
 const source=roboPriorityDocuments[priority];
 const documents=source?(intent==='direct'?'direct':'source'):intent;
 const history=roboLog.filter(m=>m.role==='user'&&!roboLocalLookup(m.text)&&!['direct','catalog'].includes(roboDocumentIntent(m.text))||m.aiText).slice(-6).map(m=>({role:m.role==='user'?'user':'assistant',content:m.role==='user'?m.text:m.aiText}));
 roboPush('user',q);
 const injuryClarification=priority==='pl01'?roboInjuryClarification(q):'';
 if(injuryClarification){roboPush('bot','<p>'+esc(injuryClarification)+'</p>');return}
 if(documents==='catalog'){$('roboCatalog').click();return}
 if(!duty&&!documents&&roboLocalLookup(q)){try{roboPush('bot',roboAnswer(q))}catch{roboPush('bot','<p>Không xử lý được tra cứu. Hãy dùng menu Tra cứu hồ sơ.</p>')}return}
 const epoch=++roboEpoch;roboController=new AbortController();const timer=setTimeout(()=>roboController?.abort(),100000);roboSetBusy(true);
 const pending={role:'bot',html:'<p>Đang đọc hướng dẫn và phân tích câu hỏi…</p>'};roboLog.push(pending);roboDraw();
 const documentSearch=documents?roboFindChatDocuments(source?.query||q,roboController.signal)
  .then(items=>source&&items?items.filter(item=>roboMatchesPriorityDocument(item,priority)):items):Promise.resolve([]);
 try{
  if(documents==='direct'){
   const items=await documentSearch;if(epoch!==roboEpoch)return;
   pending.html=items?.length?roboDocumentCards(items):items?'<p>Chưa tìm thấy tài liệu phù hợp. Hãy thử tên, từ khóa nghiệp vụ hoặc mã biểu mẫu.</p>':'<p>Kho tài liệu tạm thời chưa phản hồi. Hãy thử lại.</p>';
   return;
  }
  const question=source?`Tra cứu đúng tài liệu nội bộ ${source.label}. Dẫn rõ điều, khoản hoặc trang nếu nguồn có. Với bảng thương tật, nêu đúng dòng, mức và điều kiện ghi trong bảng. Hỏi thêm nếu chẩn đoán chưa đủ để chọn một dòng. Câu hỏi: ${q}`:q;
  const response=await authFetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,gdv:roboMy,history}),signal:roboController.signal});
  const result=await response.json();if(epoch!==roboEpoch)return;
  if(source){
   const references=Array.isArray(result.documents)?result.documents.filter(item=>roboMatchesPriorityDocument(item,priority)):[];
   if(response.ok&&references.length&&typeof result.answer==='string'&&result.answer.trim()){
    pending.hasDocumentCards=true;
    pending.html='<h3>'+esc(source.label)+'</h3>'+tlFmt(result.answer)+roboDocumentCards(references);
   }else pending.html='<p>Chưa xác minh được điều khoản theo '+esc(source.label)+'.</p>';
   return;
  }
  if(!response.ok)pending.html=roboFallback(q,result.code);
  else if(typeof result.answer==='string'&&result.answer.trim()){
   if(result.tools?.includes('duty_schedule')){
    pending.html='<h3>Tra cứu lịch trực 093</h3>'+tlFmt(result.answer)+(result.documents?.length?roboDocumentCards(result.documents):'');
    return;
   }
   if(result.tools?.includes('legal_library')||result.tools?.includes('document_library')){
    pending.hasDocumentCards=!!result.documents?.length;
    pending.html='<h3>Tra cứu tài liệu trong kho 093</h3>'+tlFmt(result.answer)+(result.documents?.length?roboDocumentCards(result.documents):'');
    return;
   }
   pending.aiText=result.answer;
   const refs=(result.sources||[]).map(s=>tlKB().find(e=>e.id===s.id)).filter(Boolean);
   pending.html='<h3>'+(result.tools?.includes('cost_cohort_query')?'Truy vấn dữ liệu 093':'Trợ lý AI 093')+'</h3>'+tlFmt(result.answer)+'<p class="robo-source">'+(result.tools?.includes('cost_cohort_query')?'Tính trực tiếp từ dữ liệu':'AI Cloudflare')+' · '+esc(String(result.scope).split(', ').map(PTIGdv.gdvLabel).join(', '))+' · Chốt '+esc(result.cutoff?.split('-').reverse().join('/'))+' · Nội dung AI cần được đối chiếu trước khi áp dụng.</p>'+(refs.length?'<div class="robo-chips">'+roboChips(refs)+'</div>':'');
  }else pending.html=roboFallback(q,'AI_EMPTY');
 }catch{if(epoch===roboEpoch)pending.html=source?'<p>Chưa tra cứu được '+esc(source.label)+'.</p>':roboFallback(q,'AI_UNAVAILABLE')}
 finally{
  const items=documents==='source'?await documentSearch:null;
  clearTimeout(timer);
  if(epoch===roboEpoch){
   if(items?.length&&!pending.hasDocumentCards)pending.html+=roboDocumentCards(items);
   roboController=null;roboSetBusy(false);roboWrite('093_robo_log_v1',roboLog.filter(m=>m.role==='user'));roboDraw();
  }
 }
}
function roboHome(){roboPush('bot',`<h3>Trợ lý GĐV 093</h3><p>Hỏi AI về nghiệp vụ và số liệu tổng hợp; tra cứu trực tiếp ${tlKB().length} hướng dẫn${window.TL_FORMS.length?", "+window.TL_FORMS.length+" biểu mẫu có tệp":""} và dữ liệu 093. Gõ biển số, số HSBT, hoặc hỏi “Ai trực ngày mai?” để tra cứu. Gõ “Tải lịch trực” để tải bản Excel.</p><div class="robo-chips">${window.TL_GROUPS.map(g=>`<button data-group="${esc(g.id)}">${esc(g.icon+' '+g.name)}</button>`).join('')}</div><p class="robo-source">AI nhận câu hỏi, hướng dẫn liên quan và số liệu tổng hợp qua Cloudflare; không gửi toàn bộ danh sách hồ sơ. Tra cứu biển số/số HSBT và nút chủ đề xử lý trực tiếp. Kho hướng dẫn chưa đối chiếu toàn bộ văn bản gốc. Hết hạn mức miễn phí sẽ dùng tra cứu dự phòng.</p>`)}
function roboPosition(){const b=$('roboFab'),p=roboRead('093_robo_position');if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){b.style.left=Math.max(8,Math.min(innerWidth-68,p.x*innerWidth))+'px';b.style.top=Math.max(8,Math.min(innerHeight-68,p.y*innerHeight))+'px';b.style.right='auto';b.style.bottom='auto'}}
// Fixed elements use the layout viewport on iOS; the keyboard reduces only the
// visual viewport. Keep the whole panel, including its composer, inside that area.
function roboViewportBounds(width,height,left,top,layoutHeight,focused){
 const keyboard=focused&&layoutHeight-height>120,gap=12;
 const panelWidth=Math.max(0,Math.min(420,width-gap*2));
 const panelHeight=Math.max(0,Math.min(650,height-gap-(keyboard?gap:84)));
 return {left:left+width-gap-panelWidth,top:top+height-(keyboard?gap:84)-panelHeight,width:panelWidth,height:panelHeight,keyboard};
}
function roboTouchViewport(){return innerWidth<=600||window.matchMedia?.('(pointer:coarse)').matches===true}
function roboFitViewport(){
 const p=$('roboPanel');if(!p||p.hidden)return;
 if(!roboTouchViewport()){for(const key of ['left','right','top','bottom','width','height'])p.style.removeProperty(key);delete p.dataset.keyboard;return}
 const v=window.visualViewport,focused=p.contains(document.activeElement);
 const r=roboViewportBounds(v?.width||innerWidth,v?.height||innerHeight,v?.offsetLeft||0,v?.offsetTop||0,innerHeight,focused);
 Object.assign(p.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',right:'auto',bottom:'auto'});
 p.dataset.keyboard=String(r.keyboard);
}
function roboToggle(force){const p=$('roboPanel');p.hidden=typeof force==='boolean'?!force:!p.hidden;$('roboFab').setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden){if(!roboLog.length)roboHome();roboFitViewport();if(!roboTouchViewport())$('roboInput').focus({preventScroll:true});roboAlignNewest()}else if(p.contains(document.activeElement)){document.activeElement.blur()}}
function roboCompactExcerpt(text){
 return (text||'').replace(/\r\n?/g,'\n').replace(/[^\S\n]+/g,' ').replace(/^ +| +$/gm,'').replace(/\n{3,}/g,'\n\n').trim();
}
function initRoboCatalog(){
 const dialog=document.createElement('dialog');
 dialog.className='robo-catalog';
 dialog.setAttribute('aria-labelledby','roboCatalogTitle');
 dialog.innerHTML=`<div class="robo-catalog-shell">
  <div class="robo-catalog-header">
   <div class="robo-catalog-title">
    <h2 id="roboCatalogTitle">Kho tài liệu GĐV 093</h2>
    <form method="dialog"><button aria-label="Đóng kho tài liệu">Đóng ✕</button></form>
   </div>
   <form data-search>
    <label>Tên, mã hoặc nội dung <input type="search" maxlength="180"></label>
    <label>Nhóm <select><option value="">Tất cả nhóm</option></select></label>
    <button type="submit">Tìm</button>
   </form>
   <p role="status"></p>
  </div>
  <div class="robo-catalog-body">
   <div data-results></div><button type="button" data-more hidden>Xem thêm</button>
   <details data-admin><summary>Cập nhật danh mục (quản trị)</summary><label>Tệp danh mục <input type="file" accept=".html,.json"></label></details>
  </div>
 </div>`;
 document.body.append(dialog);
 const search=dialog.querySelector('[data-search]'),input=search.querySelector('input'),group=search.querySelector('select');
 const status=dialog.querySelector('[role="status"]'),results=dialog.querySelector('[data-results]'),more=dialog.querySelector('[data-more]');
 const body=dialog.querySelector('.robo-catalog-body');
 let shown=0,revision=0;
 function add(host,tag,text){const node=document.createElement(tag);node.textContent=text;host.append(node);return node}
 async function load(append=false){
  const ticket=++revision,offset=append?shown:0;
  if(!append){shown=0;results.replaceChildren();body.scrollTop=0}
  more.hidden=true;status.textContent='Đang tra cứu…';
  const query=new URLSearchParams({q:input.value,group:group.value,offset:String(offset)});
  try{
   const response=await authFetch('/api/document-catalog?'+query);
   if(!response.ok)throw Error();
   const data=await response.json();
   if(ticket!==revision)return;
   const selected=group.value;
   group.length=1;
   for(const name of data.groups)group.add(new Option(name,name));
   group.value=selected;
   for(const item of data.items){
    const card=add(results,'article','');
    add(card,'h3',item.title);
    add(card,'p',[item.cat,item.folder,item.old?'Bản cũ, dùng để đối chiếu':''].filter(Boolean).join(' · '));
    if(item.available){
     const button=add(card,'button','Tải tài liệu');
     button.onclick=()=>roboDownloadDocument(item.id,button,status);
    }else if(item.download){
     add(card,'small','Bản tải xuống đang chờ cập nhật.');
    }
    const excerpt=roboCompactExcerpt(item.text);
    if(excerpt){
     const details=add(card,'details','');
     details.className='robo-catalog-excerpt';
     details.setAttribute('name','robo-document-excerpts');
     const summary=add(details,'summary','Xem đoạn trích');
     details.ontoggle=()=>{summary.textContent=details.open?'Thu gọn đoạn trích':'Xem đoạn trích'};
     add(details,'p',excerpt);
    }
    if(item.download&&dialog.querySelector('details[data-admin]').open){
     const control=add(card,'button','Mở Quản trị hệ thống');control.type='button';control.onclick=()=>{dialog.close();adminTab=item.id==='pti093-lich-truc-hien-truong'?'duty':'documents';go('Quản trị hệ thống');};
    }
   }
   shown=offset+data.items.length;
   status.textContent=data.total?`Hiện ${shown} / ${data.total} tài liệu`:'Không tìm thấy tài liệu phù hợp.';
   more.hidden=shown>=data.total;
  }catch{if(ticket===revision)status.textContent='Kho tài liệu chưa sẵn sàng hoặc phiên đã hết hạn.'}
 }
 search.onsubmit=e=>{e.preventDefault();load()};
 group.onchange=()=>load();
 more.onclick=()=>load(true);
 dialog.querySelector('details[data-admin]').ontoggle=()=>load();
 const picker=dialog.querySelector('[type="file"]');
 picker.onchange=async()=>{
  const file=picker.files[0];picker.value='';
  if(!file)return;
  const token=await requestDatabasePassword();
  if(!token)return;
  try{
   const response=await authFetch('/api/document-catalog',{method:'PUT',headers:{'X-Database-Authorization':token},body:file});
   if(!response.ok)throw Error();
   input.value='';group.value='';await load();
  }catch{status.textContent='Chưa cập nhật được danh mục.'}
 };
 $('roboCatalog').onclick=()=>{if(!dialog.open){dialog.showModal();load()}};
}

function initRobo(){const robot='<span class="robo-head"><i></i><i></i><em></em></span>';document.body.insertAdjacentHTML('beforeend',`<button id="roboFab" class="robo-fab" aria-label="Mở trợ lý GĐV 093, kéo để đổi vị trí" aria-expanded="false" title="Bấm để mở · Kéo để đổi vị trí">${robot}</button><section id="roboPanel" data-robo-build="20261105-short-claim" class="robo-panel" role="dialog" aria-label="Trợ lý GĐV 093" hidden><div class="robo-top"><div>${robot}<b>Trợ lý GĐV 093<small>AI · Hướng dẫn & số liệu 093</small></b></div><button id="roboReset" title="Xóa hội thoại">↺</button><button id="roboClose" aria-label="Đóng trợ lý">✕</button></div><div class="robo-toolbar"><button type="button" id="roboHome"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg><span>Chủ đề</span></button><button type="button" id="roboCatalog" aria-haspopup="dialog"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg><span>Kho tài liệu</span></button><label>Phạm vi GĐV <select id="roboGdv"><option value="">Tất cả GĐV</option>${[...new Set(ROWS.map(r=>r['GĐV thụ lý']))].sort().map(k=>`<option value="${esc(k)}">${esc(PTIGdv.gdvLabel(k))}</option>`).join('')}</select></label></div><div id="roboLog" class="robo-log" aria-live="polite"></div><form id="roboForm"><input id="roboInput" maxlength="1000" placeholder="Hỏi quy trình, biển số / số HSBT…" aria-label="Câu hỏi"><button type="button" id="roboMic" aria-label="Nhập bằng giọng nói">🎙</button><button type="submit" aria-label="Gửi câu hỏi">➤</button></form><small id="roboVoiceNote">AI nhận câu hỏi qua Cloudflare · Không nhập thông tin cá nhân khách hàng.</small></section>`);initRoboCatalog();roboMy=roboRead('093_robo_my')||'';$('roboGdv').value=roboMy;$('roboGdv').onchange=e=>{roboMy=e.target.value;roboWrite('093_robo_my',roboMy)};roboLog=[];const saved=roboRead('093_robo_log_v1');if(Array.isArray(saved))roboLog=saved.filter(x=>x&&x.role==='user'&&typeof x.text==='string').slice(-20).flatMap(x=>{let html;try{html=roboAnswer(x.text)}catch{html='<p>Hãy hỏi lại để tra cứu dữ liệu hiện tại.</p>'}return [{role:'user',text:x.text},{role:'bot',html}]});roboDraw(); // Only restore plain user text; rebuild bot answers from current code.
$('roboClose').onclick=()=>roboToggle(false);$('roboHome').onclick=roboHome;$('roboReset').onclick=()=>{roboEpoch++;roboController?.abort();roboSetBusy(false);roboLog=[];roboWrite('093_robo_log_v1',[]);roboHome()};$('roboForm').onsubmit=e=>{e.preventDefault();roboAsk($('roboInput').value);$('roboInput').value=''};$('roboLog').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.documentDownload){roboDownloadDocument(b.dataset.documentDownload,b,b.nextElementSibling);return}if(b.dataset.entry){const k=tlKB().find(x=>x.id===b.dataset.entry);if(k){roboPush('user',k.q);roboPush('bot',roboEntry(k))}}else if(b.dataset.group){const g=window.TL_GROUPS.find(x=>x.id===b.dataset.group);roboPush('bot',`<h3>${esc(g.name)}</h3><div class="robo-chips">${roboChips(tlKB().filter(x=>x.g===g.id))}</div>`)}else if(b.dataset.record)showRecord(b.dataset.record)};const b=$('roboFab');let start=null,moved=false;b.onpointerdown=e=>{if(e.button!==0)return;const r=b.getBoundingClientRect();start={x:e.clientX,y:e.clientY,left:r.left,top:r.top};moved=false;b.setPointerCapture(e.pointerId)};b.onpointermove=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>6)moved=true;if(!moved)return;b.style.animation='none';b.style.left=Math.max(8,Math.min(innerWidth-68,start.left+dx))+'px';b.style.top=Math.max(8,Math.min(innerHeight-68,start.top+dy))+'px';b.style.right='auto';b.style.bottom='auto'};b.onpointerup=()=>{if(!start)return;start=null;if(moved){b.style.animation='';const r=b.getBoundingClientRect();roboWrite('093_robo_position',{x:r.left/innerWidth,y:r.top/innerHeight})}else roboToggle()};b.onpointercancel=()=>{start=null};b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();roboToggle()}};roboCheckAi();roboPosition();addEventListener('resize',()=>{roboPosition();roboFitViewport()});window.visualViewport?.addEventListener('resize',roboFitViewport);window.visualViewport?.addEventListener('scroll',roboFitViewport);$('roboPanel').addEventListener('focusin',roboFitViewport);$('roboPanel').addEventListener('focusout',()=>requestAnimationFrame(roboFitViewport));addEventListener('keydown',e=>{if(e.key==='Escape')roboToggle(false)});const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){$('roboMic').disabled=true;$('roboMic').title='Trình duyệt chưa hỗ trợ giọng nói'}else{$('roboMic').onclick=()=>{const sr=new SR();sr.lang='vi-VN';sr.onresult=e=>{$('roboInput').value=e.results[0][0].transcript;$('roboVoiceNote').textContent='Đã nhận giọng nói. Kiểm tra nội dung rồi bấm gửi.'};sr.onerror=()=>{$('roboVoiceNote').textContent='Không nhận được giọng nói. Bạn có thể gõ câu hỏi.'};$('roboVoiceNote').textContent='Micro do trình duyệt xử lý, có thể cần mạng và gửi âm thanh tới dịch vụ nhận giọng nói.';try{sr.start()}catch{}}}}

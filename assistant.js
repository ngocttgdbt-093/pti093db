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
let roboLog=[],roboMy='',roboDrag=false;
const roboRead=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}},roboWrite=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
function roboChips(entries){return entries.map(e=>`<button data-entry="${esc(e.id)}">${esc(e.q)}</button>`).join('')}
function roboEntry(e){return `<h3>${esc(e.q)}</h3>${tlFmt(e.a)}${e.x==='forms'?roboForms():''}<p class="robo-source">Nguồn: ${esc(e.s||'Kho hướng dẫn mẫu PTI')} · Nội dung tham khảo, đối chiếu văn bản gốc trước khi áp dụng.</p><div class="robo-chips">${roboChips((e.r||[]).map(k=>tlKB().find(e=>e.id===k)).filter(Boolean))}</div>`}
function roboForms(){return '<div class="robo-table"><table><tr><th>Mã</th><th>Biểu mẫu</th></tr>'+window.TL_FORMS.map(f=>`<tr><td>${esc(f.code)}</td><td>${esc(f.name)}</td></tr>`).join('')+'</table></div>'}
function roboData(q,source=ROWS){const n=tlNorm(q),compact=v=>norm(v).replace(/[^a-z0-9]/g,''),keys=q.match(/\d{2}[a-zA-Z]{1,2}[\s.-]*\d[\d\s.-]{3,8}/g),hs=q.match(/\d{5,}\/[^\s]+/),code=[...new Set(source.map(r=>r['GĐV thụ lý']))].find(k=>n.includes(tlNorm(k))),mine=/cua toi|cua minh/.test(n),gdv=code||(mine?roboMy:'');const facts=/ton|qua han|dang xu ly|chua giai quyet|da giai quyet|tong quan|thong ke|bao nhieu|danh sach|tnds/.test(n);if(!keys&&!hs&&/(la gi|dinh nghia|cach tinh|quy uoc|khi nao|thoi han|quy trinh)/.test(n))return null;if(!keys&&!hs&&!facts&&!code&&!mine)return null;if(mine&&!gdv)return '<p>Chọn “GĐV của tôi” ở phía trên rồi hỏi lại.</p>';let rs=source;if(gdv)rs=rs.filter(r=>r['GĐV thụ lý']===gdv);if(keys)rs=rs.filter(r=>keys.some(k=>compact(r['Biển số xe']).includes(compact(k))));if(hs)rs=rs.filter(r=>id(r).includes(hs[0]));if(!keys&&!hs){if(/tnds/.test(n)){const label=/nhap huy|da huy/.test(n)?'TNDS nhập huỷ':/chua giai quyet|ton/.test(n)?'TNDS chưa giải quyết':/da giai quyet/.test(n)?'TNDS đã giải quyết':null;rs=rs.filter(r=>label?reportStatus(r)===label:reportStatus(r).startsWith('TNDS '))}if(/ton|qua han|dang xu ly|chua giai quyet/.test(n))rs=rs.filter(r=>r._state==='Tồn');else if(/da giai quyet/.test(n))rs=rs.filter(r=>r._state==='Đã giải quyết');const m=n.match(/(?:tren|hon|tu|>=|>)\s*(\d+)\s*ngay/);if(m)rs=rs.filter(r=>r._state==='Tồn'&&(/tren|hon|>/.test(m[0])&&!m[0].includes('>=')?Number(r['Số ngày tồn'])>+m[1]:Number(r['Số ngày tồn'])>=+m[1]))}const s=stats(rs);rs.sort((a,b)=>(b._state==='Tồn'?Number(b['Số ngày tồn']): -1)-(a._state==='Tồn'?Number(a['Số ngày tồn']):-1));return `<h3>${keys||hs?'Kết quả tra cứu hồ sơ':'Tổng hợp dữ liệu 093'}</h3><p><b>${num(rs.length)} hồ sơ</b>${gdv?' · '+esc(gdv):''}: ${num(s.g.length)} đã giải quyết, ${num(s.t.length)} tồn.</p><p>Ước BT tồn: <b>${money(s.tMoney)}</b> · Giá trị BT đã giải quyết: <b>${money(s.gMoney)}</b>.</p>${rs.slice(0,15).map(r=>`<button class="robo-record" data-record="${esc(id(r))}"><b>${esc(r['Biển số xe'])}</b> · ${esc(r['GĐV thụ lý'])}<br>${esc(id(r))}<br>${esc(reportStatus(r))} · ${r._state==='Tồn'?num(r['Số ngày tồn'])+' ngày tồn':'Đã giải quyết'}</button>`).join('')}${rs.length>15?'<p>Hiển thị 15 hồ sơ đầu; dùng menu Tra cứu hồ sơ để lọc và tải đầy đủ.</p>':''}<p class="robo-source">3 nguồn đã đối soát · Chốt ${reportLabel()} · Tra toàn bộ dữ liệu, không theo bộ lọc của menu. CHINHND gộp NMN04; TNDS trạng thái “-” được đối chiếu nguồn và tiền trả KH; nhập huỷ tính 0.</p>`}
function roboAnswer(q){const form=q.match(/(?:^|\s)(?:BM\.?\s*)?(20[.,]\d{2}[a-g]?)(?:$|\s)/i);if(form){const f=window.TL_FORMS.find(f=>f.code.toUpperCase()===form[1].replace(',','.').toUpperCase());if(f)return `<h3>Biểu mẫu ${esc(f.code)}</h3><p>${esc(f.name)}</p><p class="robo-source">Danh mục biểu mẫu kho PTI mẫu · Chưa đính kèm file biểu mẫu gốc.</p>`}const data=roboData(q);if(data)return data;const a=tlSearch(q);if(!a.length||a[0].s<4.5)return '<p>Chưa tìm thấy hướng dẫn phù hợp. Thử diễn đạt khác hoặc chọn chủ đề; trợ lý không tự suy đoán quy định.</p>';return roboEntry(a[0].e)}
function roboAlignNewest(){
 const log=$('roboLog'),last=log?.querySelector('.robo-msg:nth-last-child(2)'),space=log?.querySelector('.robo-scroll-space');
 if(!log||!log.clientHeight||!last||!space)return;
 space.style.height=Math.max(0,log.clientHeight-last.offsetHeight-24)+'px';
 log.scrollTop+=last.getBoundingClientRect().top-log.getBoundingClientRect().top-12;
}
function roboDraw(){const log=$('roboLog');log.innerHTML=roboLog.map(m=>`<div class="robo-msg ${m.role}">${m.role==='user'?esc(m.text):m.html}</div>`).join('')+'<div class="robo-scroll-space" aria-hidden="true"></div>';roboAlignNewest()}
function roboPush(role,text){roboLog.push(role==='user'?{role,text}:{role,html:text});roboLog=roboLog.slice(-40);roboWrite('093_robo_log_v1',roboLog);roboDraw()}
function roboAsk(q){q=q.trim().slice(0,1000);if(!q)return;roboPush('user',q);try{roboPush('bot',roboAnswer(q))}catch{roboPush('bot','<p>Không xử lý được câu hỏi. Hãy thử lại hoặc dùng menu tra cứu.</p>')}}
function roboHome(){roboPush('bot',`<h3>Trợ lý GĐV 093</h3><p>Tra cứu offline từ ${tlKB().length} hướng dẫn, ${window.TL_FORMS.length} biểu mẫu và dữ liệu 093. Gõ biển số, số HSBT, hoặc “hồ sơ tồn trên 90 ngày”.</p><div class="robo-chips">${window.TL_GROUPS.map(g=>`<button data-group="${esc(g.id)}">${esc(g.icon+' '+g.name)}</button>`).join('')}</div><p class="robo-source">Nội dung quy trình từ kho mẫu PTI, chưa đối chiếu toàn bộ văn bản gốc. Không gửi câu hỏi hoặc hồ sơ tới API AI.</p>`)}
function roboPosition(){const b=$('roboFab'),p=roboRead('093_robo_position');if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){b.style.left=Math.max(8,Math.min(innerWidth-68,p.x*innerWidth))+'px';b.style.top=Math.max(8,Math.min(innerHeight-68,p.y*innerHeight))+'px';b.style.right='auto';b.style.bottom='auto'}}
function roboToggle(force){const p=$('roboPanel');p.hidden=typeof force==='boolean'?!force:!p.hidden;$('roboFab').setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden){if(!roboLog.length)roboHome();$('roboInput').focus({preventScroll:true});roboAlignNewest()}}
function initRobo(){const robot='<span class="robo-head"><i></i><i></i><em></em></span>';document.body.insertAdjacentHTML('beforeend',`<button id="roboFab" class="robo-fab" aria-label="Mở trợ lý GĐV 093, kéo để đổi vị trí" aria-expanded="false" title="Bấm để mở · Kéo để đổi vị trí">${robot}</button><section id="roboPanel" class="robo-panel" role="dialog" aria-label="Trợ lý GĐV 093" hidden><div class="robo-top"><div>${robot}<b>Trợ lý GĐV 093<small>Offline · Tra cứu hướng dẫn & hồ sơ</small></b></div><button id="roboReset" title="Xóa hội thoại">↺</button><button id="roboClose" aria-label="Đóng trợ lý">✕</button></div><div class="robo-toolbar"><button id="roboHome">Chủ đề</button><label>GĐV của tôi <select id="roboGdv"><option value="">Chưa chọn</option>${[...new Set(ROWS.map(r=>r['GĐV thụ lý']))].sort().map(k=>`<option>${esc(k)}</option>`).join('')}</select></label></div><div id="roboLog" class="robo-log" aria-live="polite"></div><form id="roboForm"><input id="roboInput" maxlength="1000" placeholder="Hỏi quy trình, biển số / số HSBT…" aria-label="Câu hỏi"><button type="button" id="roboMic" aria-label="Nhập bằng giọng nói">🎙</button><button type="submit" aria-label="Gửi câu hỏi">➤</button></form><small id="roboVoiceNote">Trợ lý tra cứu offline · Kéo nút robot để đổi vị trí.</small></section>`);roboMy=roboRead('093_robo_my')||'';$('roboGdv').value=roboMy;$('roboGdv').onchange=e=>{roboMy=e.target.value;roboWrite('093_robo_my',roboMy)};roboLog=[];const saved=roboRead('093_robo_log_v1');if(Array.isArray(saved))roboLog=saved.filter(x=>x&&x.role==='user'&&typeof x.text==='string').slice(-20).flatMap(x=>{let html;try{html=roboAnswer(x.text)}catch{html='<p>Hãy hỏi lại để tra cứu dữ liệu hiện tại.</p>'}return [{role:'user',text:x.text},{role:'bot',html}]});roboDraw(); // Only restore plain user text; rebuild bot answers from current code.
$('roboClose').onclick=()=>roboToggle(false);$('roboHome').onclick=roboHome;$('roboReset').onclick=()=>{roboLog=[];roboWrite('093_robo_log_v1',[]);roboHome()};$('roboForm').onsubmit=e=>{e.preventDefault();roboAsk($('roboInput').value);$('roboInput').value=''};$('roboLog').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.entry){const k=tlKB().find(x=>x.id===b.dataset.entry);if(k){roboPush('user',k.q);roboPush('bot',roboEntry(k))}}else if(b.dataset.group){const g=window.TL_GROUPS.find(x=>x.id===b.dataset.group);roboPush('bot',`<h3>${esc(g.name)}</h3><div class="robo-chips">${roboChips(tlKB().filter(x=>x.g===g.id))}</div>`)}else if(b.dataset.record)showRecord(b.dataset.record)};const b=$('roboFab');let start=null,moved=false;b.onpointerdown=e=>{if(e.button!==0)return;const r=b.getBoundingClientRect();start={x:e.clientX,y:e.clientY,left:r.left,top:r.top};moved=false;b.setPointerCapture(e.pointerId)};b.onpointermove=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>6)moved=true;if(!moved)return;b.style.animation='none';b.style.left=Math.max(8,Math.min(innerWidth-68,start.left+dx))+'px';b.style.top=Math.max(8,Math.min(innerHeight-68,start.top+dy))+'px';b.style.right='auto';b.style.bottom='auto'};b.onpointerup=()=>{if(!start)return;start=null;if(moved){const r=b.getBoundingClientRect();roboWrite('093_robo_position',{x:r.left/innerWidth,y:r.top/innerHeight})}else roboToggle()};b.onpointercancel=()=>{start=null};b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();roboToggle()}};roboPosition();addEventListener('resize',roboPosition);addEventListener('keydown',e=>{if(e.key==='Escape')roboToggle(false)});const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){$('roboMic').disabled=true;$('roboMic').title='Trình duyệt chưa hỗ trợ giọng nói'}else{$('roboMic').onclick=()=>{const sr=new SR();sr.lang='vi-VN';sr.onresult=e=>{$('roboInput').value=e.results[0][0].transcript;$('roboVoiceNote').textContent='Đã nhận giọng nói. Kiểm tra nội dung rồi bấm gửi.'};sr.onerror=()=>{$('roboVoiceNote').textContent='Không nhận được giọng nói. Bạn có thể gõ câu hỏi.'};$('roboVoiceNote').textContent='Micro do trình duyệt xử lý, có thể cần mạng và gửi âm thanh tới dịch vụ nhận giọng nói.';try{sr.start()}catch{}}}}

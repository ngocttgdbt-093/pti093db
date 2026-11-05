export const XO_NAMES={'XO':'Bảo hiểm xe ô tô (Tổng hợp)','XO.1':'TNDS xe ô tô đối với người thứ ba và hành khách','XO.2':'TNDS của chủ xe đối với hàng hoá trên xe','XO.3':'Tai nạn lái phụ xe và người ngồi trên xe','XO.4':'Bảo hiểm vật chất xe ô tô'};
export function validateXoReport(input){
 const fail=m=>{throw Error(m)};
 const date=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))fail('Không đọc được kỳ báo cáo');const d=new Date(s+'T00:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==s)fail('Ngày báo cáo không hợp lệ');return s};
 const from=date(input.from),to=date(input.to);if(from!==to.slice(0,4)+'-01-01'||to<from)fail('Cần báo cáo lũy kế từ 01/01 đến ngày chốt trong cùng năm');
 if(!Array.isArray(input.rows)||input.rows.length!==5)fail('Cần đủ XO và XO.1–XO.4');
 const rows=Object.keys(XO_NAMES).map(code=>{const matches=input.rows.filter(r=>r.code===code);if(matches.length!==1)fail('Thiếu hoặc trùng mã '+code);const r=matches[0],o={code,name:XO_NAMES[code]};
  for(const k of ['revenue','resolved','outstanding','total','prior','sourceRate']){if(typeof r[k]!=='number'||!Number.isFinite(r[k])||Math.abs(r[k])>1e16)fail(code+': thiếu hoặc sai cột '+k);o[k]=r[k]}
  if(o.revenue<0)fail(code+': doanh thu âm, cần kiểm tra nguồn');if(Math.abs(o.total-o.resolved-o.outstanding)>2)fail(code+': Tổng cộng không bằng đã giải quyết + chưa giải quyết');
  o.rate=o.revenue?100*(o.total-o.prior)/o.revenue:null;if(o.rate!==null&&Math.abs(o.rate-o.sourceRate)>.011)fail(code+': tỷ lệ tính lại lệch báo cáo');return o;
 });
 for(const key of ['revenue','resolved','outstanding','total','prior'])if(Math.abs(rows[0][key]-rows.slice(1).reduce((n,r)=>n+r[key],0))>5)fail('Tổng XO không khớp XO.1–XO.4 ở '+key);
 return {from,to,year:Number(to.slice(0,4)),rows};
}
export function parseXoPages(pages){
 let text='',rows=[];
 for(const p of pages){text+=' '+p.items.map(i=>i.str).join(' ');const codes=p.items.filter(i=>/^XO(?:\.\d+)*$/.test(i.str.trim())&&i.x<p.width*.1);
  const line=c=>p.items.filter(i=>Math.abs(i.y-c.y)<2&&i.x>p.width*.25&&/^\s*-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\s*$/.test(i.str)).sort((a,b)=>a.x-b.x);
  const full=codes.map(line).find(a=>a.length===9);if(!full&&codes.some(c=>XO_NAMES[c.str.trim()]))throw Error('Không nhận diện được đủ 9 cột số liệu PDF');if(!full)continue;
  const anchors=full.map(i=>i.x+i.width);
  for(const c of codes){const code=c.str.trim();if(!XO_NAMES[code])continue;const a=line(c),cols=Array(9).fill(0),seen=new Set();for(const item of a){const right=item.x+item.width;const diffs=anchors.map(x=>Math.abs(x-right));const index=diffs.indexOf(Math.min(...diffs));if(diffs[index]>4||seen.has(index))throw Error(code+': cột số liệu không rõ, không cập nhật');seen.add(index);cols[index]=Number(item.str.trim().replaceAll(',',''))}
   if(!seen.has(0)||!seen.has(8))throw Error(code+': thiếu doanh thu hoặc tỷ lệ');rows.push({code,revenue:cols[0],resolved:cols[4],outstanding:cols[5],total:cols[6],prior:cols[7],sourceRate:cols[8]});
  }
 }
 const dates=[...text.matchAll(/\b(\d{2})\/(\d{2})\/(\d{4})\b/g)].map(m=>`${m[3]}-${m[2]}-${m[1]}`);if(dates.length<2)throw Error('Không đọc được ngày bắt đầu và ngày chốt trong PDF');return validateXoReport({from:dates[0],to:dates[1],rows});
}

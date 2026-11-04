// Generated from lib/assistant/gdv.mjs.
const PTIGdv = (()=>{
const GDV_DIRECTORY = [
 {code:'NMN04',name:'Nguyễn Minh Ngọc',short:'Ngọc'},
 {code:'DXD04',name:'Đặng Xuân Diệu',short:'Diệu'},
 {code:'DXL05',name:'Đặng Xuân Linh',short:'Linh'},
 {code:'NTHUNG05',name:'Nguyễn Tuấn Hưng',short:'Hưng'},
 {code:'PTI\\HIENDV1',name:'Đặng Văn Hiên',short:'Hiên'},
 {code:'PTI\\THAIPD',name:'Phạm Duy Thái',short:'Thái'},
];
const gdvNorm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim();
function gdvLabel(code){const e=GDV_DIRECTORY.find(e=>e.code===code);return e?e.code+' · '+e.name:code}
function resolveGdvs(text){
 const raw=String(text??'').normalize('NFC').toLowerCase(),n=' '+gdvNorm(text)+' ';
 return GDV_DIRECTORY.filter(e=>{
  if([e.code,e.code.split('\\').at(-1),e.name].some(a=>n.includes(' '+gdvNorm(a)+' ')))return true;
  const word=gdvNorm(e.short),re=new RegExp('(^| )'+word+'(?= |$)','g');
  for(const hit of n.matchAll(re)){
   const before=n.slice(0,hit.index).trim(),after=n.slice(hit.index+hit[0].length).trim();
   // Common Vietnamese words must not silently select a person.
   if(word==='thai'&&(/(?:^| )trang$/.test(before)||/^(?:do|cuc|lan)(?: |$)/.test(after)))continue;
   if(word==='linh'&&/^(?:kien|hoat|vuc|hon)(?: |$)/.test(after))continue;
   if(word==='hien'&&!/(^|[^\p{L}])hiên(?=$|[^\p{L}])/u.test(raw)){
    if(/(^|[^\p{L}])hiện(?=$|[^\p{L}])/u.test(raw))continue;
    if(!/(?:^| )(?:cua|anh|chi|gdv|vien)$/.test(before)&&!(!before&&/^(?:con|co|dang|ton|bao nhieu|la ai)(?: |$)/.test(after))&&!(n.trim()==='hien'))continue;
   }
   return true;
  }
  return false;
 }).map(e=>e.code);
}

return {GDV_DIRECTORY,gdvLabel,resolveGdvs};
})();

// Generated from lib/import/claim-logic.mjs.
const PTIClaimLogic = (() => {
// Shared business rules for browser reports and server import reconciliation.
function claimId(row) { return String(row['Số HSBT'] ?? '').trim(); }
function claimMoney(value) {
 if(value == null || String(value).trim() === '' || value === '-') return 0;
 if(typeof value === 'number') { if(Number.isFinite(value)) return value; throw Error('Số tiền không hợp lệ'); }
 return String(value).split(';').reduce((total, part) => {
  const text=part.trim();
  if(!/^-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/.test(text)) throw Error('Không đọc được số tiền: '+value);
  return total+Number(text.replaceAll(',',''));
 },0);
}
function claimIndex(data) {
 return {resolved:new Map(data.g.map(row=>[claimId(row),row])),backlog:new Map(data.t.map(row=>[claimId(row),row]))};
}
function claimResult(row,index) {
 const resolved=index.resolved.get(claimId(row));
 const source=resolved || index.backlog.get(claimId(row)) || row;
 const rawStatus=String(source['Trạng thái hồ sơ'] ?? '').trim();
 const estimate=claimMoney(source['Tiền ước/duyệt BT']);
 let status=rawStatus || 'Chưa xác định trạng thái';
 let value=estimate,paid=resolved ? claimMoney(source['Tiền BT đã trả cho GR']) : 0;
 if(rawStatus === '-') {
  if(!resolved) status='TNDS chưa giải quyết';
  else {
   const rawPaid=source['Tiền BT đã trả cho KH'];
   const missing=rawPaid == null || String(rawPaid).trim()==='' || rawPaid==='-';
   const customerPaid=claimMoney(rawPaid);
   if(missing || customerPaid<0 || estimate<0) {
    status='TNDS chờ đối soát';paid=0;
   } else {
    // Includes 0/0 and previous-year claims, as confirmed by the owner.
    status=customerPaid===0 ? 'TNDS nhập huỷ' : 'TNDS đã giải quyết';
    value=customerPaid;paid=customerPaid;
   }
  }
 }
 return {status,value,paid,rawStatus,estimate};
}

return {claimId,claimMoney,claimIndex,claimResult};
})();

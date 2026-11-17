// Sinh chuỗi VietQR (EMVCo) kèm CRC16-CCITT
const tlv=(i,v)=>i+String(v.length).padStart(2,"0")+v;
function crc16(s){let c=0xFFFF;for(let k=0;k<s.length;k++){c^=s.charCodeAt(k)<<8;for(let i=0;i<8;i++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,"0")}
function vietqr(bin,acc,amount,note){
 const m=tlv("00","A000000727")+tlv("01",tlv("00",bin)+tlv("01",acc))+tlv("02","QRIBFTTA");
 const p=tlv("00","01")+tlv("01","12")+tlv("38",m)+tlv("53","704")+(amount>0?tlv("54",String(amount)):"")+tlv("58","VN")+tlv("62",tlv("08",note))+"6304";
 return p+crc16(p)}

if(typeof module!=="undefined")module.exports={tlv,crc16,vietqr};

const test=require("node:test"),assert=require("node:assert");
const {crc16,vietqr,tlv}=require("../js/vietqr.js");
test("CRC16-CCITT-FALSE chuẩn",()=>{assert.equal(crc16("123456789"),"29B1")});
test("tlv ghép đúng độ dài",()=>{assert.equal(tlv("54","50000"),"540550000")});
test("payload VietQR hợp lệ và CRC khớp",()=>{
  const p=vietqr("970436","0123456789",150000,"Chia tien xang");
  assert.ok(p.startsWith("000201010212"));assert.ok(p.includes("A000000727"));assert.ok(p.includes("5303704"));
  assert.ok(p.includes("0006970436"));assert.equal(crc16(p.slice(0,-4)),p.slice(-4));
});

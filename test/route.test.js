const test=require("node:test"),assert=require("node:assert");
const {findCity,legKm,norm}=require("../js/route.js");
test("tìm thành phố không dấu, không phân biệt hoa thường",()=>{assert.equal(findCity("hue").name,"Huế");assert.equal(findCity("DA NANG").name,"Đà Nẵng");assert.equal(findCity("abc"),null)});
test("norm bỏ dấu tiếng Việt",()=>{assert.equal(norm("Đà Lạt"),"dalat")});
test("Huế – Đà Nẵng ước lượng 80–110 km",()=>{const a=findCity("Huế"),b=findCity("Đà Nẵng");const d=legKm(a,b);assert.ok(d>80&&d<110,String(d))});

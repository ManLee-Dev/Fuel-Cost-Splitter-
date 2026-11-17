const test=require("node:test"),assert=require("node:assert");
const {computeCost}=require("../js/cost.js");
test("100 km, 2 L/100km, 20.000đ/lít, phí phụ 10.000, 4 người",()=>{
  const r=computeCost({oneWay:100,l100:2,price:20000,extra:10000,people:4});
  assert.equal(r.liters,2);assert.equal(r.total,50000);assert.equal(r.per,13000);
});
test("khứ hồi nhân đôi quãng đường",()=>{assert.equal(computeCost({oneWay:50,roundTrip:true}).km,100)});
test("hệ số đèo dốc làm tăng lượng xăng",()=>{assert.equal(computeCost({oneWay:100,l100:2,factor:1.25}).liters,2.5)});
test("số người không hợp lệ được đưa về 1",()=>{assert.equal(computeCost({oneWay:10,l100:10,price:10000,people:0}).people,1)});

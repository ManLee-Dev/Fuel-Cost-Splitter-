// Logic tính chi phí thuần túy, không đụng DOM nên test được
function computeCost({oneWay=0,roundTrip=false,l100=0,factor=1,price=0,extra=0,people=1}){
  const km=oneWay*(roundTrip?2:1);
  const liters=km*l100/100*factor;
  const fuelCost=liters*price;
  const n=Math.max(1,Math.floor(people||1));
  const total=fuelCost+(extra||0);
  const per=Math.ceil(total/n/1000)*1000;
  return {km,liters,fuelCost,extra:extra||0,total,per,people:n};
}
if(typeof module!=="undefined")module.exports={computeCost};

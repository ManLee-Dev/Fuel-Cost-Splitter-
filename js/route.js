// Tuyến đường. Thay legKm bằng OSRM/Google Directions khi triển khai thật.
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase().replace(/[^a-z0-9]/g,"");
// Route provider: thay hàm này bằng OSRM/Google Directions khi triển khai thật.
function legKm(a,b){const R=6371,r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dn=r(b.lng-a.lng);
 const h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))*1.25}
const cityList=()=>typeof CITIES!=="undefined"?CITIES:require("./data.js").CITIES;
function findCity(q){const n=norm(q);if(!n)return null;const L=cityList();let c=L.find(x=>norm(x[0])===n)||L.find(x=>norm(x[0]).includes(n)||n.includes(norm(x[0])));return c?{name:c[0],lat:c[1],lng:c[2]}:null}


if(typeof module!=="undefined")module.exports={norm,legKm,findCity};

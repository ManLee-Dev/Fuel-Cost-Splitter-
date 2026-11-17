// Giao diện và xử lý sự kiện
const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString("vi-VN");
let geoPt=null,curQR=null,vIdx=0;


function init(){
 $("cities").innerHTML=CITIES.map(c=>`<option value="${c[0]}">`).join("");
 $("vehicles").innerHTML=VEHICLES.map((v,i)=>`<button type="button" class="chip" data-i="${i}" aria-pressed="false"><b>${v[0]}</b><span>${v[1]} L/100km, ${v[2]}</span></button>`).join("");
 $("fuel").innerHTML=Object.entries(FUELS).map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join("");
 $("bank").innerHTML=BANKS.map(b=>`<option value="${b[1]}">${b[0]}</option>`).join("");
 $("vehicles").addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;pickVehicle(+b.dataset.i)});
 pickVehicle(0);
 $("addwp").onclick=()=>{const d=document.createElement("div");d.className="wp";d.innerHTML='<input list="cities" placeholder="Điểm dừng" aria-label="Điểm dừng trung gian" autocomplete="off"><button type="button" class="btn ghost sm" aria-label="Xóa điểm dừng">Xóa</button>';d.querySelector("button").onclick=()=>{d.remove();calc()};$("wps").appendChild(d);d.querySelector("input").focus()};
 $("geo").onclick=getGeo;
 $("from").addEventListener("input",()=>{geoPt=null});
 $("fuel").onchange=()=>{$("price").value=FUELS[$("fuel").value][1];calc()};
 $("l100").oninput=()=>{document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed","false"));calc()};
 document.addEventListener("input",calc);document.addEventListener("change",calc);
 $("mkqr").onclick=makeQR;
 $("copy").onclick=copyMsg;
 calc();
}
function pickVehicle(i){vIdx=i;const v=VEHICLES[i];$("l100").value=v[1];
 document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",String(+c.dataset.i===i)));
 $("fuel").value=v[3]==="d"?"d":"r95";$("price").value=FUELS[$("fuel").value][1];calc()}
function getGeo(){const w=$("routewarn");
 if(!navigator.geolocation){w.textContent="Trình duyệt không hỗ trợ định vị. Hãy gõ điểm xuất phát.";return}
 $("geo").textContent="Đang định vị...";
 navigator.geolocation.getCurrentPosition(p=>{
  geoPt={lat:p.coords.latitude,lng:p.coords.longitude};
  let best=null,bd=1e9;CITIES.forEach(c=>{const d=legKm(geoPt,{lat:c[1],lng:c[2]});if(d<bd){bd=d;best=c[0]}});
  $("from").value="Vị trí hiện tại (gần "+best+")";$("geo").textContent="Vị trí hiện tại";calc()},
 ()=>{$("geo").textContent="Vị trí hiện tại";w.textContent="Không lấy được vị trí. Hãy cho phép định vị hoặc gõ tên điểm xuất phát."},{timeout:10000})}

function calc(){
 const warn=[];const man=parseFloat($("kmman").value);let oneWay=0,pts=[];
 const names=[];
 const from=geoPt?{...geoPt,name:$("from").value}:findCity($("from").value);
 if(!from&&$("from").value.trim())warn.push("Chưa nhận diện điểm xuất phát");
 const mids=[...$("wps").querySelectorAll("input")].map(i=>i.value.trim()).filter(Boolean).map(v=>({v,c:findCity(v)}));
 mids.forEach(m=>{if(!m.c)warn.push("Chưa nhận diện điểm dừng \""+m.v+"\"")});
 const to=findCity($("to").value);if(!to&&$("to").value.trim())warn.push("Chưa nhận diện điểm đến");
 if(from&&to&&!mids.some(m=>!m.c)){pts=[from,...mids.map(m=>m.c),to];for(let i=1;i<pts.length;i++)oneWay+=legKm(pts[i-1],pts[i])}
 if(man>0)oneWay=man;
 $("routewarn").textContent=warn.length?warn.join(". ")+". Chọn từ gợi ý hoặc nhập số km thủ công.":"";
 $("routehint").textContent=pts.length&&!(man>0)?"Ước lượng một chiều: "+fmt(oneWay)+" km qua "+pts.length+" điểm.":"";
 const l100=+$("l100").value;$("l100v").textContent=l100.toFixed(1);
 const {km,liters,fuelCost,extra,total,per,people}=computeCost({oneWay,roundTrip:$("round").checked,l100,factor:+$("road").value,price:+$("price").value,extra:+$("extra").value,people:+$("people").value});
 window.R={km,liters,fuelCost,extra,total,per,people,from:$("from").value,to:$("to").value};
 $("rsub").textContent=(from&&to||man>0)?(($("from").value||"Điểm đi")+" → "+($("to").value||"Điểm đến")+($("round").checked?" (khứ hồi)":"")):"Nhập lộ trình để xem kết quả";
 $("lines").innerHTML=[["Tổng quãng đường",fmt(km)+" km"],["Nhiên liệu tiêu thụ",liters.toFixed(1)+" lít"],["Tiền nhiên liệu",fmt(fuelCost)+" đ"],["Phí cầu đường, phụ",fmt(extra)+" đ"],["Tổng chi phí",fmt(total)+" đ"],["Chia cho",people+" người"]].map(r=>`<div class="line"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("");
 $("per").textContent=fmt(per)+" đ";
 $("msg").value=`Chia tiền xăng chuyến ${$("from").value||"..."} → ${$("to").value||"..."}${$("round").checked?" (khứ hồi)":""}\nQuãng đường ${fmt(km)} km, ${liters.toFixed(1)} lít, tổng ${fmt(total)} đ.\nMỗi người ${fmt(per)} đ (${people} người).`+($("acc").value?`\nChuyển khoản: ${BANKS.find(b=>b[1]===$("bank").value)[0]} ${$("acc").value} ${$("accname").value.toUpperCase()}`:"");
}

function makeQR(){
 const w=$("qrwarn");w.textContent="";const acc=$("acc").value.replace(/\s/g,"");
 if(!/^\d{6,19}$/.test(acc)){w.textContent="Số tài khoản cần 6 đến 19 chữ số.";return}
 if(!window.R||R.per<=0){w.textContent="Hãy nhập lộ trình để có số tiền cần thu.";return}
 if(typeof qrcode==="undefined"){w.textContent="Không tải được thư viện QR. Kiểm tra kết nối mạng và tải lại trang.";return}
 const payload=vietqr($("bank").value,acc,R.per,"Chia tien xang");
 const q=qrcode(0,"M");q.addData(payload);q.make();
 $("qrimg").src=q.createDataURL(6,4);$("qrbox").hidden=false;
 $("qrcap").textContent=($("accname").value.toUpperCase()||acc)+" – "+fmt(R.per)+" đ";calc()}
async function copyMsg(){const t=$("msg");try{await navigator.clipboard.writeText(t.value);$("copied").textContent="Đã sao chép"}catch(e){t.select();$("copied").textContent="Đã chọn sẵn, hãy bấm Sao chép của điện thoại"}}
init();

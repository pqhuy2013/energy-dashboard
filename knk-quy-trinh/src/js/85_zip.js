/* ---------- Loi ZIP cho .xlsx va .docx ----------
   Lay tu bo ghi xlsx.js trong qcvn04-2017/index.html: ZIP luu thang (method 0), CRC32,
   ten file UTF-8. .xlsx va .docx deu la file ZIP chua cac phan XML.
   files: [{ n:'duong/dan.xml', s:'noi dung chuoi' }] */
var ZIP=(function(){
  var TBL=(function(){ var tb=new Uint32Array(256),c,n,k;
    for(n=0;n<256;n++){ c=n; for(k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; tb[n]=c>>>0; } return tb; })();
  function crc32(u8){ var c=0xFFFFFFFF,i; for(i=0;i<u8.length;i++) c=TBL[(c^u8[i])&0xFF]^(c>>>8); return (c^0xFFFFFFFF)>>>0; }
  var enc=new TextEncoder();
  function dosTime(d){ return ((d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()/2))&0xFFFF; }
  function dosDate(d){ return (((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate())&0xFFFF; }
  function nen(files,mime){
    var d=new Date(), tm=dosTime(d), dt=dosDate(d);
    var parts=[], central=[], off=0;
    files.forEach(function(f){
      var data=enc.encode(f.s), crc=crc32(data), n=enc.encode(f.n);
      var h=new Uint8Array(30+n.length), v=new DataView(h.buffer);
      v.setUint32(0,0x04034b50,true); v.setUint16(4,20,true); v.setUint16(6,0x0800,true);
      v.setUint16(8,0,true); v.setUint16(10,tm,true); v.setUint16(12,dt,true);
      v.setUint32(14,crc,true); v.setUint32(18,data.length,true); v.setUint32(22,data.length,true);
      v.setUint16(26,n.length,true); v.setUint16(28,0,true); h.set(n,30);
      parts.push(h,data);
      var c=new Uint8Array(46+n.length), cv=new DataView(c.buffer);
      cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true);
      cv.setUint16(8,0x0800,true); cv.setUint16(10,0,true); cv.setUint16(12,tm,true); cv.setUint16(14,dt,true);
      cv.setUint32(16,crc,true); cv.setUint32(20,data.length,true); cv.setUint32(24,data.length,true);
      cv.setUint16(28,n.length,true); cv.setUint32(42,off,true); c.set(n,46);
      central.push(c);
      off+=h.length+data.length;
    });
    var cLen=central.reduce(function(a,b){ return a+b.length; },0);
    var e=new Uint8Array(22), ev=new DataView(e.buffer);
    ev.setUint32(0,0x06054b50,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true);
    ev.setUint32(12,cLen,true); ev.setUint32(16,off,true);
    return new Blob(parts.concat(central,[e]),{ type:mime });
  }
  return { nen:nen };
})();
/* Thoat ky tu cho XML, bo ky tu dieu khien khong hop le trong XML 1.0 */
var KY_TU_CAM=new RegExp('['+String.fromCharCode(0)+'-'+String.fromCharCode(8)+String.fromCharCode(11)+String.fromCharCode(12)+String.fromCharCode(14)+'-'+String.fromCharCode(31)+']','g');
function xmlEsc(s){
  s=String(s==null?'':s).replace(KY_TU_CAM,'');
  /* XML 1.0 cung cam U+FFFE, U+FFFF va nua cap thay the dung le (dan tu chuong trinh khac) */
  var out='';
  for(var i=0;i<s.length;i++){
    var c=s.charCodeAt(i);
    if(c===0xFFFE || c===0xFFFF) continue;
    if(c>=0xD800 && c<=0xDBFF){ var d=s.charCodeAt(i+1); if(d>=0xDC00 && d<=0xDFFF){ out+=s.charAt(i)+s.charAt(i+1); i++; } continue; }
    if(c>=0xDC00 && c<=0xDFFF) continue;
    out+=s.charAt(i);
  }
  return out.replace(/[&<>"]/g,function(m){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]; });
}
function taiBlob(blob,name){
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
}

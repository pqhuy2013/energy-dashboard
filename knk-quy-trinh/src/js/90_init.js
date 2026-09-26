/* ---------- khoi dong ---------- */
function init(){
  store.probe();
  var l=store.get(KEY_LANG); if(l==='en'||l==='vi') L=l;
  /* phien luu tam tu lan truoc */
  var raw=store.get(KEY), rawM=store.get(KEY_META);
  if(raw){
    try{
      var o=JSON.parse(raw), m=rawM?JSON.parse(rawM):{};
      if(isObj(o) && typeof o.phienBan==='number' && o.phienBan<=PHIEN_BAN && isObj(o.coSo)){
        o=chuanHoa(o);
        if(coNoiDung(o)){ S=o; SAVED={ s:o, m:isObj(m)?m:{} }; if(isObj(m)) Object.keys(M).forEach(function(k){ if(k in m) M[k]=m[k]; }); }
      }
    }catch(e){ /* du lieu luu tam hong: bo qua, bat dau ho so trong */ }
  }
  if(inFrame()){ $('qt-frame').hidden=false; $('qt-full').hidden=false; }
  $('qt-home').addEventListener('click',function(){ go('dau'); });
  $('qt-vi').addEventListener('click',function(){ setLang('vi'); });
  $('qt-en').addEventListener('click',function(){ setLang('en'); });
  $('qt-save').addEventListener('click',taiVe);
  $('qt-strip-save').addEventListener('click',taiVe);
  $('qt-open').addEventListener('click',moFile);
  $('qt-load').addEventListener('click',moFile);
  $('qt-file').addEventListener('change',function(){ if(this.files && this.files[0]) docFile(this.files[0]); });
  $('qt-new').addEventListener('click',kyMoi);
  $('qt-resume').addEventListener('click',function(){ go('buoc-'+(M.buocCuoi||0)); });
  $('qt-full').addEventListener('click',moToanManHinh);
  ganForm();
  document.addEventListener('input',onNhap);
  document.addEventListener('change',onNhap);
  document.addEventListener('click',onBam);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !$('qt-modal').hidden) ACT.dongTra(); });
  $('qt-modal').addEventListener('click',function(e){ if(e.target===this) ACT.dongTra(); });
  window.addEventListener('hashchange',function(){ go(location.hash.slice(1),true); });
  var h=location.hash.slice(1);
  cur=(h==='dau'||/^buoc-[0-8]$/.test(h))?h:'dau';
  applyLang();
  dienForm();
}
init();

/* ---------- dong trang thai ---------- */
function veStrip(){
  var s=$('qt-strip'), m=$('qt-strip-msg');
  s.hidden=false; s.classList.toggle('qt-dirty', M.coThayDoi);
  if(M.coThayDoi) m.textContent=t('stripDirty');
  else if(M.taiVeLuc) m.textContent=fill(t('stripSaved'),{t:gio(M.taiVeLuc)});
  else if(M.napTuFile) m.textContent=fill(t('stripLoaded'),{f:M.napTuFile,t:gio(M.napLuc)});
  else m.textContent=t('stripBlank');
}
function veNavFoot(){
  var st=$('qt-store-state');
  st.className=store.ok?'':'qt-bad';
  st.textContent=store.ok ? t('storeOk')+(M.luuTamLuc?' '+fill(t('storeLast'),{t:gio(M.luuTamLuc)}):'') : t('storeBad');
  $('qt-build').textContent=fill(t('build'),{d:dmyv(BUILD)});
}
function veHome(){
  $('qt-home-nostore').hidden=store.ok;
  var c=$('qt-c-resume');
  if(SAVED){
    c.hidden=false;
    var ky=(SAVED.s.ky.namBatDau&&SAVED.s.ky.namKetThuc)?SAVED.s.ky.namBatDau+'–'+SAVED.s.ky.namKetThuc:t('noky');
    $('qt-resume-info').textContent=fill(t('resumeinfo'),{ n:SAVED.s.coSo.ten.trim()||t('noname'), k:ky, t:gio(SAVED.m.luuTamLuc||SAVED.s.ngayCapNhat) });
  } else c.hidden=true;
}

/* ---------- ngon ngu ---------- */
function applyLang(){
  document.documentElement.lang=L;
  document.querySelectorAll('[data-i]').forEach(function(e){ e.textContent=t(e.dataset.i); });
  $('qt-vi').classList.toggle('on',L==='vi'); $('qt-en').classList.toggle('on',L==='en');
  document.title = L==='vi' ? 'Quy trình kiểm kê khí nhà kính cấp cơ sở' : 'Facility GHG inventory procedure';
  veMenu(); vePanes(); veSelects(); veB0(); veTra(); veStrip(); veNavFoot(); veHome();
  go(cur,true);
}
function setLang(l){ L=l; store.set(KEY_LANG,l); applyLang(); }

function veHet(){ dienForm(); veStrip(); veNavFoot(); veHome(); veMenuState(); }

/* ---------- Bo ghi .docx ----------
   Dung loi ZIP cua 85_zip.js. Chi co nhung gi ban thao Mau so 06 can: doan van, bang co
   gop o ngang (gridSpan) va doc (vMerge), dau trang co so trang tu trang 2, kho A4.
   Trinh bay theo the thuc van ban hanh chinh cua Nghi dinh 30/2020/ND-CP: Times New
   Roman 14, le tren 20 mm, duoi 20 mm, trai 30 mm, phai 20 mm, so trang giua le tren.

   Thu tu phan tu trong pPr, rPr, tcPr, tblPr, sectPr theo luoc do ECMA-376, vi Word bao
   loi khi sai thu tu du LibreOffice van mo duoc.

   Run: { x, b, i, u, hl (to vang), sub, sup, co (co chu pt) }. Chu so duoi ₀-₉ trong x
   duoc doi ra chu so thuong dat o vi tri chi so duoi, vi phong Times New Roman khong
   chac co cac ky tu nay. */
var DX=(function(){
  var W='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  var RONG=9071;   /* be rong vung chu: 11906 - 1701 - 1134 */
  var SO_DUOI='₀₁₂₃₄₅₆₇₈₉';
  function rPr(r){
    var s='';
    if(r.b) s+='<w:b/><w:bCs/>';
    if(r.i) s+='<w:i/><w:iCs/>';
    if(r.co) s+='<w:sz w:val="'+Math.round(r.co*2)+'"/><w:szCs w:val="'+Math.round(r.co*2)+'"/>';
    if(r.hl) s+='<w:highlight w:val="yellow"/>';
    if(r.u) s+='<w:u w:val="single"/>';
    if(r.sub) s+='<w:vertAlign w:val="subscript"/>';
    else if(r.sup) s+='<w:vertAlign w:val="superscript"/>';
    return s ? '<w:rPr>'+s+'</w:rPr>' : '';
  }
  function mot(r){ return '<w:r>'+rPr(r)+'<w:t xml:space="preserve">'+xmlEsc(r.x)+'</w:t></w:r>'; }
  function run(r){
    var x=String(r.x==null?'':r.x); if(!x) return '';
    if(r.sub || r.sup) return mot(r);
    var out='', buf='';
    for(var i=0;i<x.length;i++){
      var k=SO_DUOI.indexOf(x[i]);
      if(k<0){ buf+=x[i]; continue; }
      if(buf){ out+=mot(gan(r,{ x:buf })); buf=''; }
      out+=mot(gan(r,{ x:String(k), sub:true }));
    }
    if(buf) out+=mot(gan(r,{ x:buf }));
    return out;
  }
  function gan(a,b){ var o={}, k; for(k in a) o[k]=a[k]; for(k in b) o[k]=b[k]; return o; }
  /* o: can ('left','center','right','both'), thut (thut dong dau, twip), trai, phai, treo (thut treo),
        truoc, sau (twip), dong (khoang cach dong, 240 = don), giu (keepNext), vien (duong ke duoi),
        co, b (ap cho moi run khong tu dat) */
  function p(runs,o){
    o=o||{};
    var pp='';
    if(o.giu) pp+='<w:keepNext/>';
    if(o.vien) pp+='<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/></w:pBdr>';
    pp+='<w:spacing w:before="'+(o.truoc==null?60:o.truoc)+'" w:after="'+(o.sau==null?60:o.sau)+'" w:line="'+(o.dong||276)+'" w:lineRule="auto"/>';
    if(o.thut || o.trai || o.phai || o.treo){
      pp+='<w:ind w:left="'+(o.trai||0)+'" w:right="'+(o.phai||0)+'"'+(o.treo?' w:hanging="'+o.treo+'"':(o.thut?' w:firstLine="'+o.thut+'"':''))+'/>';
    }
    pp+='<w:jc w:val="'+(o.can||'both')+'"/>';
    if(o.coDau) pp+='<w:rPr><w:sz w:val="'+(o.coDau*2)+'"/><w:szCs w:val="'+(o.coDau*2)+'"/></w:rPr>';
    var body=(runs||[]).map(function(r){
      if(typeof r==='string') r={ x:r };
      var q=gan(r,{}); if(o.co && !q.co) q.co=o.co; if(o.b && q.b==null) q.b=true; if(o.i && q.i==null) q.i=true;
      return run(q);
    }).join('');
    return '<w:p><w:pPr>'+pp+'</w:pPr>'+body+'</w:p>';
  }
  var VIEN_CO='<w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/></w:tblBorders>';
  var VIEN_KHONG='<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>';
  /* spec: { rong:[twip], hang:[{ dau:bool, o:[cell] }], vien:bool, co:pt }
     cell: { r:[run] | x, doan:[[runs,o]...], b, can, gop, rs, nen, doc:'center' } */
  function bang(spec){
    var rong=spec.rong, co=spec.co||12, cho=[], choGop=[];
    function tcPr(w,gop,vm,nen,doc){
      return '<w:tcPr><w:tcW w:w="'+w+'" w:type="dxa"/>'+(gop>1?'<w:gridSpan w:val="'+gop+'"/>':'')+
        (vm?'<w:vMerge'+(vm==='dau'?' w:val="restart"':'')+'/>':'')+
        (nen?'<w:shd w:val="clear" w:color="auto" w:fill="'+nen+'"/>':'')+
        '<w:vAlign w:val="'+(doc||'top')+'"/></w:tcPr>';
    }
    function rongGop(c0,n){ var s=0; for(var i=c0;i<c0+n;i++) s+=rong[i]||0; return s; }
    function noi(c0){ var g=choGop[c0]; cho[c0]--; return '<w:tc>'+tcPr(rongGop(c0,g),g,'tiep')+p([],{ truoc:20, sau:20, dong:240, co:co })+'</w:tc>'; }
    var hang=spec.hang.map(function(h){
      var out='', c=0;
      h.o.forEach(function(cell){
        while(cho[c]>0){ var g0=choGop[c]; out+=noi(c); c+=g0; }
        var g=cell.gop||1, w=rongGop(c,g);
        var runs=cell.r || [{ x:cell.x==null?'':String(cell.x) }];
        var doan=cell.doan || [[runs,{}]];
        var ps=doan.map(function(d){
          return p(d[0],gan({ truoc:20, sau:20, dong:240, co:co, can:cell.can||'left', b:cell.b||h.dau, coDau:co },d[1]||{}));
        }).join('');
        out+='<w:tc>'+tcPr(w,g,cell.rs>1?'dau':null,cell.nen||(h.dau?'F2F2F2':null),cell.doc||(h.dau?'center':null))+ps+'</w:tc>';
        if(cell.rs>1){ cho[c]=cell.rs-1; choGop[c]=g; }
        c+=g;
      });
      while(c<rong.length){ if(cho[c]>0){ var g1=choGop[c]; out+=noi(c); c+=g1; } else c++; }
      return '<w:tr><w:trPr><w:cantSplit/>'+(h.dau?'<w:tblHeader/>':'')+'</w:trPr>'+out+'</w:tr>';
    }).join('');
    var tong=rong.reduce(function(a,b){ return a+b; },0);
    return '<w:tbl><w:tblPr><w:tblW w:w="'+tong+'" w:type="dxa"/>'+(spec.giua?'<w:jc w:val="center"/>':'')+
      (spec.vien===false?VIEN_KHONG:VIEN_CO)+'<w:tblLayout w:type="fixed"/>'+
      '<w:tblCellMar><w:left w:w="70" w:type="dxa"/><w:right w:w="70" w:type="dxa"/></w:tblCellMar></w:tblPr>'+
      '<w:tblGrid>'+rong.map(function(x){ return '<w:gridCol w:w="'+x+'"/>'; }).join('')+'</w:tblGrid>'+hang+'</w:tbl>';
  }
  /* Chia be rong vung chu theo ty le */
  function chia(tyLe,tong){
    tong=tong||RONG; var s=tyLe.reduce(function(a,b){ return a+b; },0), out=[], con=tong;
    tyLe.forEach(function(x,i){ var w=(i===tyLe.length-1)?con:Math.round(tong*x/s); out.push(w); con-=w; });
    return out;
  }
  var STYLES='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles '+W+'>'+
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>'+
    '<w:sz w:val="28"/><w:szCs w:val="28"/><w:lang w:val="vi-VN" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault>'+
    '<w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'+
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'+
    '<w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/></w:style>'+
    '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:semiHidden/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'+
    '<w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:semiHidden/></w:style>'+
    '</w:styles>';
  var SETTINGS='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings '+W+'><w:zoom w:percent="100"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/>'+
    '<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>';
  var HEADER='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr '+W+'><w:p><w:pPr><w:jc w:val="center"/></w:pPr>'+
    '<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>'+
    '<w:r><w:t>2</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:hdr>';
  function tao(body,tieuDe){
    var ns='xmlns="http://schemas.openxmlformats.org/package/2006/relationships"';
    var doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document '+W+'><w:body>'+body+
      '<w:sectPr><w:headerReference w:type="default" r:id="rId3"/><w:pgSz w:w="11906" w:h="16838"/>'+
      '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="567" w:footer="567" w:gutter="0"/>'+
      '<w:cols w:space="708"/><w:titlePg/><w:docGrid w:linePitch="381"/></w:sectPr></w:body></w:document>';
    var files=[
      { n:'[Content_Types].xml', s:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'+
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'+
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'+
        '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>'+
        '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'+
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'+
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>' },
      { n:'_rels/.rels', s:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships '+ns+'>'+
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'+
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'+
        '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>' },
      { n:'docProps/core.xml', s:propCore(tieuDe) }, { n:'docProps/app.xml', s:propApp('knk-quy-trinh') },
      { n:'word/_rels/document.xml.rels', s:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships '+ns+'>'+
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>'+
        '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/></Relationships>' },
      { n:'word/document.xml', s:doc }, { n:'word/styles.xml', s:STYLES }, { n:'word/settings.xml', s:SETTINGS }, { n:'word/header1.xml', s:HEADER }
    ];
    return ZIP.nen(files,'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }
  return { p:p, bang:bang, chia:chia, tao:tao, RONG:RONG };
})();

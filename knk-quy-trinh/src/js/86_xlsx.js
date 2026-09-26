/* ---------- Bo ghi .xlsx nhieu trang tinh ----------
   Phat trien tu xlsx.js cua qcvn04-2017/index.html (ban do chi co mot trang tinh, o chu):
   them nhieu trang tinh, o so, o cong thuc kem gia tri tinh san, dinh dang so, co dinh
   dong tieu de. Excel tinh lai toan bo cong thuc khi mo file (fullCalcOnLoad).

   Trang tinh: { ten, rong:[do rong cot], dong:[[o,...],...], gop:['A1:C1',...], coDinh:so dong }
   O: chuoi | so | null | { v, f:'cong thuc khong co dau =', s:'kieu' }
   Kieu: thuong, dau (tieu de cot), tieuDe, o (chu co khung), so, soDam, oDam, ghi, soTho, pt, nhan */
var XL=(function(){
  var KIEU={ thuong:0, dau:1, tieuDe:2, o:3, so:4, soDam:5, oDam:6, ghi:7, soTho:8, pt:9, nhan:10 };
  function cot(i){ var s=''; i++; while(i>0){ var m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=(i-m-1)/26; } return s; }
  function oXml(ref,c){
    if(c==null || c==='') return '';
    if(typeof c!=='object') c={ v:c };
    var s=KIEU[c.s!=null?c.s:(typeof c.v==='number'||c.f?'soTho':'thuong')]||0, a='<c r="'+ref+'" s="'+s+'"';
    if(c.f){
      var v=(typeof c.v==='number' && isFinite(c.v)) ? '<v>'+c.v+'</v>' : '';
      return a+'><f>'+xmlEsc(c.f)+'</f>'+v+'</c>';
    }
    if(typeof c.v==='number') return isFinite(c.v) ? a+'><v>'+c.v+'</v></c>' : '';
    if(c.v==null || c.v==='') return a+'/>';
    return a+' t="inlineStr"><is><t xml:space="preserve">'+xmlEsc(c.v)+'</t></is></c>';
  }
  function trang(sh){
    var rows=sh.dong.map(function(r,i){
      return '<row r="'+(i+1)+'">'+r.map(function(c,j){ return oXml(cot(j)+(i+1),c); }).join('')+'</row>';
    }).join('');
    var cols=(sh.rong||[]).map(function(w,i){ return '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>'; }).join('');
    var view=sh.coDinh ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="'+sh.coDinh+'" topLeftCell="A'+(sh.coDinh+1)+'" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
                       : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>';
    var mg=(sh.gop&&sh.gop.length) ? '<mergeCells count="'+sh.gop.length+'">'+sh.gop.map(function(m){ return '<mergeCell ref="'+m+'"/>'; }).join('')+'</mergeCells>' : '';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
      '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>'+view+
      (cols?'<cols>'+cols+'</cols>':'')+'<sheetData>'+rows+'</sheetData>'+mg+
      '<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>'+
      '<pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>';
  }
  var BIEN='<border><left style="thin"><color rgb="FF808080"/></left><right style="thin"><color rgb="FF808080"/></right><top style="thin"><color rgb="FF808080"/></top><bottom style="thin"><color rgb="FF808080"/></bottom><diagonal/></border>';
  function xf(numFmt,font,fill,border,align){
    return '<xf numFmtId="'+numFmt+'" fontId="'+font+'" fillId="'+fill+'" borderId="'+border+'" xfId="0"'+
      (numFmt?' applyNumberFormat="1"':'')+(font?' applyFont="1"':'')+(fill?' applyFill="1"':'')+(border?' applyBorder="1"':'')+
      ' applyAlignment="1"><alignment '+align+'/></xf>';
  }
  var STYLES='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
    '<numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0.000"/><numFmt numFmtId="165" formatCode="#,##0.00"/></numFmts>'+
    '<fonts count="5"><font><sz val="11"/><name val="Calibri"/></font>'+
    '<font><b/><sz val="11"/><name val="Calibri"/></font>'+
    '<font><b/><sz val="13"/><name val="Calibri"/></font>'+
    '<font><i/><sz val="10"/><color rgb="FF555555"/><name val="Calibri"/></font>'+
    '<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'+
    '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'+
    '<fill><patternFill patternType="solid"><fgColor rgb="FFEAF1F7"/><bgColor indexed="64"/></patternFill></fill></fills>'+
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>'+BIEN+'</borders>'+
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'+
    '<cellXfs count="11">'+
    xf(0,0,0,0,'wrapText="1" vertical="top"')+
    xf(0,1,2,1,'wrapText="1" vertical="center" horizontal="center"')+
    xf(0,2,0,0,'vertical="top"')+
    xf(0,0,0,1,'wrapText="1" vertical="top"')+
    xf(164,0,0,1,'vertical="top"')+
    xf(164,1,0,1,'vertical="top"')+
    xf(0,1,0,1,'wrapText="1" vertical="top"')+
    xf(0,3,0,0,'wrapText="1" vertical="top"')+
    xf(0,0,0,1,'vertical="top"')+
    xf(165,0,0,1,'vertical="top"')+
    xf(0,4,0,0,'vertical="top"')+
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><\/styleSheet>';
  /* Ten trang tinh: toi da 31 ky tu, khong co [ ] : * ? / \ */
  function tenTrang(s){ return String(s).replace(/[\[\]:*?\/\\]/g,' ').slice(0,31); }
  function tao(sheets,tieuDe){
    var ns='xmlns="http://schemas.openxmlformats.org/package/2006/relationships"';
    var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'+
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+
      sheets.map(function(s,i){ return '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('')+
      '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'+
      '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>';
    var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships '+ns+'>'+
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'+
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>';
    var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
      '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="16000" windowHeight="9000"/></bookViews><sheets>'+
      sheets.map(function(s,i){ return '<sheet name="'+xmlEsc(tenTrang(s.ten))+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>'; }).join('')+
      '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>';
    var wbr='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships '+ns+'>'+
      sheets.map(function(s,i){ return '<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>'; }).join('')+
      '<Relationship Id="rId'+(sheets.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    var files=[
      { n:'[Content_Types].xml', s:ct }, { n:'_rels/.rels', s:rels },
      { n:'docProps/core.xml', s:propCore(tieuDe) }, { n:'docProps/app.xml', s:propApp('knk-quy-trinh') },
      { n:'xl/workbook.xml', s:wb }, { n:'xl/_rels/workbook.xml.rels', s:wbr }, { n:'xl/styles.xml', s:STYLES }
    ];
    sheets.forEach(function(s,i){ files.push({ n:'xl/worksheets/sheet'+(i+1)+'.xml', s:trang(s) }); });
    return ZIP.nen(files,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
  return { tao:tao, cot:cot, tenTrang:tenTrang };
})();
/* Thuoc tinh tai lieu, dung chung cho .xlsx va .docx */
function propCore(tieuDe){
  var now=new Date().toISOString().replace(/\.\d+Z$/,'Z');
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
    '<dc:title>'+xmlEsc(tieuDe)+'</dc:title><dc:creator>knk-quy-trinh</dc:creator>'+
    '<dcterms:created xsi:type="dcterms:W3CDTF">'+now+'</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">'+now+'</dcterms:modified></cp:coreProperties>';
}
function propApp(app){
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>'+xmlEsc(app)+'</Application></Properties>';
}

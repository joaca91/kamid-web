// KAMID Formulario Servicio Tecnico v5
(function(){

  // --- HELPERS ---
  function gv(id){
    var el=document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function show(id){
    var el=document.getElementById(id);
    if(el) el.style.display='block';
  }
  function hide(id){
    var el=document.getElementById(id);
    if(el) el.style.display='none';
  }
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function bind(id, fn){
    var el=document.getElementById(id);
    if(el) el.addEventListener('click', fn);
  }

  // --- ESTADO ---
  var fd={tc:'',te:'',tags:[],nom:'',emp:'',suc:'',sec:'',tel:'',mail:'',mod:'',ser:'',desc:''};
  var cur=1;
  var tcL={propio:'Equipo propio',alquiler:'Equipo en alquiler'};
  var teL={
    'impresora-bn':'Impresora B/N',
    'impresora-color':'Impresora Color',
    'mf-bn':'Multifunción B/N',
    'mf-color':'Multifunción Color',
    'destructora':'Destructora de documentos',
    'plotter':'Plotter de impresión'
  };
  var eqIds={
    'impresora-bn':'eq-impbn',
    'impresora-color':'eq-impcol',
    'mf-bn':'eq-mfbn',
    'mf-color':'eq-mfcol',
    'destructora':'eq-dest',
    'plotter':'eq-plot'
  };

  // --- SELECCION DE OPCIONES ---
  function selOpt(field, val){
    if(field==='tc'){
      ['opt-propio','opt-alquiler'].forEach(function(id){
        var el=document.getElementById(id);
        if(el){ el.style.border='1.5px solid #e0e0e0'; el.style.background='#fff'; }
      });
      var sel=document.getElementById(val==='propio' ? 'opt-propio' : 'opt-alquiler');
      if(sel){ sel.style.border='1.5px solid #cc0000'; sel.style.background='rgba(204,0,0,0.04)'; }
      fd.tc=val;
      hide('e-tc');
    } else {
      Object.keys(eqIds).forEach(function(k){
        var el=document.getElementById(eqIds[k]);
        if(el){ el.style.border='1.5px solid #e0e0e0'; el.style.background='#fff'; }
      });
      var sel=document.getElementById(eqIds[val]);
      if(sel){ sel.style.border='1.5px solid #cc0000'; sel.style.background='rgba(204,0,0,0.04)'; }
      fd.te=val;
      hide('e-te');
    }
  }

  // --- TAGS ---
  function togTag(elId, label){
    var el=document.getElementById(elId);
    if(!el) return;
    var idx=fd.tags.indexOf(label);
    if(idx===-1){
      fd.tags.push(label);
      el.style.border='1.5px solid #cc0000';
      el.style.background='rgba(204,0,0,0.06)';
      el.style.color='#cc0000';
      el.style.fontWeight='bold';
    } else {
      fd.tags.splice(idx,1);
      el.style.border='1.5px solid #ddd';
      el.style.background='#fff';
      el.style.color='#555';
      el.style.fontWeight='normal';
    }
  }

  // --- NAVEGACION ---
  function go(target){
    if(target > cur && !vld(cur)) return;
    if(target===5) bldSum();
    document.getElementById('s'+cur).style.display='none';
    document.getElementById('s'+target).style.display='block';
    updProg(target);
    cur=target;
    var top=document.getElementById('kamid-prog');
    if(top) top.scrollIntoView({behavior:'smooth', block:'start'});
  }

  // --- PROGRESO ---
  function updProg(t){
    for(var i=1; i<=5; i++){
      var d=document.getElementById('dot'+i);
      var l=document.getElementById('lbl'+i);
      var ln=document.getElementById('ln'+i);
      if(!d) continue;
      if(i < t){
        d.style.background='#000'; d.style.borderColor='#000'; d.style.color='#fff'; d.style.fontSize='11px';
        d.textContent='✓';
        if(l){ l.style.color='#000'; l.style.fontWeight='normal'; }
        if(ln) ln.style.background='#000';
      } else if(i===t){
        d.style.background='#cc0000'; d.style.borderColor='#cc0000'; d.style.color='#fff'; d.style.fontSize='13px';
        d.textContent=i;
        if(l){ l.style.color='#cc0000'; l.style.fontWeight='bold'; }
      } else {
        d.style.background='#f0f0f0'; d.style.borderColor='#e0e0e0'; d.style.color='#aaa'; d.style.fontSize='13px';
        d.textContent=i;
        if(l){ l.style.color='#aaa'; l.style.fontWeight='normal'; }
        if(ln) ln.style.background='#e0e0e0';
      }
    }
  }

  // --- VALIDACION ---
  function vld(s){
    var ok=true;
    if(s===1){
      if(!fd.tc){ show('e-tc'); ok=false; }
    }
    if(s===2){
      fd.nom=gv('f-nom'); fd.emp=gv('f-emp'); fd.suc=gv('f-suc'); fd.sec=gv('f-sec'); fd.tel=gv('f-tel'); fd.mail=gv('f-mail');
      if(!fd.nom){ show('e-nom'); ok=false; } else { hide('e-nom'); }
      if(!fd.emp){ show('e-emp'); ok=false; } else { hide('e-emp'); }
      if(!fd.tel){ show('e-tel'); ok=false; } else { hide('e-tel'); }
      if(!fd.mail || fd.mail.indexOf('@')===-1){ show('e-mail'); ok=false; } else { hide('e-mail'); }
    }
    if(s===3){
      fd.mod=gv('f-mod'); fd.ser=gv('f-ser');
      if(!fd.te){ show('e-te'); ok=false; } else { hide('e-te'); }
      if(!fd.mod){ show('e-mod'); ok=false; } else { hide('e-mod'); }
    }
    if(s===4){
      fd.desc=gv('f-desc');
      // Descripción es obligatoria
      if(!fd.desc){ show('e-prob'); ok=false; } else { hide('e-prob'); }
    }
    return ok;
  }

  // --- RESUMEN ---
  function bldSum(){
    fd.desc=gv('f-desc'); fd.ser=gv('f-ser');

    document.getElementById('r-tc').textContent = tcL[fd.tc] || '—';

    var conHTML = esc(fd.nom)+' — '+esc(fd.emp);
    if(fd.suc) conHTML += ' · '+esc(fd.suc);
    if(fd.sec) conHTML += ' · '+esc(fd.sec);
    conHTML += '<br>'+esc(fd.tel)+' · '+esc(fd.mail);
    document.getElementById('r-con').innerHTML = conHTML;

    var eq=(teL[fd.te]||'—')+' · Modelo: '+esc(fd.mod)+(fd.ser ? ' · N° serie: '+esc(fd.ser) : '');
    document.getElementById('r-eq').textContent=eq;

    var p=fd.tags.join(', ');
    if(p && fd.desc) p+='\n';
    p+=fd.desc;
    document.getElementById('r-prob').textContent=p||'—';
  }

  // --- MENSAJE ---
  function buildMsg(){
    var msg = 'SOLICITUD DE SERVICIO TÉCNICO - KAMID\n'+
      'Tipo de cliente: '+(tcL[fd.tc]||'—')+'\n'+
      'Nombre: '+fd.nom+'\n'+
      'Empresa: '+fd.emp+'\n';
    if(fd.suc) msg += 'Sucursal/Dirección: '+fd.suc+'\n';
    if(fd.sec) msg += 'Sector/Piso: '+fd.sec+'\n';
    msg +=
      'Teléfono: '+fd.tel+'\n'+
      'E-mail: '+fd.mail+'\n'+
      'Equipo: '+(teL[fd.te]||'—')+'\n'+
      'Modelo: '+fd.mod+'\n'+
      'N° serie: '+(fd.ser||'No informado')+'\n'+
      'Problemas: '+(fd.tags.join(', ')||'Ninguno seleccionado')+'\n'+
      'Descripción: '+fd.desc;
    return msg;
  }

  // --- EMAIL ---
  function doEmail(){
    var txt=document.getElementById('btn-mail-txt');
    if(txt) txt.textContent='Enviando...';
    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        access_key:'TU_ACCESS_KEY_AQUI',
        subject:'Servicio Técnico - '+fd.emp+' ('+fd.nom+')',
        from_name:'Web KAMID - Formulario Servicio Técnico',
        replyto:fd.mail,
        message:buildMsg()
      })
    }).then(function(r){ return r.json(); }).then(function(d){
      if(d.success){
        document.getElementById('kamid-prog').style.display='none';
        document.getElementById('s5').style.display='none';
        document.getElementById('kamid-ok').style.display='block';
      } else {
        if(txt) txt.textContent='Error — intentá por WhatsApp';
      }
    }).catch(function(){
      if(txt) txt.textContent='Error de conexión — intentá por WhatsApp';
    });
  }

  // --- WHATSAPP ---
  function doWa(){
    window.open('https://api.whatsapp.com/send/?phone=541133073970&text='+encodeURIComponent(buildMsg())+'&type=phone_number&app_absent=0','_blank');
  }

  // --- INICIALIZAR EVENTOS ---
  function init(){
    bind('opt-propio',   function(){ selOpt('tc','propio'); });
    bind('opt-alquiler', function(){ selOpt('tc','alquiler'); });
    bind('btn-go2',      function(){ go(2); });

    bind('btn-back1',    function(){ go(1); });
    bind('btn-go3',      function(){ go(3); });

    bind('eq-impbn',     function(){ selOpt('te','impresora-bn'); });
    bind('eq-impcol',    function(){ selOpt('te','impresora-color'); });
    bind('eq-mfbn',      function(){ selOpt('te','mf-bn'); });
    bind('eq-mfcol',     function(){ selOpt('te','mf-color'); });
    bind('eq-dest',      function(){ selOpt('te','destructora'); });
    bind('eq-plot',      function(){ selOpt('te','plotter'); });
    bind('btn-back2',    function(){ go(2); });
    bind('btn-go4',      function(){ go(4); });

    bind('t-atasco',     function(){ togTag('t-atasco',   'Atascos de papel'); });
    bind('t-calidad',    function(){ togTag('t-calidad',  'Mala calidad de impresión'); });
    bind('t-calicop',  function(){ togTag('t-calicop','Mala calidad de copia'); });
    bind('t-noimp',      function(){ togTag('t-noimp',    'No imprime / no responde'); });
    bind('t-lineas',     function(){ togTag('t-lineas',   'Líneas o manchas en copias'); });
    bind('t-error',      function(){ togTag('t-error',    'Código de error en pantalla'); });
    bind('t-toner',      function(){ togTag('t-toner',    'Problema con tóner o cartucho'); });
    bind('t-escaner',    function(){ togTag('t-escaner',  'Problema con el escáner'); });
    bind('t-red',        function(){ togTag('t-red',      'No aparece en la red / Wi-Fi'); });
    bind('t-ruido',      function(){ togTag('t-ruido',    'Ruido inusual'); });
    bind('t-apagado',    function(){ togTag('t-apagado',  'No enciende'); });
    bind('t-alim',       function(){ togTag('t-alim',     'Problema con alimentación de hojas'); });
    bind('btn-back3',    function(){ go(3); });
    bind('btn-go5',      function(){ go(5); });

    bind('btn-back4',    function(){ go(4); });
    bind('btn-mail',     function(){ doEmail(); });
    bind('btn-wa',       function(){ doWa(); });
    bind('btn-wa-ok',    function(){ doWa(); });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

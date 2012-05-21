function processing(i,el){
 if (i){
  if(typeof onAJAX == "function") {onAJAX(el);}
 } else {
  if(typeof afterAJAX == "function") {afterAJAX(el);}
 }
}




Array.prototype.has=function(v){
 for (i=0;i<this.length;i++){ if (this[i].toLowerCase()==v.toLowerCase()) return true; }
 return false;
}






function addClassToSubmitWhenClicked(e) {
 var el;
 if (!e) var e = window.event;
 if (e.target) el = e.target; else if (e.srcElement) el = e.srcElement;
 if (el.nodeType == 3) el = el.parentNode;
 el.savestate=el.disabled;
 el.isclicked=true;
}




function riegelSerialize(a) {
 var getEls=Form.getElements(a);
 for (i=0; i < getEls.length; i++) {
  getEls[i].savestate=getEls[i].disabled;
  if (getEls[i].type=='submit' && getEls[i].isclicked == false) {
   getEls[i].disabled=true;
  }
  if (getEls[i].type=='submit' && getEls[i].isclicked ) {
   window.status=getEls[i].value+' in process...';
   window.waiting=window.status;
  }
  if (getEls[i].type=='button') {
   getEls[i].disabled=true;
  }
 }
 var getserial=Form.serialize(a);
 for (i=0; i < getEls.length; i++) {
  getEls[i].disabled=getEls[i].savestate;
  getEls[i].isclicked=false;
 }
 return getserial;
}





function ajaxInputs(c,evt,url) {
 if (typeof evt == 'undefined'){evt='change';}
 var event,q,input;
 for (q=0; q<3; q++)
 {
  if (q == 0){
   input=document.getElementsByTagName('select');
  } else if (q==1){
   input=document.getElementsByTagName('input');
  } else {
   input=document.getElementsByTagName('textarea');
  }
  for (i=0; i<input.length; i++)
  {
   if (input[i].className.indexOf(c) != -1 || input[i].getAttribute(c) != null )
   {
    if (typeof url == 'undefined' && input[i].form != null){
     var theaction=input[i].form.action;
     var themethod=input[i].form.method;
    } else if (typeof url == 'undefined'){
     var theaction=null;
     var themethod=null;
    } else {
     var theaction=url;
     var themethod='POST';
    }
    if (theaction != null) {
     logit('ajax added to input..."'+input[i].name+'"',input[i].form.action);
     event=evt;
     if ((Prototype.Browser.IE) && (evt == 'change') && (input[i].type == 'checkbox' || input[i].type == 'radio')){
      event='click';
     }
     ev=false;
     if (input[i].getAttribute(c)){
      ev=input[i].getAttribute(c);
     }
     if (ev != '') {
      event=ev.split(' ');
     } else {
      event=event.split(' ');
     }
     for (x=0; x < event.length; x++) {
      $(input[i]).observe(event[x],

       (function(el)
       {
        return function (e)
        {
         // we use closure so that we can capture el
         var buttons='', inputs='';
         if (el.nodeName == 'SELECT'){
          inputArray=document.getElementsByTagName('option');
         } else {
          inputArray=document.getElementsByTagName('input');
         }
         for (i=0; i < inputArray.length; i++) {
          if (inputArray[i].type == "submit") {
           buttons=buttons+'&'+inputArray[i].name+'=ERROR';
          }
          if (el.type == 'checkbox' && el.nodeName == 'INPUT'){
           if (inputArray[i].type == 'checkbox' && inputArray[i].nodeName == 'INPUT' && inputArray[i].checked){
            inputs=inputs+'&'+inputArray[i].name+'='+escape(inputArray[i].value);
           }
          } else if ( el.nodeName == "SELECT" ){
           if (inputArray[i].nodeName == 'OPTION' && inputArray[i].selected){
            inputs=inputs+'&'+el.name+'='+escape(inputArray[i].value);
           }
          } else {
           inputs='&'+el.name+'='+escape(el.value);
          }
         }
         if (el.type == 'checkbox' && el.nodeName == 'INPUT'){
          inputs=inputs+'&AESTIVACVNLIST='+escape(el.name);
         }
         if (el.nodeName == 'SELECT'){
          inputs=inputs+'&AESTIVACVNLIST='+escape(el.name);
         }
         el.event=e.type;
         el.eventobject=e;
//       doAJAX(el,theaction,themethod,'ajaxrequest=TRUE&ajax.clicked='+escape(el.name)+riegelSerialize(el));  // This version would submit the entire form
         doAJAX(el,theaction,themethod,'ajaxrequest=TRUE&AJAX.clicked='+escape(el.name)+inputs+buttons   );    // This version only submits the buttons and the element
        };
       })(input[i])
      );

     }
    }
   }
  }
 }
}







function ajaxForms(c) {
 var inputArray =  document.getElementsByTagName('input');
 for (i=0; i < inputArray.length; i++) {
  if (inputArray[i].type == "submit") {
   inputArray[i].isclicked=false;
   inputArray[i].onclick=addClassToSubmitWhenClicked;
  }
 }
 var forms= document.getElementsByTagName('form');
 for (i=0; i<forms.length; i++)
 {
  if (forms[i].className.indexOf(c) != -1 || forms[i].getAttribute(c) != null )
  {
   logit('ajax added to form...',forms[i].action);
   forms[i].onsubmit=function (e)
   {
    // First we need to identify the target div. That will get stored in el
    var el;
    if (!e) var e = window.event;
    if (e.target) el = e.target; else if (e.srcElement) el = e.srcElement;
    if (el.nodeType == 3) el = el.parentNode;
    if (el.saveaction && el.action.substr(0,6) == "status") {el.action=el.saveaction;}
    return runForm(el);
   }
  }
 }
}












function ajaxAnchors(c) {
 var overlayArray =  document.getElementsByTagName('a');
 for (i=0; i < overlayArray.length; i++)
 {
  if (overlayArray[i].className.indexOf(c) != -1 || overlayArray[i].getAttribute(c) != null ){
   overlayArray[i].onclick=
    (function(el){
     return function (e){
      $(el).event=e;
      doAJAX(el,el.href,'GET','ajaxrequest=TRUE');
      return false;
     };
    })(overlayArray[i]);
  }
 }
}









/**
*
*  AJAX IFRAME METHOD (AIM)
*  http://www.webtoolkit.info/
*
**/
AIM = {
 frame : function(f,c) {
  var n = 'f' + Math.floor(Math.random() * 99999);
  var d = document.createElement('DIV');
  d.innerHTML = '<iframe style="display:none;" src="about:blank" id="'+n+'" name="'+n+'" onload="AIM.loaded(\''+f.id+'\',\''+n+'\')"></iframe>';
  document.body.appendChild(d);
  var i = document.getElementById(n);
  if (c && typeof(c.onComplete) == 'function') {i.onComplete = c.onComplete;}
  return n;
 },
 form : function(f, name) {f.setAttribute('target', name);},
 submit : function(f, c) {
  // Added By Terry Riegel
  document.getElementsByName('ajaxrequest')[0].value="IFRAME";
  AIM.form(f, AIM.frame(f,c));
  if (c && typeof(c.onStart) == 'function') {
   return c.onStart();
  } else {
   return true;
  }
 },
 loaded : function(f,id) {
  var i = document.getElementById(id);
  if (typeof i.contentDocument != "undefined" && i.contentDocument) {
   var d = i.contentDocument;
  } else if (typeof i.contentWindow != "undefined" && i.contentWindow) {
   var d = i.contentWindow.document;
  } else {
   var d = window.frames[id].document;
  }
  if (typeof d != "undefined" && d.location.href == "about:blank") {
   return;
  }
  var q='NOCONTENT';
  try {
   var x=d.body.getElementsByTagName("pre");
   if (x.length == 1) {q=x[0].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");} else {q=d.body.innerHTML;}
   eval(q);
  } catch (error){ }

  if (f=='') {} else {
   var tf=$(f);
   if(typeof tf == "object"){
    if(typeof processing == "function") {processing(false,tf);}
   } else {
    if(typeof processing == "function") {processing(false);}
   }
  }
  if (window.waiting == window.status) {window.status='Done.'; window.waiting=false;}
  logit('ajaxForms',q);
  returnErrorCheck(q,'AIMonComplete');
  clearImage="undefined";
  if (document.getElementById(id)) {
   setTimeout(function(){document.getElementById(id).parentNode.removeChild(document.getElementById(id));},15000);
  }
 }
}





function doAJAX(element,action,method,params){
 //-----------------------------------------------------------
 // alert(element+'|'+action+'|'+method+'|'+params);
 //-----------------------------------------------------------
     var proc=true;
     if(typeof processing == "function") {proc=processing(true,element);}
     if (proc == false){return proc;}
     new Ajax.Request(
      action,
      {
       method: method,
       parameters: params,
       encoding: 'UTF-8',
       onCreate: function(t){
       },
       onException: function(request,exception){
        var t=request.transport;
        if(typeof processing == "function") {processing(false,element);}
        if (window.waiting == window.status) {window.status='Done.'; window.waiting=false;}
        logit('ajaxForms('+t.id+')',t.responseText);
        if (typeof onscreendebug == "undefined" || onscreendebug != true) {} else {showReturn('ajaxForms('+t.id+')',t.responseText);}
        returnErrorCheck(t.responseText,'onException');
        clearImage="undefined";
       },
       onFailure: function(t){
        if(typeof processing == "function") {processing(false,element);}
        if (window.waiting == window.status) {window.status='Done.'; window.waiting=false;}
        logit('ajaxForms('+t.id+')',t.responseText);
        if (typeof onscreendebug == "undefined" || onscreendebug != true) {} else {showReturn('ajaxForms('+t.id+')',t.responseText);}
        returnErrorCheck(t.responseText,'onFailure');
        clearImage="undefined";
       },
       onComplete: function(t){
        if(typeof processing == "function") {processing(false,element);}
        if (window.waiting == window.status) {window.status='Done.'; window.waiting=false;}
        logit('ajaxForms('+t.id+')',t.responseText);
        if (typeof onscreendebug == "undefined" || onscreendebug != true) {} else {showReturn('ajaxForms('+t.id+')',t.responseText);}
        temp=returnErrorCheck(t.responseText,'onComplete');
        clearImage="undefined";
       }
      }
     );
 //-----------------------------------------------------------
}





function runForm(el){
 var proc=true , el=$(el);
 if (el){
    if (el.saveaction && el.action.substr(0,6) == "status") {el.action=el.saveaction;}
    // Ok we first scan the form to see if it has any file elements. If so then we need an alternate plan
    var getEls=Form.getElements(el);
    var hasfilefield=false;
    for (i=0; i < getEls.length; i++) {
      if (getEls[i].type=='file') {
       if (getEls[i].value != ""){
        hasfilefield=true;
       }
      }
    }
    if(typeof useAIM == "undefined") useAIM=false;
    if (hasfilefield || useAIM){
     if(typeof processing == "function") {proc=processing(true,el);}
     if (proc == false){return proc;}
     if (typeof document.getElementsByName('ajaxrequest')[0] == 'undefined'){
      var newdiv = document.createElement("input");
      newdiv.setAttribute('type','hidden');
      newdiv.setAttribute('name','ajaxrequest');
      newdiv.setAttribute('value','error');
      el.insertBefore(newdiv,el.firstChild);
     }
     if (typeof document.getElementsByName('ajax_var')[0] == 'undefined'){
      var newdiv = document.createElement("input");
      newdiv.setAttribute('type','hidden');
      newdiv.setAttribute('name','ajax_var');
      newdiv.setAttribute('value','error');
      el.insertBefore(newdiv,el.firstChild);
     }
     el.action=el.action.replace('?ajaxrequest=IFRAME','')+'?ajaxrequest=IFRAME';
     AIM.submit(el);
     // The AIM method doesn't actually submit the form, it simply creates a new target
     // that is why we end this with return true, the browser will do the submission
     return true;
    } else {
     doAJAX(el,el.action,el.method,'ajaxrequest=TRUE&ajax_var=ERROR&'+riegelSerialize(el));
     return false;
    }
 }
}





function runOverlay(url,id){
 id=$(id);
 if (typeof id == 'undefined') {id=document;}
 doAJAX(id,url,'GET','ajaxrequest=TRUE');
 return false;
}





function runAnchor(id){
 id=$(id);
 doAJAX(id,id.href,'GET','ajaxrequest=TRUE');
 return false;
}





function returnErrorCheck(t,kind){

  if (t=="NOCONTENT"){
   report('error','IFRAME ERROR');
   clearImage="undefined";
  }
  if(typeof clearImage == "undefined" || clearImage == "undefined") {
   var browserDims = $(document.body).getDimensions();
   var y  = (browserDims.height - 300);
   var x = (browserDims.width - 300);
   var styles = { zIndex: 100000000 ,position: 'absolute', top: '150px',left: '150px', backgroundColor:'#336699', width: x+'px', height: y+'px', overflow: 'auto', padding: '10px', border: '5px solid #dddddd'};
   var w
   w = document.createElement('DIV');
   Element.setStyle(w,styles);
   if (t==''){t='ERROR Retrieving XHR Request.';}
   if (t=='NOCONTENT'){t='ERROR Retrieving IFRAME Request.';}

   temp ='<pre>'+t.replace(/</g,'&lt;').replace(/\\n/g,'<br>').replace(/\\\//g,'/').replace(/\\\"/g,'"').replace(/\\\'/g,"'")+'</pre>';
   if (left(t,19) == "clearImage='START';"){
     temp1='(x) error found in javascript ('+kind+').'
     temp ='<pre>'+t.replace(/</g,'&lt;').replace(/\\n/g,'<br>').replace(/\\\//g,'/').replace(/\\\"/g,'"').replace(/\\\'/g,"'")+'</pre>';

   } else if (t.indexOf("<!-- Engine: Aestiva HTML/OS") === -1) {
     // looks like an Aestiva Page response
     temp1='(x) Unexpected Session Response from ajaxrequest ('+kind+').'
     temp=t


   } else if(kind=='onException'){
     temp1='(x) Unexpected Response from ajaxrequest ('+kind+').'
     temp='<pre>'+t.replace(/</g,'&lt;').replace(/\\n/g,'<br>').replace(/\\\//g,'/').replace(/\\\"/g,'"').replace(/\\\'/g,"'")+'</pre>';


   } else {
     temp1='(x) Unexpected Response from ajaxrequest ('+kind+').'
     temp='AJAX Response Expected, HTML Page returned instead.<br>Your overlay should end with an ajaxgoto(), like this...<br>o=AJAXgoto("index.html")<hr>or...<br>perhaps AJAX was applied to a normal link. If so remove the AJAX option from your anchor tag.<hr>'+temp;
   }



   w.innerHTML = '<div style="background-color: #bbbbbb; height: 15px; font-family: Verdana; font-size: 10px;">'+temp1+'</div><div style="background-color: #ffffff;">'+temp+'</div>';
   document.body.appendChild(w);
   Event.observe(w,'click',function(){document.body.removeChild(w);});
   report('error',temp1+' '+t.url);
   return true;
  }
  return false;
}



function showReturn(f,t){
   var browserDims = $(document.body).getDimensions();
   var y  = (browserDims.height - 300);
   var x = (browserDims.width - 300);
   var styles = { zIndex: 100000000 ,position: 'absolute', top: '150px',left: '150px', backgroundColor:'#eeeeee', width: x+'px', height: y+'px', overflow: 'auto', padding: '10px', border: '5px solid #dddddd'};
   var w
   w = document.createElement('DIV');
   Element.setStyle(w,styles);
   if (t==''){t='--empty--';}
   w.innerHTML = '<div style="background-color: #bbbbbb; height: 15px; font-family: Verdana; font-size: 10px;">AJAX Response:</div><div style="background-color: #ffffff;"><pre>'+t.replace(/</g,'&lt;').replace(/\\n/g,'<br>').replace(/\\\//g,'/').replace(/\\\"/g,'"').replace(/\\\'/g,"'")+'</pre></div>';
   document.body.appendChild(w);
   Event.observe(w,'click',function(){document.body.removeChild(w);});
   return true;
}




function logit(f,t) {
 if (typeof debug == "undefined" || debug != true) {} else {report('info',f); report('log',t.replace(/\\n/g,'\r\n').replace(/\\\//g,'/').replace(/\\\"/g,'"').replace(/\\\'/g,"'"));}
}





function report(t,m) {
 if (typeof console.info != "undefined") {
  if (t.toLowerCase() == 'error') console.error(m);
  if (t.toLowerCase() == 'info')  console.info(m);
  if (t.toLowerCase() == 'log')   console.log(m);
 } else {
  if (t.toLowerCase() == 'error') window.status='ERROR: '+m;
 }
}





function setDIV(a,b) {
 return function(q){
  if (q) {
   if (typeof $(a).saveHTML == "undefined" || $(a).saveHTML == "ERROR" ){
    $(a).saveHTML=$(a).innerHTML;
    $(a).innerHTML=b;
   }
  } else {
   if ($(a).saveHTML != "ERROR" ){
    $(a).innerHTML=$(a).saveHTML;
    $(a).saveHTML='ERROR';
   }
  }
  return true;
 };
}




function checkIn(l,p){
// if (typeof checkIn == undefined && typeof checkIn.stop != "function" ) {} else {checkIn.stop();}
 checkIn = new PeriodicalExecuter(
  function(pe){
   new Ajax.Request(l,{
     method: 'GET',
     parameters: 'ajaxrequest=TRUE',
     encoding: 'UTF-8',
     onComplete: function(t){
        logit('checkin()',t.responseText);
        if (returnErrorCheck(t.responseText,'onComplete')) {checkIn.stop();}
        clearImage="undefined";
     }
    });
    return false;
  },
  p);
}



function left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}
function right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}
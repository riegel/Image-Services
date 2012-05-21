   function onAJAX(el){
    if(el.id=='saveform' && CLEAR.f.getvalue('iswebcast')[0]){
     var timestring=padlength(serverdate.getHours())+":"+padlength(serverdate.getMinutes())+":"+padlength(serverdate.getSeconds());
     var q=CLEAR.f.dialog('Time Stamp','<h1 style="text-align: center; margin:auto; padding:20px; font-size: 40pt;">'+timestring+'</h1>');
     var f=function(){document.body.removeChild(q);}
     setTimeout(f,1500);
    }

    spinner(true);

    if($('minimize').value == '1'){
     $('txtarea_min').value=jsmin('', $('txtarea').value, 2);
    } else {
     $('txtarea_min').value='ERROR';
    }

   }





   function afterAJAX(el){
    spinner(false);
   }

   function swapHTML(a,b) {
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




   function doSearchValue() {
    if ($('searchtext').value == '') {$('searchtext').value='SEARCH'; $('larrow').style.display = "none"; $('rarrow').style.display = "none"; $('sbg').style.display = "none";}
   }





   function doSearchValueFocus() {
    if ($('searchtext').value == 'SEARCH') {$('searchtext').value=''; $('larrow').style.display = "block"; $('rarrow').style.display = "block"; $('sbg').style.display = "block";}
   }





   function searchArea(){
    var txtarea=$('txtarea')
    var srch=$('searchtext')
    if (srch.value == "SEARCH") {
      srch.focus();
    } else {
      txtarea.focus();
      se=cp || 0;
      se=txtarea.value.substr(0,se).replace(/\r/g,'').length
      text=txtarea.value.toLowerCase().replace(/\r/g,'')
      if ( text.substr(se,srch.value.length) == srch.value.toLowerCase()) {se=se+srch.value.length+1;}
      var results = text.substr(se,text.length).indexOf(srch.value.toLowerCase());
      if (results == -1) {
       se=0;
       results = text.substr(se,text.length).indexOf(srch.value.toLowerCase());
      }
      if (results != -1) {
       results=results+se;
       setSelectionRange(txtarea,results,results+srch.value.length);
       windowstatus(countLines());
      }
     }
   }





   function setSelectionRange(input, selectionStart, selectionEnd) {
    var q;
    if (input.setSelectionRange) {
     input.setSelectionRange(selectionStart, selectionEnd);
     q=countLine();
//   input.scrollTop=q[0]*13-(10*13);
    } else if (input.createTextRange) {
     var range = input.createTextRange();
     range.collapse(true);
     range.moveEnd('character', selectionEnd);
     range.moveStart('character', selectionStart);
     range.select();
    }
   }





   function backSearchArea(){
    var txtarea=$('txtarea')
    var srch=$('searchtext')
    if (srch.value == "SEARCH") {
      srch.focus();
    } else {
      txtarea.focus();
      se=cp || 0;
      se=txtarea.value.substr(0,se).replace(/\r/g,'').length
      text=txtarea.value.toLowerCase().replace(/\r/g,'')
      var results = text.substr(0,se).lastIndexOf(srch.value.toLowerCase());
      if (results == -1) {
       results = text.substr(0,text.length).lastIndexOf(srch.value.toLowerCase());
      }
      if (results != -1) {
       setSelectionRange(txtarea,results,results+srch.value.length);
       windowstatus(countLines());
      }
     }
   }





   function checkSave(e) {
    var kc;
    if (e && e.which) {e=e; kc=e.which;} else{e=event; kc=e.keyCode;}
    if (kc == 9 && !e.shiftKey) {if ($('searchtext').value != '' && $('searchtext').value != 'SEARCH'){searchArea();}  }
    if (kc == 9 && e.shiftKey) {if ($('searchtext').value != '' && $('searchtext').value != 'SEARCH'){backSearchArea();}  }
    if (kc == 27){
     if ($('searchtext').value != '' && $('searchtext').value != 'SEARCH')
      {$('searchtext').value='SEARCH'; $('searchtext').focus();}
     else
      {$('searchtext').focus();}
    }
    windowstatus(countLines());
    return false;
   }





   function resizetextarea() {
    var id='txtarea';
    var ison=true;
    var winW = 630, winH = 460;


// var D=document.viewport.getDimensions();

var D=CLEAR.f.getDimensions();


winW=D.width-16;
winH=D.height-38;


    if (dosplit) {
     if (winW>0) $('txtarea').style.width=parseInt((winW/2)-4)+"px";
     if (winW>0) $('splittxtarea').style.width=parseInt((winW/2)-4)+"px";
     if (winH>0) $('txtarea').style.height=winH+"px";
     if (winH>0) $('splittxtarea').style.height=winH+"px";
     if (winH>0) $('splittxtarea').style.display="block";
    } else {
     if (winW>0) $('txtarea').style.width=winW+"px";
     if (winH>0) $('txtarea').style.height=winH+"px";
     if (winH>0) $('splittxtarea').style.display="none";
    }




   }


   function textareawidth() {
    var id='txtarea';
    var ison=true;
    var winW = 630, winH = 460;
    if (parseInt(navigator.appVersion)>3) {
     if (navigator.appName=="Netscape") {
      winW = window.innerWidth-8;
      winH = window.innerHeight-27-4;
     }
     if (navigator.appName.indexOf("Microsoft")!=-1) {
      winW = document.body.clientWidth-8;
      winH = document.body.clientHeight-27-4;
     }
    }
    return winW;
   }




   function countLine(){
    var obj = $('txtarea');
    var b;
    var cp;
    var ce;
    var str;
    var q;

    cp = cursorPosition() || 0;
    ce = obj.value.substr(0,cp).replace(/\r/g,'').length
    var str = obj.value.substr(0, cp);
    try {
     q=((str.match(/[^\n]*\n[^\n]*/gi).length)+1);
    } catch(e) {
     q=1
    }
    b=[];
    b[0]=q;
    b[1]=ce;
    return b;
   }


   function countLines(){
    var obj = $('txtarea');
    cp = cursorPosition() || 0;
    ce = obj.value.substr(0,cp).replace(/\r/g,'').length
    var str = obj.value.substr(0, cp);
    try {
     q=((str.match(/[^\n]*\n[^\n]*/gi).length)+1);
    } catch(e) {
     q=1
    }
    return 'Line: '+q+' Char: '+ce;
   }





   function cursorPosition(){
    var textarea = document.getElementById("txtarea");
    if (typeof(textarea.selectionStart) == 'number') {
     return textarea.selectionStart;
    } else if(document.selection){
     var selection_range = document.selection.createRange().duplicate();
     if (selection_range.parentElement() == textarea) {
      var before_range = document.body.createTextRange();
      before_range.moveToElementText(textarea);
      before_range.setEndPoint("EndToStart", selection_range);
      var after_range = document.body.createTextRange();
      after_range.moveToElementText(textarea);
      after_range.setEndPoint("StartToEnd", selection_range);
      var before_finished = false, selection_finished = false, after_finished = false;
      var before_text, untrimmed_before_text, selection_text, untrimmed_selection_text, after_text, untrimmed_after_text;
      before_text = untrimmed_before_text = before_range.text;
      selection_text = untrimmed_selection_text = selection_range.text;
      after_text = untrimmed_after_text = after_range.text;
      do {
       if (!before_finished) {
        if (before_range.compareEndPoints("StartToEnd", before_range) == 0) {
         before_finished = true;
        } else {
         before_range.moveEnd("character", -1)
         if (before_range.text == before_text) {
          untrimmed_before_text += "\r\n";
         } else {
          before_finished = true;
         }
        }
       }
       if (!selection_finished) {
        if (selection_range.compareEndPoints("StartToEnd", selection_range) == 0) {
         selection_finished = true;
        } else {
         selection_range.moveEnd("character", -1)
         if (selection_range.text == selection_text) {
          untrimmed_selection_text += "\r\n";
         } else {
          selection_finished = true;
         }
        }
       }
       if (!after_finished) {
        if (after_range.compareEndPoints("StartToEnd", after_range) == 0) {
         after_finished = true;
        } else {
         after_range.moveEnd("character", -1)
         if (after_range.text == after_text) {
          untrimmed_after_text += "\r\n";
         } else {
          after_finished = true;
         }
        }
       }
      } while ((!before_finished || !selection_finished || !after_finished));
      var untrimmed_text = untrimmed_before_text + untrimmed_selection_text + untrimmed_after_text;
      var untrimmed_successful = false;
      if (textarea.value == untrimmed_text) {
       untrimmed_successful = true;
      }
      var startPoint = untrimmed_before_text.length;
      return startPoint;
     }
    }
   }




function windowstatus(x){
 window.status=x;
 if (window.status==''){
  $('message').innerHTML=x;
 }
}

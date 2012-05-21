/*********
* Modifications made by Terry Riegel August 3, 2006
* to work with HTMLOS scripting engine.
*
* Mofified by Terry Riegel November 12, 2007 to work with
* updated ajax calls from thomas.epineer.se
* and also removed the prototype.js dependencies
* Works with Aestiva's HTML/OS, and
* Clear Image Media's Image Services.
* also modified ajax code for compatability with Safari 3.
*
*
* Javascript for file upload demo
* Copyright (C) Tomas Larsson 2006
* http://tomas.epineer.se/
*
* Licence:
* The contents of this file are subject to the Mozilla Public
* License Version 1.1 (the "License"); you may not use this file
* except in compliance with the License. You may obtain a copy of
* the License at http://www.mozilla.org/MPL/
* 
* Software distributed under this License is distributed on an "AS
* IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
* implied. See the License for the specific language governing
* rights and limitations under the License.
*
*/




document.getElementsByClassName = function(cl) {
var retnode = [];
var myclass = new RegExp('\\b'+cl+'\\b');
var elem = this.getElementsByTagName('*');
for (var i = 0; i < elem.length; i++) {
var classes = elem[i].className;
if (myclass.test(classes)) retnode.push(elem[i]);
}
return retnode;
};





function $() {
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);
		if (arguments.length == 1)
			return element;
		elements.push(element);
	}
	return elements;
}







function reverse(o)
{
  var s = "";
  var i = o.length;
  while (i>0) {
   s += o.substring(i-1,i);
   i--; }
  return s;
}

function chopright(t,a)
{ var b='';
  if (t.search(a)<0)
  {b=t;}
  else
  {b=t.substring(0,t.search(a));}
  return b;
}










function beginUpload(t,url)
 {
  document.formx.submit();
  var pb  = $('formx_progress');
  $('formx_uploadbutton').style.visibility = "hidden";
  new PeriodicalAjax(url,'',3,2,function(request){updateProgress(pb,request)},function(request){updateFailure(pb,request)})
 }



function updateProgress(pb,req)
 {
  var a = req.responseText.split("|");
  var percent = parseInt(a[0]);
  var text = a[1];
  if(!percent) percent = 0;
  $('formx_progress').style.width=percent+'%';
  $('formx_progresstext').innerHTML = text;
 }





function updateFailure(pb,req) {
  var mes = req.responseText;
  pb.style.width=0;
  $('formx_progresstext').innerHTML = mes;
}





function PeriodicalAjax(url, parameters, frequency, decay, onSuccess, onFailure) {
 function createRequestObject() {
  var xhr;
  try {
   xhr = new XMLHttpRequest();
  }
  catch (e) {
   xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xhr;
 }	
 function send() {
  if(!stopped) {
   // This is because of a bug in Firefox.
   // see https://bugzilla.mozilla.org/show_bug.cgi?id=313646
   if (navigator.userAgent.indexOf("Firefox")>0) xhr.open('get', url+'?'+Math.random(), true); else xhr.open('get', url+'?'+Math.random(), false);
   xhr.onreadystatechange = function() { self.onComplete(); };
   xhr.send(null);
  }
 }
 this.stop = function() {
  stopped = true;
  clearTimeout(this.timer);
 }
 this.start = function() {
  stopped = false;
  this.onTimerEvent();
 }




 this.onComplete = function() {
  if(this.stopped) return false;
  if ( xhr.readyState == 4) {
   if(xhr.status == 200) {
    if(xhr.responseText == lastResponse) {
     decay = decay * originalDecay;
    } else {
     decay = 1;
    }
    lastResponse = xhr.responseText;
    if(onSuccess instanceof Function) {
     onSuccess(xhr);
    }
    this.timer = setTimeout(function() { self.onTimerEvent(); }, decay * frequency * 1000);
   } else {
    if(onFailure instanceof Function) {
     onFailure(xhr);
    }
   }
  }
 }
 this.getResponse = function() {
  if(xhr.responseText) {
   return xhr.responseText;
  }
 }
 this.onTimerEvent = function() {
  send();
 }
 var self = this;
 var stopped = false;
 var originalDecay = decay || 1.2;
 decay = originalDecay;
 var xhr = createRequestObject();
 var lastResponse = "";
 this.start();
}
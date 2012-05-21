window.onload = jsinit;
function detailsinit()
{
 togspinner('OFF');
 getlist();
}
function docommand(cmd)
{
 togspinner('ON');
 if (cmd=='file|' || cmd=='folder|')
 {
  top.frames['browse'].document.browseformhere["fm_cmd"].value = cmd;
  top.frames['browse'].document.browseformhere.submit();
 }

 {
  top.frames['browse'].document.browseform["fm_cmd"].value = cmd;
  populatelist();
  top.frames['browse'].document.browseform.submit();
 }
}
function jsinit()
{
   if (!document.getElementById) { alert('No way to traverse DOM'); return; }
   var daList = document.getElementById("filelist");
   if (!daList) { alert('Missing File Listing'); return; }
   var daItems = daList.getElementsByTagName("DIV");
   if (!daItems) { alert('No files found!'); return; }
   for (iItem=0; iItem < daItems.length; iItem++)
    {
     var o=daItems[iItem]
     var a=o.className.split(' ');
     var q=o.id;
     var nm=getthename(q);

     o.ondblclick = doubleclick;
     o.onclick = textclick;
     newimg=document.createElement('IMG');
     newimg.src='/apps/imageservices/images/'+a[2].toLowerCase()+'-small.gif';
     if(nm.substr(0,5)=='{BAD}'){}else{
      newimg.onclick=iconclick;
     }
     o.appendChild(newimg);
     newSpan=document.createElement('SPAN');
     newText=document.createTextNode(' '+ decodeURIComponent(nm.replace('{BAD}','')));
     newSpan.appendChild(newText);
     o.appendChild(newSpan);
    }
   drawpath(document.browseform["destination"].value);
   if (document.browseform["fm_cmd"].value=='goto')
    {
     document.browseform["fm_cmd"].value='';
     top.frames['details'].window.location.href=document.browseform["fm_url"].value;
    }
   getlist();
   togspinner('OFF');

   if (typeof browse == 'function'){browse();}

}













function getlist()
  {
   if (!top.frames['browse'].document.getElementById) { alert('No way to traverse DOM'); return; }
   var daList = top.frames['browse'].document.getElementById("filelist");
   if (!daList) { alert('Missing File Listing'); return; }
   var daItems = daList.getElementsByTagName("DIV");
   if (!daItems) { alert('No files found!'); return; }
   var thelist='';
   var aselection='';
   for (iItem=0; iItem < daItems.length; iItem++)
    {
     var o=daItems[iItem];
     var c=o.className.split(' ');
     var nm=getthename(o.id);
     if (c[0]=='sel') 
     {
      aselection='TRUE';
      if (c[2]=='dir')
       { thelist=thelist+nm+'/|'; }
      else
       { thelist=thelist+nm+'|'; }
     }
    }
  return thelist;
  }





function populatelist()
{
 var thelist=getlist();
 top.frames['browse'].document.browseform["fm_list"].value = thelist;
 top.frames['browse'].document.browseformhere["fm_list"].value = thelist;
}








function deselect()
  {
   if (!document.getElementById) { alert('No way to traverse DOM'); return; }
   var daList = document.getElementById("filelist");
   if (!daList) { alert('Missing File Listing'); return; }
   var daItems = daList.getElementsByTagName("DIV");
   if (!daItems) { alert('No files found!'); return; }
   for (iItem=0; iItem < daItems.length; iItem++)
    {
     var o=daItems[iItem]
     o.className=o.className.replace('sel','nor');
    }
  }






function getthename(n)
{
  if (n.substr(0,1)=='F') {
   var dest=n.substr(1);
  } else if (n.substr(0,1)=='B') {
   var dest='{BAD}'+n.substr(1);
  } else {
   var dest=n;
   if (dest=='parent')  { dest='..'; }
   if (dest=='current') { dest='.';  }
  }
 return dest; }






function textclick(e)
 {

   if (this.className)
    {
     var dest=getthename(this.id);
     var c=this.className.split(' ');
     if (c[0]=='nor'){
      if (e && e.shiftKey){
       if(lastclick){
        var daList = document.getElementById("filelist");
        var daItems = daList.getElementsByTagName("DIV");
        var inSelection=false;
        for (iItem=0; iItem < daItems.length; iItem++){
         var o=daItems[iItem]
         console.info(o.className);
         if(inSelection){
          o.className=o.className.replace('nor','sel');
         }
         if (o==this || o==lastclick) {inSelection=!inSelection;}
        }
       }
      }
      this.className=this.className.replace('nor','sel');
      lastclick=this;
     } else {
      this.className=this.className.replace('sel','nor');
     }
    }
    populatelist();
 }






function selectthisone(a)
{
   a.className=a.className.replace('nor','sel');
   var dest=getthename(a.id);
   var c=a.className.split(' ');
   var b = "";
   if (c[2] == "dir") {b="/";} else {b="";}
   document.browseform["fm_list"].value = "|"+dest+b;
   document.browseform["fm_cmd"].value = "";
   document.browseformhere["fm_cmd"].value = "";
   document.browseformhere["fm_list"].value = "|"+dest+b;
   document.browseform.submit();
}






function doubleclick()
  {
   togspinner('ON');
   deselect();
   selectthisone(this);
  }






function right(t,x) { return t.substr(t.length-x) ; }

function left(t,x) { return t.substr(0,x) ; }

function reverse(o)
{
  var s = "";
  var i = o.length;
  while (i>0) {
   s += o.substring(i-1,i);
   i--; }
  return s;
}

function replace(a,b,c) {return a.replace(b,c) ; }

function replaceall(text, strA, strB) 
{ while ( text.indexOf(strA) != -1)
  { text = text.replace(strA,strB); }
  return text; }

function middle(t,a,b) {return t.substring(a-1,b);}

function chopleft(t,a)
{ var b='';
  if (t.search(a)<0)
  {b=t;}
  else
  {b=t.substring(t.search(a));}
  return b;
}






function drawpath(p)
{
  if (!top.frames['path'].document.getElementById('thefilepath')) {top.frames['path'].window.location.href=loadpopup+'?path';}
  if (!top.frames['btbr'].document.getElementById('info')) {top.frames['btbr'].window.location.href=loadpopup+'?toolbar';}
   var p=replaceall(p,'//','/');
   p=replace(p,fm_chroot,'');
   if (right(p,1)!='/') {p=p+'/';}
   p=replaceall(p,'/./','/')
   if (right(p,1)=='/') { p=left(p,p.length-1); }
   if (right(p,3)=='/..') { p=reverse(chopleft(replace(reverse(p),'/',''),'/')); }
   if (right(p,2)=='..') { p=reverse(chopleft(reverse(p),'/')); }
   var o=top.frames['path'].document.getElementById('thefilepath');
   p=p.replace('//','/')
   p=p.split('/')
   var temp='';
   var q='/';
   for (i=0; i<p.length; i++)
   {
     if (p[i])
      {
        q=q+p[i]+'/';
        if (i==p.length-1)
        {
         temp=temp+'<td><img src="/apps/imageservices/filemanager/images/midnext.png" border="0" width="9" height="20"></td><td class="hi"><a href="javascript:top.frames['+"'browse'"+'].pathclick('+"'"+q+"'"+');"><img src="/apps/imageservices/images/dir-small.gif" border="0" width="12" height="12"><span>'+p[i]+'</span></a></td>';
        }
        else
        {
         temp=temp+'<td><img src="/apps/imageservices/filemanager/images/midnext.png" border="0" width="9" height="20"></td><td><a href="javascript:top.frames['+"'browse'"+'].pathclick('+"'"+q+"'"+');"><img src="/apps/imageservices/images/dir-small.gif" border="0" width="12" height="12"><span>'+p[i]+'</span></a></td>';
        }


      }
   }


   temp='<table border="0" cellspacing="0" cellpadding="0" class="tabbed"><tr><td><a href="javascript:top.frames['+"'browse'"+'].pathclick('+"'/'"+');"><img src="/apps/imageservices/filemanager/images/home.gif" border="0" width="12" height="12"><span>Home</span></a></td>'+temp+'</tr></table>';
if(o){
   o.innerHTML=temp;
}

}









function pathclick(dest)
  {
     togspinner('ON');
     document.browseformhere["fm_list"].value = getlist();
     document.browseformhere["fm_cmd"].value = "both";
     document.browseformhere["destination"].value = fm_chroot+dest;
     drawpath(document.browseform["destination"].value);
     document.browseformhere.submit();
  }




















function togspinner(state)
{
 var a = top.frames['path'].document.getElementById('spinner');
 if (state=='ON')
  {
   a.src='/apps/imageservices/filemanager/images/spinner.gif';
  }
 else
  {
   a.src=spinneroff;
  }
}







function iconclick()
  {
   var handled='';
   var dest=getthename(this.parentNode.id);
   var c=this.parentNode.className.split(' ');

   if (document.browseformhere["fm_bbfile"] && document.browseformhere["fm_bbfile"].value == 'bb' && c[2] != 'dir' ) {return;}
   if (c[2]=='txt')
    {
     windowHandle=window.open(loadpopup+'?'+c[2]+'&'+dest+'&'+c[1], 'TXT'+c[1]+replaceall(document.browseform["destination"].value,'/','')+dest.replace('.','') , 'width=900,height=650,status=yes,scrollbars=no,resizable=yes,left=50');
     windowHandle.focus();
     handled='TRUE';
    }
   if (c[2]=='pict')
    {
     windowHandle=window.open(loadpopup+'?'+c[2]+'&'+dest, 'UPLOAD'+dest.replace('.','') , 'width=550,height=550,status=yes,scrollbars=no,resizable=yes,left=50');
     windowHandle.focus();
     handled='TRUE';
    }
   if (c[2]=='dir')
    {
     togspinner('ON');
     document.browseformhere["fm_list"].value = getlist();
     document.browseformhere["fm_cmd"].value = "both";
     document.browseformhere["destination"].value = document.browseformhere["destination"].value+'/'+dest;
     drawpath(document.browseform["destination"].value);
     document.browseformhere.submit();
     handled='TRUE';
    }
   if (c[2]=='db')
    {
     togspinner('ON');
     top.frames['details'].window.location.href=loadpopup+'?'+c[2]+'&'+dest;
     handled='TRUE';
    }
   if (handled=='TRUE') {deselect();} else 
    {
     deselect();
     selectthisone(this.parentNode);
     this.parentNode.className=this.parentNode.className.replace('sel','nor');
     handled='TRUE';
    }
  }

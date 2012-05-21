#!/usr/bin/perl -w


# Aestiva File Uploader with progress bar Version .9 alpha
# Modified for use with Aestiva's HTML/OS by Terry Riegel
# Heavily modified from code by Raditha Dissanyake
#
# Licence:
# The contents of this file are subject to the Mozilla Public
# License Version 1.1 (the "License"); you may not use this file
# except in compliance with the License. You may obtain a copy of
# the License at http://www.mozilla.org/MPL/
# 
# Software distributed under this License is distributed on an "AS
# IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
# implied. See the License for the specific language governing
# rights and limitations under the License.
# 
# The Initial Developer of the Original Code is Raditha Dissanayake.
# Portions created by Raditha are Copyright (C) 2003
# Raditha Dissanayake. All Rights Reserved.
#
# CHANGELOG:
# Removed dependency on File::Temp

use CGI;
use Fcntl qw(:DEFAULT :flock);

$docroot = $ENV{DOCUMENT_ROOT};
$max_upload = 1000000000000;
$tmp_dir = $docroot."/upload";


@qstring=split(/&/,$ENV{'QUERY_STRING'});
@p1 = split(/=/,$qstring[0]);
@p2 = split(/=/,$qstring[1]);
@p3 = split(/=/,$qstring[2]);

if("test" eq $p1[0]) {
    print "Content-type: text/html\n\n";
    print "Perl seems to be installed and working!<br />";
    print "<b>Settings</b><br />";
    print "Max upload size: ".$max_upload."<br />";
    print "Temp dir:        ".$tmp_dir."<br />";
    exit;
}

$sessionid = $p1[1];
$sessionid =~ s/[^a-zA-Z0-9]//g;  # sanitized as suggested by Terrence Johnson.

$dest_program = $p2[1];
$dest_program =~s/\+/ /g;
$dest_program =~s/%([0-9a-f]{2})/pack("c",hex($1))/gie;

$dest_getdata = $p3[1];
$dest_getdata =~s/\+/ /g;
$dest_getdata =~s/%([0-9a-f]{2})/pack("c",hex($1))/gie;






# bye_bye("$sessionid");



# don't change the next few lines unless you have a very good reason to.

$post_data_file = "$tmp_dir/$sessionid"."_postdata";
$monitor_file = "$tmp_dir/$sessionid"."_flength.txt";
$error_file = "$tmp_dir/$sessionid"."_err.txt";
$signal_file = "$tmp_dir/$sessionid"."_signal.txt";
$qstring_file = "$tmp_dir/$sessionid"."_qstring.txt";

$len = $ENV{'CONTENT_LENGTH'};
$bRead=0;
$|=1;

sub bye_bye {
	$mes = shift;
	# Output alert directly to client
	print "Content-type: text/html\n\n";
	print "<html>\n$mes\n<script language=javascript>\nalert('Encountered error: $mes.');\n</script>\n</html>\n";
	exit;
}


# see if we are within the allowed limit.


if($len > $max_upload)
{
	close (STDIN);
	bye_bye("The maximum upload size has been exceeded");
}


#
# The thing to watch out for is file locking. Only
# one thread may open a file for writing at any given time.
# 

if (-e "$post_data_file") {
	unlink("$post_data_file");
}

if (-e "$monitor_file") {
	unlink("$monitor_file");
}

unlink("$qstring_file");
unlink("$error_file");

sysopen(FH, $monitor_file, O_RDWR | O_CREAT)
	or &bye_bye ("Can't open $monitor_file: $!");

# autoflush FH
$ofh = select(FH); $| = 1; select ($ofh);
flock(FH, LOCK_EX)
	or  &bye_bye ("Can't write-lock numfile: $!");
seek(FH, 0, 0)
	or &bye_bye ("Can't rewind numfile : $!");
print FH $len;	
close(FH);	
	
sleep(1);


open(TMP,">","$post_data_file") or &bye_bye ("Can't open temp file from PERL");
 

#
# read and store the raw post data on a temporary file so that we can
# pass it though to a CGI instance later on.
#



my $i=0;

$ofh = select(TMP); $| = 1; select ($ofh);
			
while (read (STDIN ,$LINE, 4096) && $bRead < $len )
{
	$bRead += length $LINE;
	
	select(undef, undef, undef,0.05);	# sleep for 0.35 of a second.
	
	# Many thanx to Patrick Knoell who came up with the optimized value for
	# the duration of the sleep

	$i++;
	print TMP $LINE;
}

close (TMP);

#
# We don't want to decode the post data ourselves. That's like
# reinventing the wheel. If we handle the post data with the perl
# CGI module that means the PHP script does not get access to the
# files, but there is a way around this.
#
# We can ask the CGI module to save the files, then we can pass
# these filenames to the PHP script. In other words instead of
# giving the raw post data (which contains the 'bodies' of the
# files), we just send a list of file names.
#

open(STDIN,"$post_data_file") or &bye_bye("Can't open post data file");

my $cg = new CGI();
my $qstring="";
my %vars = $cg->Vars;
my $j=0;

while(($key,$value) = each %vars)
{

	if(defined $value)
	{	

		my $fh = $cg->upload($key);
		if(defined $fh)
		{
			open(TMP,'>',"$tmp_dir/$key") or &bye_bye("ERROR OPENING/CREATING: $tmp_dir/$key");
			while(<$fh>) {
				print TMP $_;
			}
			close(TMP);
			$mode = 0755;   chmod $mode, "$tmp_dir/$key";
			$fsize =(-s $fh);
			$fh =~ s/([^a-zA-Z0-9_\-.])/uc sprintf("%%%02x",ord($1))/eg;
			$tmp_filename =~ s/([^a-zA-Z0-9_\-.])/uc sprintf("%%%02x",ord($1))/eg;
			$value =~ s/([^a-zA-Z0-9_\-.])/uc sprintf("%%%02x",ord($1))/eg;
			$qstring .= "$key=$value&";
			$j++;
			}
		else
			{
			$value =~ s/([^a-zA-Z0-9_\-.])/uc sprintf("%%%02x",ord($1))/eg;
			$qstring .= "$key=$value&" ;
		}
	}
}

open (QSTR,">", "$qstring_file") or &bye_bye ("Can't open output file");
print QSTR $qstring;
close (QSTR);




# Remove all files used to get here
unlink("$post_data_file");
unlink("$monitor_file");

# print "Content-type: text/html\n\n";
# print "<html>Excellent, File Made it. \nNow I need to pipe the data through...<br><br>\n\nPROGRAM:$dest_program<br>\nURLGETDATA:$dest_getdata<br>\nURLPOSTDATA:$qstring</html>";

$ENV{'REQUEST_METHOD'} = 'GET';
$ENV{'PATH_INFO'} = "$dest_getdata";
open(AESTIVA, "| ./$dest_program");
select AESTIVA;
while (<STDIN>) {print AESTIVA $_;}
close(AESTIVA);
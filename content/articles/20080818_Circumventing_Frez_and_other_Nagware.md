/*
Title: London 2600 archive: Enjoying Nagware without the Nagging Price
Description: Using Windows System Restore to deal with software which appears "Free" at first, then tries to force cash out of the user.
Author: DieselDragon
Date: 2008/08/18
License: cc-nc-sa 3.0
*/

# Enjoying Nagware without the Nagging Price

_This article was originally written in the Summer of 2008 intended for publishing in 2600 Magazine, but wasn't used and subsequently found its way onto my own website instead. Although the techniques given in this article **won't** circumvent ransomware (Which encrypts the whole disk including the System Restore repositories) they might be useful for dealing with bad installs of software which only allows a limited number of uses before a paid-for license must be provided. As the article was originally written for print, some changes have been made to better suit online display._

---

Having built up a nice library of music videos in FLV format, I recently decided to try and convert the audio streams in them to MP3s so that I could use them like any other music file. A bit of web searching led me to a utility called "_Freez FLV-MP3 Converter_" which is widely advertised as software that is free to download and use; A Freeware application.  
I downloaded and installed the program as normal (Fortunateley to one of my "quarantine" PCs and not my main box, as we'll soon see!) and started to use it. Unfortunateley, the first couple of runs wern't exactly successful as I'd forgotton to set the bitrate of outputted MP3s correctly...

...So I decided to fire up the program for about it's third or fourth run, and was greeted with a prompt asking for a name and registration code combination (Clicking "later" just closed the application). Reading more about this on the web, it turns out that the program itself is falsely advertised as Freeware, whereas it is in reality Shareware; Software that is free for a limited period, after which time you have to purchase a licence for $19.99 if you wish to continue using it.  
Worse still, there was apparently an option for a "free" registration on the site in question...But according to many reports on the 'web, trying to access this free registration just gives a message to the effect that "_The free registration service has been closed due to excessive bandwidth overheads_." (That's total bull by the way...A free registration was never available in the first place, nor will there ever be one!)

Aside from the false advertising, Freez FLV-MP3 Converter is a good little utility for stripping audio tracks out of *.FLV files and - So far - Is fairly quick, easy and nice to use. Given that it's advertised across the web as Freeware though, I know that I have a legal right (Under UK Law) to use that software without payment of any kind (If it was advertised as _Shareware_ or the licencing restrictions were made obvious to the user before download, then there would be no problem with it at all! :-) and a handy thought passing through my mind about the Quarantine PC that I was using the software on suddenly gave me an idea as to how to keep using the program for free...Though I'd have to put in a little bit of work at my end to continue doing so!

Fortunateley - For me - I had installed the program on a PC that is normally used only for file storage, and therefore never changes at all as far as programs and configurations are concerned. Using the _System Restore_ feature in Windows I managed to "roll-back" the computer to it's previous checkpoint (About three days before) and this appeared to completely remove all of the registry entries and hidden checkpoint files that the Freez application had created to guard against the old uninstall-reinstall trick. A slight side effect of this was that a few folders on my backup drive had jumped back to a different folder, but these were quickly returned to their rightful places. :-)

So...I'm now running the Freez conversion package in the perpetual "_Freeware_" mode that it's advertising suggests, and - Aside from having to run a system restore after every third run of the program - I havn't had to worry about having only a limited number of runs available, and I certainly won't ever have to be worrying that I'd have been extorted for $20 of my hard earned cash!  
This technique would potentially work with just about all Shareware-style programs as well, although - As should be perfectly obvious - This technique is only really suitable for use on dedicated machines (Or better: A virtual machine) that can be set aside for software testing and similar purposes. :-)

So to recap, this is how you "register" Freez FLV-MP3 converter for free:

1. Set up a dedicated PC with a fresh installation of Windows (If using XP an old P-III box with 128Mb RAM will do...Dig around at computer fairs or check out the local dump for a cheap one!) and once you have the machine configured to your liking, take a full system restore point.
2. Reboot, then install Freez (Or whatever programme or package) as normal. At this point, it'll help a lot if you have as many of your target files to hand as possible.
3. Load and convert the files as normal, trying to do as many as possible in the one run. Freez appears to count program starts and not files converted, so it should allow you to do as much as possible up until then.
4. Once the program tells you that you'll need to register, close the program and use system restore to roll the PC back to a pre-Freez state. Then repeat from stage 2 above as much as you need to.  
  _Of course: doing this will "roll-back" everything on your PC outside of your document folders, including programs and Windows configuration settings...Hence why a dedicated PC or virtual environment is highly recommended for this._

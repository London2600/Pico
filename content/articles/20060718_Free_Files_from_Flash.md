/*
Title: London 2600 archive: Free Files from Flash
Description: How to obtain free media files and other interesting stuff from embedded flash applications
Author: DieselDragon
Date: 2006/07/18
License: cc-nc-sa 3.0
*/

# Free Files from Flash
_This article was originally written in the Summer of 2006, and was published in the Autumn 2006 issue of 2600 Magazine. A lot of the information in this article is no longer relevant now that HTML 5 is in widespread use and Flash has fallen out of favour, but it has been uploaded for historical reference. As the article was originally written for print, some changes have been made to better suit online display._

---

## 0x00. Introduction:
Anyone who uses the internet nowadays will have noticed the increasing trend of Flash applications being used for playing embedded audio and video on web pages. Notable websites for this include YouTube (Video) and the infamous MySpace (Audio/video). Often, these Flash players are used in an attempt to play files without revealing the location of the host file to prevent users from downloading the actual files to their computers - An example of which can be found on the [Dragonforce website](https://www.dragonforce.com).

However, one thing that many webmasters have overlooked is that the use of Flash media players _does not_ guarentee that the file(s) in question will stay "safe"...After all, it's a simple fact that anything on the internet that can be viewed by the user can be downloaded...And it's a fact that has few exceptions. In this article, I'll show you how to download one of my videos from YouTube, but insted of teaching you the technique for the one specific site, I'll be showing you the general principle behind the hack which should work for most sites that use embedded Flash players.  
Obviously the standard disclaimers apply here, and you're the only one responsible for anything that you use this technique for. Please don't steal copyrighted works...The author of those works still has to put food on the table as much as you or I. :-)

## 0x01. How it all works:
When an embedded Flash player (Henceforth referred to as EFP) loads on a web page, there are a few processes that take place:

1. An `<OBJECT>` tag causes an HTTP request to the server for the EFP,
2. The EFP is downloaded to temporary storage and executed using the relevant plug-in,
3. The EFP fires off an HTTP or other request for the media file,  
(This request might return an XSPF file in the case of audio players. More on that later...)
4. The media file is downloaded or streamed to the EFP via temp storage or RAM,
5. Once a decent buffer amount of data is downloaded, the EFP will start playing.  

In this tutorial, we'll be tracing the EFPs HTTP requests to find out where the desired media file is located.

## 0x02. The theory applied:
In this article, we'll be downloading [one of my videos from YouTube](https://www.youtube.com/watch?v=T8feb8zXj54). Fire up your favourite packet scanner (I used **Ethereal** at the time, nowadays known as [WireShark](https://wireshark.org)) and set it to trace everything to catch any EFPs that use unusual protocols (FTP, Telnet etc.) to download files. Then point your browser to the URL of the page that holds the media that you are interested in. Once the song/movie has started playing, stop your packet scanner and have a peek at the log. It'll look something like this:  
(_The following log is typed from memory as I discovered this on a friends PC a while ago, so apologies for the lack of packet detail._)
```
127.0.0.1 > 208.65.153.253 - GET https://www.youtube.com/watch?v=T8feb8zXj54  
208.65.153.253 > 127.0.0.1\  
208.65.153.253 > 127.0.0.1 - [The usual GET requests and packets of  
HTML, images, scripts and other gumpf...]  
208.65.153.253 > 127.0.0.1/  
127.0.0.1 > 208.65.153.253 - GET
https://www.youtube.com/get_video?video_id=T8feb8zXj54&l=203&t=OEgsToPDskJ47_l7h9B3isGzSjA9NZmb  
  [The L and T parameters are session specific. Sending just the video_id parameter gives a blank page.]  
208.65.153.253 > 127.0.0.1\  
208.65.153.253 > 127.0.0.1 - [Several packets of audio/video data...]  
208.65.153.253 > 127.0.0.1/
```  
As you can see, there is an easily spotted URL to the video. The URL itself may vary from that shown but the theory remains the same: Trace packets, find the URL, download the file. In this case, the video sent down from the YouTube server comes in .FLV (Flash video) format, but sometimes renaming the file with a .WMV (Or whatever) extension might work. Alternatively, there are probabally several FLV file players for download knocking about the internet.  
If anyone is interested in hacking the FLV format, the original file in this case was a 320x240 Windows Media format video with MP3 audio at 30fps (I think) if that helps.

## 0x03. Quick note on XSPF files:
As mentioned above, some audio EFPs may request an .XSPF file insted of an .MP3 file. This is actually a bonus as XSPF files are text/xml based audio playlists and can contain references and URLs to many audio files across the internet. Hacking the audio player on the [Dragonforce site](http://www.dragonforce.com) using the above method will demonstrate better what I'm talking about. Check out [XSPF](http://www.xspf.org) for full info and specifications on the format.  
As a side-bar to this, try entering `[Your favourite band] .mp3 filetype:xspf` into Google and see what comes up! ;-)

## 0xFF. The final word:
I hope that this tutorial has helped you all learn a little about how Flash Players and the HTTP standard in general work. If you like to download music, please consider using this method (And buy the CD for copyright/royalty purposes of course!) as opposed to Apples iTunes...After all, I'd rather pay my favourite bands much more than a measly $0.03 for each track of theirs that I buy!

Shouts to: [**Bal-Sagoth**](http://www.bal-sagoth.com) (For being the greatest band ever known to Metal!), and [**Dragonforce**](http://www.dragonforce.com) (For providing an excellent example for this article!)

F-yous to: **Apple** iTunes for ripping artists off much worse than bedroom pirates and "_those Hackers_" ever did!

Have a lot of phun... >:-)  
**>> Dieseldragon <<**

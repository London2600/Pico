/*
Title: London 2600 archive: L33ching the L33chers
Description: How to use a portable wireless network to sniff, serve, and protect.
Author: DieselDragon
Date: 2009/01/21
License: cc-nc-sa 3.0
*/

# L33ching The L33chers
### Using a Portable Wireless Network

_This article was originally written at the start of 2009, and was published in the Spring 2009 issue of 2600 Magazine. This was a time when public wifi was still in it's early infancy, legally free wifi was hard to come by, and the public wifi which was available was normally expensive to use. Many of the principles in this article still apply today (Mid 2017) and may still be of relevance for some years to come. It is possible this article may also have been the inspiration for pocket routers, wireless storage devices, mobile internet hotspots, and other PirateBox-like devices. As the article was originally written for print, some changes have been made to better suit online display._

---

## 0x00. Introduction:
If there is one home truth in today's ever connected World, it's the fact that the public _love_ free wireless internet access. Public Wi-Fi networks now exist in almost every resturant, every major railway station and airport, and even on board long-distance trains.  
However, with many of these public networks - Such as "_The Cloud_" in London - Charging users for their access [At the time] you can often see people scanning the airwaves in the hope of finding a free and open route to the Internet before they are forced to part with their hard-earned cash.

In this article, I will explore some of the basic principles of Portable Networks and the possibilities that they open up for many interesting and useful activities. Obviously the standard disclaimers apply to this educational article, and you are the only one responsible for anything that you use the following information for.  
To try and keep this article to more readable proportions, I'm going to concentrate mainly on the theory behind Portable Networks and their uses...If you need more information on a specific aspect of this article, Google is your friend! :-)

## 0x01. Portable Networks, or "PortaNets":
As one may imagine from the name, a PortaNet is a complete network that exists in a portable and easily transportable form. Although potential variants of a PortaNet may run into the thousands depending on what use they are intended for, a general purpose PortaNet might be composed of the following:

1. Uplink: A device that forms the upstream (Internet-side) connection to the PortaNet, such as a Wi-Fi card/dongle, GSM/GPRS data modem, or Ethernet link.
2. Downlink: As above, but forms the downstream (Network-side) connection to the PortaNet. For having phun in public places, this should ideally be a Wi-Fi card/dongle that's capable of functioning in Access Point (AP) mode. For more overt applications, any old AP or wired switch/hub will do.
3. Server: A device used to connect the Uplink and Downlink together, and to host any applications (Such as WireShark) or services (DNS, Apache etc.) that may be needed. In practice, this would be a laptop - Preferably one with a decent amount of RAM and CPU power if anything more complex than general eavesdropping is planned.
4. Power source: Even with the most modern batteries and power-saving techniques, a PortaNet will drink a lot of juice in general operation...So having a convenient power outlet to hand is most advisable.

The main principle of a PortaNet is that all traffic from the inside of the network passes across the server (Laptop) as it goes to and from the Internet, and this offers up a wide range of possibilities for what can be done with that traffic - Given that in such a case, we have full control over the victim's Internet connection. Aside from the typical eavesdropping exercises, it is also theoretically possible to change and/or redirect content en-route - Something that I outline in clearer detail in 0x03.

## 0x02. Brief Scenario and Setup:
The departures lounge at Stansted is typical of most UK airports. Thousands of travellers pass through it every day en-route to various destinations, and the captive audience of passengers awaiting their flights is a veritable gold-mine for the operators of pay-WiFi hotspots. Many people will often reach for their laptops whilst awaiting departure, and it probabally comes as no surprise to find that - No matter how much you scan the air - You won't find a cost-free route to the Internet in any departures lounge where pay-WiFi is in use!

It is in these situations where our PortaNet comes in. By purchasing an access code for the pay-WiFi network (Or firing up WireShark and grabbing someone else's) and setting our uplink card to use that network, we give ourselves a route through to the Internet. We then set up the downlink card to form a seperate open and unsecured network that - To a casual observer - Might look like an old AP that's simply been plugged in and long forgotton about. Of course, all communications between the two cards run across the laptop...And it is here where our eavesdropping (Or whatever) applications are being run.

As I said at the beginning of this article, Joe Public loves to have free Wi-Fi access...And he loves nothing better than to find a connection that appears to be running on default out-of-box settings. Therefore, setting the downlink card with a generic name like "linksys" or "belkin" will probabally encourage more connections from unsuspecting users than the dangerously obvious "Free_WiFi". If you wanted to go the whole hog and fool those who may decide to double-check the network first, you could even spoof the MAC address of your downlink card and set up a web server with faked router config pages on the laptop!  
As being discreet is vital, one of the two Wi-Fi cards should ideally be an internal one - As even the most uneducated of users might sense something odd about a laptop with two Wi-Fi dongles poking out of it. A seperate AP cunningly hidden under a jacket or baseball cap might also be fine though, depending on the situation at hand.

## 0x03. Uses of a PortaNet:
So...Just what exactly can a Portanet be used for? Following are a number of interesting possibilities that could be applied to PortaNets, and - Given the nature of computing - This list is probabally just the tip of the proverbial iceberg.

* **Traffic and service re-routing:**  
99.9% of the time whenever a client connects to a network, they'll have their system set to obtain network info - I.P. address, DNS server address etc - Via DHCP, and this allows us to specify which DNS server the client will use for hostname resolution...Which could easily be a DNS run on our laptop, and configured to our own ends. If you dislike PayPal for example, you could set-up the DNS to return the I.P. for paypalsucks.com in response to any requests for paypal.com.  
Likewise, redirection to a spoofed login page for any website - On the laptop itself, or elsewhere - Could be done with the same approach, with the additional benefit that the address bar in the victims browser would still display the original, legit-looking URL.  

* **Eavesdropping on "secure" communications:**  
The problem with conventional "passive" eavesdropping is that encrypted communications like HTTPS are exactly what they say on the tin. On the other hand, a PortaNet - As it IS the users connection - Has the potential to record such transmissions in their original plain-text form. Although probabally a complicated and rather tricky thing to set-up, the laptop could trap and encrypt/decrypt secure communications on-the-fly through the following process:
  1. The victim requests a secure webpage using their browser,
  2. The laptop establishes a secure connection to the victim in response to their original request, then establishes a seperate secure connection to the requested website,
  3. Transmissions between the victims browser and site are decrypted by the laptop upon arrival, the plaintext is logged/recorded, then the data is re-encrypted for transmission to it's intended destination via the second secure connection.  
Obviously for seamless operation and less chance of detection by the victim, you would also need to change (If necessary) and pass on any security certificates or other authentication tokens that the victims browser would normally use to check that the connection is indeed "secure".  

* **Content shaping and hi-jacking:**  
As whatever goes to the victims browser has to pass through our laptop first, it is possible for us to change and generally mess about with whatever it is they are looking at. Simple changes for small profits could be the changing of all passing Google AdSense provider IDs to one of your own...Meaning that you'd get credited with hits every time the victim clicks any AdSense ad. Other phun could be had in the swapping of Googles logo with Yahoo's (And vice versa) and other little content injection/tampering jokes.  
On a more serious note of course, the same technique could also be used to substitute a requested application with a keylogger or similar nasty program, or to completely reverse the meaning of an e-mail from the victim's loved one.  

* **Sharing out the cost of Internet access:**  
A group of 50 people (Those at a 2600 meeting, perhaps) enter a bar and settle down with their laptops and PDAs, only to find that the one available AP has some rediculous charge of £10.00 per connection, or something like that. By connecting the PortaNets upstream card as a single paid-for connection and routing it through the downstream card to everyone's devices, each user pays only 20p towards the cost of the connection...And the gr33dy so-and-so's running the AP only take £10.00 in total, insted of the £500.00 that they'd normally expect to make from such a large group.  
 
* **Secure group communications over public Wi-Fi:**  
Following on from example D above, another headache with using public WLANs is that they generally have to be open and unsecure to allow users to connect to them in the first place...Meaning that anything sent from the users device has to be encrypted before transmission to remain secure from anyone else on the network who may be running an eavesdropping tool. Using a PortaNet, it would be possible for the laptop to route all Internet traffic passing across it via an SSH tunnel or similar encrypted medium to a server running elsewhere for onward transmission, which would bypass the risk normally posed by the public WLAN being used.  
Of course, one could normally do this from their own device anyway. But the added benefit of using a PortaNet to serve group communications in this way is that only one device (The PortaNet laptop) needs to be configured to use the SSH tunnel, and it would also afford protection for less skilled members of the group who may not know how to use such secured connections.  

## 0x04. Other potential uses of a PortaNet:
Back in November 2008 I stayed in an Oslo youth hostel that ran a free and open Wi-Fi network for guest use, and a lot of people were using it for just about every possible activity. It naturally occurred to me that - Assuming I was staying in a dorm within range of the AP - If I were to set up a laptop running WireShark and simply leave it running in my locker or hidden under the bunk, then I could capture all manner of interesting traffic throughout the day without even having to be in the hostel.

On top of this, a PortaNet could be configured to capture traffic passing across the network in the conventional way for storage and transmission to another device across a seperate, secure connection. Aside from providing you with a secure, encrypted connection as suggested in point E above, it would also allow you to perform eavesdropping/traffic monitoring from anywhere within range of the PortaNets AP card - Meaning that you wouldn't be confined to the power outlet in the dorm all the time.

## 0x05. Avoiding dodgy connections and networks:
Obviously, this article clarifies just how insecure and potentially dangerous public Wi-Fi networks can be for the unwary, so I will also give a few hints 'n' tips for checking and avoiding malicious PortaNets and similar setups:

1. Check the MAC address for the connection that you are using. If a network called "belkin" connects to an AP with a MAC address starting 00:07:0D, then you are actually connecting to a Cisco/LinkSys device of some description. If the manufacturers ID code (Generally the first three bytes of the MAC) doesn't match up with the brand of router that you seem to be connecting to, chances are that the network is a "fake".  
Bear in mind though that MAC addresses can be spoofed and reconfigured by whoever has set up the device, so this isn't a comprehensive safety measure. It should protect you from any PortaNets set up by average Skr1pt K1dd1ez though. A list of vendor MAC codes can be found [Here](https://tinyurl.com/vendor-MACs).  

2. Encrypt as much of your traffic as possible, and use complicated/obscure/multi-layer methods of encryption. Although a PortaNet could potentially decrypt/re-encrypt data en-route as outlined above, a rare encryption protocol (Or one that uses pre-defined keys and sends encrypted data right from the get-go) stands less chance of being known and decryptable by anyone running a PortaNet.  

3. Don't do anything risky in public! The very nature of public WLANs means that they shouldn't be used for accessing private and confidential services such as PayPal and online banking sites, unless you are using a strongly encrypted tunnel connection for such things.  
Remember that a lot of online services such as Hotmail, ebay and FaceBook only use HTTPS encryption for user authentication purposes, and then drop back to normal HTTP for sending general data - Including the content of private pages and e-mails. In these situations - Even if your username and password are protected with HTTPS - The unencrypted data in the pages that you load afterwards could still provide a lot of ammunition for an identity thief or similar individual.  

4. Finally; Consider using your own network services whenever possible. Setting up your own DNS and/or encrypted web-proxy on a machine at home - And only using those services - Should afford a lot of protection from malicious DNS and similar attacks, with the added benefit that you have a greater level of control over the services that you may use whilst out and about.  
With a normal public Wi-Fi connection, you often have to put your trust in the DNS and other services provided by that network or the ISP serving the connection, and - While most commercial ISPs can generally be trusted to deliver legitimate responses to DNS and similar calls - It would be a very simple matter for the manager of a cafe to set up a maliciously configured DNS to route calls from customers laptops to only the Gods know where.

## 0xFF. The final word:
Here's hoping that you all enjoyed this article on the theory and benefits of Portable Networks, the insecurity of public WLANS, and how to go about protecting yourself from the dangers posed by the above! I see that despite my original intentions, this article - Like my previous ones - Has run to somewhat epic proportions...But fingers crossed, this hasn't proved too long or tiresome for people to read and enjoy. :-)

Farewell for now, have a lot of phun, and surf safe! >:-)  
**>> DieselDragon <<**

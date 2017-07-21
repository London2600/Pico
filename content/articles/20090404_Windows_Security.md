/*
Title: London 2600 archive: Making your Windows box a little more secure (Short version)
Description: How to use Access Control Lists (ACLs) and filesystem permissions to control and reduce the scope for user-instigated damage to your Windows systems.
Author: DieselDragon
Date: 2009/04/04
License: cc-nc-sa 3.0
*/

# Making your Windows box a little more secure (Short version)

_This article was originally written in the Spring of 2009, and was published in the Summer 2009 issue of 2600 Magazine. Although the article was originally written for and using Windows XP the same principles can still be applied to earlier and later versions of Windows which are NT based, including all versions of Windows from XP and onwards. As the article was originally written for print, some changes have been made to better suit online display._

---

## 0x00. Introduction:
It has been over a year since I wrote my last article ("_Free Files from Flash_", 24:3) and I have been hoping to write another two or three in the meantime, but sadly I've always been kept busy by other annoying diversions and hardly ever get the chance to sit in front of a computer nowadays, let alone write articles. However, today's a typical British summer day (Freezing cold with six inches of rain!) and I thought it may be well to try my hand in making another contribution to such a great magazine!

Following a long running period of playing around with the various security tools and features in Windows, I thought that I'd share some of my findings made over this time. Hopefully, this might help those of us "_locked in_" to using the Windows family in protecting our machines a little bit better than they are normally. :-)  
The things detailed here have been tested and applied on a machine running Windows XP Pro SP2, but should hopefully be supported in all versions of Windows 2000, XP and Vista. Just to be sure, I'll add that errors and omissions are excepted, and your mileage may vary. :-)

## 0x01. Who this guide is for:
Most articles in 2600 seem - To my eye - To be written mainly for those lucky enough to be able to understand and use Linux without experiencing serious implosion of the brain. Sadly, some of us are classic victims of vendor lock-in and - Try as we might - Find that the only kind of OS we can efficiently use is one of the Microsoft Windows family of operating systems. This article concentrates mainly on applying secure practices in Windows XP...But the methods and practices used here should also be adaptable for use in Windows Vista and other operating systems, both by Microsoft and other producers.

There are two versions of this article:
* This one aimed at experienced users, kept as short as possible so that it doesn't take up too much space, and
* A long-winded version - With a lot more background info - Written for less experienced "_Average Joe_" users. This longer version will be uploaded to the site if requests for it are received.

## 0x02. Sensible user account management:
As we all know, there are two main types of account on a Windows NT-based box; "_Administrator_" and "_Restricted_". The difference between the two should be fairly obvious to anyone used to configuring Windows machines. Unfortunately, Windows 2000 and XP set all new user accounts with administrative permissions by default, and therefore it should come as no surprise to find that the majority of Windows 2000/XP users log in to their machines with full administrative privileges every time they use it. Microsoft have - Or so I've heard - Addressed this issue with Windows Vista, but Vista users should still pay careful attention to the type of user account that they're logging on with.  
If a user unwittingly executes malware when logged in to an administrative account, the malware in question will have full access to everything on the system straight away - Every file, every folder, and every system resource. Clearly, this isn't a good thing by any stretch of the imagination.

To adopt a "best practice" for using a Windows box and minimise the spread of malicious code on the system, we can take a leaf out of the Linux user's Bible: "_**Never** login as 'root'_ (The Administrator account on a Linux machine) _unless you are performing essential system maintenance_". Putting this into practice gives us a few good maxims for managing the user accounts on our Windows machines:

1. General use accounts - Those which are used for routine logging on - Should always be "_Restricted_" accounts. This type of account can only write to files under `\Documents and Settings\[UserName]\` (And usually `\Documents and Settings\All Users\` as well), and any applications (Including malware or viruses) running under the account in question will only be able to perform write operations under those paths, plus other paths that the user has write access to by default, such as on USB keys. Naturally, this type of account is barred from installing applications and making changes to the system, but is still sufficient for running most Windows compatible applications such as office software and games.

2. Where a computer is used by certain categories of user - Those being children, teenagers, and inexperienced users - Such users should always have a "_Restricted_" account with no exceptions. The less experienced/knowledgeable the user, the greater the risk of damage being done from malware and ill-advised changes in configuration. On systems that are only accessed by those three types of user, it might be a good idea for a trusted, computer-literate friend to create an administrative account for themselves with remote access rights, who can log in from their own system and make necessary installations and system changes on request.

3. Administrative accounts should ONLY be used for installing applications and system maintenance purposes, and great care should be exercised in their use to prevent malicious code from executing under a user account. Ideally, fast user switching should be disabled (To prevent malware running under a restricted account "jumping over" whilst both accounts are logged in at the same time) and performing a cold-boot before logging on as an Administrator might be a sensible precaution. Obviously, it goes without saying that all Administrative accounts should have a very strong password set, and your partners name is anything but a strong password!

4. If software packages update themselves regularly with essential updates (World of Warcraft being one such example), don't be tempted to simply give the relevant user account(s) administrative privileges for convenience - This would reduce the security of your machine. Instead, consider changing the Access Control Lists (ACLs - Described below) to allow the relevant users appropriate read/change/write permissions for the relevant application files and/or folders.

So to briefly summarise the above, we can say that the best practice in user management is to assess the degree of risk posed by each user and grant them only the access rights that are appropriate for what they need to do...And no-one needs to log in as an Administrator on a regular basis unless they're developing/testing a low-level application, for which a separate devving box really ought to be used.

## 0x03. User-specific access control with CACLS:
Windows NT-based systems - Being designed for a multi-user environment from the start - Make use of Access Control Lists (ACLs) to grant or restrict access to individual files and folders (Henceforth "objects") on a per-user and/or per-group basis, provided that the host filesystem is formatted with NTFS or another secure, multi-user compliant filesystem. Normally, every ACL is configured by default to give full access to the creator of an object, full access to all members of the `[SystemName]\Administrators` group, and - Depending on the context of the object (Is it located in Shared Documents?) - To deny access to any "_Restricted_" or "_Guest_" users.

To edit object ACLs, Microsoft provide a command-line tool with Windows XP (Known to be available in WinXP Pro, but should also be available in Win2K, XP Home, and Vista as well) which can be used to increase or decrease access to specific objects across the system. The following are two hypothetical examples of how this could be used to improve access to specific objects without giving away admin rights and/or reducing system security:

1. A parent (Who logs on as restricted user "Dad", and only uses the Admin account for maintenance) wants to keep an eye on the files, folders, browser caches, and MSN conversations in the accounts of his two children; "Bill" and "Ben". Using the CACLS command from the Admin account, he can give his restricted account read, write or full access privileges to his children's folders with the following commands:
```
CD \Docume~1
CACLS Bill /T /E /C /G Dad:F   Gives Dad full control over files in Bill's user tree.
CACLS Ben /T /E /C /G Dad:R    Gives Dad read-only access to files in Ben's user tree.
```
  By setting the ACLs in this way, "Dad" can monitor the activity and data in his children's accounts without having to log in as an Admin user every time, and risking the spread of malware that might unwittingly have been downloaded by his children.

2. A security-conscious user (Who logs on under the restricted account "Warcraft Fan", like the user "Dad" above) is fed up with having to log in as the Administrator every time the World of Warcraft suite is updated. As World of Warcraft runs under the same credentials as the user who executes it, this user logs in as Administrator and uses several CACLS commands to grant his normal restricted account the necessary permissions to allow Warcraft to update itself under his logon:
```
CD \progra~1
CACLS Worldo~1 /E /C /G "Warcraft Fan":W     Write permissions in the top-level WoW folder only.
CD Worldo~1
CACLS Cache /T /E /C /G "Warcraft Fan":F     Full control over the Cache tree.
CACLS Data /T /E /C /G "Warcraft Fan":W
CACLS Data /T /E /C /G "Warcraft Fan":C      Write and Change permissions in the Data tree.
CACLS Errors /T /E /C /G "Warcraft Fan":F    Full control over the Errors tree.
CACLS Logs /T /E /C /G "Warcraft Fan":F      Full control over the Logs tree.
CACLS Patches /T /E /C /G "Warcraft Fan":W   Write permissions to the Patches tree.
CACLS Screenshots /E /C /G "Warcraft Fan":W  Write permissions for the Screenshots folder only.
CACLS WTF /T /E /C /G "Warcraft Fan":W
CACLS WTF /T /E /C /G "Warcraft Fan":C       Write and Change permissions for the WTF tree.
```
  He decides to avoid setting the "_Full control_" flag where possible to try and maintain slightly better security, although it's worth noting that under these conditions, malware might still be able to install itself to and run from folders with the "Write" and "Change" flags set.

When giving such permissions to restricted user accounts, it would be best to try and keep the scope of such changes as minimal as possible. Allowing full access rights to an entire folder tree is less secure than simply granting the same rights to a single file, and makes no sense if that file is the only one changed by a software update. It's also worth noting that - Although I've not tried it yet - CACLS could potentially be employed by users to prevent system administrators from "snooping" on their files and folders by denying that permission to everyone except themselves. However, such a bar on file access might still be removable by the "_Administrator_" account (The one set-up by Windows on installation) and your mileage may vary with this technique. For more info on using CACLS, search the [MSDN knowledge-base](https://msdn.microsoft.com) or use `CACLS /?` from the command prompt.

## 0x04. Windows security and best-practice summary:
Now thankfully, I can see that this version of the article is much shorter than the "_Average Joe_" version that I originally came up with. To reinforce what I have outlined above, here is a brief bullet-point summary of the article:

* Windows 2000, XP and Vista all use the more secure NTFS filesystem by default, and this makes it easier to control which users can do what. If you're still using Windows 98 or ME (Or - Horror of horrors - Windows 95!) with FAT filesystems, consider upgrading your operating system as quickly as possible. This also applies to Windows 2000/XP computers upgraded from Windows 95/98/ME that are still using a FAT filesystem insted of NTFS.  

* Firewalls may prevent trojans or other malware from sending data (Keylogging info etc) to external servers, but they won't stop viruses or malware from arriving on a machine if a user unknowingly downloaded it in the first place. Most firewalls allow known web browsers (IE and Firefox, to name but a few) to always connect to the Internet, effectively throwing open the door for malicious data to come through if the user opened the connection in the first instance.  

* Viruses, trojans and malware can only run with the same privileges as the current user, at least until they are run under an account with admin rights. Therefore, if the current user account is a restricted one, any malware programs running under it will only be able to change data under the user's own data folders and "_Shared documents_", and will have a greater degree of difficulty installing themselves as a system-wide application or service.  

* When using Windows 2000, XP or Vista, the best practice is to make all user accounts (I.E: The one that you use to log on to Windows) restricted ones, and only use accounts with Admin privileges for system maintenance. This is especially important where accounts used by children or teenagers are concerned. On the same token, one should always be **very** careful when logging onto an account with administrative rights, and make sure that you don't run anything that is potentially unsafe. Do a cold boot before an Admin logon if you consider it necessary.  

* Windows 2000 and XP users beware: User accounts created using the initial Windows welcome and setup screens are given administrative privileges by default, and it's very hard to change them to restricted accounts later on. Just create a single "_SuperUser_" account (Or use whatever name ye wish) to get past the setup screens, and create restricted accounts later on. This might not apply to Vista users, but ye should double-check this carefully in the user accounts control panel all the same.  

* If a program needs to update itself on a regular basis by writing updated files to it's own folders (Or otherwise changing itself), consider modifying the file/folder ACL using the CACLS command, instead of automatically giving the user(s) of that program administrative rights to the whole system.  

* If several users all make use of a regularly updated program, consider creating a restricted user account especially for that program and configure access rights and restrictions for that account, ensuring that the account itself can only change the program (And directly associated files) that it has been created for. Remember to set the program to always run under that special account, instead of having it run as the current user.

## 0xFF. The final word:
I hope that this tutorial has helped you all learn a little about how the security setup works on Windows NT-based platforms, and some best practices for ensuring that your Windows boxes are set up to inhibit (Or at least reduce the damage done from) unwanted system-wide changes and malware installations. :-)

Shouts to:
* Whoever came up with the permissions system for Linux, from which the initial principles in this article are derived. :-)

Have a lot of phun... >:-)  
**>> DieselDragon <<**

KwickTipp
=========

This safari extension supports you with you weekly [kicktipp.de](http://www.kicktipp.de) soccer result predictions.

Download & Install
------------------
You can get the extension from the [download section](http://github.com/naltatis/KwickTipp-safari-extension/downloads) or clone the repository and open it in safaris extension builder.

Usage
-----
Navigate to you kicktipp entry page (`http://www.kicktipp.de/your_group/tippabgabe`) and hit the **[~2:1]** button. It will pre populate the form without submitting it. So you have the change to tweak the results as you like.

**Note:** Once you have been on the entry form the button will remember the url an act as a direkt bookmark.

Strategies & Algorithms
-----------------------

### simple random ###
Randomly fills in results ranging from 0:0 to 2:2

### popular results ###
Chooses from a list of historical ***bundesliga scores from 2008 to 2010***. The algorithm uses a weighted random function based on how many times a result occurred.

	most frequents			least frequents
	--------------          ---------------
	1:1 - 72x				5:4 - 1x
	2:1 - 61x				0:6 - 1x
	1:0 - 53x				4:4 - 1x
	0:0 - 43x				6:0 - 1x
	2:0 - 42x				5:4 - 1x
	...						...
	
### odd based tendency ###
This algorithm retrieves the current odds from [mybet.com](http://www.mybet.com/de/sportwetten/wettprogramm/fussball/deutschland/1-bundesliga) for the next weekend. It uses the tendency odds `(home|draw|guest)` together with the **popular results** frequencies for weighting.

If you try to use this algorithm for games that don't have odds on mybet yet, it will gracefully fall back to **popular results**.

**Feel free to fork this project and add you own algorithms and ideas.**
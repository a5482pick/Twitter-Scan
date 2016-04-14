function beginBackground() {

    //Limit the pages that the browser action may be used on.
    chrome.tabs.onCreated.addListener(function(tab) {
    
        if (!tab.url.match(/twitter/))  {

            chrome.browserAction.disable(tab.id);
        }
    });
   
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
        //If an updated tab is reloaded, disable the browser action using a repeated function.
        setInterval(function() {
    
            if (!changeInfo.url.match(/twitter/)) {
        
                chrome.browserAction.disable(tabId);
            }
        }, 1000);
    });
    
    
    //The following commences whenever the browser action is pressed.
    chrome.browserAction.onClicked.addListener(function(tab) {
  
        //If trying to activate on a non-twitter page.    
        if (!tab.url.match(/twitter/)) {
        
            alert("Need a twitter.com url."); //(Not really required.)
        }
        
        else {
        
            //Tell content.js to open a new tab to list all the relevant tweets in real time.
            chrome.tabs.query({url : "*://twitter.com/*", active : true}, function (tab) {
            
                chrome.browserAction.disable(tab[0].id);
                chrome.tabs.sendMessage(tab[0].id, {message: "initiate", url: tab[0].url});   
            });
    
    
            //Listen for new tweets AFTER page action has been pressed once.
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
                if (tab.url.match(/twitter/)) {  
                
                    chrome.tabs.sendMessage(tabId, {message: "buttonClicked", url: tab.url});
                }
            });
        } 
    });
}


//The extension begins here.
beginBackground();

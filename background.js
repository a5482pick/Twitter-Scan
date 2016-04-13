function beginBackground() {

    
    //The following commences whenever the PageAction is pressed.
    chrome.browserAction.onClicked.addListener(function(tab) {
    

        //Tell content.js to open a new tab to list all the relevant tweets in real time.
        chrome.tabs.query({url : "*://twitter.com/*", active : true}, function (tab) {
    
            chrome.tabs.sendMessage(tab[0].id, {message: "initiate"});   
        });
    
    
        //Listen for new tweets AFTER page action has been pressed once.
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
            if (tab.url.match(/twitter/)) {  
                
                chrome.tabs.sendMessage(tabId, {message: "buttonClicked"});
            }
        }); 
    });
}


//The extension begins here.
beginBackground();

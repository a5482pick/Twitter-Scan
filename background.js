function beginBackground() {

    //When tab updates, make the page action visible if it's a twitter.com page.
    function checkUrl(tabId, changeInfo, tab) {

        if (tab.url.match(/twitter/))  {

            chrome.pageAction.show(tabId);
        }
    };

    //Listen for changes to tabs.
    chrome.tabs.onUpdated.addListener(checkUrl);
    
    
    //The following commences whenever the enabled page action is pressed.
    chrome.pageAction.onClicked.addListener(function(tab) {
  
        //If trying to activate on a non-twitter page.    
        if (!tab.url.match(/twitter/)) {
        
            alert("Need a twitter.com url."); //(Not really required.)
        }
        
        else {
        
            //Tell content.js to open a new tab to list all the relevant tweets in real time.
            chrome.tabs.query({url : "*://twitter.com/*", active : true}, function (tab) {
            
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

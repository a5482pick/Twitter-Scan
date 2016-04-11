function beginBackground() {

    //Time variables are declared.  These will be used to igonore too rapid updates.
    var time;
    var timeOld = 0;


    //The following commences whenever the extension button is pressed.
    chrome.browserAction.onClicked.addListener(function(tab) {
    
    
        //Tell content.js to open a new tab to list all the relevant tweets in real time.
        chrome.tabs.query({url : "*://twitter.com/*"}, function (tab) {
    
             for (var i = 0; i < tab.length; i++) {
        
                chrome.tabs.sendMessage(tab[i].id, {message: "initiate"});           
            }
        });
    
    
        //Listen for array of tweets returned by content.js.
        chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        
            var dataObject = request.message;
        });
    
    
        //Send the message to all active twitter tabs immediately.
        chrome.tabs.query({url : "*://twitter.com/*"}, function (tab) {
    
            for (var i = 0; i < tab.length; i++) {
        
                chrome.tabs.sendMessage(tab[i].id, {message: "buttonClicked"});           
            }
        });
        
        
        
        //Send the message to content.js whenever the twitter tabs update.
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            
            //Time will be used to count only one update per reload.      
            time = Date.now() - timeOld;
            
            //Set the interval to 1500ms.
            if (time > 1500) {
        
                timeOld = Date.now();
            
                if (tab.url.match(/twitter/)) {  
                
                    chrome.tabs.sendMessage(tabId, {message: "buttonClicked"});
                }
            }
        });   
    });
}


//The extension begins here.
beginBackground();

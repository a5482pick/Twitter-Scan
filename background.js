function beginBackground() {


    //The following commences whenever the extension button is pressed.
    chrome.browserAction.onClicked.addListener(function(tab) {
    
    
    
        //Listen for array of tweets returned by content.js.
        chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
        
            var dataObject = request.message;
            alert(dataObject[3]);
        });
    
    
    
        //Send the message to all active twitter tabs immediately.
        chrome.tabs.query({url : "*://twitter.com/*"}, function (tab) {
    
            for (var i = 0; i < tab.length; i++) {
        
                chrome.tabs.sendMessage(tab[i].id, {message: "buttonClicked"});           
            }
        });
        
        
        
        //Send the message whenever the twitter tabs update.
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
            if (tab.url.match(/twitter/)) {  
                
                chrome.tabs.sendMessage(tabId, {message: "buttonClicked"});
            }
        });   
    });
}


//The extension begins here.
beginBackground();

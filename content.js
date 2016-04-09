//Listen for message from background.js
chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {
    
        if( request.message === "buttonClicked" ) {
       
            if (document.readyState === "complete") { 
                
                //Automatically 'click' to load new tweets.
                var elements = document.body.getElementsByClassName("new-tweets-bar");
            
                for (i = 0; i < elements.length; i++)  {
            
                    elements[i].click(); 
                } 
            }      
        }
    }
);

//Listen for message from background.js
var numNewTweets = 0;

chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {
    
        if( request.message === "buttonClicked" ) { 
            
            if (document.readyState === "complete") { 
                      
                //Get the 'new tweets' bar.
                var elements = document.body.getElementsByClassName("new-tweets-bar");
                
                if (elements) {
                      
                    for (i = 0; i < elements.length; i++)  {
                        
                        //Store number of new tweets.
                        numNewTweets = parseInt(elements[i].innerText);
                        
                        //Load the new tweets.
                        elements[i].click(); 
                    } 
                }            
                
                
                //Manipulate text and colur of new tweets.
                var pElementArray = document.getElementsByTagName("p");
                var classNameArray = [];
                var j = 0;
                
                
                //For every p element on the page...
                for (i = 0; i < pElementArray.length; i++)  {


                    //Find p elements with correct class name.
                    if (pElementArray[i].className.match(/[\w-]*js-tweet-text tweet-text[\w-]*/g)) {
                    
                        //These elements are the new tweets, so store them.  
                        classNameArray[j] = pElementArray[i].className;
                    
                   
                        if (j < numNewTweets) {
                        
                            //Make new tweets green.           
                            pElementArray[i].style.color = "green"; 
                        }
                    
                        else {
                         
                            //Make old tweets red. 
                            pElementArray[i].style.color = "red";
                        }
                        
                        //Only increment j if the p element's class name matches.
                        j++;
                    }
                }
            }      
        }
    }
);


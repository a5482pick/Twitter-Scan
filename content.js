var numNewTweets = 0.9;        
var dataObject = {};
var myWindow;


//Listen for message from background.js
chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {

        //Called only when the page action button is pressed.  Initialies a blank tab to store tweets.
        if( request.message === "initiate" ) {
        
            myWindow = window.open("");
            myWindow.document.write("<title>New Tweets Collection</title>");
            myWindow.document.write("<i>(Any new tweets will be listed here in real time.  The first tweet is presented for demonstration.)</i>");
        }
    
        //Called when page action is pressed AND when a relevant tab automatically updates.
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
                     
                           
                //Manipulate text and colour of new tweets.
                //Collect all 'p' elements.
                var pElementArray = document.getElementsByTagName("p");
                
                //An array to store all the tweet-containing p elements.
                var tweetElementArray = [];
                var j = 0;
                
                
                //For every p element on the page...
                for (i = 0; i < pElementArray.length; i++)  {


                    //Find p elements with correct class name.
                    if (pElementArray[i].className.match(/js-tweet-text tweet-text/g)) {
                    
                        //These elements are the tweets, so store them.  
                        tweetElementArray[j] = pElementArray[i];
                    
                   
                        if (j < numNewTweets) {
                        
                            //Make new tweets green.           
                            tweetElementArray[j].style.color = "green"; 
                            
                            //Store the new tweets in an array.                           
                            dataObject[j] = tweetElementArray[j].innerText;   
                            
                            //Output the tweets to a new window.
                            myWindow.document.write("<p>" + dataObject[j] + "</p>");                
                        }
                    
                        else {
                         
                            //Make old tweets red. 
                            tweetElementArray[j].style.color = "red";
                        }
                        
                        //Only increment j if the p element's class name matches.
                        j++;
                    }
                }

                //After the 'for loop' has finished, the storage of the tweets is demonstrated.
                chrome.storage.local.set(dataObject, function() {
                
                    //Return the stored data to background.js.
                    chrome.runtime.sendMessage({message: {dataObj : dataObject, messageId : '1'}});  
                });  
            }     
        }
    }
);


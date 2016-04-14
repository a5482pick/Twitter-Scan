var numNewTweets = 0;        
var myWindow;
var RE;      //For the filter criteria.
var urlKey;
var storeObject = {};
var clear = 0;

//Listen for message from background.js
chrome.runtime.onMessage.addListener(

    
    function(request, sender, sendResponse) {


        //Called once, immediately when 'browser action' is pressed.
        if( request.message === "initiate") {
        
            //The url of the calling tab.  Needed for storage key.
            urlKey = request.url;
            
            
            //Get any stored tweets from a previous run.
            chrome.storage.local.get(function(stored) {
        
                
                //Open a new window to display any stored tweets from a previous run.
                oldDataWin = window.open("");
                oldDataWin.document.write("<title>Previously stored tweets.</title>");
                oldDataWin.document.write("<i>(Any tweets from a previous TwitterScan session will be listed here, with their tweet's url. &nbsp;The first line is the number of tweets.)</i>");

                //Loop over all tweets in the stored object, to output them to oldDataWin tab.
                for (x in stored)   {
            
                    for (y in stored[x]) {
            
                        oldDataWin.document.write("<p>" + x + " &nbsp;&nbsp; " + stored[x][y+""] + "</p>");
                        
                        //stored[x][0] says where the first vacant location is e.g. 4 tweets means stored[x][0]=5.
                        if (stored[x][0 + ""] > 1) {
                        
                            clear = 1;
                        }
                    }
                }   
              
              
                //Define a 2d object.
                storeObject[urlKey] = {};
              
              
                //If clear = 1, we offer to delete the stored data from memory.
                if (clear == 1) {
                
                    if (confirm("Memory from a previous session has been listed.  Click OK to clear memory, cancel to not clear."))  {

                        chrome.storage.local.clear(function(){});
                        
                        storeObject[urlKey][0 + ""] = 1;
                    }
                }
     
            
                //Prompt user for selection criteria.
                var searchTerm = window.prompt("Enter your new search term.");
                
                //Selection criteria.
                RE = new RegExp(searchTerm, 'gi');
            
            
                //Create the new tab for listing new tweets.
                myWindow = window.open("");
                myWindow.document.write("<title>New Tweets Collection</title>");
                myWindow.document.write("<i>(Keep this tab open to list new tweets in real time. &nbsp;If the first tweet matches it's shown immediately, for demonstration.)</i>");
            
            
                //Collect all 'p' elements.
                var pElementArray = document.getElementsByTagName("p");
            
                //An array to store all the tweet-containing p elements.
                var tweetElementArray = [];
                var j = 0;
            
            
                //For every p element on the page...
                for (i = 0; i < pElementArray.length; i++)  {
            
                    //Find p elements with correct class name.  This subset will be labelled with a j.
                    if (pElementArray[i].className.match(/js-tweet-text tweet-text/g)) {
                    
                        //The inner text of theses elements are the tweets, so store them.  
                        tweetElementArray[j] = pElementArray[i];
                    
                        //Make all tweets red.
                        tweetElementArray[j].style.color = "red";
                    
                        //Increment to next free position.
                        j++;
                    }
                }
            
            
                //For demonstration, make the 1st tweet green, and output it to the new window if appropriate.
                tweetElementArray[0].style.color = "green";
            
                //Filter tweet, then output it to designated tab.
                if (tweetElementArray[0].innerText.match(RE))  {
             
                    myWindow.document.write("<p>" + tweetElementArray[0].innerText + "</p>");
                }
            });//End 'store get'.           
        }//End immediate action from browser-action press request.
    
    
/*----------------------------------------------------------------------------------*/

    
        //Called when browser-action is pressed AND when new tweets become available.
        if( request.message === "buttonClicked" ) { 
           
           
            //The url of the calling tab.
            urlKey = request.url;
           
            //Define 2d object.
            storeObject[urlKey] = {};
            
            //Get the 'new tweets' bar.
            var elements = document.body.getElementsByClassName("new-tweets-bar");
                
                
            //If the new-tweets-bar exists, get the number of new tweets and load them.
            if (elements) {
                      
                for (i = 0; i < elements.length; i++)  {
                        
                    //Store number of new tweets.
                    numNewTweets = parseInt(elements[i].innerText);
                        
                    //Load the new tweets.
                    elements[i].click(); 
                } 
            }
                
                
            //Only output when the update creates new tweets.
            if (numNewTweets) {    
                                 
                                 
                //Collect all 'p' elements.
                var pElementArray = document.getElementsByTagName("p");
                
                //An array to store all the tweet-containing p elements.
                var tweetElementArray = [];
                var j = 0;
                
                
                //For every p element on the page...
                for (i = 0; i < pElementArray.length; i++)  {


                    //Find p elements with correct class name.
                    if (pElementArray[i].className.match(/js-tweet-text tweet-text/g)) {
                    
                        //Inner text of these elements are the tweets, so store them.  
                        tweetElementArray[j] = pElementArray[i];
                    
                   
                        if (j < numNewTweets) {
                      
                            //Make new tweets green.           
                            tweetElementArray[j].style.color = "green"; 
                            
                            
                            //Output the tweets to a new window if not discarded, and add them to the storage object.
                            if (tweetElementArray[j].innerText.match(RE))  {
                            
                                myWindow.document.write("<p>" + tweetElementArray[j].innerText + "</p>"); 
                                storeObject[urlKey][j + "" + storeObject[urlKey][0 + ""]  ] = tweetElementArray[j].innerText;  
                                
                                //Only increment j if the p element's class name matches.
                                j++; 
                            }          
                        }
                    
                        else {
                         
                            //Make old tweets red. 
                            tweetElementArray[j].style.color = "red";
                        }
                                
                    }//End if.
                    
                }//End for.
                
                //Tell memory where the first unused location is, and store all the tweets.
                storeObject[urlKey][0 +""] = j;
                chrome.storage.local.set(storeObject);
                
            }//End if (numNewTweets). 
           
            //Reset the number of new tweets, so the process can begin again.
            numNewTweets = 0;  
            
        }//End if ("buttonClicked").
    }
);


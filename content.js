var numNewTweets = 0;        
var myWindow;
var RE;      //For the filter criteria.
var urlKey;
var j;
var num = 1;
var bracket;
var clear;


//Listen for message from background.js
chrome.runtime.onMessage.addListener(

    
    function(request, sender, sendResponse) {


        //Called once, immediately when 'browser action' is pressed.
        if( request.message === "initiate") {
        
        
            //The url of the calling tab.  Needed for storage key.
            urlKey = request.url;           
            
            //Define a 2d object. 
            var storeObject = {}; 
            storeObject[urlKey] = {};
            storeObject[0 + " "] = {};      //To hold current position in the storage 'array'.
            
            //Get any stored tweets from a previous run.
            chrome.storage.local.get(function(stored) {
        
                
                //Open a new window to display any stored tweets from a previous run.
                oldDataWin = window.open("");
                oldDataWin.document.write("<title>Previously stored tweets.</title>");
                oldDataWin.document.write("<i>(Any storage indices and their tweets from a previous TwitterScan session will be listed here. &nbsp;When listed, the first unfilled storage location is the value at 0 0.)</i>");


                //Loop over all tweets in the stored object, to output them to oldDataWin tab, and assign them to the 2d object.
                for (x in stored)   {
                
                    storeObject[x] = stored[x];
            
                    for (y in stored[x]) {
            
                        oldDataWin.document.write("<p>" + x + " &nbsp;&nbsp; " + y + " &nbsp;&nbsp; " + " &nbsp;&nbsp; " + stored[x][y] + "</p>");
                        storeObject[x][y] = stored[x][y];     
                    }
                }   
                
                clear = 0;
                
                //A current position > 1 means there is storage, so offer to clear.
                if (storeObject && (storeObject[0 + " "][0 + " "] > 1)) {
                
                    if (confirm("Memory from a previous session has been listed.  Click OK to clear memory, cancel to not clear."))  {

                        chrome.storage.local.clear(function(){});
                        
                        storeObject[0 + " "][0 + " "] = 1;
                        clear = 1;
                    }
                }
                
                
                //This initialises an undefined initial position.
                if (!storeObject[0 + " "][0 + " "]) {
                
                    storeObject[0 + " "][0 + " "] = 1;
                }
                
                //Assign position to a defined script variable.
                num = storeObject[0 + " "][0 + " "];
                
                //Store the (possibly changed) data.
                if (clear != 1)   {
                
                    chrome.storage.local.set(storeObject);
                }
                     
            });//End 'store get'.

            
            //Prompt user for selection criteria.
            var searchTerm = window.prompt("Enter your new search term.", "a");
                
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
            
            //Index used in storage.
            j = 0;
            
            
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
                      
        }//End immediate action from browser-action press request.
    
    
/*--------------------------------------------------------------------------------------------------------------*/

    
        //Called when browser-action is pressed AND when new tweets become available.
        if( request.message === "buttonClicked" ) { 
           
           
            //The url of the calling tab.
            urlKey = request.url;
            
            
            //Get any old stored data.
            chrome.storage.local.get(function(storeObject) {
         
         
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
                
                    //Initialise a storage variable.
                    j = 0;
                
                
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
                                    
                                    //The first free position in the storage array.
                                    bracket = j + num;
                                    
                                    myWindow.document.write("<p>" + tweetElementArray[j].innerText + "</p>"); 
                                    storeObject[urlKey][bracket + " "] = tweetElementArray[j].innerText;  
                                
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
                    storeObject[0 + " "][0 + " "] = bracket + 1;
                    chrome.storage.local.set(storeObject);
                
                }//End if (numNewTweets). 
           
                //Reset the number of new tweets, so the process can begin again.
                numNewTweets = 0;  
            });          
        }//End if ("buttonClicked").
    }
);


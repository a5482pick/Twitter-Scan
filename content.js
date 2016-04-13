var numNewTweets = 0;        
var dataObject = {};
var myWindow;
var newTab = 0;

//Listen for message from background.js
chrome.runtime.onMessage.addListener(

    function(request, sender, sendResponse) {


        //Called once, immediately when 'page action' is pressed.
        if( request.message === "initiate" && newTab == 0) {
            

            //Limit to only one blank page created, per twitter tab id.
            newTab = 1;
            
            //Create the new tab for listing new tweets.
            myWindow = window.open("");
            myWindow.document.write("<title>New Tweets Collection</title>");
            myWindow.document.write("<i>(Keep this tab open to list new tweets in real time.  The first tweet is presented already, for demonstration.)</i>");
            
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
            
            //For demonstration, make the 1st tweet green, and output it to the new window.
            tweetElementArray[0].style.color = "green";
            myWindow.document.write("<p>" + tweetElementArray[0].innerText + "</p>");
        }
    
    
        //Called when page action is pressed AND when new tweets become available.
        if( request.message === "buttonClicked" ) { 
           
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
                            
                            //Output the tweets to a new window.
                            myWindow.document.write("<p>" + tweetElementArray[j].innerText + "</p>");              
                        }
                    
                        else {
                         
                            //Make old tweets red. 
                            tweetElementArray[j].style.color = "red";
                        }
                        
                        //Only increment j if the p element's class name matches.
                        j++;
                    }//End if.
                }//End for.
            }//End if (numNewTweets). 
            numNewTweets = 0;  
        }//End if ("buttonClicked").
    }
);


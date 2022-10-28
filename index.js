import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// Listen for any events on the UI
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.id === 'switch') {
        handleMode()
    } 
    else if (e.target.dataset.erase) {
        handleErase(e.target.dataset.erase)
    }
    else if (e.target.dataset.comment) {
        handleComment(e.target.dataset.comment)
    }
})
 
 // Like a tweet
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

// Retweet a tweet
function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

// Display replies
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// Create a tweet
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Anonymous`,
            profilePic: `images/anonymous.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

// Light and Dark mode
function handleMode() {
    document.body.classList.toggle('dark')
}

// Delete a tweet
function handleErase(tweetId) {
    tweetsData.forEach((tweet) => {
        if(tweet.uuid === tweetId) {
            const index = tweetsData.indexOf(tweet);
            tweetsData.splice(index,1);
            render();
        }
    })
}

// Add reply
function handleComment(tweetId) {
    const comment = document.getElementById(`comment-${tweetId}`)
    tweetsData.forEach((tweet) => {
        if(comment.value){
            if(tweet.uuid === tweetId) {
            tweet.replies.unshift({
                handle: `@Anonymous`,
                profilePic: `images/anonymous.png`,
                tweetText: `${comment.value}`,
            
            })}
            render()
        }
    })
}

// Compile TweetData
function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>
            <div class="reply-ui">
            <img src="images/anonymous.png" class="profile-pic reply-pic">
            <input id="comment-${tweet.uuid}" class="reply" placeholder="Tweet your reply"/>
            </div>
            <button data-comment=${tweet.uuid} id="reply" >Reply</button>
        </div>  
        <i class="fa-regular fa-trash-can" data-erase=${tweet.uuid}></i>          
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

// Render UI
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


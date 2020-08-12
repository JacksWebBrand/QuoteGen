const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('error-message');
i = 1;

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}


function hideLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

function errorHandle() {
    if (i < 5) {
        getQuote(); //initialise this when the api calls are working (currently getting 429)
        console.log('whoops, no quote received by the api');
        return(i++);
        } else
        console.log('The api has rejected our requests too many times - please wait and try again later, since the api will only handle so-many requests per hour');
        errorMsg.innerText = 'The api has rejected our requests too many times :( Please wait and try again later. The api will only handle so-many requests per hour';
        loader.hidden = true;
}

// Get quote from api
async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        // If author is blank
        if (data.quoteAuthor === '') {
            authorText.innerText = '~ Unknown';
        } else {
            authorText.innerText = ('~ ' + data.quoteAuthor);
        }
        // Reduce font size for longer quotes
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        hideLoadingSpinner();
    } catch (error) {
        errorHandle()
    }
}

// Tweet quote

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event listeners

newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

//On Load
getQuote();
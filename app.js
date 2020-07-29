//
// ─── UI ELEMENTS ────────────────────────────────────────────────────────────────
//


let deck = document.querySelector('#deck');
let form = document.querySelector('#search-form');
let loadingAnimation = document.querySelector('#loading');
let searchBox = document.querySelector('#search');
let messageContainer = document.querySelector('#message');
let messageContent = document.querySelector('#message-content');


//
// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
//


// Shows a message under the search box
function showMessage(message) {
    messageContainer.classList.remove('hidden');
    messageContent.textContent = message;
}


// Clears the UI elements: search box content, 'no results' message and the loading animation
function clearUI() {
    searchBox.value = '';
    messageContainer.classList.add('hidden');
    setTimeout(() => {
        loadingAnimation.classList.toggle('hidden');
    }, 1000);
}


// Load the ids of the items obtained from the given search query
function loadIds(query) {

    axios
        .get(`http://www.omdbapi.com/?s=${query}&apikey=thewdb`)
        .then(res => {
            let items = res.data["Search"];
            if (items) {
                items.forEach((item, index) => {
                    if (index < 9)
                        loadItem(item["imdbID"]);
                });
            } else {
                showMessage('No results found');
            }

        })
        .catch(err => console.log(err));
}


// Gets the item(movie, tv show, etc) data from the API given its id
function loadItem(id) {
    axios
        .get(`http://www.omdbapi.com/?i=${id}&apikey=thewdb`)
        .then(res => {
            let item = res.data;
            appendItem(item);
        })
        .catch(err => console.log(err));
}


// Appends a card to the deck
function appendItem(item) {
    let card = document.createElement('div');
    card.className = 'col-lg-4 col-sm-6 mb-4';

    // Poster
    let poster = item["Poster"];
    let posterFragment = ''; // HTML fragment for the poster of the card
    if (poster !== 'N/A') {
        posterFragment = `
            <div class="col-md-4">
                <img src="${poster}" class="card-img" alt="Poster">
            </div>
        `;
    }

    // Imdb rating
    let IMDBRating = item['imdbRating'];

    // Rotten tomatoes rating
    let RTRating = 'N/A';
    let RTFragment = ''; // HTML fragment for the Rotten Tomatoes score
    if (item['Ratings'][1] !== undefined) {
        RTRating = item['Ratings'][1]['Value'];
    }
    if (RTRating !== 'N/A') {
        RTFragment = `
                    <div class="d-flex flex-column">
                        <div class="row justify-content-start align-items-center mb-2">
                            <div class="col"><img class="icon" src="img/rotten_tomatoes.png"
                                    alt="Rotten Tomatoes"></div>
                            <div class="col"><span class="score score-yellow">${RTRating}</span></div>
                        </div>
                    </div>
                    `;
    }

    // Metascore rating
    let MSRating = item['Metascore'];
    let MSFragment = ''; // HTML fragment for the Metacritic score
    if (MSRating !== 'N/A') {
        MSFragment = `
                    <div class="d-flex flex-column">
                        <div class="row justify-content-start align-items-center mb-2">
                            <div class="col"><img class="icon" src="img/metacritic.png" alt="Metacritic">
                            </div>
                            <div class="col"><span class="score score-yellow">${MSRating}</span></div>
                        </div>
                    </div>
                    `;
    }


    // Card element
    card.innerHTML = `
        <div class="card bg-dark mb-3" style="max-width: 540px;">
            <div class="row no-gutters"> ` +
        `${posterFragment}` +
        `    
                <div class="col-md-8">
                    <div class="card-body">
                        <a href=https://www.imdb.com/title/${item["imdbID"]}><h5 class="card-title">${item['Title']}<span class="item-year">  (${item['Year']})</span></h5></a>
                        <p>${item['imdbVotes']} IMDB votes</p>
                        <div class="d-flex flex-column">
                            <div class="row justify-content-start align-items-center mb-2">
                                <div class="col"><img class="icon" src="img/imdb.png" alt="IMDb"></div>
                                <div class="col"><span class="score score-yellow">${IMDBRating}</span></div>
                            </div>
                        </div>
                        ` +
        `${MSFragment}` +
        `${RTFragment}` +
        `
                    </div>
                </div>
            </div>
        </div>
    `;

    deck.appendChild(card);
}


//
// ─── EVENT LISTENERS ────────────────────────────────────────────────────────────
//


// Listen for the search form submit
form.addEventListener('submit', e => {

    // Clear the deck
    deck.innerHTML = '';

    // Get the query value
    const query = searchBox.value;

    // Show loading image
    loadingAnimation.classList.toggle('hidden');

    // Load the items
    loadIds(query);

    // Clear the UI
    clearUI();

    // Prevent default submit action
    e.preventDefault();
});
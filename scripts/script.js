// Hero-Museum Slector
// fn1: (Nice to have) Populate museum selector based on available museums
// fn2: form handler store local variable based on museum filter

// Hero-collection Slector
// fn1: Populate collection selctor based on available collections
// fn2: form handler store local variable based on colection selection

// Hero-Image-Card
// fn1: Function that fetches artwork array for hero (may be filtered)
// fn2: manipulate DOM to display artwork & info
// fn3: event listerer & functions to rate/save artowork
// fn3: event listener & function to move artwork side to side

// Collections
// fn1: create collection + name
// fn2: fetch all collections & display them
// fn3: fetch all artworks in the collectio & display them
// fn4: delete collection
// fn5: delete artwork from collection


// CODE STARTS HERE

// Globals Variables
let museumList = []
let artworkList = []
let collectionList = [1]

// API Globals
const curatedApi = 'http://localhost:3000'
const requestHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

// API CALL: Query museums & populate Museum Picklist
const populateMusuemSelect = function() {
    fetch (`${curatedApi}/museums`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (museums => museums.forEach(museum => {
        domUpdateMuseumSelectOption(museum)
    }))
    .catch (error => console.error(`${error.message}`))
}

// HELPER: Populate musuem picklist
const domUpdateMuseumSelectOption = function(museum) {

        let selectForm = document.querySelector('select#museum-select')
        let newOption = document.createElement('option')
        newOption.setAttribute('value',museum.id)
        newOption.innerText = museum.name
        
        selectForm.appendChild(newOption)
}

// API CALL: Query collections & populate collection picklist
const populateCollectionSelect = function() {
    fetch (`${curatedApi}/collections`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (collections => collections.forEach(collection => {
        domUpdateCollectionSelectOption(collection)
    }))
}

// HELPER: Populate collection picklist
const domUpdateCollectionSelectOption = function(collection) {
    let selectForm = document.querySelector('select#collection-select')
    let newOption = document.createElement('option')
    newOption.setAttribute('value',collection.id)
    newOption.innerText = collection.name
    
    selectForm.appendChild(newOption)
}

// API CALL: Search & return array of artworks
const searchArtworkApi = function(museum = 'all') {
    let searchQuery = ''
    if (museum !== 'all') {searchQuery = `?museum=${museum}`}
    
    fetch (`${curatedApi}/artworks${searchQuery}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (artworks => {
        artworkList = []
        
        populateArtworkList(artworks)
        populateHeroImage(artworkList[0])
        populateHeroInfo(artworkList[0])

        console.log(artworkList)
    })
    .catch (error => console.error(`${error.message}`))
}

// HELPER: Populate artwork list
const populateArtworkList = function(artworks) {
    artworks.forEach(artwork => artworkList.push(artwork))
}

// HELPER: Populate Hero Image, Title, and Rating (right pane) based on artwork
const populateHeroImage = function(artwork) {

    let heroTitle = `${artwork.title}, ${artwork.artist}`
    let heroImage = `${artwork.file.preferred.url}`
    let heroRating = artwork.rating || 0

    document.getElementById('hero-title').innerText = heroTitle
    document.getElementById('hero-img').src = heroImage
    document.getElementById('rating-select').value = heroRating

}

// HELPER: Populate Hero Info (right pane) based on artwork
const populateHeroInfo = function(artwork) {

    // Iterate li elements
    const createListItem = function(keyText, valText) {
        let liElement = document.createElement('li')
        let strongElement = document.createElement('strong')
        
        liElement.innerText = valText
        strongElement.innerText = keyText
        liElement.prepend(strongElement)

        document.getElementById('artwork-info-list').appendChild(liElement)
    }

    // Delete exisiting li elements
    document.getElementById('artwork-info-list').innerHTML = ''

    // Can enhance this to iterate over object
    createListItem('Artist: ', `${artwork.artist} ${artwork.artist_lifespan}`)
    createListItem('Artwork Date: ', artwork.date)
    createListItem('Museum: ', artwork.museum)
    createListItem('Genre: ', artwork.genre)
    createListItem('Medium: ', artwork.medium)

}

// HELPER: Upate the DOM to have a particular artwork in focus. Takes array+index or individual artwork
const populateHero = function(artworks, arrIndex = 0) {
    
    // Handle object vs array
    let newArtworks = []
    if (!Array.isArray(artworks)) {newArtworks.push(artworks)}
    else newArtworks = [...artworks]

    populateHeroImage(newArtworks[arrIndex])
    populateHeroInfo(newArtworks[arrIndex])
}

// searchArtworkApi(artworkApi)
// searchArtworkApi(artworkApi, 'Tate Britain')


// Initialze page
populateMusuemSelect()
populateCollectionSelect()
searchArtworkApi()

// Add Event Handlers
const handleClick = function(event) {
    let museumId = document.getElementById('museum-select').value
    console.log(museumId)
    searchArtworkApi(museumId)
}

// Add Event Listeners
document.getElementById('search-artwork').addEventListener('click', handleClick)
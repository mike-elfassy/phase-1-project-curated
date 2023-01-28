// Hero-Image-Card
// fn3: event listerer & functions to rate/save artwork

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
let artworkListIndex = 0
let collectionList = []

// API Globals
const curatedApi = 'http://localhost:3000'
const requestHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

// API CALL: Query museums & populate Museum Picklist + stores museums locally
const populateMusuemSelect = function() {
    fetch (`${curatedApi}/museums`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (museums => {
        museumList = [...museums]
        museums.forEach(museum => domUpdateMuseumSelectOption(museum))
    })
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
    .then (collections => {
        collectionList = [...collections]
        collections.forEach(collection => domUpdateCollectionSelectOption(collection))
    })
}

// HELPER: Populate collection picklist
const domUpdateCollectionSelectOption = function(collection) {
    let selectForm = document.querySelector('select#collection-select')
    let newOption = document.createElement('option')
    newOption.setAttribute('value',collection.id)
    newOption.innerText = collection.name
    
    selectForm.appendChild(newOption)
}

// HELPER: Populate Collection Container with new collection cards
const domUpdateCollectionList = function(collection) {
    let collectionContainerDiv = document.getElementById('collections-container')
    let newCollectionCard = document.createElement('div')
    newCollectionCard.innerHTML = (`
        <div class="collection-card">
            <div class="header collection-header">
                <h2 class="collection-name">${collection.name}</h2>
                <button class="rename-collection">Edit</button>
                <button class="delete-collection">X</button>
            </div>
            <div class="collection-flex-grid"></div>
        </div>
    `)
    console.log(newCollectionCard)
}

// API CALL: Search & return array of artworks
const searchArtworkApi = function(museumName = 'all') {
    let searchQuery = ''
    if (museumName !== 'all') {searchQuery = `?museum=${museumName}`}
    
    fetch (`${curatedApi}/artworks${searchQuery}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (artworks => {
        populateArtworkList(artworks)
        artworkListIndex = 0
        populateHero(artworkList[artworkListIndex])
    })
    .catch (error => console.error(`${error.message}`))
}

// HELPER: Populate artwork list
const populateArtworkList = function(artworks) {
    artworkList = []
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

// HELPER: Update artwork array index for navigation
const calculateNewArtworkListIndex = function(currentIndex, increment, artworkList) {
    let newIndex = currentIndex + increment

    if (newIndex >= artworkList.length) {newIndex = 0}
    else if (newIndex < 0) {newIndex = artworkList.length - 1}

    return newIndex
}



// Initialze page
populateMusuemSelect()
populateCollectionSelect()
searchArtworkApi()





// Add Event Handlers
const handleSearchClick = function(event) {
    let museumId = document.getElementById('museum-select').value
    let museum = museumList.find(museum => museum.id == museumId)
    let museumName = 'all'
    if (museum) {museumName = museum.name}
    searchArtworkApi(museumName)
}

const handleNav = function(event) {
    let direction = 0
    if (event.type === 'keydown') {
        if (event.code === 'ArrowLeft') {direction = -1}
        else if (event.code === 'ArrowRight') {direction = 1}
        else {return}
    }
    else if (event.type === 'click') {
        if (event.target.id === 'nav-left') {direction = -1}
        else if (event.target.id === 'nav-right') {direction = 1}
        else {return}
    }
    else {return}

    // Update Hero Image
    artworkListIndex = calculateNewArtworkListIndex(artworkListIndex, direction, artworkList)
    populateHero(artworkList[artworkListIndex])
}

// Add Event Listeners
document.getElementById('search-artwork').addEventListener('click', handleSearchClick)
document.querySelectorAll('button.left-right-button').forEach(node => node.addEventListener('click', handleNav))
addEventListener('keydown', handleNav)
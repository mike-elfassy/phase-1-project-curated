// Hero-Image-Card
// fn3: event listerer & functions to rate/save artwork
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
let artworkListIndex = 0
let collectionList = [1]

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
        museums.forEach(museum => {domUpdateMuseumSelectOption(museum)})
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
    console.log(artworkListIndex)
    if (event.type === 'keydown') {
        if (event.code === 'ArrowLeft') {artworkListIndex--}
        else if (event.code === 'ArrowRight') {artworkListIndex++}
        else {return}
    }
    else if (event.type === 'click') {
        if (event.target.id === 'nav-left') {artworkListIndex--}
        else if (event.target.id === 'nav-right') {artworkListIndex++}
        else {return}
    }
    else {return}

    console.log(artworkListIndex)
}

// Add Event Listeners
document.getElementById('search-artwork').addEventListener('click', handleSearchClick)
document.querySelectorAll('button.left-right-button').forEach(node => node.addEventListener('click', handleNav))
addEventListener('keydown', handleNav)
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
        domCreateMuseumSelectOption(museum)
    }))
    .catch (error => console.error(`${error.message}`))
}

// HELPER: Populate musuem picklist
const domCreateMuseumSelectOption = function(museum) {
        // console.log(museum.id, museum.name, museum.slug)
        // console.log(document.querySelector('select#museum-select'))

        let selectForm = document.querySelector('select#museum-select')
        let newOption = document.createElement('option')
        newOption.setAttribute('value',museum.slug)
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
        domCreateCollectionSelectOption(collection)
    }))
}

// HELPER: Populate collection picklist
const domCreateCollectionSelectOption = function(collection) {
    let selectForm = document.querySelector('select#collection-select')
    let newOption = document.createElement('option')
    newOption.setAttribute('value',collection.id)
    newOption.innerText = collection.name
    
    selectForm.appendChild(newOption)
}

// API CALL: Search & return array of artworks
const searchArtworks = function(curatedApi, searchMuseum = '--All--') {
    let searchQuery = ''
    if (searchMuseum !== '--All--') {searchQuery = `?museum=${searchMuseum}`}
    
    fetch (`${curatedApi}/artworks${searchQuery}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (artworks => {
        artworkList = []
        populateArtworkList(artworks)
    })
    .catch (error => console.error(`${error.message}`))
}

// HELPER: Populate artwork hero
const populateArtworkList = function(artworks) {
    artworks.forEach(artwork => artworkList.push(artwork))
}

// HELPER: Upate the DOM to have a particular artwork in focus. Takes array+index or individual artwork
const heroFocus = function(artworks, arrIndex = 0) {
    
    // Handle object vs array
    let newArtworks = []
    if (!Array.isArray(artworks)) {newArtworks.push(artworks)}
    else newArtworks = [...artworks]

    // Select DOM elements
    let heroTitle = `${newArtworks[arrIndex].title}, ${newArtworks[arrIndex].artist}`
    let heroImage = `${newArtworks[arrIndex].file.preferred.url}`
    let heroRating = newArtworks[arrIndex].rating || 0
    console.log(newArtworks[arrIndex])
    console.log(heroRating)
    document.getElementById('hero-title').innerText = heroTitle
    document.getElementById('hero-img').src = heroImage
    document.getElementById('rating-select').value = heroRating

}

// HELPER: Populate Hero Info (right pane)
const populateHeroInfo = function() {
    // Iterate li elemnts
    const createListItem(keyText, valText) {
        let liElement = document.createElement('li')
        let strongElement = document.createElement('strong')
        strongElement.innerText = keyText
        liElement.appendChild(strongElement)
    }
}

// searchArtworks(artworkApi)
// searchArtworks(artworkApi, 'Tate Britain')

populateMusuemSelect()
populateCollectionSelect()
searchArtworks(curatedApi)
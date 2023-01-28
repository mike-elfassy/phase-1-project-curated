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
let localArtworkList = []
let localArtworkCurrentIndex = 0 
let localMuseumArray = []
let localCollectionList = []

// Globals API Variables
const curatedApi = 'http://localhost:3000'
const requestHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}




// HELPER: Translate 0-5 rating to stars
const ratingToStars = function(rating) {
    let stars = '☆☆☆☆☆'
    switch(rating) {
        case 0:
            stars = '☆☆☆☆☆'
            break;
        case 1:
            stars = '★☆☆☆☆'
            break;
        case 2:
            stars = '★★☆☆☆'
            break;
        case 3:
            stars = '★★★☆☆'
            break;
        case 4:
            stars = '★★★★☆'
            break;
        case 5:
            stars = '★★★★★'
            break;
        default:
            stars = '☆☆☆☆☆'
    }
    return stars
}

// HELPER: Create option node for musuems or collection selectOption
const createNodeSelectOption = function(obj) {
    let newOption = document.createElement('option')
    newOption.setAttribute('value',obj.id)
    newOption.innerText = obj.name
    
    return newOption
}

// API CALL: Query museums, save a local copy of array, and populate museum selectOptions
const apiGetMuseums = function() {
    fetch (`${curatedApi}/museums`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (museums => {
        // Save local copy of musuem array
        localMuseumArray = [...museums]

        // Populate museum selectOptoion
        let museumSelectNode = document.querySelector('select#museum-select')
        museums.forEach(museum => {
            museumSelectNode.appendChild(createNodeSelectOption(museum, 'museum'))
        })
    })
    .catch (error => console.error(`${error.message}`))
}

// API CALL: Query collections, save a local copy of array, populate collection selectOptions, and populate collections container
const apiGetCollections = function() {
    fetch (`${curatedApi}/collections`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (collections => {
        // Save a local copy of collection array
        localCollectionList = [...collections]
        
        // Populate collection selctOptions & collection container
        let collectionsSelectNode = document.querySelector('select#collection-select')
        let collectionContainerNode = document.querySelector('div#collections-container')
        collections.forEach(collection => {
            collectionsSelectNode.appendChild(createNodeSelectOption(collection))
            collectionContainerNode.appendChild(createNodeCollectionCard(collection))
        })
    })
}

// HELPER: Add single artwork to collection grid
const createNodeCollectionArtwork = function(artworkId) {
    // Get artwork object
    let newArtwork = localArtworkList.find(artwork => artwork.id === artworkId)
    newArtwork.rating = ratingToStars(newArtwork.rating || 0)
    
    // Create Node Object
    let newArtworkNode = document.createElement('div')
    newArtworkNode.id = `collection-artwork-${newArtwork.id}`
    newArtworkNode.className = `collection-artwork`
    newArtworkNode.innerHTML = (`
        <div class="collection-artwork-image">
            <img class="collection-artwork-image" src="">
        </div>
        <div class="collection-artwork-detail">
            <div class="collection-artwork-rating"></div>
            <button class="delete-button">X</button>
        </div>
    `)
    newArtworkNode.querySelector('img').src = newArtwork.file.preferred.url
    newArtworkNode.querySelector('div.collection-artwork-rating').innerText = newArtwork.rating
    
    return newArtworkNode
}

// HELPER: Populate Collection Container with new collection cards
const createNodeCollectionCard = function(collection) {
    let collectionContainerNode = document.getElementById('collections-container')
    
    // Create collection card
    let newCollectionCardNode = document.createElement('div')
    newCollectionCardNode.id = `collection-card-${collection.id}`
    newCollectionCardNode.className = 'collections-card'
    newCollectionCardNode.innerHTML = (`
            <div class="header collection-header">
                <h2 class="collection-name"></h2>
                <button class="rename-collection">Edit</button>
                <button class="delete-collection">X</button>
            </div>
            <div class="collection-flex-grid"></div>
    `)
    newCollectionCardNode.querySelector('h2').innerText = collection.name

    // Iterate over collections artworks and append art to grid
    let collectionGrid = newCollectionCardNode.querySelector('div.collection-flex-grid')
    collection.artworkIds.forEach(artworkId => {
        collectionGrid.appendChild(createNodeCollectionArtwork(artworkId))
    })
    
    return newCollectionCardNode
}

// API CALL: Query artworks (optional musem filter), save a local copy of array, and populate gallery hero
const apiGetArtworks = function(museumName = 'all') {
    let searchQuery = ''
    if (museumName !== 'all') {searchQuery = `?museum=${museumName}`}
    
    fetch (`${curatedApi}/artworks${searchQuery}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (artworks => {
        // Save a local copy of artwork array
        localArtworkList = [...artworks]
        localArtworkCurrentIndex = 0

        // Populate Gallery Hero
        populateHero(localArtworkList[localArtworkCurrentIndex])
    })
    .catch (error => console.error(`${error.message}`))
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
const calculateNewArtworkListIndex = function(currentIndex, increment) {
    let newIndex = currentIndex + increment

    if (newIndex >= localArtworkList.length) {newIndex = 0}
    else if (newIndex < 0) {newIndex = localArtworkList.length - 1}

    return newIndex
}



// Initialze page
apiGetArtworks()
apiGetMuseums()
apiGetCollections()

// Event Handler Definitions
const handleSearchClick = function(event) {
    let museumId = document.getElementById('museum-select').value
    let museum = localMuseumArray.find(museum => museum.id == museumId)
    let museumName = 'all'
    if (museum) {museumName = museum.name}
    apiGetArtworks(museumName)
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
    localArtworkCurrentIndex = calculateNewArtworkListIndex(localArtworkCurrentIndex, direction)
    populateHero(localArtworkList[localArtworkCurrentIndex])
}

// Add Event Listeners
document.getElementById('search-artwork').addEventListener('click', handleSearchClick)
document.querySelectorAll('button.left-right-button').forEach(node => node.addEventListener('click', handleNav))
addEventListener('keydown', handleNav)
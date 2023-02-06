// --------------------
//   GLOBAL VARIABLES
// --------------------

let localArtworkList = []
let localArtworkCurrentIndex = 0 
let localMuseumArray = []
let localCollectionList = []

const curatedApi = 'http://localhost:3000'
const requestHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

// --------------------
//     API Requests
// --------------------

// API GET: Query museums, save a local copy of array, and populate museum selectOptions
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

// API GET: Query collections, save a local copy of array, populate collection selectOptions, and populate collections container
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
        let collectionContainerNode = document.querySelector('div#collections-card')
        collections.forEach(collection => {
            collectionsSelectNode.appendChild(createNodeSelectOption(collection))
            collectionContainerNode.appendChild(createNodeCollectionCard(collection))
        })
    })
}

// API GET: Query artwork and populate gallery hero
const apiGetArtwork = function(artworkId) {    
    fetch (`${curatedApi}/artworks/${artworkId}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (artwork => {
        // Populate Gallery Hero
        populateHero(artwork)
    })
    .catch (error => console.error(`${error.message}`))
}

// API GET: Query artworks (optional musem filter), save a local copy of array, and populate gallery hero
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
        // Random Start
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
        }
        localArtworkCurrentIndex = getRandomInt(0, localArtworkList.length - 1)

        // Populate Gallery Hero
        populateHero(localArtworkList[localArtworkCurrentIndex])
    })
    .catch (error => console.error(`${error.message}`))
}

// API POST: Create new collection object, update collections selectOptions, and add it to the DOM
const apiPostCollection = function(collectionName = 'New Collection') { 
    fetch (`${curatedApi}/collections`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            name: collectionName,
            artworkIds:[]
        })
    })
    .then (response => response.json())
    .then (collection => {
        // Append to collection selctOptions & Collection container
        let collectionsSelectNode = document.querySelector('select#collection-select')
        let collectionContainerNode = document.querySelector('div#collections-card')
        collectionsSelectNode.appendChild(createNodeSelectOption(collection))
        collectionContainerNode.appendChild(createNodeCollectionCard(collection))
    })
    .catch (error => console.error(`${error.message}`))
}

// API DELETE: Delete collection object, update collections selectOptions, and remove it from the DOM
const apiDeleteCollection = function(collectionId = null) { 
    if (collectionId === null) {return}
    fetch (`${curatedApi}/collections/${collectionId}`, {
        method: 'DELETE',
        headers: requestHeaders
    })
    .then (() => {
        // Remove collecion from selectOptions
        let collectionsSelectOptionNode = document.querySelector(`select#collection-select option[value='${collectionId}']`)
        collectionsSelectOptionNode.remove()

        // Remove collection card from the DOM
        let collectionCardNode = document.getElementById(`collection-card-${collectionId}`)
        collectionCardNode.remove()
    })
    .catch (error => console.error(`${error.message}`))
}

// API PATCH: Delete collection object, update collections selectOptions, and remove it from the DOM
const apiPatchCollection = function(collectionId = null, collectionPatchObj = null) { 
    if (collectionId === null || collectionPatchObj === null) {return}
    fetch (`${curatedApi}/collections/${collectionId}`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify(collectionPatchObj)
    })
    .then (response => response.json())
    .then (collection => {
        // Rename collection card and selectOption
        let collectionCardNode = document.getElementById(`collection-card-${collectionId}`)
        let collectionsSelectNodeOption = document.querySelector(`#collection-select option[value="${collectionId}"]`)
        
        collectionCardNode.querySelector('.collection-name').innerText = collection.name
        collectionsSelectNodeOption.innerText = collection.name

        // Toggle edit visibility
        toggleCollectionCardNode(collectionCardNode, false)
    })
    .catch (error => console.error(`${error.message}`))
}

// API GET PATCH: Get a collection artwork array and push a new artwork
const apiGetPatchCollectionArtworkIds = function(collectionId, newArtworkId) {
    // Get collection object
    fetch (`${curatedApi}/collections/${collectionId}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (collection => {
        // Check if artwork already exists
        if (collection.artworkIds.find(artworkId => artworkId === newArtworkId)) { alert('Artwork exists in collection'); return }
        
        // Create new object that only includes the artworkIds array
        collection.artworkIds.push(newArtworkId)
        let newArtworkIdsObj = {artworkIds: [...collection.artworkIds]}
        
        // Update Server with new collection artwork array
        fetch (`${curatedApi}/collections/${collectionId}`, {
            method: 'PATCH',
            headers: requestHeaders,
            body: JSON.stringify(newArtworkIdsObj)
        })
        .then (response => response.json())
        .then (() => {
            // TBD: Update local copy of collection array
            // console.log(localCollectionList[collectionId].artworkIds)
            
            // Add new artwork to DOM in collection artwork grid
            let collectionCardNode = document.getElementById(`collection-card-${collectionId}`)
            let collectionGridNode = collectionCardNode.querySelector('.collection-flex-grid')
            collectionGridNode.appendChild(createNodeCollectionArtwork(newArtworkId))
            
        })
        .catch (error => console.error(`${error.message}`))
    })
    .catch (error => console.error(`${error.message}`))
}

// API GET PATCH: Get a collection artwork array and push a new artwork
const apiGetDeleteCollectionArtworkId = function(collectionId, deleteArtworkId) {
    // Get collection object
    fetch (`${curatedApi}/collections/${collectionId}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (collection => {
        // Create new object that only includes the modified artworkIds array
        let newArtworkIdsArr = [...collection.artworkIds]
        let deleteIndex = newArtworkIdsArr.findIndex(element => element === parseInt(deleteArtworkId))
        newArtworkIdsArr.splice(deleteIndex, 1)
        let newArtworkIdsObj = {artworkIds: [...newArtworkIdsArr]}

        // Update Server with new collection artwork array
        fetch (`${curatedApi}/collections/${collectionId}`, {
            method: 'PATCH',
            headers: requestHeaders,
            body: JSON.stringify(newArtworkIdsObj)
        })
        .then (response => response.json())
        .then (() => {
            // TBD: Update local copy of collection array
            // console.log(localCollectionList[collectionId].artworkIds)
            
            // Remove artwork from DOM in collection artwork grid
            let collectionCardNode = document.getElementById(`collection-card-${collectionId}`)
            let collectionArtworkNode = collectionCardNode.querySelector(`#collection-artwork-${deleteArtworkId}`)
            collectionArtworkNode.remove()            
        })
        .catch (error => console.error(`${error.message}`))
    })
    .catch (error => console.error(`${error.message}`))
}

// API PATCH: Update artwork rating
const apiPatchArtworkRating = function(artworkId, newRating) {
    let ratingPatchObj = {rating: parseInt(newRating)}
    fetch (`${curatedApi}/artworks/${artworkId}`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify(ratingPatchObj)
    })
    .then (response => response.json())
    .then (() => {
        // Update local copy of artwork array with new rating
        localArtworkList[localArtworkCurrentIndex].rating = newRating
    })
    .catch (error => console.error(`${error.message}`))
}

// --------------------
//    DOM MODIFIERS
// --------------------

// DOM: Create option node for musuems or collection selectOption
const createNodeSelectOption = function(obj) {
    let newOption = document.createElement('option')
    newOption.setAttribute('value',obj.id)
    newOption.innerText = obj.name
    
    return newOption
}

// DOM: Add single artwork to collection grid
const createNodeCollectionArtwork = function(artworkId) {
    // Get artwork object
    let newArtwork = Object.assign({},localArtworkList.find(artwork => artwork.id === artworkId))
    // let newArtwork = localArtworkList.find(artwork => artwork.id === artworkId)
    
    // Create Node Object
    let newArtworkNode = document.createElement('div')
    newArtworkNode.id = `collection-artwork-${newArtwork.id}`
    newArtworkNode.className = `collection-artwork`
    newArtworkNode.innerHTML = (`
        <div class="collection-artwork-image">
            <img class="collection-artwork-image" src="">
        </div>
        <div class="collection-artwork-rating"></div>
        <button class="delete-button">x</button>
    `)
    newArtworkNode.querySelector('img').src = newArtwork.file.preferred.url
    newArtworkNode.querySelector('div.collection-artwork-rating').innerText = ratingToStars(newArtwork.rating || 0)
    
    newArtworkNode.querySelector('img').addEventListener('click', handleCollectionArtworkClick)
    newArtworkNode.querySelector('button.delete-button').addEventListener('click', handleDeleteArtworkFromCollection)
    
    return newArtworkNode
}

// DOM: Populate Collection Container with new collection cards
const createNodeCollectionCard = function(collection) {
    // let collectionContainerNode = document.getElementById('collections-card')
    
    // Create collection card
    let newCollectionCardNode = document.createElement('div')
    newCollectionCardNode.id = `collection-card-${collection.id}`
    newCollectionCardNode.className = 'collections-card'
    newCollectionCardNode.innerHTML = (`
            <div class="collection-card-header">
                <h2 class="collection-name"></h2>
                <input class="collection-name-input" style="display:none" onfocus="this.value=''"></input>
                <button class="edit-collection">✎</button>
                <button class="cancel-collection" style="display:none">Cancel</button>
                <button class="rename-collection" style="display:none">Rename</button>
                <button class="delete-collection">X</button>
            </div>
            <div class="collection-flex-grid"></div>
    `)
    newCollectionCardNode.querySelector('h2').innerText = collection.name
    // newCollectionCardNode.querySelector('input').value = collection.name

    // Iterate over collections artworks and append art to grid
    let collectionGrid = newCollectionCardNode.querySelector('div.collection-flex-grid')
    collection.artworkIds.forEach(artworkId => {
        collectionGrid.appendChild(createNodeCollectionArtwork(artworkId))
    })

    // Add event listeners for Cancel, Rename, Edit, and Delete buttons
    newCollectionCardNode.querySelector('button.cancel-collection').addEventListener('click', handleCancelCollection)
    newCollectionCardNode.querySelector('button.rename-collection').addEventListener('click', handleRenameCollection)
    newCollectionCardNode.querySelector('button.edit-collection').addEventListener('click', handleEditCollection)
    newCollectionCardNode.querySelector('button.delete-collection').addEventListener('click', handleDeleteCollection)

    // Remove input, edit, rename, and delete nodes from default collection
    if (collection.id === 1) {
        newCollectionCardNode.querySelector('div').childNodes.forEach(node => {
              if (node.tagName === 'BUTTON') {node.remove()}
              if (node.tagName === 'INPUT') {node.remove()}
        })
    }
    
    return newCollectionCardNode
}

// DOM: Upate the DOM to have a particular artwork in focus. Takes array+index or individual artwork
const populateHero = function(artworks, arrIndex = 0) {
    // debugger 
    // Handle object vs array
    let newArtworks = []
    if (!Array.isArray(artworks)) {newArtworks.push(artworks)}
    else newArtworks = [...artworks]

    // DOM: Populate Hero Image, Title, and Rating (right pane) based on artwork. Store Artwork ID in the DOM
    function populateHeroImage(artwork) {

        let heroTitle = `${artwork.title}, ${artwork.artist}`
        let heroImage = `${artwork.file.preferred.url}`
        let heroRating = 0
        // console.log(artwork.rating)
        if (!!artwork.rating || false) {heroRating = artwork.rating}
        
        document.getElementById('hero-title').setAttribute('artwork-id',artwork.id)
        document.getElementById('hero-title').firstChild.innerText = heroTitle
        document.getElementById('hero-img').src = heroImage
        document.getElementById('rating-select').value = heroRating
        document.getElementById('rating-select').addEventListener('change', handleRateArtwork)
        
    }

    // DOM: Populate Hero Info (right pane) based on artwork
    function populateHeroInfo(artwork) {

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
        createListItem('Artist', `: ${artwork.artist} ${artwork.artist_lifespan}`)
        createListItem('Artwork Date', `: ${artwork.date}`)
        createListItem('Museum', `: ${artwork.museum}`)
        createListItem('Genre', `: ${artwork.genre}`)
        createListItem('Medium', `: ${artwork.medium}`)
    }

    populateHeroImage(newArtworks[arrIndex])
    populateHeroInfo(newArtworks[arrIndex])
}

// --------------------
//    HELPERS
// --------------------

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

// HELPER: Update artwork array index for navigation
const calculateNewArtworkListIndex = function(currentIndex, increment) {
    let newIndex = currentIndex + increment

    if (newIndex >= localArtworkList.length) {newIndex = 0}
    else if (newIndex < 0) {newIndex = localArtworkList.length - 1}

    return newIndex
}

// HELPER: Toggle visibility on collection card header
const toggleCollectionCardNode = function(collectionCardNode, showInput = false) {
    let collectionNameNode = collectionCardNode.querySelector('h2.collection-name')
    let collectionNameInputNode = collectionCardNode.querySelector('input.collection-name-input')
    let editCollectionNode = collectionCardNode.querySelector('button.edit-collection')
    let renameCollectionNode = collectionCardNode.querySelector('button.rename-collection')
    let cancelCollectionNode = collectionCardNode.querySelector('button.cancel-collection')

    collectionNameInputNode.value = collectionNameNode.innerText

    if (showInput) {
        collectionNameNode.style.display = 'none'
        collectionNameInputNode.style.display = 'block'
        editCollectionNode.style.display = 'none'
        cancelCollectionNode.style.display = 'block'
        renameCollectionNode.style.display = 'block'
    }
    else {
        collectionNameNode.style.display = 'block'
        collectionNameInputNode.style.display = 'none'
        editCollectionNode.style.display = 'block'
        cancelCollectionNode.style.display = 'none'
        renameCollectionNode.style.display = 'none'
    }

}

// --------------------
//    EVENT HANDLERS
// --------------------

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
    localArtworkCurrentIndex = parseInt(calculateNewArtworkListIndex(localArtworkCurrentIndex, direction))
    populateHero(localArtworkList[localArtworkCurrentIndex])
}

const handleCreateCollection = function(event) {
    apiPostCollection()
}

const handleCancelCollection = function(event) {
    let collectionCardNode = event.target.parentNode.parentNode
    toggleCollectionCardNode(collectionCardNode, false)
}

const handleRenameCollection = function(event) {
    let collectionCardNode = event.target.parentNode.parentNode
    let collectionId = collectionCardNode.id.substring(16)
    let collectionNameInput = collectionCardNode.querySelector('.collection-name-input').value
    let collectionPatchObj = {name: collectionNameInput}

    collectionId = parseInt(collectionId)

    apiPatchCollection(collectionId, collectionPatchObj)
}

const handleEditCollection = function(event) {
    let collectionCardNode = event.target.parentNode.parentNode
    toggleCollectionCardNode(collectionCardNode, true)
}

const handleDeleteCollection = function(event) {
    let collectionCardNode = event.target.parentNode.parentNode
    let collectionId = collectionCardNode.id.substring(16)
    collectionId = parseInt(collectionId)
    apiDeleteCollection(collectionId)
}

const handleDeleteArtworkFromCollection = function(event) {
    let collectionArtworkNode = event.target.parentNode
    let artworkId = collectionArtworkNode.id.substring(19)
    let collectionId = collectionArtworkNode.parentNode.parentNode.id.substring(16)
    artworkId = parseInt(artworkId)
    collectionId = parseInt(collectionId)
    apiGetDeleteCollectionArtworkId(collectionId, artworkId)
}

const handleSaveToCollection = function(event) {
    let collectionId = document.getElementById('collection-select').value
    let artworkId = document.getElementById('hero-title').getAttribute('artwork-id')
    artworkId = parseInt(artworkId)
    collectionId = parseInt(collectionId)
    apiGetPatchCollectionArtworkIds(collectionId, artworkId)
}

const handleRateArtwork = function(event) {
    let artworkId = event.target.parentNode.parentNode.parentNode.querySelector('#hero-title').getAttribute('artwork-id')
    let newRating = event.target.value
    artworkId = parseInt(artworkId)
    apiPatchArtworkRating(artworkId, newRating)
}

const handleCollectionArtworkClick = function(event) {
    let artworkId = event.target.parentNode.parentNode.id.substring(19)
    artworkId = parseInt(artworkId)
    apiGetArtwork(parseInt(artworkId))
}

// --------------------
//   INITIALIZE PAGE
// --------------------

apiGetArtworks()
apiGetMuseums()
apiGetCollections()

// --------------------
//    EVENT LISTENERS
// --------------------

// Search Musuems
document.getElementById('search-artwork').addEventListener('click', handleSearchClick)

// Left/Right navigation on artwork
document.querySelectorAll('button.left-right-button').forEach(node => node.addEventListener('click', handleNav))
addEventListener('keydown', handleNav)

// Save to Collection
document.getElementById('save-to-collection').addEventListener('click', handleSaveToCollection)

// Create Collection
document.getElementById('create-collection').addEventListener('click', handleCreateCollection)

// Noop
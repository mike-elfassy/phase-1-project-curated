console.log('Hello World')

// Hero

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
let museumList = [
    { 
        name:'--All--',
        value:''
    },
    {
        name: 'Tate Britain',
        value: 'tate'
    },
    {
        name:'Musée des Beaux-Arts de Strasbourg',
        value: 'strasbourg'
    },
    {
        name: "Musée d'Orsay",
        value: 'dorsay'
    }]
let collectionList = [1]

// API Globals
const artworkApi = 'http://localhost:3000'
const requestHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

// Populate Artwork filter
const populateArtworkSelect = function(museumList) {
    museumList.forEach(museum => {
        console.log(museum.name, museum.value)
        console.log(document.querySelector('select#museum-select'))

        let selectForm = document.querySelector('select#museum-select')
        let newOption = document.createElement('option')
        newOption.setAttribute('value',museum.value)
        newOption.innerText = museum.name
        
        selectForm.appendChild(newOption)

    })
}

// API Call: Search & return array of artworks
const searchArtworks = function(artworkApi, searchMuseum = '--All--') {
    let searchQuery = ''
    if(searchMuseum !== '--All--') {searchQuery = `?museum=${searchMuseum}`}

    fetch (`${artworkApi}/artworks${searchQuery}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (artworks => artworks.forEach(artwork => {
        console.log(artwork)
    }))
    .catch (error => console.error(`${error.message}`))
}

// searchArtworks(artworkApi)
// searchArtworks(artworkApi, 'Tate Britain')

populateArtworkSelect(museumList)
# Curated

README for Michael Elfassy’s Phase-1 Project

## Brief
The ‘Curated’ web app will display artwork one-by-one and allow users to ‘rate’ the piece and/or save it to a ‘collection’. Collections will be displayed lower down on the page and users may choose to use a default collection or create their own. Users will search through artwork by utilizing a picklist and will be able to skip artwork if they choose not to rate or save it.

The artwork database is seeding with images and descriptions from Wikimedia Commons

## Goals
Users will select a search criteria via a picklist: all, Tate Britain, Musée d'Orsay, Musée des Beaux-Arts de Strasbourg
Users can ‘save’ or ‘skip’ and/or ‘rate’ an artwork
Items can be saved to a default collection “Saved” or to user created collections
Skipping an artwork will display the next image on the page
Users can create, delete, or rename ‘collections’
Collections will be collapsible and utilize the thumbnail image
All updates: ratings, collections, artworks within a collection will be persisted to the database
The database is global and has no notion of user profiles
Challenges

## Project Requirements
* API: Local json-server
* Event Listeners:
  * Input: Pick a museum
  * Submit: API fetch call to Wikimedia Commons
  * Click: Save or Skip artwork
  * Keyboard shortcuts: Save or skip artwork
  * Fullscreen?
  * Download?
* Array iteration: Not sure yet, but will certainly need this

## Stretch Goals
* Nice-to-have
  * Keyboard Left or right to move through images
  * Aspect ratio warning (i.e. “This image is heavily cropped!”)
  * User input to search artworks
  * Clicking an artwork in a collection moves it to the selection pane
* Possible
  * List of artworks shown to user will be filtered against saved artwork so photos won’t be shown twice despite page refresh
  * Sort collections based on rating
  * User profiles for saved collections
  * Manage collections (delete artworks, change rating, etc.)
* Super-stretch
  * Use AirTable as a cloud database for these collections
  * User can add additional tags to artwork before saving
  * Frame finder: try out different artwork frames
  * Auto-populate collections based on year/style/etc

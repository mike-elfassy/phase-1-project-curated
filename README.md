# Curated

## Description

‘Curated’ is a single page web app that displays artwork one-by-one and invites users to ‘rate’ the piece and/or save it to a ‘collection’. Collections are displayed lower down on the page and users may choose to use a default collection or create their own.

This project is intended as a phase-1 submission for the Flatiron School's Software Engineering currculum.

## Features & Usage

[![Video walkthrough of Curated app](https://cdn.loom.com/sessions/thumbnails/d98c59ee811546118cb266a68d5c9375-with-play.gif)](https://www.loom.com/share/d98c59ee811546118cb266a68d5c9375)



## Installation

This web application requires a local JSON server to run a local databse and REST API. Follow these instructions to run the web app locally:
1. Download the codebase from this repository to a local computer
2. Install JSON Server if it does not exist. Instructions can be found https://www.npmjs.com/package/json-server
3. Start the JSON Server by navigating to the local directory where this repository is saved and running this command in a terminal application: `$ json-server --watch db.json`
4. Verify that JSON Server is using this port `http://localhost:3000/` by navigating there in your browser.
5. Visit the Curated web-page in your browser here: https://mike-elfassy.github.io/phase-1-project-curated/

## Support

Reach out to me via email for any questions, comments, or feedback. 

## Roadmap

1. To-do's
    * Bug fix: Include most recent artwork rating when saving to collections
    * Use async + await on API calls instead of nesting dom manipulation within in API functions
    * Zoom/fullscreen button to view larger high res image 
    * Ability to name a collection on create
    * Better handling of local copies of db
2. Nice-to-have
    * Refactor code & better handling of local cach
    * Prevent delete ‘default’ collection via backend
    * Sorting: collections, artworks, etc
    * Optimize for widescreen layout (stack items)
    * User input box to search artworks
    * Collapsible collections
3. Stretch-goals
    * Handle pagination
    * Overall design update
    * Update rating on collection artwork items without page refresh
    * User profiles for saved collections
4. Super-stretch goals
    * Use AirTable as a cloud database for these collections and/or existing artwork db
    * User can add additional tags to artwork
    * Frame finder: try out different artwork frames
    * Auto-populate collections based on year/style/etc


## Project status

This project is complete as of February 2, 2023 and there are no plans for further development

## Authors and acknowledgment

The artwork database is seeding with images and descriptions from Wikimedia Commons
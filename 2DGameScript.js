// Waits for document to be ready before running JS code
let display
let container
let context

window.onload = function () {
    display = document.getElementById('display')
    container = document.getElementById('container')
    context = display.getContext("2d")
    container.style.backgroundImage = "url('Assets/Backgrounds/menuBackground.png')"
}

function play() {
    document.getElementById('gameControls').style.display = "block"
    document.getElementById('menuControls').style.display = "none"
    container.style.backgroundImage = "url('Assets/Backgrounds/AsteroidDefense.png')"
    
    let map = document.getElementById('mapPreviewText').innerHTML
    if (map == "Asteroid Defense")
        runAsteroid()
}

function menu() {
    document.getElementById('gameControls').style.display = "none"
    document.getElementById('mapsControls').style.display = "none"
    document.getElementById('settingsControls').style.display = "none"
    document.getElementById('menuControls').style.display = "block"
    container.style.backgroundImage = "url('Assets/Backgrounds/menuBackground.png')"
}

function maps() {
    document.getElementById('mapsControls').style.display = "block"
    document.getElementById('menuControls').style.display = "none"
}

function settings() {
    document.getElementById('settingsControls').style.display = "block"
    document.getElementById('menuControls').style.display = "none"
}

function runAsteroid() {

}

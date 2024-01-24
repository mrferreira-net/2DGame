// Waits for document to be ready before running JS code
let display
let container
let context
let gameControls
let mapsControls
let settingsControls
let menuControls
$(document).ready(function () {
    display = $('#display')[0]
    container = $('#container')[0]
    context = display.getContext("2d")
    gameControls = $('#gameControls')[0]
    mapsControls = $('#mapsControls')[0]
    settingsControls = $('#settingsControls')[0]
    menuControls = $('#menuControls')[0]
})

function play() {
    let map = $('#mapPreviewText').html()
    if (map == "Asteroid Defense") 
        runAsteroid()
}

function screenTransition(event) {
    let string
    let interval = 0
    if (event.target == undefined) {
        string = event
        interval = 25
    } 
    else 
        string = event.target.innerHTML

    let transitionScreen = $('#transitionScreen')[0]
    transitionScreen.style.zIndex = "1"
    let opacity = 0
    let madeOpaque = false

    let animate = setInterval(function () {
        if (opacity < 0) {
            transitionScreen.style.zIndex = "-1"
            clearInterval(animate)
        }  
        else if (madeOpaque) {
            transitionScreen.style.opacity = opacity.toString() + "%"
            opacity--
        }
        else if (opacity > 100) {
            madeOpaque = true

            gameControls.style.display = "none"
            mapsControls.style.display = "none"
            settingsControls.style.display = "none"
            menuControls.style.display = "none"
            container.style.backgroundImage = "url('Assets/Backgrounds/menu.png')"
            if (string == "Main Menu")
                menuControls.style.display = "block"
            else if (string == "Settings")
                settingsControls.style.display = "block"
            else if (string == "Maps")
                mapsControls.style.display = "block"
            else { 
                gameControls.style.display = "block"
                container.style.backgroundImage = "url('Assets/Backgrounds/" + string + ".png')"
            }
        }
        else {
            transitionScreen.style.opacity = opacity.toString() + "%"
            opacity++
        }
    }, interval)
}

function runAsteroid() {
    screenTransition("AsteroidDefense")
    let x = 0,
        y = 10,
        sprite = new Image()

    sprite.onload = animate
    sprite.src = "Assets/Sprites/TestSprite.png"

    function animate() {
        // Clear display
        context.clearRect(0, 0, display.width, display.height)
        // Draw sprite at current position
        context.drawImage(sprite, x, y)
        // Change position
        x++
        // Loop
        if (x < 250) 
            requestAnimationFrame(animate)
    }
}

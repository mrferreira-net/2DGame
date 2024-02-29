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
    if (map == "Asteroid Defense") {
        screenTransition("AsteroidDefense")
        let wait = setInterval(function () {
            if (transitionEnd) {
                runAsteroid()
                clearInterval(wait)
            }
        }, 10)
    }
        
}

// test function
function test() {
    container.style.backgroundImage = "url('Assets/Backgrounds/AsteroidDefensep.png')"
    gameControls.style.display = "none"
    mapsControls.style.display = "none"
    settingsControls.style.display = "none"
    menuControls.style.display = "none"
    runAsteroid()
}

let transitionEnd = false
function screenTransition(event) {
    transitionEnd = false
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
            transitionEnd = true
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
            if (string == "Main Menu") {
                menuControls.style.display = "block"
                context.clearRect(0, 0, display.width, display.height)
            }
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

function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}
function headsOrTails () {
    return Math.random() < 0.5
}

function runAsteroid() {
    let x = 0,
        y = 16,
        sprite = new Image()
        
    let width
    let height
    sprite.onload = function () {
        width = this.width
        height = this.height
        animate()
    }
    sprite.src = "Assets/Sprites/testsprite2.png"

    let path1 = false
    let path2 = false
    function animate() {
        // Clear display
        context.clearRect(0, 0, display.width, display.height)
        // Draw sprite at current position
        context.drawImage(sprite, x, y)
        // Change position
        if (x == 0 && y < 17) 
            path1 = true
        else if (x == 0 && y >= 17) 
            path2 = true
        


        if (path1) {
            if (x > -1 && x < 54 && y < 17 && y > 5) {
                x = x + 0.25
                y = -(0.22 * x) + 17
            }
            else if (x >= 54 && x < 80 && y >= 5 && y < 5.5) {
                x = x + 0.25
                y = (0.04 * x) + 5
            }
            else {
                let i = 0
            }
        }
        else if (path2) {

        }
        // Loop
        if (y < 151) 
            requestAnimationFrame(animate)
    }
}

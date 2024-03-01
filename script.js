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
    let numOfSprites = 20
    let spawnRate = 1000
    let spriteSpeed = 2

    let sprites = []
    for (let i = 0; i < numOfSprites; i++) {
        sprites.push({
            x: -3,
            y: 18,
            speed: spriteSpeed,
            image: new Image(),
            width: 0,
            height: 0,
            path: headsOrTails(),
            branch: {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false, 13:false}
        })
        sprites[i].image.src = "Assets/Sprites/testsprite2.png"
    }
    
    sprites[numOfSprites - 1].image.onload = function () {
        animate()
        let i = 0
        let spawning = setInterval(function () {
            if (i < numOfSprites) {
                sprites[i].x = 0
                i++
            }
            else
                clearInterval(spawning)
        }, spawnRate)
        function animate() {
            // Clear display
            context.clearRect(0, 0, display.width, display.height)
            // Draw sprite at current position
            for (let i = 0; i < numOfSprites; i++) {
                context.drawImage(sprites[i].image, sprites[i].x, sprites[i].y)
                // Change position
                if (sprites[i].path) {
                    //sprites[i].x initial   sprites[i].x-final   sprites[i].y-initial   sprites[i].y-final
                    if (sprites[i].x >= 0 && sprites[i].x < 54 && sprites[i].y <= 18 && sprites[i].y > 5 && sprites[i].branch[0] == false) { 
                        sprites[i].x = sprites[i].x + (0.2 * sprites[i].speed) //speed
                        sprites[i].y = -(0.22 * (sprites[i].x-0)) + 17
                            //slope  sprites[i].x-initial  sprites[i].y-initial
                    }
                    else if (sprites[i].x >= 54 && sprites[i].x < 85 && sprites[i].y >= 5 && sprites[i].y < 7 && sprites[i].branch[1] == false) {
                        sprites[i].branch[0] = true
                        sprites[i].x = sprites[i].x + 0.2 * (sprites[i].speed)
                        sprites[i].y = (0.04 * (sprites[i].x-54)) + 5
                    }
                    else if (sprites[i].x >= 85 && sprites[i].x < 110 && sprites[i].y >= 6 && sprites[i].y < 20 && sprites[i].branch[2] == false) {
                        sprites[i].branch[1] = true
                        sprites[i].x = sprites[i].x + 0.2 * (sprites[i].speed)
                        sprites[i].y = (0.57 * (sprites[i].x-85)) + 6.24
                    }
                    else if (sprites[i].x >= 109 && sprites[i].x < 133 && sprites[i].y >= 19 && sprites[i].y < 30 && sprites[i].branch[3] == false) {
                        sprites[i].branch[2] = true
                        sprites[i].x = sprites[i].x + 0.22 * (sprites[i].speed)
                        sprites[i].y = (0.4 * (sprites[i].x-109.2)) + 20.03
                    }
                    else if (sprites[i].x >= 133 && sprites[i].x < 168 && sprites[i].y <= 30 && sprites[i].y > 23 && sprites[i].branch[4] == false) {
                        sprites[i].branch[3] = true
                        sprites[i].x = sprites[i].x + 0.22 * (sprites[i].speed)
                        sprites[i].y = -(0.18 * (sprites[i].x-133.1)) + 29.6
                    }
                    else if (sprites[i].x >= 168 && sprites[i].x < 190 && sprites[i].y <= 24 && sprites[i].y > 22 && sprites[i].branch[5] == false) {
                        sprites[i].branch[4] = true
                        sprites[i].x = sprites[i].x + 0.22 * (sprites[i].speed)
                        sprites[i].y = -(0.04 * (sprites[i].x-168.16)) + 23.2
                    }
                    else if (sprites[i].x >= 190 && sprites[i].x < 196 && sprites[i].y >= 22 && sprites[i].y < 36 && sprites[i].branch[6] == false) {
                        sprites[i].branch[5] = true
                        sprites[i].x = sprites[i].x + 0.1 * (sprites[i].speed)
                        sprites[i].y = (2.2 * (sprites[i].x-190.15)) + 22.32
                    }
                    else if (sprites[i].x >= 196 && sprites[i].x < 198 && sprites[i].y >= 35 && sprites[i].y < 82 && sprites[i].branch[7] == false) {
                        sprites[i].branch[6] = true
                        sprites[i].x = sprites[i].x + 0.0045 * (sprites[i].speed)
                        sprites[i].y = (42 * (sprites[i].x-196)) + 35.19
                    }
                    else if (sprites[i].x <= 198 && sprites[i].x > 178 && sprites[i].y >= 82 && sprites[i].y < 95 && sprites[i].branch[8] == false) {
                        sprites[i].branch[7] = true
                        sprites[i].x = sprites[i].x - 0.2 * (sprites[i].speed)
                        sprites[i].y = (0.57 * -(sprites[i].x-197.16)) + 82.045
                    }
                    else if (sprites[i].x <= 178 && sprites[i].x > 106 && sprites[i].y <= 95 && sprites[i].y > 89 && sprites[i].branch[9] == false) {
                        sprites[i].branch[8] = true
                        sprites[i].x = sprites[i].x - 0.2 * (sprites[i].speed)
                        sprites[i].y = -(0.03 * -(sprites[i].x-177.96)) + 92.989
                    }
                    else if (sprites[i].x <= 106 && sprites[i].x > 77 && sprites[i].y <= 91 && sprites[i].y > 78 && sprites[i].branch[10] == false) {
                        sprites[i].branch[9] = true
                        sprites[i].x = sprites[i].x - 0.2 * (sprites[i].speed)
                        sprites[i].y = -(0.43 * -(sprites[i].x-105.96)) + 90.829
                    }
                    else if (sprites[i].x <= 77 && sprites[i].x > 53 && sprites[i].y <= 79 && sprites[i].y > 74 && sprites[i].branch[11] == false) {
                        sprites[i].branch[10] = true
                        sprites[i].x = sprites[i].x - 0.2 * (sprites[i].speed)
                        sprites[i].y = -(0.17 * -(sprites[i].x-76.96)) + 78.359
                    }
                    else if (sprites[i].x <= 53 && sprites[i].x > 36 && sprites[i].y >= 74 && sprites[i].y < 80 && sprites[i].branch[12] == false) {
                        sprites[i].branch[11] = true
                        sprites[i].x = sprites[i].x - 0.15 * (sprites[i].speed)
                        sprites[i].y = (0.29 * -(sprites[i].x-52.96)) + 74.279
                    }
                    else if (sprites[i].x <= 36 && sprites[i].x > 31 && sprites[i].y >= 79 && sprites[i].y < 99 && sprites[i].branch[13] == false) {
                        sprites[i].branch[12] = true
                        sprites[i].x = sprites[i].x - 0.05 * (sprites[i].speed)
                        sprites[i].y = (4.3 * -(sprites[i].x-35.86)) + 79.238
                    }
                    else if (sprites[i].x <= 32 && sprites[i].x > 30 && sprites[i].y >= 99 && sprites[i].y < 151) {
                        sprites[i].branch[13] = true
                        sprites[i].x = sprites[i].x - 0.004 * (sprites[i].speed)
                        sprites[i].y = (45.8 * -(sprites[i].x-31.26)) + 99.018
                    }
                }
                else {
                    if (sprites[i].x >= 0 && sprites[i].x < 52 && sprites[i].y >= 18 && sprites[i].y < 35 && sprites[i].branch[0] == false) {
                        sprites[i].x = sprites[i].x + 0.2 * (sprites[i].speed)
                        sprites[i].y = (0.3 * (sprites[i].x-0)) + 19
                    }
                    else if (sprites[i].x >= 51 && sprites[i].x < 81 && sprites[i].y >= 34 && sprites[i].y < 36 && sprites[i].branch[1] == false) {
                        sprites[i].branch[0] = true
                        sprites[i].x = sprites[i].x + 0.2 * (sprites[i].speed)
                        sprites[i].y = (0.04 * (sprites[i].x-51.7)) + 34.51
                    }
                    else if (sprites[i].x >= 81 && sprites[i].x < 120 && sprites[i].y >= 35 && sprites[i].y < 36 && sprites[i].branch[2] == false) {
                        sprites[i].branch[1] = true
                        sprites[i].x = sprites[i].x + 0.2 * (sprites[i].speed)
                    }
                    else if (sprites[i].x >= 120 && sprites[i].x < 170 && sprites[i].y <= 36 && sprites[i].y > 28 && sprites[i].branch[3] == false) { 
                        sprites[i].branch[2] = true
                        sprites[i].x = sprites[i].x + 0.2 * (sprites[i].speed)
                        sprites[i].y = -(0.15 * (sprites[i].x-120)) + 35.682
                    }
                    else if (sprites[i].x >= 170 && sprites[i].x < 177 && sprites[i].y <= 29 && sprites[i].y > 19 && sprites[i].branch[4] == false) {
                        sprites[i].branch[3] = true
                        sprites[i].x = sprites[i].x + 0.1 * (sprites[i].speed)
                        sprites[i].y = -(1.45 * (sprites[i].x-170.2)) + 28.152
                    }
                    else if (sprites[i].x >= 176 && sprites[i].x < 185 && sprites[i].y <= 19 && sprites[i].y > 13 && sprites[i].branch[5] == false) {
                        sprites[i].branch[4] = true
                        sprites[i].x = sprites[i].x + 0.13 * (sprites[i].speed)
                        sprites[i].y = -(0.6 * (sprites[i].x-175.6)) + 18.872
                    }
                    else if (sprites[i].x >= 185 && sprites[i].x < 194 && sprites[i].y >= 13 && sprites[i].y < 16 && sprites[i].branch[6] == false) {
                        sprites[i].branch[5] = true
                        sprites[i].x = sprites[i].x + 0.18 * (sprites[i].speed)
                        sprites[i].y = (0.3 * (sprites[i].x-185.05)) + 13.202
                    }
                    else if (sprites[i].x >= 194 && sprites[i].x < 196 && sprites[i].y >= 15 && sprites[i].y < 24 && sprites[i].branch[7] == false) {
                        sprites[i].branch[6] = true
                        sprites[i].x = sprites[i].x + 0.04 * (sprites[i].speed)
                        sprites[i].y = (4.6 * (sprites[i].x-194.05)) + 15.902
                    }
                    else if (sprites[i].x <= 196 && sprites[i].x > 182 && sprites[i].y >= 24 && sprites[i].y < 86 && sprites[i].branch[8] == false) {
                        sprites[i].branch[7] = true
                        sprites[i].x = sprites[i].x - 0.04 * (sprites[i].speed)
                        sprites[i].y = (4.6 * -(sprites[i].x-195.82)) + 24.044
                    }
                    else if (sprites[i].x <= 183 && sprites[i].x > 116 && sprites[i].y <= 87 && sprites[i].y > 84 && sprites[i].branch[9] == false) {
                        sprites[i].branch[8] = true
                        sprites[i].x = sprites[i].x - 0.2 * (sprites[i].speed)
                        sprites[i].y = -(0.028 * -(sprites[i].x-182.35)) + 86.006
                    }
                    else if (sprites[i].x <= 116 && sprites[i].x > 80 && sprites[i].y >= 84 && sprites[i].y < 98 && sprites[i].branch[10] == false) {
                        sprites[i].branch[9] = true
                        sprites[i].x = sprites[i].x - 0.2 * (sprites[i].speed)
                        sprites[i].y = (0.36 * -(sprites[i].x-115.98)) + 84.148
                    }
                    else if (sprites[i].x <= 80 && sprites[i].x > 65 && sprites[i].y >= 97 && sprites[i].y < 120 && sprites[i].branch[11] == false) {
                        sprites[i].branch[10] = true
                        sprites[i].x = sprites[i].x - 0.1 * (sprites[i].speed)
                        sprites[i].y = (1.56 * -(sprites[i].x-79.98)) + 97.108
                    }
                    else if (sprites[i].x <= 66 && sprites[i].x > 60 && sprites[i].y >= 119 && sprites[i].y < 151) {
                        sprites[i].branch[11] = true
                        sprites[i].x = sprites[i].x - 0.025 * (sprites[i].speed)
                        sprites[i].y = (7 * -(sprites[i].x-65.5)) + 119.697
                    }
                }
            }

            let spriteOnScreen = false
            for (let i = 0; i < numOfSprites; i++) {
                if (sprites[i].y < 151) {
                    spriteOnScreen = true
                    break
                }
                    
            }
            if (spriteOnScreen)
                requestAnimationFrame(animate)
        }
    }
}

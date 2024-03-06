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
    context.lineWidth = 0.1
    context.strokeStyle = "white"
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
    container.style.backgroundImage = "url('Assets/Backgrounds/AsteroidDefense.png')"
    gameControls.style.display = "none"
    mapsControls.style.display = "none"
    settingsControls.style.display = "none"
    menuControls.style.display = "none"
    runAsteroid()
}
// create path
let createdPath = []
function createPath () {
    container.style.backgroundImage = "url('Assets/Backgrounds/AsteroidDefense.png')"
    gameControls.style.display = "none"
    mapsControls.style.display = "none"
    settingsControls.style.display = "none"
    menuControls.style.display = "none"

    display.style.pointerEvents = "auto"
    let mouseDown = false
    $("#display").on("mousemove", function (evt) {
        let position = getMousePos(display, evt)
        if (mouseDown) {
            let lastPositionIndex = createdPath.length - 1
            createdPath.push({
                x: position.x, 
                y: position.y
            })
            if (lastPositionIndex >= 0)
                context.moveTo(createdPath[lastPositionIndex].x, createdPath[lastPositionIndex].y)
            context.lineTo(position.x, position.y)
            context.stroke()
        }
    })
    $(document).on("mousedown", function () {
        mouseDown = true
    })
    $(document).on("mouseup", function () {
        mouseDown = false //BREAK POINT HERE
    })
}

function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
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
    // Load Paths
    let path1 = []
    let path2 = []
    let pathsLoaded = false
    $.get('Assets/GameData/AsteroidDefensePaths.txt', function(data) {
        let dataLen = data.length
        let i = 0
        let path1Complete = false
        while (i < dataLen) {
            if (data[i] == "[") {
                while (data[i] != "]" && i < dataLen) {
                    if (data[i] == "{") {
                        let xData = "",
                            yData = ""
                        while (data[i] != "}" && i < dataLen) {
                            if (data[i] == "x") {
                                while (data[i] != ":" && i < dataLen)
                                    i++
                                i++
                                while (data[i] != "," && i < dataLen) {
                                    xData = xData + data[i]
                                    i++
                                }
                                xData = Number(xData)
                            }
                            else if (data[i] == "y") {
                                while (data[i] != ":" && i < dataLen)
                                    i++
                                i++
                                while (data[i] != "}" && i < dataLen) {
                                    yData = yData + data[i]
                                    i++
                                }
                                yData = Number(yData)
                            }
                            else
                                i++
                        }
                        if (path1Complete)
                            path2.push({x: xData, y: yData})
                        else
                            path1.push({x: xData, y: yData})
                    }
                    else
                        i++
                }
            }
            else if (data[i] == "]" && path1Complete == false) 
                path1Complete = true
            else
                i++
        }
        pathsLoaded = true
    
    }, "text")

    let checkLoading = setInterval (function() {
        if (pathsLoaded) {
            clearInterval(checkLoading)
            let path1Len = path1.length
            let path2Len = path2.length

            let numOfSprites = 200
            let spawnRate = 100
            let spriteSpeed = 2
            let sprites = []
            for (let i = 0; i < numOfSprites; i++) {
                sprites.push({
                    x: 0,
                    y: 0,
                    speed: spriteSpeed,
                    image: new Image(),
                    width: 0,
                    height: 0,
                    path: headsOrTails(),
                    index: 0
                })
                sprites[i].image.src = "Assets/Sprites/testsprite2.png"
            }
            
            sprites[numOfSprites - 1].image.onload = function () {
                let spawned = 0
                let spawning = setInterval(function () {
                    if (spawned == 0)
                        animate()
                    if (spawned < numOfSprites) 
                        spawned++
                    else
                        clearInterval(spawning)
                }, spawnRate)
                function animate() {
                    // Clear display
                    context.clearRect(0, 0, display.width, display.height)
                    // Draw sprite at current position
                    if (spawned == 2) {
                        let i = 0
                    }
                    for (let i = 0; i < spawned; i++) {
                        let roundedIndex = Math.round(sprites[i].index)
                        // Change position
                        if (sprites[i].path) {
                            if (roundedIndex >= path1Len - 1) 
                                continue
                            sprites[i].x = path1[roundedIndex].x
                            sprites[i].y = path1[roundedIndex].y
                            
                            if (sprites[i].index < path1Len - 1) 
                                sprites[i].index = sprites[i].index + spriteSpeed
                        }
                        else {
                            if (roundedIndex >= path2Len - 1) 
                                continue
                            sprites[i].x = path2[roundedIndex].x
                            sprites[i].y = path2[roundedIndex].y
                            if (sprites[i].index < path2Len - 1) 
                                sprites[i].index = sprites[i].index + spriteSpeed
                        }
                        context.drawImage(sprites[i].image, sprites[i].x, sprites[i].y)
                    }
        
                    let spriteOnScreen = false
                    for (let i = 0; i < numOfSprites; i++) {
                        if (sprites[i].path) {
                            if (sprites[i].index < path1Len - 1) {
                                spriteOnScreen = true
                                break
                            }
                        }
                        else {
                            if (sprites[i].index < path2Len - 1) {
                                spriteOnScreen = true
                                break
                            }
                        }
                        
                    }
                    if (spriteOnScreen) 
                        requestAnimationFrame(animate)
                    else
                        context.clearRect(0, 0, display.width, display.height)
                }
            }
        }
    }, 1000)
    
}

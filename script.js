// Waits for document to be ready before running JS code
let display,
    container,
    context,
    gameControls,
    mapsControls,
    settingsControls,
    menuControls
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

// executes when play button is pressed
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

// test function that runs game
function test() {
    container.style.backgroundImage = "url('Assets/Backgrounds/AsteroidDefense.png')"
    gameControls.style.display = "none"
    mapsControls.style.display = "none"
    settingsControls.style.display = "none"
    menuControls.style.display = "none"
    runAsteroid()
}

// create path for map creation
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

// Returns mouse position on canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

// Executes screen transitions between menus and the game
let transitionEnd = false
function screenTransition(event) {
    transitionEnd = false
    let string,
        interval = 0
    if (event.target == undefined) {
        string = event
        interval = 25
    } 
    else 
        string = event.target.innerHTML

    let transitionScreen = $('#transitionScreen')[0],
        opacity = 0,
        madeOpaque = false
    transitionScreen.style.zIndex = "1"
    

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

// Returns a random number between the parameters
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

// Returns a 50/50 boolean
function headsOrTails () {
    return Math.random() < 0.5
}

// function that defines a sprite type in a wave.
function spawnSprites(numOfSprites, spawnRate, spriteSpeed, imageSrc, health, spriteWidth, spriteHeight) {
    let sprites = []
    for (let i = 0; i < numOfSprites; i++) {
        sprites.push({
            hp: health, 
            x: 0,
            y: 0,
            speed: spriteSpeed,
            image: new Image(),
            width: spriteWidth,
            height: spriteHeight,
            path: headsOrTails(),
            index: 0,
        })
        sprites[i].image.src = imageSrc
    }
    
    sprites[numOfSprites - 1].image.onload = function () {
        let spawned = 0,
            spawning = setInterval(function () {
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
                        sprites[i].index = sprites[i].index + sprites[i].speed
                }
                else {
                    if (roundedIndex >= path2Len - 1) 
                        continue
                    sprites[i].x = path2[roundedIndex].x
                    sprites[i].y = path2[roundedIndex].y
                    if (sprites[i].index < path2Len - 1) 
                        sprites[i].index = sprites[i].index + sprites[i].speed
                }
                context.drawImage(sprites[i].image, sprites[i].x, sprites[i].y, sprites[i].width, sprites[i].height)
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
            else {
                context.clearRect(0, 0, display.width, display.height)
                return 0
            }
                
        }
    }
}

// Begins Asteroid defense map spawning.
let path1 = [],
    path2 = [],
    path1Len,
    path2Len
function runAsteroid() {
    // Load Paths
    let pathsLoaded = false
    $.get('Assets/GameData/AsteroidDefensePaths.txt', function(data) {
        let dataLen = data.length,
            i = 0,
            path1Complete = false
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

    $("#placeTower").on("click", function () {
        let i = 0
    })
    let checkLoading = setInterval (function() {
        if (pathsLoaded) {
            clearInterval(checkLoading)
            path1Len = path1.length,
            path2Len = path2.length
            
            let spawn1 = spawnSprites (20, 1000, 0.5, "Assets/Sprites/testsprite2.png", 100, 3, 3)
            let spawn1Interval = setInterval(function() {
                if (spawn1 == 0) {
                    clearInterval(spawn1Interval)
                }
            }, 2000)

        }
    }, 1000)
    
}

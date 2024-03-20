let pathSmoothingIndex = 12
let spawnRate = 1500

const oneDeg = Math.PI / 180
const pi = Math.PI
const twoPi = Math.PI * 2
const tenDeg = oneDeg * 10
const fiveDeg = oneDeg * 5

// Waits for document to be ready before running JS code
let spriteLayer,
    spriteContext,
    towerLayer,
    towerContext,
    pointerLayer,
    pointerContext,
    projectileLayer,
    projectileContext,
    edgeLayer,
    container,
    gameControls,
    mapsControls,
    settingsControls,
    menuControls,
    edgeContainer
$(document).ready(function () {
    spriteLayer = $('#spriteLayer')[0]
    spriteContext = spriteLayer.getContext("2d")
    towerLayer = $('#towerLayer')[0]
    towerContext = towerLayer.getContext("2d")
    pointerLayer = $('#pointerLayer')[0]
    pointerContext = pointerLayer.getContext("2d")
    projectileLayer = $('#projectileLayer')[0]
    projectileContext = projectileLayer.getContext("2d")
    edgeLayer = $("#edgeLayer")[0]
    container = $('#container')[0]
    gameControls = $('#gameControls')[0]
    mapsControls = $('#mapsControls')[0]
    settingsControls = $('#settingsControls')[0]
    menuControls = $('#menuControls')[0]
    edgeContainer = $("#edgeContainer")[0]
    spriteContext.imageSmoothingEnabled = false
    spriteContext.lineWidth = 0.1
    spriteContext.strokeStyle = "white"
    pointerContext.fillStyle = "rgba(0, 247, 255, 0.452)"
    pointerContext.strokeStyle = "rgb(161, 241, 255)"
    towerContext.fillStyle = "rgba(0, 247, 255, 0.452)"
    towerContext.strokeStyle = "rgb(161, 241, 255)"

    loading()
    //test() //temporary
})

// Loades all images before user can use the program
let images
function loading () {
    images = {
        drone: new Image(),
        mcannon: new Image(),
        menace: new Image(),
        test1: new Image(),
        test2: new Image(),
        polygon: new Image(),
        missile: new Image()
    }

    images.drone.src = "Assets/Sprites/drone.png"
    images.mcannon.src = "Assets/Sprites/missileCannon.png"
    images.menace.src = "Assets/Sprites/MenaceSprite.png"
    images.test1.src = "Assets/Sprites/testsprite1.png"
    images.test2.src = "Assets/Sprites/testsprite2.png"
    images.polygon.src = "Assets/Sprites/polygon.png"
    images.missile.src = "Assets/Sprites/missile.png"
    
    let boolArray = []
    for (let i in images) 
        boolArray.push({bool:false})
    
    images.drone.onload = function () {boolArray[0].bool = true}
    images.mcannon.onload = function () {boolArray[1].bool = true}
    images.menace.onload = function () {boolArray[2].bool = true}
    images.test1.onload = function () {boolArray[3].bool = true}
    images.test2.onload = function () {boolArray[4].bool = true}
    images.polygon.onload = function () {boolArray[5].bool = true}
    images.missile.onload = function () {boolArray[6].bool = true}

    let checkLoading = setInterval (function () {
        let boolArrayLen = boolArray.length
        for (let i = 0; i < boolArrayLen; i++) {
            if (boolArray[i].bool == false)
                return
            $("#loadingScreen")[0].style.display = "none"
            clearInterval(checkLoading)
        }
    }, 1000)
}

// executes when play button is pressed
let paths = [],
    towers = [],
    sprites = [],
    projectiles = []
function play() {
    let map = $('#mapPreviewText').html()
    if (map == "Asteroid Defense") {
        screenTransition("AsteroidDefense")
        let wait = setInterval(function () {
            if (transitionEnd) {
                runAsteroid()
                clearInterval(wait)
            }
        }, 1000)
    }
        
}

// test function that runs game
function test() {
    reset()
    container.style.backgroundImage = "url('Assets/Backgrounds/AsteroidDefense.png')"
    gameControls.style.display = "block"
    spriteLayer.style.display = "block"
    towerLayer.style.display = "block"
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

    spriteLayer.style.pointerEvents = "auto"
    let mouseDown = false
    $("#spriteLayer").on("pointermove", function (evt) {
        let position = getMousePos(spriteLayer, evt)
        if (mouseDown) {
            let lastPositionIndex = createdPath.length - 1
            createdPath.push({
                x: position.x, 
                y: position.y
            })
            if (lastPositionIndex >= 0)
                spriteContext.moveTo(createdPath[lastPositionIndex].x, createdPath[lastPositionIndex].y)
            spriteContext.lineTo(position.x, position.y)
            spriteContext.stroke()
        }
    })
    $(document).on("pointerdown", function () {
        mouseDown = true
    })
    $(document).on("pointerup", function () {
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

function reset () {
    clearInterval(checkLoading)
    clearInterval(towerDraw)
    clearInterval(spawning)
    paths = []
    towers = []
    sprites = []
    spriteContext.clearRect(0, 0, spriteLayer.width, spriteLayer.height)
    towerContext.clearRect(0, 0, towerLayer.width, towerLayer.height)
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
    transitionScreen.style.zIndex = "5"
    

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
            spriteLayer.style.display = "none"
            towerLayer.style.display = "none"
            container.style.backgroundImage = "url('Assets/Backgrounds/menu.png')"
            if (string == "Main Menu") {
                menuControls.style.display = "block"
                edgeLayer.style.display = "none"
                reset()
            }
            else if (string == "Settings")
                settingsControls.style.display = "block"
            else if (string == "Maps")
                mapsControls.style.display = "block"
            else { 
                gameControls.style.display = "block"
                spriteLayer.style.display = "block"
                towerLayer.style.display = "block"
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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Returns a 50/50 boolean
function headsOrTails () {
    return Math.random() < 0.5
}

// function that appends sprites to sprites array
function appendSpriteArray (numOfSprites, spriteSpeed, imageSrc, health, sizeMod) {
    for (let i = 0; i < numOfSprites; i++) {
        sprites.push({
            hp: health, 
            x: 0,
            y: 0,
            speed: spriteSpeed,
            image: imageSrc,
            width: imageSrc.width * sizeMod,
            height: imageSrc.height * sizeMod,
            path: getRandomInt(paths.length),
            index: 0,
        })
    }
}

// function that spawns sprites in sprite array
let spawning
function spawnSprites(numOfSprites) {
    let spawned = 0
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
        spriteContext.clearRect(0, 0, spriteLayer.width, spriteLayer.height)
        for (let i = 0; i < spawned; i++) {
            let roundedIndex = Math.round(sprites[i].index)

            if (roundedIndex >= paths[sprites[i].path].length - 1) 
                continue

            if (sprites[i].index < paths[sprites[i].path].length - 1) 
                sprites[i].index = sprites[i].index + sprites[i].speed
            
            spriteContext.save()
            spriteContext.translate(paths[sprites[i].path][roundedIndex].baseX, paths[sprites[i].path][roundedIndex].baseY)
            spriteContext.rotate(paths[sprites[i].path][roundedIndex].r)
            spriteContext.drawImage(sprites[i].image, ((-sprites[i].width / 2) + paths[sprites[i].path][roundedIndex].h), 
            (-sprites[i].height / 2), sprites[i].width, sprites[i].height)
            spriteContext.restore()
            sprites[i].x = paths[sprites[i].path][roundedIndex].x
            sprites[i].y = paths[sprites[i].path][roundedIndex].y
        }

        let spriteOnScreen = false
        for (let i = 0; i < numOfSprites; i++) {
            if (Math.round(sprites[i].index) < paths[sprites[i].path].length - 1) {
                spriteOnScreen = true
                break
            }
        }
        if (spriteOnScreen) 
            requestAnimationFrame(animate)
        else 
            spriteContext.clearRect(0, 0, spriteLayer.width, spriteLayer.height)   
    }
}

// appends projectile object to the projectiles array
function appendProjectile (towerIndex) {
    let imageSrc,
        speed
    if (towers[towerIndex].id == "missile") {
        imageSrc = images.missile
        speed = 0.4
    }
    projectiles.push({
        sIndex: towers[towerIndex].sIndex,
        x: towers[towerIndex].x + (towers[towerIndex].width / 2),
        y: towers[towerIndex].y + (towers[towerIndex].height / 2),
        image: imageSrc,
        speed: speed,
        radian: towers[towerIndex].radian
    })
}

// Begins Asteroid defense map spawning.
let towerDraw
let checkLoading
function runAsteroid() {
    edgeLayer.style.display = "block"
    edgeLayer.style.backgroundImage = "url('Assets/Backgrounds/AsteroidLayer.png')"
    // Load Paths
    let pathsLoaded = false
    if (paths.length == 0) {
        $.get('Assets/GameData/AsteroidDefensePaths.txt', function(data) {
            let dataLen = data.length,
                i = 0
            while (i < dataLen) {
                if (data[i] == "[") {
                    let coordinateCount = 0,
                        xData = 0,
                        yData = 0,
                        firstCoordinate = true
                    paths.push([])
                    while (data[i] != "]" && i < dataLen) {
                        if (data[i] == "{") {
                            if (coordinateCount == pathSmoothingIndex || firstCoordinate) {
                                coordinateCount = 0
                                let lastCoordinate = {
                                    x: xData,
                                    y: yData
                                }
                                xData = 0
                                yData = 0
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
                            
                                if (firstCoordinate == false) {
                                    let dy = yData - lastCoordinate.y,
                                        dx = xData - lastCoordinate.x
                                        radian = Math.atan(dy / dx),
                                        hypotenuse = Math.sqrt((dy ** 2) + (dx ** 2)) / pathSmoothingIndex
        
                                    if (Math.sign(dx) == -1)
                                        radian = radian + pi
        
                                    for (let i = 1; i <= pathSmoothingIndex; i++) {
                                        paths[paths.length - 1].push({r: radian, h: (hypotenuse * i), baseX: xData
                                        , baseY: yData, x: 0, y: 0})
                                    } 
                                } 
                                firstCoordinate = false
                                coordinateCount++
                            }
                            else
                                coordinateCount++
                            i++
                        }
                        else
                            i++
                    }
                }
                else
                    i++
            }
    
            for (let i = 0; i < paths.length; i++) {
                let pathLen = paths[i].length
                for (let j = 1; j < pathLen - 1; j++) {
                    if (i == 6 && j ==1402){
                        let h = 0
                    }
                    let ri = paths[i][j].r,
                        rf = paths[i][j+1].r,
                        xi = paths[i][j].baseX,
                        xf = paths[i][j+1].baseX,
                        yi = paths[i][j].baseY,
                        yf = paths[i][j+1].baseY
                    if ((rf - ri) != 0 || (yf - yi) != 0 || (xf - xi) != 0) {
                        let dr = (rf - ri) / pathSmoothingIndex,
                            dx = (xf - xi) / pathSmoothingIndex,
                            dy = (yf - yi) / pathSmoothingIndex

                        for (let k = 0; k < pathSmoothingIndex; k++) {
                            paths[i][j - k].r = ri + (dr * (pathSmoothingIndex - k - 1))
                            paths[i][j - k].x = xi + (dx * (pathSmoothingIndex - k - 1)) 
                            paths[i][j - k].y = yi + (dy * (pathSmoothingIndex - k - 1)) 
                        }   
                    }
                }
            }

            $("#edgeContainer").load("Assets/GameData/AsteroidDefenseEdges.html", function () {
                pathsLoaded = true
            })

        }, "text")
    }
    else
        pathsLoaded = true

    // handles tower placement, it's animation, and appending tower to towers array
    $("#missileCannon").on("click", function (evt) {
        placeTower(images.mcannon, 1, 110, 1000, "missile", evt)
    })
    function placeTower (imageSrc, sizeMod, range, firingSpeed, id, evt) {
        pointerLayer.style.pointerEvents = "auto"
        $('[class="edge"').each(function () {
            $(this)[0].style.backgroundColor = "rgba(0, 255, 149, 0.315)"
            $(this)[0].style.pointerEvents = "auto"
        })
        function animate (evt) {
            position = getMousePos(pointerLayer, evt)
            posX = position.x - (imageSrc.width * sizeMod / 2)
            posY = position.y - (imageSrc.height * sizeMod / 2)
            pointerContext.clearRect(0, 0, pointerLayer.width, pointerLayer.height)
            pointerContext.beginPath();
            pointerContext.arc(position.x, position.y, range, 0, 2 * pi);
            pointerContext.fill()
            pointerContext.stroke();
            pointerContext.save()
            pointerContext.translate(position.x, position.y)
            pointerContext.rotate(3 * pi / 2)
            pointerContext.drawImage(imageSrc, (-imageSrc.width / 2), (-imageSrc.height / 2), imageSrc.width, imageSrc.height)
            pointerContext.restore()
        }
        let position,
            posX,
            posY,
            towerDown = false
        animate(evt)
        $("#pointerLayer").on("pointermove", function (evt) {
            animate(evt)
        })
        $("#pointerLayer").on("pointerdown", function () {
            pointerContext.clearRect(0, 0, pointerLayer.width, pointerLayer.height)
            pointerLayer.style.pointerEvents = "none"
        })
        $(".edge").on("pointerup", function () {
            if (towerDown == false) {
                $('[class="edge"').each(function () {
                    $(this)[0].style.backgroundColor = "rgba(0, 0, 0, 0)"
                    $(this)[0].style.pointerEvents = "none"
                })
                towers.push({
                    x: posX,
                    y: posY,
                    image: imageSrc,
                    width: imageSrc.width * sizeMod,
                    height: imageSrc.height * sizeMod,
                    range: range,
                    id: id,
                    radian: (3 * pi / 2),
                    gTurn: false,
                    direction: 0,
                    sRadian: 0,
                    sIndex: -1,
                    firingSpeed: firingSpeed,
                    firing: false,
                    firingInterval: null
                })
            }
            towerDown = true
        })
    }

    // Renders all towers in tower array and rotates them to first sprite to enter their range.
    let spritesLen,
        hypotenuse,
        radian
    renderTowers()
    function renderTowers () {
        let towersLen = towers.length
        towerContext.clearRect(0, 0, towerLayer.width, towerLayer.height)
        for (let i = 0; i < towersLen; i++) {
            // TEMP -- Range visual
            let posX = towers[i].x + (towers[i].width / 2),
                posY = towers[i].y + (towers[i].height / 2)
            towerContext.beginPath();
            towerContext.arc(posX, posY, 110, 0, 2 * pi);
            towerContext.fill()
            towerContext.stroke();

            // designates specific turning instructions for when a towers angle is significantly 
            // different than the angle of a sprite within the tower's range.
            function gentleTurn () {
                towers[i].firing = false
                let dx = sprites[towers[i].sIndex].x - (towers[i].x + (towers[i].width / 2)),
                    dy = sprites[towers[i].sIndex].y - (towers[i].y + (towers[i].height / 2))
                towers[i].sRadian = Math.atan(dy / dx)
                if (Math.sign(dx) == -1)
                    towers[i].sRadian = towers[i].sRadian + pi
                if (towers[i].sRadian < 0)
                    towers[i].sRadian = towers[i].sRadian + twoPi

                let dTheta = Math.abs(towers[i].sRadian - towers[i].radian)
                if (dTheta > fiveDeg) {
                    towers[i].radian = towers[i].radian + (towers[i].direction * oneDeg)
                    if (towers[i].radian < 0)
                        towers[i].radian = towers[i].radian + twoPi
                    else if (towers[i].radian > twoPi)
                        towers[i].radian = towers[i].radian - twoPi
                }
                else
                    towers[i].gTurn = false 
            }

            if (towers[i].gTurn == true) 
                gentleTurn()
            else {
                spritesLen = sprites.length
                for (let j = 0; j < spritesLen; j++) {
                    let dx = sprites[j].x - (towers[i].x + (towers[i].width / 2)),
                        dy = sprites[j].y - (towers[i].y + (towers[i].height / 2)),
                        hypotenuse = Math.sqrt((dx ** 2) + (dy ** 2))
                    towers[i].sIndex = j
                    if (hypotenuse <= towers[i].range) {
                        towers[i].sRadian = Math.atan(dy / dx)
                        if (Math.sign(dx) == -1)
                            towers[i].sRadian = towers[i].sRadian + pi
                        if (towers[i].sRadian < 0)
                            towers[i].sRadian = towers[i].sRadian + twoPi

                        let dTheta = Math.abs(towers[i].sRadian - towers[i].radian)
                        if (dTheta > tenDeg) {
                            towers[i].gTurn = true
                            if (towers[i].radian < towers[i].sRadian) {
                                if (((twoPi - towers[i].sRadian) + towers[i].radian) > dTheta) 
                                    towers[i].direction = 1
                                else
                                    towers[i].direction = -1
                            }
                            else {
                                if (((twoPi - towers[i].radian) + towers[i].sRadian) > dTheta) 
                                    towers[i].direction = -1
                                else
                                    towers[i].direction = 1
                            }
                            gentleTurn()
                        }
                        else {
                            if (towers[i].firing == false)
                                appendProjectile(i)
                            towers[i].firing = true
                            towers[i].radian = towers[i].sRadian
                        }
                        break
                    }
                    else {
                        towers[i].firing = false
                    }
                }
            }
            towerContext.save()
            towerContext.translate(towers[i].x + (towers[i].width / 2), towers[i].y + (towers[i].height / 2))
            towerContext.rotate(towers[i].radian)
            towerContext.drawImage(towers[i].image, (-towers[i].width / 2), (-towers[i].height / 2), towers[i].width, towers[i].height)
            towerContext.restore()
        }
        requestAnimationFrame(renderTowers)
    }

    let checkFiring = setInterval (function () {
        let towersLen = towers.length
        for (let i = 0; i < towersLen; i++) {
            if (towers[i].firing == true && towers[i].firingInterval == null) {
                towers[i].firingInterval = setInterval(function () {
                    appendProjectile(i)
                }, towers[i].firingSpeed)
            }
            else if (towers[i].firing == false) {
                clearInterval(towers[i].firingInterval)
                towers[i].firingInterval = null
            }
        }
    }, 50)

    // Renders projectiles in projectile array
    renderProjectiles()
    function renderProjectiles() {
        let projectilesLen = projectiles.length
        projectileContext.clearRect(0, 0, projectileLayer.width, projectileLayer.height)
        for (let i = 0; i < projectilesLen; i++) {
            let sx = sprites[projectiles[i].sIndex].x,
                sy = sprites[projectiles[i].sIndex].y,
                px = projectiles[i].x,
                py = projectiles[i].y

            if (px < sx) 
                projectiles[i].x = px + projectiles[i].speed
            else if (px > sx)
                projectiles[i].x = px - projectiles[i].speed

            if (py < sy) 
                projectiles[i].y = py + projectiles[i].speed
            else if (py > sy)
                projectiles[i].y = py - projectiles[i].speed

            
            
            projectileContext.drawImage(projectiles[i].image, projectiles[i].x, projectiles[i].y)
        }
        requestAnimationFrame(renderProjectiles)
    }
    
    checkLoading = setInterval (function() {
        if (pathsLoaded) {
            clearInterval(checkLoading)
            appendSpriteArray(1, 0.25, images.drone, 100, 1.2)
            spawnSprites(sprites.length)
        }
    }, 1000)
}

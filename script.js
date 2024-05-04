const oneDeg = Math.PI / 180
const tenDeg = oneDeg * 10
const twoDeg = oneDeg * 2
const pi = Math.PI
const twoPi = Math.PI * 2

// developement tool for creating sprite path data.
let createdPath = []
function createPath () {
    container.style.backgroundImage = "url('Assets/Backgrounds/AsteroidDefense.png')"
    gameControls.style.display = "none"
    mapsControls.style.display = "none"
    settingsControls.style.display = "none"
    menuControls.style.display = "none"

    spriteLayer.style.pointerEvents = "auto"
    let mouseDown = false
    $("#spriteLayer").on("pointermove", function (e) {
        let position = getMousePos(spriteLayer, e)
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
        $("#spriteLayer").off("pointermove")
        $(document).off("pointerdown")
        $(document).off("pointerup")
    })
}

// Deals with javascript radian weirdness.
function getRadian (dx, dy) {
    let radian = Math.atan(dy / dx)
    if (Math.sign(dx) == -1)
        radian = radian + pi
    if (radian < 0)
        radian = radian + twoPi
    if (isNaN(radian))
        radian = 0
    return radian
}

// Returns mouse position on canvas.
function getMousePos(canvas, e) {
    let agentX = e.clientX,
        agentY = e.clientY
    if (e.type == "touchstart" || e.type == "touchmove" || e.type == "touchend" || e.type == "touchcancel") {
        let touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]
        agentX = touch.pageX
        agentY = touch.pageY
    }

    var rect = canvas.getBoundingClientRect(),
        x = agentX - rect.left
        y = agentY - rect.top 

    return {
        x: x,   
        y: y
    }
}

// Returns a random number between the parameters.
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Returns a 50/50 boolean.
function headsOrTails () {
    return Math.random() < 0.5
}

// Waits for document to be ready before grabbing DOM stuff.
let spriteLayer, spriteContext, towerLayer, towerContext, pointerLayer, pointerContext, projectileLayer,
    projectileContext, edgeLayer, container, gameControls, mapsControls, settingsControls, menuControls,
    loadingScreen, body
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
    loadingScreen =  $("#loadingScreen")[0]
    body = $('#body')[0]

    spriteContext.imageSmoothingEnabled = false
    spriteContext.lineWidth = 0.1
    spriteContext.strokeStyle = "white"
    pointerContext.fillStyle = "rgba(0, 247, 255, 0.452)"
    pointerContext.strokeStyle = "rgb(161, 241, 255)"
    towerContext.fillStyle = "rgba(0, 247, 255, 0.452)"
    towerContext.strokeStyle = "rgb(161, 241, 255)"

    loading()
})

// test function that runs game.
function test() {
    reset()
    screenTransition("AsteroidDefense")
    loadAsteroid()
}

// Resets game related global variables, HTML elements, and intervals.
let stopRender = false
function reset () {
    stopRender = true
    waveEnded = false
    startNextWave = false
    paused = false
    spawned = 0

    clearInterval(spawning)
    clearInterval(checkFiring)
    clearInterval(waveRunning)
    clearInterval(checkPathLoading)
    clearInterval(checkLoading)
    clearInterval(waveTimer)
    let towersLen = towers.length
    for (let i = 0 ; i < towersLen; i++) 
        clearInterval(towers[i].firingInterval)

    paths = []
    towers = []
    sprites = []
    projectiles = []
    playerHP = 10
    
    $("#edgeContainer").empty()
    $("#gameOverScreen")[0].style.display = "none"
    $('[class="healthSquare"').each(function () {
        $(this)[0].style.display = "block"
    })

    spriteContext.clearRect(0, 0, spriteLayer.width, spriteLayer.height)
    towerContext.clearRect(0, 0, towerLayer.width, towerLayer.height)
    pointerContext.clearRect(0, 0, pointerLayer.width, pointerLayer.height)
    projectileContext.clearRect(0, 0, projectileLayer.width, projectileLayer.height)
}

// executes the selected map when play button is pressed.
let paths = [], towers = [], sprites = [], projectiles = [], playerHP = 10, playerCredits
function play() {
    reset()
    let map = $('#mapPreviewText').html()
    if (map == "Asteroid Defense") {
        screenTransition("AsteroidDefense")
        loadAsteroid()
    }   
}

// Modifies visible DOM elements in between the main menu and game.
function screenTransition(event) {
    let string
    if (event.target == undefined) 
        string = event
    else 
        string = event.target.innerHTML

    loadingScreen.style.display = "block"
    gameControls.style.display = "none"
    mapsControls.style.display = "none"
    settingsControls.style.display = "none"
    menuControls.style.display = "none"
    spriteLayer.style.display = "none"
    towerLayer.style.display = "none"
    container.style.backgroundImage = "url('Assets/Backgrounds/menu.png')"
    if (string == "Main Menu") {
        loadingScreen.style.display = "none"
        menuControls.style.display = "block"
        edgeLayer.style.display = "none"
        reset()
    }
    else if (string == "Settings") {
        loadingScreen.style.display = "none"
        settingsControls.style.display = "block"
    }
        
    else if (string == "Maps") {
        loadingScreen.style.display = "none"
        mapsControls.style.display = "block"
    }
    else {
        gameControls.style.display = "block"
        spriteLayer.style.display = "block"
        towerLayer.style.display = "block"
        container.style.backgroundImage = "url('Assets/Backgrounds/" + string + ".png')"
    }
}

// Pauses game if tabbed out
let paused = false
$(document).on("visibilitychange", function() {
    if (document.visibilityState == 'hidden')
        paused = true
    else 
        paused = false
})

// Loads all images into image object before user can use the program.
let images, checkLoading
function loading () {
    images = {
        "drone": new Image(),
        "mcannon" : new Image(),
        "menace": new Image(),
        "test1": new Image(),
        "test2": new Image(),
        "polygon": new Image(),
        "missile": new Image()
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
    let boolArrayLen = boolArray.length

    images.drone.onload = function () {boolArray[0].bool = true}
    images.mcannon.onload = function () {boolArray[1].bool = true}
    images.menace.onload = function () {boolArray[2].bool = true}
    images.test1.onload = function () {boolArray[3].bool = true}
    images.test2.onload = function () {boolArray[4].bool = true}
    images.polygon.onload = function () {boolArray[5].bool = true}
    images.missile.onload = function () {boolArray[6].bool = true}

    checkLoading = setInterval (function () {
        if (!paused) {
            for (let i = 0; i < boolArrayLen; i++) {
                if (boolArray[i].bool == false)
                    return
            }
            clearInterval(checkLoading)
            loadingScreen.style.display = "none"
            loadStatData()
            test() // temporary
        }
    }, 1000)
}

// Loads sprite path data from Game Data files.
let pathSmoothingIndex = 15
function loadPaths (data) {
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
                                dx = xData - lastCoordinate.x,
                                radian = Math.atan(dy / dx)
                            if (Math.sign(dx) == -1)
                                radian = radian + pi

                            for (let i = 1; i <= pathSmoothingIndex; i++) {
                                paths[paths.length - 1].push({
                                    r: radian, 
                                    x: xData, 
                                    y: yData, 
                                })
                            } 
                        }
                        else {
                            for (let i = 1; i <= pathSmoothingIndex; i++) {
                                paths[paths.length - 1].push({
                                    r: 0, 
                                    x: xData,
                                    y: yData, 
                                })
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

    let pathsLen = paths.length
    for (let i = 0; i < pathsLen; i++) {
        let pathLen = paths[i].length,
            dr, dx, dy
        for (let j = 1; j < pathLen - 1; j++) {
            let ri = paths[i][j].r,
                rf = paths[i][j+1].r,
                xi = paths[i][j].x,
                xf = paths[i][j+1].x,
                yi = paths[i][j].y,
                yf = paths[i][j+1].y
            if ((rf - ri) != 0 || (yf - yi) != 0 || (xf - xi) != 0) {
                dr = (rf - ri) / pathSmoothingIndex
                dx = (xf - xi) / pathSmoothingIndex
                dy = (yf - yi) / pathSmoothingIndex

                for (let k = 0; k < pathSmoothingIndex; k++) {
                    paths[i][j - k].r = ri + (dr * (pathSmoothingIndex - k - 1))
                    paths[i][j - k].x = xi + (dx * (pathSmoothingIndex - k - 1)) 
                    paths[i][j - k].y = yi + (dy * (pathSmoothingIndex - k - 1)) 
                }   
            }
        }
        let mod = 1
        for (let j = pathLen + 1 - pathSmoothingIndex; j < pathLen; j++) {
            paths[i][j].r = paths[i][j].r + (dr * mod)
            paths[i][j].x = paths[i][j].x + (dx * mod)
            paths[i][j].y = paths[i][j].y + (dy * mod)
            mod++
        }
    }
}

// Is triggered when all image data is loaded to define sprite and tower stats
let spriteStats, towerStats
function loadStatData () {
    spriteStats = {
        "drone": {
            speed: 1,
            hp: 100,
            sizeMod: 1.2,
            image: images.drone
        },
        "menace": {
            speed: 1,
            hp: 200,
            sizeMod: 1,
            image: images.menace
        }
    }

    towerStats = {
        "mcannon": {
            sizeMod: 1, 
            range: 180, 
            firingSpeed: 2000,
            projectileId: "missile",
            projectileSpeed: 1.5,
            projectileSizeMod: 1,
            projectileDmg: 33.4
        }
    }
}

// Waits to load the Asteroid defense map data before firing any code.
let checkPathLoading
function loadAsteroid () {
    let pathsLoaded = false
    checkPathLoading = setInterval (function() {
        if (!paused) {
            if (pathsLoaded) {
                clearInterval(checkPathLoading)
                stopRender = false
                runAsteroid()
            }
        }
    }, 1000)
    // Load Paths
    $.get('Assets/GameData/AsteroidDefensePaths.txt', function(data) {
        loadPaths(data)
        $("#edgeContainer").load("Assets/GameData/AsteroidDefenseEdges.html", function () {
            pathsLoaded = true
        })
    }, "text")
}

// Begins Asteroid defense sprite spawning.
let checkFiring, spawnRate = 1500
function runAsteroid() {
    edgeLayer.style.display = "block"
    edgeLayer.style.backgroundImage = "url('Assets/Backgrounds/AsteroidLayer.png')"
    playerCredits = 300
    $("#playerCredits").html(playerCredits)

    // Wave info is formatted as the integer number of sprites, a space, 
    // then the sprite type followed by a comma to seperate sprites.
    startWave(wave1, "10 drone", 15)

    function wave1(waveInfo) {
        for (let i in waveInfo)
            appendSprite(waveInfo[i], i)
        startWave(wave2, "5 drone, 5 menace", 60)
    }
    function wave2(waveInfo) {
        for (let i in waveInfo)
            appendSprite(waveInfo[i], i)
        startWave(wave3, "10 drone, 5 menace", 60)
    }
    function wave3(waveInfo) {
        for (let i in waveInfo)
            appendSprite(waveInfo[i], i)
        startWave(wave4," 10 drone, 10 menace", 60)
    }
    function wave4(waveInfo) {
        for (let i in waveInfo)
            appendSprite(waveInfo[i], i)
        startWave("", "", "")
    }

    checkFiring = setInterval (function () {
        if (!paused) {
            let towersLen = towers.length
            for (let i = 0; i < towersLen; i++) {
                if (towers[i].firing == true && towers[i].firingInterval == null) {
                    towers[i].firingInterval = setInterval(function () {
                        if (!paused) 
                            appendProjectile(i)
                    }, towers[i].firingSpeed)
                }
                else if (towers[i].firing == false && towers[i].firingInterval != null) {
                    clearInterval(towers[i].firingInterval)
                    towers[i].firingInterval = null
                }
            }
        }
    }, 1000)
}

// Functions triggers when playerHP reaches 0, informs player of losing and deals with variables and gives,
// player option to retry or return to menu.
function playerDead () {
    paused = true
    $("#gameOverScreen")[0].style.display = "block"
}

// handles tower placement and appending tower to towers array.
let position, pointerActive = false, pointerId
$(document).ready(function () {
    $("#missileCannon").on("click", function (e) {
        if (playerCredits - 100 >= 0) {
            playerCredits = playerCredits - 100
            appendTower(images.mcannon, towerStats["mcannon"].sizeMod, 
                towerStats["mcannon"].range, towerStats["mcannon"].firingSpeed, "mcannon", e)
        }
        else {
            // flash credits red
        }
        $("#playerCredits").html(playerCredits)
    })
})
function appendTower (imageSrc, sizeMod, range, firingSpeed, id, e) {
    pointerId = id
    let posX, posY
    pointerLayer.style.pointerEvents = "auto"
    pointerLayer.style.touchAction = "auto"
    $('[class="edge"').each(function () {
        $(this)[0].style.backgroundColor = "rgba(0, 255, 149, 0.315)"
        $(this)[0].style.pointerEvents = "auto"
        $(this)[0].style.touchAction = "auto"
    })

    function updateMousePos (e) {
        position = getMousePos(pointerLayer, e)
        pointerActive = true
        posX = position.x - (imageSrc.width * sizeMod / 2)
        posY = position.y - (imageSrc.height * sizeMod / 2)
    }
    updateMousePos(e)

    function removeEvents () {
        $("#pointerLayer").off("touchstart")
        $("#pointerLayer").off("touchmove")
        $("#pointerLayer").off("touchend")
        $(".edge").off("touchmove")
        $(".edge").off("touchend")

        $("#pointerLayer").off("pointermove")
        $("#pointerLayer").off("pointerdown")
        $(".edge").off("pointerup")

        $("#void").off("pointerup touchend")
        $(".gameButton").off("pointerup touchend")

        $('[class="edge"').each(function () {
            $(this)[0].style.pointerEvents = "none"
            $(this)[0].style.touchAction = "none"
            $(this)[0].style.backgroundColor = "rgba(0, 0, 0, 0)"
        })
    }

    function touchAction (e) {
        updateMousePos(e)
        $(".edge").off("pointerup")
        $(".edge").off("pointerdown")
        $("#pointerLayer").off("pointerdown")
        $("#pointerLayer").off("pointermove")
    }

    function pointerAction (e) {
        updateMousePos(e)
        $("#pointerLayer").off("touchstart")
        $("#pointerLayer").off("touchmove")
        $("#pointerLayer").off("touchend")
        $(".edge").off("touchmove")
        $(".edge").off("touchend")
    }

    $("#pointerLayer").on("touchstart", function (e) {
        touchAction(e)
    })
    $("#pointerLayer").on("touchmove", function (e) {
        touchAction(e)
    })
    $("#pointerLayer").on("touchend", function () {
        pointerLayer.style.pointerEvents = "none"
        pointerLayer.style.touchAction = "none"
    })
    $(".edge").on("touchmove", function (e) {
        touchAction(e)
    })
    $(".edge").on("touchend", function () {
        removeEvents()
        pointerActive = false
        $('[class="edge"').each(function () {
            $(this)[0].style.backgroundColor = "rgba(0, 0, 0, 0)"
        })

        let towersLen = towers.length
        // Doesn't allow for towers to be placed over one another
        for (let i = 0; i < towersLen; i++) {
            if ((towers[i].x + (towers[i].width / 2)) >= (posX - (imageSrc.width * sizeMod / 2)) 
            && (towers[i].x - (towers[i].width / 2)) <= (posX + (imageSrc.width * sizeMod / 2)) 
            && (towers[i].y + (towers[i].height / 2)) >= (posY - (imageSrc.height * sizeMod / 2)) 
            && (towers[i].y - (towers[i].height / 2)) <= (posY + (imageSrc.height * sizeMod / 2))) {
                // Some animation or indicator
                return
            }
        }

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
    })

    $("#void").on("pointerup touchend", function () {
        removeEvents()
        pointerActive = false
    })
    $(".gameButton").on("pointerup touchend", function () {
        removeEvents()
        pointerActive = false
    })
    
    $("#pointerLayer").on("pointermove", function (e) {
        pointerAction(e)
    })
    $("#pointerLayer").on("pointerdown", function () {
        pointerLayer.style.pointerEvents = "none"
        pointerLayer.style.touchAction = "none"
    })
    $(".edge").on("pointerup", function () {
        removeEvents()
        pointerActive = false
        let towersLen = towers.length
        // Doesn't allow for towers to be placed over one another
        for (let i = 0; i < towersLen; i++) {
            if ((towers[i].x + (towers[i].width / 2)) >= (posX - (imageSrc.width * sizeMod / 2)) 
            && (towers[i].x - (towers[i].width / 2)) <= (posX + (imageSrc.width * sizeMod / 2)) 
            && (towers[i].y + (towers[i].height / 2)) >= (posY - (imageSrc.height * sizeMod / 2)) 
            && (towers[i].y - (towers[i].height / 2)) <= (posY + (imageSrc.height * sizeMod / 2))) {
                // Some animation or indicator
                return
            }
        }

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
            sIndex: null,
            firingSpeed: firingSpeed,
            firing: false,
            firingInterval: null
        })
    })
}

// appends projectile object to the projectiles array.
function appendProjectile (towerIndex) {
    let towerType = towers[towerIndex].id,
        imageSrc = images[towerStats[towerType].projectileId], 
        speed = towerStats[towerType].projectileSpeed, 
        sizeMod = towerStats[towerType].projectileSizeMod, 
        dmg = towerStats[towerType].projectileDmg

    projectiles.push({
        sIndex: towers[towerIndex].sIndex,
        tIndex: towerIndex,
        x: towers[towerIndex].x + (towers[towerIndex].width / 2),
        y: towers[towerIndex].y + (towers[towerIndex].height / 2),
        image: imageSrc,
        height: imageSrc.height * sizeMod,
        width: imageSrc.width * sizeMod,
        speed: speed,
        radian: towers[towerIndex].radian,
        dmg: dmg,
        target: true
    })
}

// function that appends sprites object to sprites array
function appendSprite (numOfSprites, spriteType) {
    for (let i = 0; i < numOfSprites; i++) {
        let sizeMod = spriteStats[spriteType].sizeMod,
            image = spriteStats[spriteType].image
            
        sprites.push({
            hp: spriteStats[spriteType].hp, 
            x: 0,
            y: 0,
            speed: spriteStats[spriteType].speed,
            image: image,
            width: image.width * sizeMod,
            height: image.height * sizeMod,
            path: getRandomInt(paths.length),
            index: 0,
            despawned: false,
            name: spriteType
        })
    }
}

// function that spawns sprites in sprite array.
function renderSprites() {
    spriteContext.clearRect(0, 0, spriteLayer.width, spriteLayer.height)
    for (let i = 0; i < spawned; i++) {
        let roundedIndex = Math.round(sprites[i].index)
        if ((roundedIndex > paths[sprites[i].path].length - 1) && sprites[i].despawned == false) {
            // Do damage to player
            if (playerHP > 0) {
                $('#' + playerHP + 'hp')[0].style.display = "none"
                playerHP--
            }
            if (playerHP == 0){
                playerDead()
                return
            }
        }
        if ((roundedIndex > paths[sprites[i].path].length - 1) || (sprites[i].hp <= 0) || sprites[i].despawned) {
            if (sprites[i].hp <= 0 && sprites[i].despawned == false) {
                if (sprites[i].name == "drone")
                    playerCredits = playerCredits + 25
                else if (sprites[i].name == "menace")
                    playerCredits = playerCredits + 50

                $("#playerCredits").html(playerCredits)
            }
            sprites[i].despawned = true
            continue
        }
            
        spriteContext.save()
        spriteContext.translate(paths[sprites[i].path][roundedIndex].x, paths[sprites[i].path][roundedIndex].y)
        spriteContext.rotate(paths[sprites[i].path][roundedIndex].r)
        spriteContext.drawImage(sprites[i].image, (-sprites[i].width / 2), (-sprites[i].height / 2), sprites[i].width, sprites[i].height)
        spriteContext.restore()
        sprites[i].x = paths[sprites[i].path][roundedIndex].x
        sprites[i].y = paths[sprites[i].path][roundedIndex].y
        sprites[i].index = sprites[i].index + sprites[i].speed
    }
}

// function that renders tower placement
function renderPointers() {
    if (pointerActive) {
        let imageSrc = images[pointerId]
        pointerContext.clearRect(0, 0, pointerLayer.width, pointerLayer.height)
        pointerContext.beginPath();
        pointerContext.arc(position.x, position.y, towerStats[pointerId].range, 0, 2 * pi);
        pointerContext.fill()
        pointerContext.stroke();
        pointerContext.save()
        pointerContext.translate(position.x, position.y)
        pointerContext.rotate(3 * pi / 2)
        pointerContext.drawImage(imageSrc, (-imageSrc.width / 2), (-imageSrc.height / 2), imageSrc.width, imageSrc.height)
        pointerContext.restore()
    }
    else
        pointerContext.clearRect(0, 0, pointerLayer.width, pointerLayer.height)
}

// Renders all towers in tower array and rotates them to first sprite to enter their range.
function renderTowers() {
    let towersLen = towers.length
    towerContext.clearRect(0, 0, towerLayer.width, towerLayer.height)

    // TEMP -- Range visual
    //for (let i = 0; i < towersLen; i++) {
    //    let posX = towers[i].x + (towers[i].width / 2),
    //        posY = towers[i].y + (towers[i].height / 2)
    //    towerContext.beginPath();
    //    towerContext.arc(posX, posY, 110, 0, 2 * pi);
    //    towerContext.fill()
    //    towerContext.stroke();
    //}

    for (let i = 0; i < towersLen; i++) {
        // designates specific turning instructions for when a towers angle is significantly 
        // different than the angle of a sprite within the tower's range.
        function gentleTurn () {
            let dx = sprites[towers[i].sIndex].x - (towers[i].x + (towers[i].width / 2)),
                dy = sprites[towers[i].sIndex].y - (towers[i].y + (towers[i].height / 2))
            towers[i].sRadian = getRadian(dx, dy)

            let dTheta = Math.abs(towers[i].sRadian - towers[i].radian)
            if (dTheta > tenDeg) {
                towers[i].radian = towers[i].radian + (towers[i].direction * twoDeg)
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
                if (sprites[j].despawned)
                    continue
                let dx = sprites[j].x - (towers[i].x + (towers[i].width / 2)),
                    dy = sprites[j].y - (towers[i].y + (towers[i].height / 2)),
                    hypotenuse = Math.sqrt((dx ** 2) + (dy ** 2))
                towers[i].sIndex = j
                if (hypotenuse <= towers[i].range) {
                    towers[i].sRadian = getRadian(dx, dy)
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
                else if (j == spritesLen - 1)
                    towers[i].firing = false
            }
        }
        towerContext.save()
        towerContext.translate(towers[i].x + (towers[i].width / 2), towers[i].y + (towers[i].height / 2))
        towerContext.rotate(towers[i].radian)
        towerContext.drawImage(towers[i].image, (-towers[i].width / 2), (-towers[i].height / 2), towers[i].width, towers[i].height)
        towerContext.restore()
    }
}

// Renders projectiles in projectile array.
function renderProjectiles() {
    let projectilesLen = projectiles.length
    projectileContext.clearRect(0, 0, projectileLayer.width, projectileLayer.height)
    for (let i = 0; i < projectilesLen; i++) {
        let px = projectiles[i].x,
            py = projectiles[i].y
        
        if (projectiles[i].target == false) {
            projectileContext.save()
            projectileContext.translate(px, py)
            projectileContext.rotate(projectiles[i].radian)
            projectileContext.drawImage(projectiles[i].image, (-projectiles[i].width / 2), (-projectiles[i].height / 2), 
                                        projectiles[i].width, projectiles[i].height)
            projectileContext.restore()

            let xTheta = Math.cos(projectiles[i].radian) * projectiles[i].speed,
                yTheta = Math.sin(projectiles[i].radian) * projectiles[i].speed

            projectiles[i].x = px + xTheta
            projectiles[i].y = py + yTheta
            continue
        }
        
        let spriteIndex = projectiles[i].sIndex,
            sx = sprites[spriteIndex].x,
            sy = sprites[spriteIndex].y,
            dx = sx - px,
            dy = sy - py,
            radian = getRadian(dx, dy)

        projectileContext.save()
        projectileContext.translate(px, py)
        projectileContext.rotate(radian)
        projectileContext.drawImage(projectiles[i].image, (-projectiles[i].width / 2), (-projectiles[i].height / 2), 
                                    projectiles[i].width, projectiles[i].height)
        projectileContext.restore()

        let xTheta = Math.cos(radian) * projectiles[i].speed,
            yTheta = Math.sin(radian) * projectiles[i].speed

        projectiles[i].x = px + xTheta
        projectiles[i].y = py + yTheta
        projectiles[i].radian = radian

        dx = Math.abs(dx)
        dy = Math.abs(dy)
        if ((dx < projectiles[i].width && dy < projectiles[i].height)) {
            sprites[spriteIndex].hp = sprites[spriteIndex].hp - projectiles[i].dmg
            projectiles.splice(i, 1)
            projectilesLen--
            if (i > 0)
                i--
            if (sprites[spriteIndex].hp <= 0) {
                for (let j = 0; j < projectilesLen; j++) {
                    if (projectiles[j].sIndex == spriteIndex) 
                        projectiles[j].target = false
                }
                let towersLen = towers.length
                for (let j = 0; j < towersLen; j++) {
                    if (towers[j].sIndex == spriteIndex) {
                        towers[j].firing = false
                        clearInterval(towers[j].firingInterval)
                        towers[j].firingInterval = null
                    }
                }
            }
        }
        else if (projectiles[i].x > 960 || projectiles[i].y > 540) {
            projectiles.splice(i, 1)
            projectilesLen--
            i--
        }
    }
}

// The actual animation frame function for rendering all sprites, towers, and projectiles.
function render() {
    renderSprites()
    renderPointers()
    renderTowers()
    renderProjectiles()

    if (stopRender == false && waveEnded == false) {
        setTimeout(() => {
            requestAnimationFrame(render)
        }, 17)
    }
}

// Allows player to start next wave once all the sprites of the current wave have been killed/despawned.
let startNextWave = false
function startNextWaveButton () {
    let spritesLen = sprites.length
    for (let i = 0; i < spritesLen; i++) {
        if (sprites[i].despawned == false) {
            alert("Cannot start next wave until there are no enemy units in the current wave.")
            return
        }
    }
    startNextWave = true
}

// Starts spawning the sprites in the sprite array, and Checks if wave is over, then it clears the sprites array.
// This function is passed information about the next wave and initiates the next wave once the current wave is over.
// Takes argument variable with amount of seconds in integer form until the next wave and waits to render the next wave.
let spawning, waveRunning, spawned = 0, waveEnded = false,
    waveTimer
function startWave (nextWave, rawWaveInfo, timeTillNext) {
    // Reads sprite array to pass the next wave information to DOM.
    function readWaveInfo (rawWaveInfo) {
        let rawWaveInfoLen = rawWaveInfo.length,
            waveInfo = {},
            numOfSprites = "",
            spriteType = ""
        for (let i = 0; i < rawWaveInfoLen; i++) {
            if (rawWaveInfo[i] == "," || i == (rawWaveInfoLen - 1)) {
                if (i == (rawWaveInfoLen - 1))
                    spriteType = spriteType + rawWaveInfo[i]
                waveInfo[spriteType] = Number(numOfSprites)
                spriteType = ""
                numOfSprites = ""
            }
            else if (rawWaveInfo[i] == " ") 
                continue
            else if (isNaN(rawWaveInfo[i]) == false)
                numOfSprites = numOfSprites + rawWaveInfo[i]
            else
                spriteType = spriteType + rawWaveInfo[i]
        }
        return waveInfo
    }

    waveEnded = false
    let numOfSprites = sprites.length
        
    let waveNum, parsedWaveInfo, waveInfoText
    if (nextWave != "") {
        waveNum = nextWave.name.slice(4),
        parsedWaveInfo = readWaveInfo(rawWaveInfo),
        waveInfoText = ""
        $('#waveNumber').html(Number(waveNum) - 1)
        $('#nextWaveNumber').html(waveNum)
        for (let i in parsedWaveInfo)
            waveInfoText = waveInfoText + parsedWaveInfo[i] + " " + i + ", "
        $('#nextWaveSprites').html(waveInfoText.slice(0, waveInfoText.length - 2))
        let secondsString = (timeTillNext % 60).toString(),
            zeroInFront = ""
        if (secondsString.length == 1)
            zeroInFront = "0"
        $('#nextWaveTimer').html(Math.trunc(timeTillNext / 60) + "m:" + zeroInFront + secondsString + "s")
    }
    else {
        $('#waveNumber').html(Number($('#waveNumber').html()) + 1)
        $('#nextWaveNumber').html("")
        $('#nextWaveSprites').html("")
        $('#nextWaveTimer').html("")
    }
    
    loadingScreen.style.display = "none"

    render()
    spawning = setInterval(function () {
        if (!paused) {
            if (spawned < numOfSprites) 
                spawned++
            else 
                clearInterval(spawning)
        }
    }, spawnRate)

    waveTimer = setInterval(function () {
        if (!paused) {
            if (nextWave != "") {
                timeTillNext--
                let secondsString = (timeTillNext % 60).toString(),
                    zeroInFront = ""
                if (secondsString.length == 1)
                    zeroInFront = "0"
                $('#nextWaveTimer').html(Math.trunc(timeTillNext / 60) + "m:" + zeroInFront + secondsString + "s")
                if (timeTillNext == 0 || startNextWave) {
                    clearInterval(waveTimer)
                    startNextWave = false
                    waveEnded = true
                    setTimeout(() => {
                        sprites = []
                        let projectilesLen = projectiles.length
                        for (let i = 0; i < projectilesLen; i++) 
                            projectiles[i].target = false
                        spawned = 0
                        nextWave(parsedWaveInfo)
                    }, 100)
                }
            }
            else {
                clearInterval(waveTimer)
            }
        }
    }, 1000)
}




let x = 0,
    y = 0,
    sprite = new Image();

sprite.onload = animate;
sprite.src = "Assets/Sprites/TestSprite.png";

function animate() {
    // Clear display
    context.clearRect(0, 0, display.width, display.height);
    // Draw sprite at current position
    context.drawImage(sprite, x, y);
    // Change position
    x++;
    // Loop
    if (x < 250) 
        requestAnimationFrame(animate);
}
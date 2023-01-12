// Create a rectangle with an (x, y) coordinate, a width, and a height
function rect(x, y, w, h) {
    return { x: x, y: y, w: w, h: h }
}

// Represent the level as a list of rectangles
let rects = [
    rect(0, 0, 600, 20),
    rect(0, 580, 600, 20),
    rect(0, 0, 20, 600),
    rect(580, 0, 20, 600),

    rect(180, 120, 80, 10),
    rect(10, 220, 80, 10),
    rect(120, 170, 40, 10),
    rect(130, 300, 40, 10),
    rect(200, 320, 80, 10),
    rect(200, 520, 80, 10),
    rect(100, 420, 80, 10),

    rect(280, 60, 10, 600),
    rect(320, 0, 10, 540),

    rect(380, 60, 300, 10),

    rect(390, 160, 40, 10),
    rect(490, 260, 40, 10),
    rect(490, 360, 40, 10),
    rect(380, 440, 40, 10),
    rect(480, 520, 40, 10),


]

// Returns true iff a and b overlap
function overlapTest(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
        a.y < b.y + b.h && a.y + a.h > b.y
}

// Move the rectangle p along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function move(p, vx, vy) {
    // Move rectangle along x-axis
    for (let i = 0; i < rects.length; i++) {
        let c = { x: p.x + vx, y: p.y, w: p.w, h: p.h }
        if (overlapTest(c, rects[i])) {
            if (vx < 0) vx = rects[i].x + rects[i].w - p.x
            else if (vx > 0) vx = rects[i].x - p.x - p.w
        }
    }
    p.x += vx

    // Move rectangle along y-axis
    for (let i = 0; i < rects.length; i++) {
        let c = { x: p.x, y: p.y + vy, w: p.w, h: p.h }
        if (overlapTest(c, rects[i])) {
            if (vy < 0) vy = rects[i].y + rects[i].h - p.y
            else if (vy > 0) vy = rects[i].y - p.y - p.h
        }
    }
    p.y += vy
}

// Record which key codes are currently pressed
let keys = {}
document.onkeydown = function(e) { keys[e.which] = true }
document.onkeyup = function(e) { keys[e.which] = false }

// Player is a rectangle with extra properties
let player = rect(20, 280, 20, 20)
player.velocity = { x: 0, y: 0 }
player.onFloor = false

// Updates the state of the game for the next frame
function update() {
    // Update the velocity
    player.velocity.x = 3 * (!!keys[39] - !!keys[37]) // right - left
    player.velocity.y += 1 // Acceleration due to gravity

    // Move the player and detect collisions
    let expectedY = player.y + player.velocity.y
    move(player, player.velocity.x, player.velocity.y)
    player.onFloor = (expectedY > player.y)
    if (expectedY != player.y) player.velocity.y = 0

    // Only jump when we're on the floor
    if (player.onFloor && keys[38]) {
        player.velocity.y = -15
    }
}

// Renders a frame
function draw() {
    let c = document.getElementById('game').getContext('2d')

    // Background
    c.fillStyle = '#FFF'
    c.fillRect(0, 0, c.canvas.width, c.canvas.height)

    // Player
    c.fillStyle = '#A14EBF'
    c.fillRect(player.x, player.y, player.w, player.h)

    // Level
    c.fillStyle = '#F1F1F1'
    for (let i = 0; i < rects.length; i++) {
        let r = rects[i]
        c.fillRect(r.x, r.y, r.w, r.h)
    }
}

// Set up the game loop
window.onload = function() {
    setInterval(function() {
        update()
        draw()
    }, 1000 / 60)
}

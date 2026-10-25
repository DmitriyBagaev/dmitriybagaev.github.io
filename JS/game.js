function rect(x, y, w, h) {
    return { x: x, y: y, w: w, h: h }
}
// Ряд шипов высотой 10, острия смотрят вверх или вниз
function spike(x, y, w, dir) {
    let s = rect(x, y, w, 10)
    s.dir = dir || 'up'
    return s
}

// Рамка вокруг поля, общая для всех уровней
const borders = [
    rect(0, 0, 600, 20),
    rect(0, 580, 600, 20),
    rect(0, 0, 20, 600),
    rect(580, 0, 20, 600),
]

// Уровни: стены, шипы, лава, точка старта и выход
const levels = [
    {
        name: 'Лабиринт',
        start: { x: 20, y: 280 },
        exit: rect(550, 30, 20, 30),
        walls: [
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
        ],
    },
    {
        name: 'Шипы',
        start: { x: 40, y: 560 },
        exit: rect(30, 210, 20, 30),
        walls: [
            rect(220, 520, 60, 60),
            rect(360, 480, 60, 100),
            rect(480, 400, 100, 10),
            rect(380, 320, 60, 10),
            rect(20, 240, 340, 10),
        ],
        spikes: [
            spike(130, 570, 60),
            spike(280, 570, 80),
            spike(420, 570, 160),
            spike(250, 230, 40),
            spike(140, 230, 40),
        ],
    },
    {
        name: 'Башня',
        start: { x: 40, y: 560 },
        exit: rect(40, 70, 20, 30),
        walls: [
            rect(120, 500, 60, 10),
            rect(250, 430, 60, 10),
            rect(390, 370, 60, 10),
            rect(500, 300, 80, 10),
            rect(370, 220, 60, 10),
            rect(230, 150, 60, 10),
            rect(20, 100, 160, 10),
        ],
        spikes: [
            spike(200, 570, 380),
            spike(250, 440, 60, 'down'),
            spike(370, 230, 60, 'down'),
            spike(230, 160, 60, 'down'),
        ],
    },
    {
        name: 'Пол — это лава',
        start: { x: 40, y: 460 },
        exit: rect(40, 230, 20, 30),
        walls: [
            rect(20, 480, 70, 100),
            rect(170, 450, 30, 10),
            rect(260, 400, 30, 10),
            rect(320, 470, 30, 10),
            rect(420, 400, 30, 10),
            rect(510, 320, 70, 10),
            rect(140, 330, 260, 20),
            rect(390, 250, 10, 80),
            rect(420, 240, 50, 10),
            rect(20, 260, 80, 10),
        ],
        spikes: [
            spike(290, 320, 40),
            spike(190, 320, 40),
        ],
        lava: [
            rect(90, 550, 490, 30),
        ],
    },
    {
        name: 'Финал',
        start: { x: 30, y: 60 },
        exit: rect(225, 190, 20, 30),
        walls: [
            rect(200, 20, 10, 470),
            rect(20, 100, 110, 10),
            rect(70, 190, 130, 10),
            rect(20, 280, 130, 10),

            rect(210, 460, 270, 10),
            rect(270, 540, 30, 40),
            rect(340, 540, 30, 40),
            rect(410, 540, 30, 40),

            rect(530, 500, 50, 10),
            rect(480, 420, 50, 10),
            rect(530, 340, 50, 10),
            rect(480, 260, 50, 10),

            rect(390, 220, 40, 10),
            rect(300, 180, 40, 10),
            rect(220, 220, 40, 10),
            rect(250, 20, 230, 30),
        ],
        spikes: [
            spike(150, 180, 40),
            spike(20, 270, 30),
            spike(20, 570, 140),
            spike(210, 450, 270),
            spike(250, 50, 230, 'down'),
        ],
        lava: [
            rect(230, 560, 250, 20),
        ],
    },
]

let level, rects
let levelIndex = 0
let deaths = 0
let frames = 0       // время прохождения в кадрах
let bannerTimer = 0  // сколько кадров ещё показывать название уровня
let flashTimer = 0   // красная вспышка после смерти
let finished = false

let player = rect(0, 0, 20, 20)

function loadLevel(i) {
    levelIndex = i
    level = levels[i]
    rects = borders.concat(level.walls)
    bannerTimer = 120
    respawn()
}
function respawn() {
    player.x = level.start.x
    player.y = level.start.y
    player.velocity = { x: 0, y: 0 }
    player.onFloor = false
}
function startGame() {
    deaths = 0
    frames = 0
    finished = false
    loadLevel(0)
}

function overlapTest(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
        a.y < b.y + b.h && a.y + a.h > b.y
}
function move(p, vx, vy) {
    for (let i = 0; i < rects.length; i++) {
        let c = { x: p.x + vx, y: p.y, w: p.w, h: p.h }
        if (overlapTest(c, rects[i])) {
            if (vx < 0) vx = rects[i].x + rects[i].w - p.x
            else if (vx > 0) vx = rects[i].x - p.x - p.w
        }
    }
    p.x += vx

    for (let i = 0; i < rects.length; i++) {
        let c = { x: p.x, y: p.y + vy, w: p.w, h: p.h }
        if (overlapTest(c, rects[i])) {
            if (vy < 0) vy = rects[i].y + rects[i].h - p.y
            else if (vy > 0) vy = rects[i].y - p.y - p.h
        }
    }
    p.y += vy
}
// Один шаг физики: dir = -1, 0 или 1, jump — нажат ли прыжок
function step(p, dir, jump) {
    p.velocity.x = 3 * dir
    // Скорость падения ограничена, чтобы не пролетать сквозь тонкие платформы
    p.velocity.y = Math.min(p.velocity.y + 1, 15)

    let expectedY = p.y + p.velocity.y
    move(p, p.velocity.x, p.velocity.y)
    p.onFloor = (expectedY > p.y)
    if (expectedY !== p.y) p.velocity.y = 0

    if (p.onFloor && jump) {
        p.velocity.y = -15
    }
}
function touchesHazard(p) {
    // Хитбокс шипов чуть меньше картинки, чтобы смерть не казалась нечестной
    for (let s of level.spikes || []) {
        if (overlapTest(p, rect(s.x + 2, s.y + 2, s.w - 4, s.h - 4))) return true
    }
    for (let l of level.lava || []) {
        if (overlapTest(p, rect(l.x, l.y + 3, l.w, l.h - 3))) return true
    }
    return false
}

let keys = {}
const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'Space']
document.onkeydown = function(e) {
    keys[e.code] = true
    // Стрелки и пробел не должны прокручивать страницу
    if (gameKeys.includes(e.code)) e.preventDefault()
    if (e.code === 'KeyR' && !finished) respawn()
    if (e.code === 'Enter' && finished && !e.repeat) startGame()
}
document.onkeyup = function(e) { keys[e.code] = false }
window.onblur = function() { keys = {} }

function pressed(codes) {
    return codes.some(function(code) { return keys[code] }) ? 1 : 0
}

// Кнопки для телефона: зажатая кнопка работает как зажатая клавиша
function bindTouchButton(button) {
    let code = button.dataset.key
    function release() {
        keys[code] = false
        button.classList.remove('pressed')
    }
    button.addEventListener('pointerdown', function(e) {
        e.preventDefault()
        keys[code] = true
        button.classList.add('pressed')
    })
    button.addEventListener('pointerup', release)
    button.addEventListener('pointercancel', release)
    button.addEventListener('lostpointercapture', release)
    button.addEventListener('contextmenu', function(e) { e.preventDefault() })
}
function isTouchScreen() {
    return window.matchMedia('(pointer: coarse)').matches
}

function update() {
    if (finished) return
    frames++
    if (bannerTimer > 0) bannerTimer--
    if (flashTimer > 0) flashTimer--

    let dir = pressed(['ArrowRight', 'KeyD']) - pressed(['ArrowLeft', 'KeyA'])
    step(player, dir, pressed(['ArrowUp', 'KeyW', 'Space']))

    if (touchesHazard(player)) {
        deaths++
        flashTimer = 20
        respawn()
    } else if (overlapTest(player, level.exit)) {
        if (levelIndex < levels.length - 1) loadLevel(levelIndex + 1)
        else finished = true
    }
}

function formatTime(f) {
    let seconds = f / 60
    let m = Math.floor(seconds / 60)
    let s = Math.floor(seconds % 60)
    return m + ':' + String(s).padStart(2, '0') + '.' + Math.floor(seconds * 10) % 10
}
function text(c, str, x, y, font, color) {
    c.font = font + ' "IBM Plex Sans", sans-serif'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    // Белая обводка, чтобы текст читался поверх уровня
    c.strokeStyle = '#FFF'
    c.lineWidth = 8
    c.lineJoin = 'round'
    c.strokeText(str, x, y)
    c.fillStyle = color
    c.fillText(str, x, y)
}

function drawSpikes(c, s) {
    c.beginPath()
    for (let x = s.x; x < s.x + s.w; x += 10) {
        if (s.dir === 'down') {
            c.moveTo(x, s.y)
            c.lineTo(x + 5, s.y + s.h)
            c.lineTo(x + 10, s.y)
        } else {
            c.moveTo(x, s.y + s.h)
            c.lineTo(x + 5, s.y)
            c.lineTo(x + 10, s.y + s.h)
        }
    }
    c.fill()
}
function drawLava(c, l) {
    c.beginPath()
    c.moveTo(l.x, l.y + l.h)
    for (let x = l.x; x <= l.x + l.w; x += 5) {
        c.lineTo(x, l.y + 3 + Math.sin((x + frames * 2) / 15) * 3)
    }
    c.lineTo(l.x + l.w, l.y + l.h)
    c.fill()
}
function drawExit(c, e) {
    c.fillStyle = '#ECDCF2'
    c.fillRect(e.x, e.y, e.w, e.h)
    c.strokeStyle = '#A14EBF'
    c.lineWidth = 2
    c.strokeRect(e.x + 1, e.y + 1, e.w - 2, e.h - 2)
    c.fillStyle = '#A14EBF'
    c.fillRect(e.x + e.w - 7, e.y + e.h / 2, 3, 3)
}

function drawWin(c) {
    c.fillStyle = '#A14EBF'
    c.fillRect(290, 140, 20, 20)
    text(c, 'Победа!', 300, 220, '600 48px', '#2F2F2F')
    text(c, 'Все уровни пройдены', 300, 270, '400 20px', '#B8B8B8')
    text(c, 'Время: ' + formatTime(frames), 300, 330, '400 24px', '#2F2F2F')
    text(c, 'Смерти: ' + deaths, 300, 365, '400 24px', '#2F2F2F')
    let restartHint = isTouchScreen() ? 'Коснитесь поля, чтобы сыграть ещё раз' : 'Нажмите Enter, чтобы сыграть ещё раз'
    text(c, restartHint, 300, 440, '400 20px', '#B8B8B8')
}

let c, hudLevel, hudDeaths, hudTime
function draw() {
    // Background
    c.fillStyle = '#FFF'
    c.fillRect(0, 0, c.canvas.width, c.canvas.height)

    hudLevel.textContent = 'Уровень ' + (levelIndex + 1) + ' из ' + levels.length + ' · ' + level.name
    hudDeaths.textContent = 'Смерти: ' + deaths
    hudTime.textContent = formatTime(frames)

    if (finished) {
        drawWin(c)
        return
    }

    // Lava
    c.fillStyle = '#FF8A3D'
    for (let l of level.lava || []) drawLava(c, l)

    // Level
    c.fillStyle = '#F1F1F1'
    for (let i = 0; i < rects.length; i++) {
        let r = rects[i]
        c.fillRect(r.x, r.y, r.w, r.h)
    }

    // Spikes
    c.fillStyle = '#E05561'
    for (let s of level.spikes || []) drawSpikes(c, s)

    drawExit(c, level.exit)

    // Player
    c.fillStyle = '#A14EBF'
    c.fillRect(player.x, player.y, player.w, player.h)

    if (flashTimer > 0) {
        c.fillStyle = 'rgba(224, 85, 97, ' + flashTimer / 60 + ')'
        c.fillRect(0, 0, c.canvas.width, c.canvas.height)
    }

    // Название уровня в начале
    if (bannerTimer > 0) {
        c.globalAlpha = Math.min(1, bannerTimer / 30)
        text(c, 'Уровень ' + (levelIndex + 1), 300, 270, '400 20px', '#B8B8B8')
        text(c, level.name, 300, 310, '600 40px', '#2F2F2F')
        c.globalAlpha = 1
    }
}

startGame()
window.onload = function() {
    c = document.getElementById('game').getContext('2d')
    hudLevel = document.getElementById('hudLevel')
    hudDeaths = document.getElementById('hudDeaths')
    hudTime = document.getElementById('hudTime')
    document.querySelectorAll('.TouchButton').forEach(bindTouchButton)
    c.canvas.onclick = function() {
        if (finished) startGame()
    }
    setInterval(function() {
        update()
        draw()
    }, 1000 / 60)
}

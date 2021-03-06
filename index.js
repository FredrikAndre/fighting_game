const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6,
})

const player = new Fighter({
  position: {
    x: 60,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/idle.png',
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
})

const enemy = new Fighter({
  position: {
    x: 900,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: 'blue',
  imageSrc: './img/kenji/idle.png',
  scale: 2.5,
  framesMax: 4,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
})

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
}

decreaseTimer()

const animate = () => {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player movement
  if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 0) {
    player.velocity.x = -5
    player.switchSprites('run')
  } else if (
    keys.d.pressed &&
    player.lastKey === 'd' &&
    player.position.x < canvas.width - player.width
  ) {
    player.velocity.x = 5
    player.switchSprites('run')
  } else {
    player.switchSprites('idle')
  }

  // Player Jump
  if (player.velocity.y < 0) {
    player.switchSprites('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprites('fall')
  }

  // Enemy movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === 'ArrowLeft' &&
    enemy.position.x > 0
  ) {
    enemy.velocity.x = -5
    enemy.switchSprites('run')
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === 'ArrowRight' &&
    enemy.position.x < canvas.width - enemy.width
  ) {
    enemy.velocity.x = 5
    enemy.switchSprites('run')
  } else {
    enemy.switchSprites('idle')
  }

  // Enemy Jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprites('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites('fall')
  }

  // Detect for player attacking
  if (
    playerCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit(20)
    player.isAttacking = false
    gsap.to('#enemyhealth', {
      width: enemy.health + '%',
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // Detect for enemy attacking
  if (
    playerCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit(10)
    enemy.isAttacking = false
    gsap.to('#playerhealth', {
      width: player.health + '%',
    })
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // End game based on Health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd': // Player
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (player.velocity.y === 0) {
          player.velocity.y = -22
        }
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight': // Enemy
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (enemy.velocity.y === 0) {
          enemy.velocity.y = -22
        }
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // Enemy Keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

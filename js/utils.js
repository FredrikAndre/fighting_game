const playerCollision = ({
  rectangle1,
  rectangle2
}) => {
  return (
  rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

const determineWinner = ({player, enemy, timerId}) => {
  clearTimeout(timerId)
  document.querySelector('#gameresult').style.display = 'flex'
  if (player.health === enemy.health) {
        document.querySelector('#gameresult').innerHTML = "it's a Draw!"
      } else if (player.health > enemy.health) {
        document.querySelector('#gameresult').innerHTML = 'Player 1 wins!'
      } else if (enemy.health > player.health) {
        document.querySelector('#gameresult').innerHTML = 'Player 2 wins!'
      }
}

// Handling timer
let timer = 60
let timerId
const decreaseTimer = () => {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({player, enemy})
  }
}
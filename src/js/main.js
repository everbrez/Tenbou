window.addEventListener('load', main, false);

function main() {
  window.a = new Tenpou()
  a.init();
  a.mount();
  a.on('richi', (state, config, player) => {
    state.dashboard.richi += 1;
    player.score -= 1000;
    player.richi = true;
    return state
  })

  a.on('beforeroundend', (state, config, player, tenpou, type) => {
    const id = player.id
    lastPlayer = state.players[(id - 1 - 1 + 4) % 4];
    player.score += 1000;
    lastPlayer.score -= 1000;
    return state;
  })

  a.on('roundend', (state, config, player, tenpou, type) => {
    if(player.score > 42000) {
      tenpou.gameover('点数超过42000');
    }
  })
}

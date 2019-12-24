window.addEventListener('load', main, false);

function main() {
  window.a = new Tenpou()
  a.init();
  a.mount();
  a.on('richi', (state, config, player) => {
    state.richi += 1;
    player.score -= 1000;
    player.richi = true;
    console.log('richi', state, player)
    return state
  })
}

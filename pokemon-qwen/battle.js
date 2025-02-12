// Define Pokémon data
const pokemonData = {
    bulbasaur: {
      name: "Bulbasaur",
      level: 5,
      hp: 100,
      type: "Grass",
      moves: [
        { name: "Tackle", power: 10, type: "Normal" },
        { name: "Vine Whip", power: 20, type: "Grass" },
        { name: "Razor Leaf", power: 25, type: "Grass" },
        { name: "Growth", power: 0, type: "Normal" }, // Buff move
      ],
    },
    squirtle: {
      name: "Squirtle",
      level: 5,
      hp: 100,
      type: "Water",
      moves: [
        { name: "Tackle", power: 10, type: "Normal" },
        { name: "Bubble", power: 15, type: "Water" },
        { name: "Water Gun", power: 20, type: "Water" },
        { name: "Withdraw", power: 0, type: "Normal" }, // Buff move
      ],
    },
    charmander: {
      name: "Charmander",
      level: 7,
      hp: 120,
      type: "Fire",
      moves: [
        { name: "Scratch", power: 10, type: "Normal" },
        { name: "Ember", power: 20, type: "Fire" },
        { name: "Flamethrower", power: 25, type: "Fire" },
        { name: "Growl", power: 0, type: "Normal" }, // Debuff move
      ],
    },
  };
  
  // Type effectiveness chart
  const typeEffectiveness = {
    Fire: { Fire: 0.5, Water: 0.5, Grass: 2 },
    Water: { Fire: 2, Water: 0.5, Grass: 0.5 },
    Grass: { Fire: 0.5, Water: 2, Grass: 0.5 },
    Normal: { Fire: 1, Water: 1, Grass: 1 },
  };
  
  // Game state
  let playerPokemon = { ...pokemonData.bulbasaur };
  let currentPokemonIndex = 0; // 0 for Bulbasaur, 1 for Squirtle
  let enemyPokemon = { ...pokemonData.charmander };
  
  // DOM elements
  const playerSprite = document.getElementById("player-sprite");
  const playerInfo = document.getElementById("player-info");
  const enemySprite = document.getElementById("enemy-sprite");
  const enemyInfo = document.getElementById("enemy-info");
  const log = document.getElementById("log");
  const playerMovesDiv = document.getElementById("player-moves");
  
  // Initialize battle
  function initBattle() {
    updateUI();
    renderMoves();
  }
  
  // Update UI
  function updateUI() {
    playerSprite.src = `https://img.pokemondb.net/sprites/black-white/anim/normal/${playerPokemon.name.toLowerCase()}.gif`;
    playerInfo.textContent = `${playerPokemon.name} - HP: ${playerPokemon.hp}`;
    enemySprite.src = `https://img.pokemondb.net/sprites/black-white/anim/normal/${enemyPokemon.name.toLowerCase()}.gif`;
    enemyInfo.textContent = `${enemyPokemon.name} - HP: ${enemyPokemon.hp}`;
  }
  
  // Render player moves
  function renderMoves() {
    playerMovesDiv.innerHTML = "";
    playerPokemon.moves.forEach((move, index) => {
      const button = document.createElement("button");
      button.textContent = move.name;
      button.onclick = () => useMove(move);
      playerMovesDiv.appendChild(button);
    });
  }
  
  // Switch Pokémon
  function switchPokemon() {
    currentPokemonIndex = 1 - currentPokemonIndex; // Toggle between 0 and 1
    playerPokemon =
      currentPokemonIndex === 0
        ? { ...pokemonData.bulbasaur }
        : { ...pokemonData.squirtle };
    updateUI();
    logMessage(`Switched to ${playerPokemon.name}!`);
  }
  
  // Use a move
  function useMove(move) {
    if (playerPokemon.hp <= 0 || enemyPokemon.hp <= 0) return;
  
    // Calculate damage
    const effectiveness = typeEffectiveness[move.type][enemyPokemon.type];
    const damage =
      Math.floor(
        ((2 * playerPokemon.level + 10) / 250) *
          (move.power / enemyPokemon.hp) *
          effectiveness
      ) + 1;
  
    enemyPokemon.hp -= damage;
    logMessage(
      `${playerPokemon.name} used ${move.name}! It's ${
        effectiveness > 1 ? "super effective!" : effectiveness < 1 ? "not very effective..." : ""
      }`
    );
    logMessage(`Enemy ${enemyPokemon.name} took ${damage} damage.`);
  
    if (enemyPokemon.hp <= 0) {
      enemyPokemon.hp = 0;
      logMessage(`Enemy ${enemyPokemon.name} fainted! You win!`);
      return;
    }
  
    // Enemy turn
    const enemyMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
    const enemyEffectiveness = typeEffectiveness[enemyMove.type][playerPokemon.type];
    const enemyDamage =
      Math.floor(
        ((2 * enemyPokemon.level + 10) / 250) *
          (enemyMove.power / playerPokemon.hp) *
          enemyEffectiveness
      ) + 1;
  
    playerPokemon.hp -= enemyDamage;
    logMessage(
      `Enemy ${enemyPokemon.name} used ${enemyMove.name}! It's ${
        enemyEffectiveness > 1 ? "super effective!" : enemyEffectiveness < 1 ? "not very effective..." : ""
      }`
    );
    logMessage(`${playerPokemon.name} took ${enemyDamage} damage.`);
  
    if (playerPokemon.hp <= 0) {
      playerPokemon.hp = 0;
      logMessage(`${playerPokemon.name} fainted! You lose.`);
    }
  
    updateUI();
  }
  
  // Log messages
  function logMessage(message) {
    const p = document.createElement("p");
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }
  
  // Start the battle
  initBattle();
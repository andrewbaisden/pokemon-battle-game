/* Begin battle.js */
"use strict";

function Pokemon(name, level, type, sprite, maxHP, attacks) {
  this.name = name;
  this.level = level;
  this.type = type;
  this.sprite = sprite;
  this.maxHP = maxHP;
  this.currentHP = maxHP;
  this.attacks = attacks;
}

function Attack(name, power, type) {
  this.name = name;
  this.power = power;
  this.type = type;
}

const typeChart = {
  fire: { grass: 2, water: 0.5, electric: 1, normal: 1 },
  electric: { water: 2, fire: 1, grass: 1, normal: 1 },
  grass: { fire: 0.5, water: 2, electric: 1, normal: 1 },
  normal: { fire: 1, water: 1, grass: 1, electric: 1, normal: 1 }
};

function calculateDamage(attacker, defender, attack) {
  const levelRatio = attacker.level / defender.level;
  const effectiveness = (typeChart[attack.type] && typeChart[attack.type][defender.type]) || 1;
  const randomFactor = Math.random() * 0.15 + 0.85; // Between 0.85 and 1.0
  const damage = Math.floor(attack.power * levelRatio * effectiveness * randomFactor);
  return damage;
}

// Define player's Pokemon and enemy Pokemon
const pikachuAttacks = [
  new Attack("Thunder Shock", 15, "electric"),
  new Attack("Quick Attack", 10, "normal"),
  new Attack("Electro Ball", 20, "electric"),
  new Attack("Iron Tail", 18, "normal")
];

const bulbasaurAttacks = [
  new Attack("Tackle", 10, "normal"),
  new Attack("Vine Whip", 15, "grass"),
  new Attack("Razor Leaf", 18, "grass"),
  new Attack("Seed Bomb", 20, "grass")
];

const charmanderAttacks = [
  new Attack("Scratch", 12, "normal"),
  new Attack("Ember", 18, "fire"),
  new Attack("Flame Burst", 22, "fire"),
  new Attack("Fire Fang", 20, "fire")
];

const playerPokemonList = [
  new Pokemon("Pikachu", 5, "electric", "https://img.pokemondb.net/sprites/black-white/normal/pikachu.png", 80, pikachuAttacks),
  new Pokemon("Bulbasaur", 5, "grass", "https://img.pokemondb.net/sprites/black-white/normal/bulbasaur.png", 85, bulbasaurAttacks)
];

const enemyPokemon = new Pokemon("Charmander", 7, "fire", "https://img.pokemondb.net/sprites/black-white/normal/charmander.png", 100, charmanderAttacks);

let currentPlayerIndex = 0;
let currentPlayerPokemon = playerPokemonList[currentPlayerIndex];

const enemyHPElement = document.getElementById("enemy-hp");
const playerHPElement = document.getElementById("player-hp");
const playerNameElement = document.getElementById("player-name");
const playerSpriteElement = document.getElementById("player-sprite");
const battleLogElement = document.getElementById("battle-log");

function updateDisplay() {
  enemyHPElement.textContent = enemyPokemon.currentHP;
  playerHPElement.textContent = currentPlayerPokemon.currentHP;
  playerNameElement.textContent = `${currentPlayerPokemon.name} (Lv. ${currentPlayerPokemon.level})`;
  playerSpriteElement.src = currentPlayerPokemon.sprite;
}

function appendLog(message) {
  const p = document.createElement("p");
  p.textContent = message;
  battleLogElement.appendChild(p);
  battleLogElement.scrollTop = battleLogElement.scrollHeight;
}

function playerAttack(attackIndex) {
  const attack = currentPlayerPokemon.attacks[attackIndex];
  appendLog(`${currentPlayerPokemon.name} used ${attack.name}!`);
  const damage = calculateDamage(currentPlayerPokemon, enemyPokemon, attack);
  enemyPokemon.currentHP -= damage;
  if (enemyPokemon.currentHP < 0) enemyPokemon.currentHP = 0;
  appendLog(`It dealt ${damage} damage!`);
  updateDisplay();
  if (enemyPokemon.currentHP <= 0) {
    appendLog(`Enemy ${enemyPokemon.name} fainted! You win!`);
    disableButtons();
  } else {
    setTimeout(enemyTurn, 1000);
  }
}

function enemyTurn() {
  const randomAttackIndex = Math.floor(Math.random() * enemyPokemon.attacks.length);
  const attack = enemyPokemon.attacks[randomAttackIndex];
  appendLog(`Enemy ${enemyPokemon.name} used ${attack.name}!`);
  const damage = calculateDamage(enemyPokemon, currentPlayerPokemon, attack);
  currentPlayerPokemon.currentHP -= damage;
  if (currentPlayerPokemon.currentHP < 0) currentPlayerPokemon.currentHP = 0;
  appendLog(`It dealt ${damage} damage!`);
  updateDisplay();
  if (currentPlayerPokemon.currentHP <= 0) {
    appendLog(`${currentPlayerPokemon.name} fainted!`);
    // Auto-switch if another Pokemon is available
    if (playerPokemonList.some(p => p.currentHP > 0 && p !== currentPlayerPokemon)) {
      appendLog(`Auto-switching to the next available Pokemon.`);
      switchPokemon();
    } else {
      appendLog(`All your Pokemon have fainted! You lose!`);
      disableButtons();
    }
  }
}

function switchPokemon() {
  // Switch to the next available Pokemon that has HP remaining
  let switched = false;
  for (let i = 0; i < playerPokemonList.length; i++) {
    if (i !== currentPlayerIndex && playerPokemonList[i].currentHP > 0) {
      currentPlayerIndex = i;
      currentPlayerPokemon = playerPokemonList[i];
      appendLog(`Switched to ${currentPlayerPokemon.name}!`);
      updateDisplay();
      switched = true;
      break;
    }
  }
  if (!switched) {
    appendLog(`No other Pokemon available to switch!`);
  }
}

function disableButtons() {
  document.querySelectorAll('.attack-button').forEach(btn => btn.disabled = true);
  document.getElementById("switch-button").disabled = true;
}

// Attach event listeners for attack buttons
const attackButtons = document.querySelectorAll(".attack-button");
attackButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (currentPlayerPokemon.currentHP > 0 && enemyPokemon.currentHP > 0) {
      playerAttack(index);
    }
  });
});

// Attach event listener for switch button
const switchButton = document.getElementById("switch-button");
if (switchButton) {
  switchButton.addEventListener("click", switchPokemon);
}

updateDisplay();
appendLog(`Battle started: ${currentPlayerPokemon.name} vs ${enemyPokemon.name}!`);
/* End battle.js */
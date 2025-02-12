const playerPokemon1 = {
    name: "Pikachu",
    level: 5,
    hp: 35,
    type: "Electric",
    moves: [
        { name: "Thunder Shock", type: "Electric", power: 40 },
        { name: "Quick Attack", type: "Normal", power: 40 },
        { name: "Growl", type: "Normal", power: 0 },
        { name: "Tail Whip", type: "Normal", power: 0 }
    ],
    sprite: "https://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif"
};

const playerPokemon2 = {
    name: "Bulbasaur",
    level: 5,
    hp: 45,
    type: "Grass",
    moves: [
        { name: "Tackle", type: "Normal", power: 40 },
        { name: "Vine Whip", type: "Grass", power: 45 },
        { name: "Growl", type: "Normal", power: 0 },
        { name: "Leech Seed", type: "Grass", power: 0 }
    ],
    sprite: "https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif"
};

const enemyPokemon = {
    name: "Charmander",
    level: 7,
    hp: 39,
    type: "Fire",
    moves: [
        { name: "Scratch", type: "Normal", power: 40 },
        { name: "Ember", type: "Fire", power: 40 },
        { name: "Growl", type: "Normal", power: 0 },
        { name: "Leer", type: "Normal", power: 0 }
    ],
    sprite: "https://img.pokemondb.net/sprites/black-white/anim/normal/charmander.gif"
};

let currentPlayerPokemon = playerPokemon1;

const typeAdvantages = {
    Normal: {},
    Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 0.5 },
    Water: { Fire: 2, Ground: 2, Rock: 2 },
    Electric: { Water: 2, Flying: 2 },
    Grass: { Water: 2, Ground: 2, Rock: 2 },
    Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2 },
    Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2 },
    Poison: { Grass: 2, Fairy: 2 },
    Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2 },
    Flying: { Grass: 2, Fighting: 2, Bug: 2 },
    Psychic: { Fighting: 2, Poison: 2 },
    Bug: { Grass: 2, Psychic: 2, Dark: 2 },
    Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2 },
    Ghost: { Psychic: 2, Ghost: 2 },
    Dragon: { Dragon: 2 },
    Dark: { Psychic: 2, Ghost: 2 },
    Steel: { Ice: 2, Rock: 2, Fairy: 2 },
    Fairy: { Fighting: 2, Dragon: 2, Dark: 2 }
};

function updateUI() {
    document.getElementById("player-sprite").src = currentPlayerPokemon.sprite;
    document.getElementById("player-name").textContent = currentPlayerPokemon.name;
    document.getElementById("player-level").textContent = currentPlayerPokemon.level;
    document.getElementById("player-hp").textContent = currentPlayerPokemon.hp;

    document.getElementById("enemy-sprite").src = enemyPokemon.sprite;
    document.getElementById("enemy-name").textContent = enemyPokemon.name;
    document.getElementById("enemy-level").textContent = enemyPokemon.level;
    document.getElementById("enemy-hp").textContent = enemyPokemon.hp;

    document.getElementById("move1").textContent = currentPlayerPokemon.moves[0].name;
    document.getElementById("move2").textContent = currentPlayerPokemon.moves[1].name;
    document.getElementById("move3").textContent = currentPlayerPokemon.moves[2].name;
    document.getElementById("move4").textContent = currentPlayerPokemon.moves[3].name;
}

function calculateDamage(attacker, defender, move) {
    let damage = move.power;
    const typeMultiplier = typeAdvantages[move.type][defender.type] || 1;
    damage *= typeMultiplier;
    damage *= (attacker.level / defender.level);
    return Math.max(1, Math.round(damage));
}

function playerAttack(moveIndex) {
    const move = currentPlayerPokemon.moves[moveIndex];
    const damage = calculateDamage(currentPlayerPokemon, enemyPokemon, move);
    enemyPokemon.hp -= damage;
    updateUI();
    if (enemyPokemon.hp <= 0) {
        alert("You win!");
    } else {
        enemyAttack();
    }
}

function enemyAttack() {
    const moveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
    const move = enemyPokemon.moves[moveIndex];
    const damage = calculateDamage(enemyPokemon, currentPlayerPokemon, move);
    currentPlayerPokemon.hp -= damage;
    updateUI();
    if (currentPlayerPokemon.hp <= 0) {
        alert("You lose!");
    }
}

function switchPokemon() {
    currentPlayerPokemon = (currentPlayerPokemon === playerPokemon1) ? playerPokemon2 : playerPokemon1;
    updateUI();
}

document.getElementById("move1").addEventListener("click", () => playerAttack(0));
document.getElementById("move2").addEventListener("click", () => playerAttack(1));
document.getElementById("move3").addEventListener("click", () => playerAttack(2));
document.getElementById("move4").addEventListener("click", () => playerAttack(3));
document.getElementById("switch-pokemon").addEventListener("click", switchPokemon);

updateUI();

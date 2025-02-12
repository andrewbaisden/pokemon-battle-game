console.log("Welcome to the Pokemon Battle!");

class Pokemon {
    constructor(name, type, level, hp, attacks) {
        this.name = name;
        this.type = type;
        this.level = level;
        this.maxHP = hp;
        this.currentHP = hp;
        this.attacks = attacks;
        this.sprite = `https://img.pokemondb.net/sprites/black-white/anim/normal/${name.toLowerCase()}.gif`;
    }

    attack(target, move) {
        let damage = Math.floor((2 * this.level / 5 + 2) * move.power * (this.level / target.level) / 50);
        damage = this.applyTypeEffectiveness(move.type, target.type, damage);
        target.currentHP = Math.max(0, target.currentHP - damage);
        return damage;
    }

    applyTypeEffectiveness(moveType, targetType, damage) {
        // Simplified type effectiveness - will need more detailed logic
        if (moveType === targetType) return damage * 0.5; // Not very effective
        if ((moveType === 'Water' && targetType === 'Fire') || 
            (moveType === 'Fire' && targetType === 'Grass') || 
            (moveType === 'Grass' && targetType === 'Water')) {
            return damage * 2; // Super effective
        }
        return damage;
    }
}

// Example Pokémon and Attacks
const playerPokemon1 = new Pokemon("Pikachu", "Electric", 5, 100, [
    { name: "Thunderbolt", power: 90, type: "Electric" },
    { name: "Quick Attack", power: 40, type: "Normal" },
    { name: "Iron Tail", power: 100, type: "Steel" },
    { name: "Electro Ball", power: 60, type: "Electric" }
]);

const playerPokemon2 = new Pokemon("Bulbasaur", "Grass", 5, 100, [
    { name: "Vine Whip", power: 45, type: "Grass" },
    { name: "Razor Leaf", power: 55, type: "Grass" },
    { name: "Tackle", power: 40, type: "Normal" },
    { name: "Sleep Powder", power: 0, type: "Grass" } // This would need special handling
]);

const enemyPokemon = new Pokemon("Charmander", "Fire", 7, 120, [
    { name: "Ember", power: 40, type: "Fire" },
    { name: "Scratch", power: 40, type: "Normal" },
    { name: "Dragon Breath", power: 60, type: "Dragon" },
    { name: "Fire Spin", power: 35, type: "Fire" }
]);

let currentPlayerPokemon = playerPokemon1;

function loadPokemonSprites() {
    document.getElementById('playerPokemon').innerHTML = `
        <div>
            <img src="${currentPlayerPokemon.sprite}" class="pokemon-sprite" alt="${currentPlayerPokemon.name}">
            <div>HP: ${currentPlayerPokemon.currentHP}/${currentPlayerPokemon.maxHP}</div>
        </div>
    `;
    document.getElementById('enemyPokemon').innerHTML = `
        <div>
            <img src="${enemyPokemon.sprite}" class="pokemon-sprite" alt="${enemyPokemon.name}">
            <div>HP: ${enemyPokemon.currentHP}/${enemyPokemon.maxHP}</div>
        </div>
    `;
}

function displayActions() {
    let actions = '<div class="actions">';
    currentPlayerPokemon.attacks.forEach(attack => {
        actions += `<button onclick="performAttack('${attack.name}')">${attack.name}</button>`;
    });
    actions += `<button onclick="switchPokemon()">Switch Pokemon</button>`;
    actions += '</div>';
    document.getElementById('actions').innerHTML = actions;
}

function performAttack(attackName) {
    const attack = currentPlayerPokemon.attacks.find(a => a.name === attackName);
    const damage = currentPlayerPokemon.attack(enemyPokemon, attack);
    console.log(`${currentPlayerPokemon.name} used ${attackName}! It did ${damage} damage.`);
    if (enemyPokemon.currentHP <= 0) {
        console.log("Enemy Pokémon fainted!");
    } else {
        // Here you would implement enemy's turn
        const enemyMove = enemyPokemon.attacks[Math.floor(Math.random() * enemyPokemon.attacks.length)];
        const enemyDamage = enemyPokemon.attack(currentPlayerPokemon, enemyMove);
        console.log(`${enemyPokemon.name} used ${enemyMove.name}! It did ${enemyDamage} damage.`);
        if (currentPlayerPokemon.currentHP <= 0) {
            console.log("Your Pokémon fainted!");
            if(currentPlayerPokemon === playerPokemon1) {
                currentPlayerPokemon = playerPokemon2;
                loadPokemonSprites();
            } else {
                console.log("Game Over - no more Pokémon to switch to!");
            }
        }
    }
    displayActions();
    loadPokemonSprites();
}

function switchPokemon() {
    if (currentPlayerPokemon === playerPokemon1) {
        currentPlayerPokemon = playerPokemon2;
    } else {
        currentPlayerPokemon = playerPokemon1;
    }
    loadPokemonSprites();
    displayActions();
}

// Initialize the game
loadPokemonSprites();
displayActions();
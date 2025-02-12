// Pokemon Data (Simplified for two player Pokemon and one enemy)
const pokemonData = {
    pikachu: {
        name: "Pikachu",
        types: ["Electric"],
        baseStats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 },
        level: 5,
        moves: [
            { name: "Thunderbolt", type: "Electric", power: 90, accuracy: 100 },
            { name: "Quick Attack", type: "Normal", power: 40, accuracy: 100 },
            { name: "Iron Tail", type: "Steel", power: 100, accuracy: 75 },
            { name: "Volt Tackle", type: "Electric", power: 120, accuracy: 100, recoil: true }
        ],
        spriteUrl: "https://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif", // Example from website
        backSpriteUrl: "https://img.pokemondb.net/sprites/black-white/anim/back-normal/pikachu.gif"
    },
    bulbasaur: {
        name: "Bulbasaur",
        types: ["Grass", "Poison"],
        baseStats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 },
        level: 5,
        moves: [
            { name: "Vine Whip", type: "Grass", power: 45, accuracy: 100 },
            { name: "Tackle", type: "Normal", power: 40, accuracy: 100 },
            { name: "Razor Leaf", type: "Grass", power: 55, accuracy: 95 },
            { name: "Poison Powder", type: "Poison", power: 0, accuracy: 75, status: 'poison' } // Status move example
        ],
        spriteUrl: "https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif",
        backSpriteUrl: "https://img.pokemondb.net/sprites/black-white/anim/back-normal/bulbasaur.gif"
    },
    charmander: {
        name: "Charmander",
        types: ["Fire"],
        baseStats: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 },
        level: 7, // Enemy level is 7
        moves: [
            { name: "Ember", type: "Fire", power: 40, accuracy: 100 },
            { name: "Scratch", type: "Normal", power: 40, accuracy: 100 },
            { name: "Fire Fang", type: "Fire", power: 65, accuracy: 95, chanceSecondaryEffect: 0.1, secondaryEffect: 'burn' }, // Example with secondary effect
            { name: "SmokeScreen", type: "Normal", power: 0, accuracy: 100, status: 'accuracyDown' } // Status move example
        ],
        spriteUrl: "https://img.pokemondb.net/sprites/black-white/anim/normal/charmander.gif"
    }
};

// Type Effectiveness Chart (Simplified)
const typeChart = {
    "Normal": {},
    "Fire": { "Grass": 2, "Fire": 0.5, "Water": 0.5, "Rock": 0.5, "Bug": 2, "Steel": 2 },
    "Water": { "Fire": 2, "Water": 0.5, "Grass": 0.5, "Ground": 2, "Rock": 2 },
    "Electric": { "Water": 2, "Electric": 0.5, "Grass": 0.5, "Ground": 0 },
    "Grass": { "Water": 2, "Fire": 0.5, "Grass": 0.5, "Poison": 0.5, "Flying": 0.5, "Ground": 2, "Rock": 2, "Bug": 0.5 },
    "Poison": { "Grass": 2, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5 },
    "Ground": { "Fire": 2, "Electric": 2, "Grass": 0.5, "Poison": 2, "Flying": 0, "Rock": 2, "Bug": 0.5, "Steel": 2 },
    "Flying": { "Electric": 0.5, "Grass": 2, "Bug": 2, "Rock": 0.5, "Steel": 0.5 },
    "Bug": { "Fire": 0.5, "Grass": 2, "Poison": 0.5, "Flying": 0.5, "Fighting": 0.5, "Steel": 0.5 },
    "Steel": { "Fire": 0.5, "Water": 0.5, "Electric": 0.5, "Rock": 2, "Steel": 0.5 }
    // ... more types can be added
};

// Game State
let playerPokemon = [createPokemon(pokemonData.pikachu), createPokemon(pokemonData.bulbasaur)]; // Player has Pikachu and Bulbasaur
let enemyPokemon = createPokemon(pokemonData.charmander); // Enemy has Charmander
let currentTurn = "player"; // Player starts first
let activePlayerPokemon = playerPokemon[0]; // Player starts with first Pokemon
let isSwitching = false; // Flag to check if player is in switching state
let battleLog = document.getElementById('battle-log');
let actionButtonsDiv = document.getElementById('action-buttons');
let switchPokemonAreaDiv = document.getElementById('switch-pokemon-area');

// Function to create a Pokemon object with level-scaled stats
function createPokemon(basePokemonData) {
    let pokemon = { ...basePokemonData }; // Copy base data
    pokemon.stats = scaleStatsWithLevel(basePokemonData.baseStats, basePokemonData.level, basePokemonData.level); // Initial level scaling
    pokemon.currentHp = pokemon.stats.hp; // Set current HP to max HP
    pokemon.statusConditions = []; // Initialize status conditions
    return pokemon;
}

// Function to scale stats based on level (simple linear scaling for now)
function scaleStatsWithLevel(baseStats, baseLevel, targetLevel) {
    let scaledStats = { ...baseStats };
    let levelDiff = targetLevel - baseLevel;
    for (let stat in scaledStats) {
        if (stat === 'hp') {
            scaledStats[stat] += levelDiff * 10; // Increased HP scaling
        } else {
            scaledStats[stat] += levelDiff * 3; // Less aggressive scaling for other stats
        }
    }
    return scaledStats;
}

// Function to update the UI with Pokemon data
function updateUI() {
    document.getElementById('player-pokemon-sprite').innerHTML = `<img src="${activePlayerPokemon.backSpriteUrl}" alt="${activePlayerPokemon.name} Sprite">`;
    document.getElementById('enemy-pokemon-sprite').innerHTML = `<img src="${enemyPokemon.spriteUrl}" alt="${enemyPokemon.name} Sprite">`;
    document.getElementById('player-pokemon-name').innerText = activePlayerPokemon.name + " (Lv." + activePlayerPokemon.level + ")";
    document.getElementById('enemy-pokemon-name').innerText = enemyPokemon.name + " (Lv." + enemyPokemon.level + ")";

    updateHPBar('player-pokemon-hp', activePlayerPokemon.currentHp, activePlayerPokemon.stats.hp);
    updateHPBar('enemy-pokemon-hp', enemyPokemon.currentHp, enemyPokemon.stats.hp);

    updateActionButtons();
}

// Function to update HP bar visually
function updateHPBar(elementId, currentHp, maxHp) {
    const hpBar = document.getElementById(elementId);
    const percentage = (currentHp / maxHp) * 100;
    hpBar.style.width = percentage + '%';
    hpBar.style.backgroundColor = percentage > 50 ? 'lightgreen' : (percentage > 20 ? 'yellow' : 'red');
}

// Function to display battle log messages
function logMessage(message) {
    battleLog.innerHTML += `<p>${message}</p>`;
    battleLog.scrollTop = battleLog.scrollHeight; // Auto-scroll to bottom
}

// Function to calculate damage
function calculateDamage(attacker, defender, move) {
    let levelFactor = (2 * attacker.level) / 5 + 2;
    let attackStat = attacker.stats.attack; // For physical moves (simplified for now)
    let defenseStat = defender.stats.defense; // For physical moves (simplified for now)
    let baseDamage = move.power;

    let damage = (((levelFactor * attackStat * baseDamage) / defenseStat) / 50) + 2;

    let typeEffectiveness = getTypeEffectiveness(move.type, defender.types);
    damage *= typeEffectiveness;

    // Add random factor (between 0.85 and 1.00) for variability (optional)
    damage *= (0.85 + Math.random() * 0.15);

    return Math.max(1, Math.floor(damage)); // Ensure minimum damage of 1
}

// Function to get type effectiveness multiplier
function getTypeEffectiveness(moveType, defenderTypes) {
    let effectiveness = 1;
    defenderTypes.forEach(defType => {
        if (typeChart[moveType] && typeChart[moveType][defType] !== undefined) {
            effectiveness *= typeChart[moveType][defType];
        }
    });
    return effectiveness;
}

// Function to handle Pokemon attack
function pokemonAttack(attacker, defender, move) {
    if (attacker.currentHp <= 0 || defender.currentHp <= 0) return; // Don't attack if fainted

    logMessage(`${attacker.name} used ${move.name}!`);

    if (move.accuracy === undefined || Math.random() * 100 <= move.accuracy) { // Check for move accuracy
        let damage = calculateDamage(attacker, defender, move);
        let effectiveness = getTypeEffectiveness(move.type, defender.types);

        defender.currentHp -= damage;
        defender.currentHp = Math.max(0, defender.currentHp); // HP cannot go below 0
        updateHPBar(`enemy-pokemon-hp`, enemyPokemon.currentHp, enemyPokemon.stats.hp); // Assuming defender is enemy for now
        updateHPBar(`player-pokemon-hp`, activePlayerPokemon.currentHp, activePlayerPokemon.stats.hp); // Corrected HP bar update

        logMessage(`${defender.name} took ${damage} damage.`);
        if (effectiveness > 1) logMessage("It's super effective!");
        if (effectiveness < 1 && effectiveness > 0) logMessage("It's not very effective...");
        if (effectiveness === 0) logMessage("It has no effect!");

        if (move.recoil) { // Example recoil implementation
            let recoilDamage = Math.floor(damage * 0.25); // 1/4 recoil damage
            attacker.currentHp -= recoilDamage;
            attacker.currentHp = Math.max(0, attacker.currentHp);
            updateHPBar(`player-pokemon-hp`, activePlayerPokemon.currentHp, activePlayerPokemon.stats.hp);
            logMessage(`${attacker.name} was hurt by recoil!`);
        }

        // Example Secondary Effect (Burn chance on Fire Fang)
        if (move.chanceSecondaryEffect && Math.random() <= move.chanceSecondaryEffect) {
            if (move.secondaryEffect === 'burn' && !defender.statusConditions.includes('burn')) {
                defender.statusConditions.push('burn');
                logMessage(`${defender.name} was burned!`);
                // Implement burn damage over time in game loop if needed
            }
        }

        // Example Status Move (Poison Powder)
        if (move.status) {
            if (move.status === 'poison' && !defender.statusConditions.includes('poison')) {
                defender.statusConditions.push('poison');
                logMessage(`${defender.name} was poisoned!`);
                // Implement poison damage over time in game loop if needed
            }
        }

         // Example Status Move (SmokeScreen - Accuracy Down)
        if (move.status === 'accuracyDown' && !defender.statusConditions.includes('accuracyDown')) {
            defender.statusConditions.push('accuracyDown');
            logMessage(`${defender.name}'s accuracy fell!`);
            // Implement accuracy reduction in attack calculations if needed.
        }


    } else {
        logMessage(`${attacker.name}'s attack missed!`);
    }

    checkBattleEnd();
    if (enemyPokemon.currentHp > 0 && activePlayerPokemon.currentHp > 0 && currentTurn === 'player') { // Enemy Turn starts only if game is not over and it's player's turn
        currentTurn = 'enemy';
        enemyTurn();
    }
}

// Function to handle Enemy turn (Simple AI - random attack for now)
function enemyTurn() {
    if (enemyPokemon.currentHp <= 0 || activePlayerPokemon.currentHp <= 0) return; // Don't act if fainted

    logMessage(`Enemy ${enemyPokemon.name}'s turn.`);
    setTimeout(() => { // Add a small delay for enemy turn
        let randomMoveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
        let move = enemyPokemon.moves[randomMoveIndex];
        pokemonAttack(enemyPokemon, activePlayerPokemon, move);
        if (activePlayerPokemon.currentHp > 0 && enemyPokemon.currentHp > 0) { // Player turn only if game not over
            currentTurn = 'player';
            updateActionButtons();
            logMessage(`Your turn.`);
        }
    }, 1000); // 1 second delay
}


// Function to check if battle has ended
function checkBattleEnd() {
    if (enemyPokemon.currentHp <= 0) {
        logMessage(`Enemy ${enemyPokemon.name} fainted!`);
        logMessage(`You win!`);
        currentTurn = 'ended'; // Game over
        actionButtonsDiv.innerHTML = ''; // Clear action buttons
    } else if (activePlayerPokemon.currentHp <= 0) {
        logMessage(`${activePlayerPokemon.name} fainted!`);
        // Check if there are any other Pokemon left to switch to
        let remainingPokemon = playerPokemon.filter(poke => poke.currentHp > 0 && poke !== activePlayerPokemon);
        if (remainingPokemon.length > 0) {
            logMessage(`What will you do?`);
            prepareSwitchPokemonUI(); // Allow switching if more Pokemon left
        } else {
            logMessage(`You have no more Pokemon! You lose...`);
            currentTurn = 'ended'; // Game over
            actionButtonsDiv.innerHTML = ''; // Clear action buttons
        }
    }
}

// Function to prepare action buttons (Attack, Switch)
function updateActionButtons() {
    if (currentTurn !== 'player' || isSwitching || currentTurn === 'ended') {
        actionButtonsDiv.innerHTML = ''; // Clear buttons if not player's turn or switching
        return;
    }

    actionButtonsDiv.innerHTML = ''; // Clear previous buttons
    let attackButtonsHTML = '';
    activePlayerPokemon.moves.forEach((move, index) => {
        attackButtonsHTML += `<button onclick="useAttack(${index})">${move.name}</button>`;
    });

    let switchButtonHTML = `<button onclick="prepareSwitchPokemonUI()">Switch Pokemon</button>`;

    actionButtonsDiv.innerHTML = attackButtonsHTML + switchButtonHTML;
}

// Function called when an attack button is clicked
function useAttack(moveIndex) {
    if (currentTurn !== 'player' || isSwitching || currentTurn === 'ended') return;
    let move = activePlayerPokemon.moves[moveIndex];
    pokemonAttack(activePlayerPokemon, enemyPokemon, move);
    actionButtonsDiv.innerHTML = ''; // Clear action buttons after attack
}

// Function to prepare Switch Pokemon UI
function prepareSwitchPokemonUI() {
    if (currentTurn !== 'player' || isSwitching || currentTurn === 'ended') return;
    isSwitching = true;
    actionButtonsDiv.innerHTML = ''; // Clear action buttons

    switchPokemonAreaDiv.innerHTML = 'Switch to:<br>';
    playerPokemon.forEach((poke, index) => {
        if (poke.currentHp > 0 && poke !== activePlayerPokemon) { // Only show switch options for alive and not current Pokemon
            switchPokemonAreaDiv.innerHTML += `<button onclick="switchPokemon(${index})">${poke.name}</button>`;
        }
    });
    switchPokemonAreaDiv.innerHTML += `<button onclick="cancelSwitch()">Cancel</button>`; // Add cancel option
}

// Function to switch Pokemon
function switchPokemon(pokemonIndex) {
    if (currentTurn !== 'player' || !isSwitching || currentTurn === 'ended') return;

    let nextPokemon = playerPokemon[pokemonIndex];
    if (nextPokemon && nextPokemon.currentHp > 0) {
        logMessage(`Player switched to ${nextPokemon.name}.`);
        activePlayerPokemon = nextPokemon;
        updateUI();
        switchPokemonAreaDiv.innerHTML = ''; // Clear switch buttons
        isSwitching = false;
        currentTurn = 'enemy'; // Enemy turn after switch
        enemyTurn();
    } else {
        logMessage("Cannot switch to that Pokemon.");
        cancelSwitch(); // If switch fails, cancel switch mode
    }
}

// Function to cancel Pokemon switching
function cancelSwitch() {
    isSwitching = false;
    switchPokemonAreaDiv.innerHTML = ''; // Clear switch buttons
    updateActionButtons(); // Re-display action buttons
}


// Initialize game
function startGame() {
    logMessage("Battle Start!");
    updateUI();
    updateActionButtons(); // Show attack buttons at start
}

startGame();
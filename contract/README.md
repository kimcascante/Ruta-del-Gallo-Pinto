# 🎮 Dojo Game Starter - Backend Documentation

> **Complete Cairo + Dojo backend for onchain games**
> Production-ready smart contracts with achievement system

This repository contains the complete **backend** for developing games on **Starknet** using **Cairo/Dojo** as the game engine. It includes a player progression system, integrated achievement system, and is production-ready for Sepolia deployment.

## 🏗️ Backend Project Structure

```
contract/
├── src/
│   ├── achievements/         # Achievement system implementation
│   │   └── achievement.cairo # Achievement enums and configuration
│   ├── helpers/              # Utility functions
│   │   └── timestamp.cairo   # Timestamp utilities
│   ├── models/               # Data entities
│   │   └── player.cairo      # Player model with progression stats
│   ├── systems/              # Game logic systems
│   │   └── game.cairo        # Core game actions (spawn, train, mine, rest)
│   ├── tests/                # Integration tests
│   │   ├── test_game.cairo   # System tests
│   │   └── utils.cairo       # Testing utilities
│   ├── constants.cairo       # Global constants
│   ├── store.cairo           # Data access layer abstraction
│   └── lib.cairo             # Main module
├── Scarb.toml                # Project configuration
├── dojo_dev.toml             # Local development configuration
├── dojo_sepolia.toml         # Sepolia deployment configuration
└── torii_config.toml         # Indexer configuration
```

### 📋 Main Components

#### **Models** - Data Entities
Models define the data structures stored in the Dojo world:

- **`Player`**: Main entity representing a player with progression stats
  - `owner`: Address of the player
  - `experience`: Experience points for progression
  - `health`: Health points for risk/reward mechanics
  - `coins`: Player's currency for achievements
  - `creation_day`: Day of creation for tracking

#### **Store** - Data Access Layer
The store provides an abstraction layer between models and systems:

- **Getters**: `read_player()`, `read_player_from_address()`
- **Setters**: `write_player()`, `write_player_from_address()`
- **Creators**: `create_player()`, `create_player_from_address()`
- **Game Actions**: `train_player()`, `mine_coins()`, `rest_player()`

#### **Systems** - Game Logic
Systems contain the business logic and are the methods exposed to the client:

- **`spawn_player()`**: Create new player entity
- **`train()`**: Train player (+10 experience)
- **`mine()`**: Mine coins (+5 coins, -5 health)
- **`rest()`**: Rest player (+20 health)

#### **Achievements** - Achievement System
Complete integrated achievement system with 5 progression tiers:

```cairo
pub enum Achievement {
    MiniGamer,     // 1 action
    MasterGamer,   // 10 actions
    LegendGamer,   // 20 actions
    AllStarGamer,  // 30 actions
    SenseiGamer,   // 50 actions
}
```

## 🎮 Game Mechanics

The backend implements essential onchain game patterns:

| Action | Effect | Demonstrates |
|--------|--------|--------------|
| 🏋️ **Train** | +10 Experience | Pure advancement mechanics |
| ⛏️ **Mine** | +5 Coins, -5 Health | Risk/reward decision making |
| 💤 **Rest** | +20 Health | Resource management systems |

**🏆 Achievement System:**
- Automatic progress tracking for all game actions
- Complete integration with frontend achievement display
- Progressive difficulty from MiniGamer to SenseiGamer

## 🛠️ Local Development

> The next three steps assume you are in the `contract/` directory.

### 1️⃣ Start Katana (Local Blockchain)
```bash
katana --config katana.toml
```

### 2️⃣ Local Deployment
```bash
sozo build
sozo migrate
```

### 3️⃣ Start Local Torii
```bash
torii --world <WORLD_ADDRESS> --http.cors_origins "*"
```

### 4️⃣ Configure the Client for local development

In the `client/` directory, create an `.env.development.local` file with the following contents:

```bash
VITE_PUBLIC_DEPLOY_TYPE=localhost
VITE_PUBLIC_NODE_URL=http://localhost:5050
VITE_PUBLIC_TORII=http://localhost:8080
```

Now run `npm run dev:https` and you should be ready to go!

## 🚀 Deploy to Sepolia

### 1️⃣ Prepare Deploy Account
1. Create **Argent** or **Braavos** account on Sepolia testnet.
2. Deploy the account and enable it.
3. Fund with STRK tokens using [faucets](https://starknet-faucet.vercel.app/)
4. Obtain `account_address` and `private_key`.

### 2️⃣ Execute/Run these variables in the terminal
```bash
export STARKNET_RPC_URL="https://api.cartridge.gg/x/starknet/sepolia"
export DEPLOYER_ACCOUNT_ADDRESS="<tu_direccion_de_cuenta>"
export DEPLOYER_PRIVATE_KEY="<tu_clave_privada>"
```

### 3️⃣ Update Seed
In `dojo_sepolia.toml`, set a new seed:
```toml
seed = "seed456"  # Update the seed to create a new deployment
```

### 4️⃣ Clear old state
```bash
# Delete old manifest
rm manifest_sepolia.json
```

In `torii_config.toml`, clear the previous world address:

```toml
world_address = ""
```

### 5️⃣ Execute Deploy
```bash
cd contract
scarb run sepolia
```

✅ **The deploy will return the `world_address` you will need for the client.**

> Note: if you are using a new account and receive an "account does not exist error" please ensure your account has been fully deployed

## 📊 Deploy Torii with Achievements

Torii is the indexer that allows you to query the state of the world efficiently.

### 1️⃣ Auth
```bash
slot auth login
# Authenticate with controller username
```

### 2️⃣ Torii Instance Deploy
```bash
slot deployments create <instance_name> torii \
  --sql.historical "full_starter_react-TrophyProgression" \
  --world <world_address> \
  --rpc https://api.cartridge.gg/x/starknet/sepolia
```

📝 **The `instance_name` is used later on in the client to connect to this specific instance.**

## 🏆 Achievements System

### Achievements creation
Achievements are defined in `src/achievements/achievement.cairo`:

```cairo
impl AchievementImpl of AchievementTrait {
    fn identifier(self: Achievement) -> felt252 { /* ... */ }
    fn title(self: Achievement) -> felt252 { /* ... */ }
    fn description(self: Achievement) -> ByteArray { /* ... */ }
    fn tasks(self: Achievement) -> Span<Task> { /* ... */ }
    // ... more methods
}
```

### Initialization
The achievements are automatically initialized in `dojo_init()`:

```cairo
fn dojo_init(ref self: ContractState) {
    let mut achievement_id: u8 = 1;
    while achievement_id <= constants::ACHIEVEMENTS_COUNT {
        let achievement: Achievement = achievement_id.into();
        self.achievable.create(world, /* parámetros del achievement */);
        achievement_id += 1;
    }
}
```

### Progress Achievements
Each game action (`train`, `mine`, `rest`) emits progress events:

```cairo
// In each action of the system
let mut achievement_id = constants::ACHIEVEMENTS_INITIAL_ID;
while achievement_id <= constants::ACHIEVEMENTS_COUNT {
    let task: Achievement = achievement_id.into();
    achievement_store.progress(
        player.owner.into(),
        task.identifier(),
        1,
        get_block_timestamp()
    );
    achievement_id += 1;
}
```

## 🧪 Testing

### Run Tests Locally
```bash
cd contract
sozo test
```

### Tests Included
- **`test_spawn_player()`**: Player creation
- **`test_train_player()`**: Training system
- **`test_mine_coins()`**: Mining system
- **`test_rest_player()`**: Rest system
- **`test_complete_game_flow()`**: Complete flow of the game

## 📝 Configs

### Scarb.toml
- Cairo project configuration
- Dependencies (Dojo, Achievement)
- Deployment scripts
- External contracts

### dojo_dev.toml / dojo_sepolia.toml
- Dojo World Configuration
- RPC URLs
- Write permissions
- Project Namespace

### torii_config.toml
- Indexer configuration
- Events to index
- CORS and network options

## 🎯 Perfect For

- 🏆 **Hackathon teams** needing rapid onchain game setup
- 🎮 **Game developers** entering Web3 with production patterns
- 🏢 **Studios** prototyping blockchain games with real UX
- 📚 **Developers** learning Starknet + Dojo with comprehensive examples

## 🌟 Key Features

**⚡ Gaming-First Architecture**
- Player progression system with experience, health, and coins
- Integrated achievement system with 5+ achievements
- Production-ready deployment configuration
- Comprehensive testing strategy

**🔧 Developer Experience**
- Clean separation of models, systems, and store
- Type-safe Cairo contracts with Dojo Engine
- Hot reload with contract changes
- Complete integration with frontend

**🏗️ Scalable Design**
- Modular architecture for easy extension
- Reusable patterns for game mechanics
- Performance optimizations built-in
- Production deployment configurations

# Hamster-Kombat-Clone Telegram Web App
# Note
## Sorry, this project is not complete yet and does not work.
This project is a Telegram Web App that includes features like coin mining, referrals, tasks, and statistics like hamster kombat

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up a Firebase project and add your configuration to `src/firebase.js`
4. Create a Telegram bot using BotFather and add your bot token to a `.env` file:
   ```
   BOT_TOKEN=your_bot_token_here
   ```
5. Start the React app with `npm start`
6. Start the Telegram bot with `npm run start-bot`

## Features

- Coin mining system with energy
- Referral system
- Task completion
- Boost options
- User statistics

## Technologies Used

- React
- Firebase (Authentication and Firestore)
- Telegraf (Telegram Bot API)
- Tailwind CSS

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://github.com/ragibmondal/hamsterkombat-clone/blob/main/LICENSE)
## Hamster-Kombat-Clone
# Telegram Web App

This is a web-based mining game integrated with Telegram, featuring various components for user engagement and progression.

## How It Works

1. **Home Component**
   - The main dashboard where users can start and stop mining.
   - Displays user stats like coins, energy, and level.
   - Mining consumes energy and generates coins based on mining power and speed.
   - Users level up by accumulating coins, increasing their mining power.
   - Global events can affect mining rewards.

2. **Tasks Component**
   - Users can complete tasks to earn additional coins.
   - Tasks are level-gated, unlocking as the user progresses.

3. **Stats Component**
   - Displays global statistics and top users.

4. **Boost Component**
   - Allows users to boost their energy, coins, or level.
   - Includes a confirmation dialog for each boost action.

5. **Referral Component**
   - Users can refer others to the game.
   - Displays the user's referral link and list of referrals.

6. **Marketplace Component**
   - Users can purchase upgrades using their coins.
   - Upgrades include mining speed boost, energy capacity increase, and coin multiplier.

7. **Leaderboard Component**
   - Displays the top 10 players based on their coin count.

## Key Features

- Real-time updates using Firebase Firestore and Realtime Database.
- User authentication with Firebase Auth.
- Analytics tracking with Firebase Analytics.
- Push notifications using Firebase Cloud Messaging.
- Error handling with an ErrorBoundary component and toast notifications.
- Responsive design using Tailwind CSS.
- Animations with Framer Motion.

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up a Firebase project and update the configuration in `src/firebase.js`.
4. Run the development server with `npm start`.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

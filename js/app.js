// const App = {
//     // selected html elements
//     $: {
//         menu: document.querySelector('[data-id="menu"]'),
//         menuItems: document.querySelector('[data-id="menu-items"]'),
//         resetBtn: document.querySelector('[data-id="reset-btn"]'),
//         newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
//         squares: document.querySelectorAll('[data-id="square"]'),
//         modal: document.querySelector('[data-id="modal"]'),
//         modalContent: document.querySelector('[data-id="modal-content"]'),
//         modalBtn: document.querySelector('[data-id="modal-button"]'),
//         modalText: document.querySelector('[data-id="modal-text"]'),
//         turn: document.querySelector('[data-id="turn"]'),
//     },
//     state: {
//         moves: [],
//     },
//     getGameStatus(moves) {
//         const p1Moves = moves
//             .filter((move) => move.playerId === 1)
//             .map((move) => +move.squareId);
//         const p2Moves = moves
//             .filter((move) => move.playerId === 2)
//             .map((move) => +move.squareId);

//         const winningPatterns = [
//             [1, 2, 3],
//             [1, 4, 7],
//             [1, 5, 9],
//             [2, 5, 8],
//             [3, 5, 7],
//             [3, 6, 9],
//             [4, 5, 6],
//             [7, 8, 9],
//         ];

//         let winner = null;

//         winningPatterns.forEach((pattern) => {
//             const p1Wins = pattern.every((v) => p1Moves.includes(v));
//             const p2Wins = pattern.every((v) => p2Moves.includes(v));

//             if (p1Wins) winner = 1;
//             if (p2Wins) winner = 2;
//         });

//         return {
//             status:
//                 moves.length === 9 || winner != null
//                     ? "complete"
//                     : "in-progress",
//             winner: winner,
//         };
//     },
//     init() {
//         App.registerEventListeners();
//     },
//     registerEventListeners() {
//         // App.$.menu.addEventListener("click", () => {
//         //     App.$.menuItems.classList.toggle("hidden");
//         // });

//         App.$.resetBtn.addEventListener("click", () => {
//             console.log("reset");
//         });

//         App.$.newRoundBtn.addEventListener("click", () => {
//             console.log("new round");
//         });

//         App.$.modalBtn.addEventListener("click", () => {
//             App.state.moves = [];
//             App.$.squares.forEach((square) => {
//                 square.innerHTML = "";
//             });
//             App.$.modal.classList.add("hidden");
//         });

//         App.$.squares.forEach((square) => {
//             square.addEventListener("click", (e) => {
//                 // <i class="fa-solid fa-x turquoise"></i>
//                 // <i class="fa-solid fa-o yellow"></i>

//                 const hasMove = (squareId) => {
//                     const existingMove = App.state.moves.find(
//                         (move) => move.squareId === +square.id
//                     );
//                     return existingMove !== undefined;
//                 };

//                 if (hasMove(+square.id)) return;

//                 console.log(`square ${e.target.id} clicked`);

//                 const icon = document.createElement("i");
//                 const turnIcon = document.createElement("i");

//                 const lastMove = App.state.moves.at(-1);

//                 const getOppositePlayer = (playerId) =>
//                     playerId === 1 ? 2 : 1;

//                 const currentPlayer =
//                     App.state.moves.length == 0
//                         ? 1
//                         : getOppositePlayer(lastMove.playerId);

//                 const nextPlayer = getOppositePlayer(currentPlayer);
//                 const turnLabel = document.createElement("p");
//                 turnLabel.innerText = `Player ${nextPlayer}, you're up!`;

//                 if (currentPlayer === 1) {
//                     icon.classList.add("fa-solid", "fa-x", "turquoise");
//                     turnIcon.classList.add("fa-solid", "fa-o", "yellow");
//                     turnLabel.classList = "yellow";
//                 } else {
//                     icon.classList.add("fa-solid", "fa-o", "yellow");
//                     turnIcon.classList.add("fa-solid", "fa-x", "turquoise");
//                     turnLabel.classList = "turquoise";
//                 }

//                 App.$.turn.replaceChildren(turnIcon, turnLabel);

//                 square.replaceChildren(icon);

//                 App.state.moves.push({
//                     squareId: +square.id,
//                     playerId: currentPlayer,
//                 });

//                 console.log(App.state);

//                 // check if there is a winner or a draw
//                 const game = App.getGameStatus(App.state.moves);
//                 console.log(game);

//                 if (game.status === "complete") {
//                     App.$.modal.classList.remove("hidden");
//                     if (game.winner === null) {
//                         console.log("draw");
//                         App.$.modalText.textContent = "Draw";
//                     } else {
//                         console.log(`player ${game.winner} wins`);
//                         App.$.modalText.textContent = `Player ${game.winner} wins`;
//                     }
//                 }
//             });
//         });
//     },
// };

// window.addEventListener("load", App.init);

import View from "./view.js";
import Store from "./store.js";

const players = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "turquoise",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "yellow",
    },
];

function init() {
    const view = new View();
    const store = new Store("iks-oks", players);

    function initView() {
        view.closeAll();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScoreboard(
            store.stats.playerWithStats[0].wins,
            store.stats.playerWithStats[1].wins,
            store.stats.ties
        );
        view.initializeMoves(store.game.moves);
    }

    window.addEventListener("storage", () => {
        initView();
    });

    initView();

    view.bindGameResetEvent((e) => {
        store.reset();
        initView();
    });

    view.bindNewRoundEvent((e) => {
        store.newRound();
        initView();
    });

    view.bindPlayerMoveEvent((square) => {
        const existingMove = store.game.moves.find(
            (move) => move.squareId === +square.id
        );
        if (existingMove !== undefined) return;

        view.handlePlayerMove(square, store.game.currentPlayer);
        store.playerMove(+square.id);

        if (store.game.status.isComplete) {
            view.openModal(
                store.game.status.winner
                    ? `${store.game.status.winner.name} wins!`
                    : "Draw"
            );
            return;
        }

        view.setTurnIndicator(store.game.currentPlayer);
    });
}

window.addEventListener("load", init);

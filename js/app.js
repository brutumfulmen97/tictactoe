const App = {
    // selected html elements
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
    },
    init() {
        App.registerEventListeners();
    },
    registerEventListeners() {
        App.$.menu.addEventListener("click", () => {
            App.$.menuItems.classList.toggle("hidden");
        });

        App.$.resetBtn.addEventListener("click", () => {
            console.log("reset");
        });

        App.$.newRoundBtn.addEventListener("click", () => {
            console.log("new round");
        });

        App.$.squares.forEach((square) => {
            square.addEventListener("click", (e) => {
                console.log(`square ${e.target.id} clicked`);
            });
        });
    },
};

window.addEventListener("load", App.init);

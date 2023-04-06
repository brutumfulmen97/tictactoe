export default class View {
    $ = {};
    $$ = {};
    constructor() {
        this.$.menu = this.#qs('[data-id="menu"]');
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
        this.$.menuItems = this.#qs('[data-id="menu-items"]');
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
        this.$.modal = this.#qs('[data-id="modal"]');
        this.$.modalContents = this.#qs('[data-id="modal-contents"]');
        this.$.modalBtn = this.#qs('[data-id="modal-button"]');
        this.$.modalText = this.#qs('[data-id="modal-text"]');
        this.$.turn = this.#qs('[data-id="turn"]');

        this.$$.squares = this.#qsa('[data-id="square"]');

        //ui only event listeners
        this.$.menuBtn.addEventListener("click", () => {
            this.#toggleMenu();
        });
    }

    /**
     *
     * Register all new event listeners
     */

    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindPlayerMoveEvent(handler) {
        this.$$.squares.forEach((square) => {
            square.addEventListener("click", () => handler(square));
        });
    }

    /**
     *
     * DOM helper methods
     */

    #toggleMenu() {
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuBtn.classList.toggle("border");

        //flip icon
        const icon = this.#qs("i", this.menuBtn);
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    setTurnIndicator(player) {
        const icon = document.createElement("i");
        const label = document.createElement("p");

        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        label.classList = player.colorClass;
        label.innerText = `${player.name}, you're up!`;

        this.$.turn.replaceChildren(icon, label);
    }

    handlePlayerMove(squareEl, player) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        squareEl.replaceChildren(icon);
    }

    #qs(selector, parent) {
        const el = parent
            ? parent.querySelector(selector)
            : document.querySelector(selector);
        if (!el) throw new Error("Element not found" + selector);
        return el;
    }

    #qsa(selector, parent) {
        const el = parent
            ? parent.querySelectorAll(selector)
            : document.querySelectorAll(selector);
        if (!el) throw new Error("Element not found" + selector);
        return el;
    }
}

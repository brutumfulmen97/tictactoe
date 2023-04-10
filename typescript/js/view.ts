import { Game, GameStatus, Move, Player } from "./types";
import type Store from "./store";

export default class View {
    $: Record<string, Element> = {};
    $$: Record<string, NodeListOf<Element>> = {};
    constructor() {
        this.$.grid = this.#qs('[data-id="grid"]');
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
        this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
        this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
        this.$.ties = this.#qs('[data-id="ties"]');

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

    bindGameResetEvent(handler: EventListener) {
        this.$.resetBtn.addEventListener("click", handler);
        this.$.modalBtn.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler: EventListener) {
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindPlayerMoveEvent(handler: (el: Element) => void) {
        this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
    }

    render(game: Store["game"], stats: Store["stats"]) {
        this.#updateScoreboard(
            stats.playerWithStats[0].wins,
            stats.playerWithStats[1].wins,
            stats.ties
        );
        this.#clearMoves();
        this.#closeAll();
        this.#initializeMoves(game.moves);

        if (game.status.isComplete) {
            this.#openModal(
                game.status.winner ? `${game.status.winner.name} wins!` : "Draw"
            );
            return;
        }

        this.#setTurnIndicator(game.currentPlayer);
    }

    /**
     *
     * DOM helper methods
     */

    #updateScoreboard(p1Wins: number, p2Wins: number, ties: number) {
        this.$.p1Wins.textContent = `${p1Wins} Wins`;
        this.$.p2Wins.textContent = `${p2Wins} Wins`;
        this.$.ties.textContent = `${ties}`;
    }

    #openModal(message: string) {
        this.$.modalText.textContent = message;
        this.$.modal.classList.remove("hidden");
    }

    #clearMoves() {
        this.$$.squares.forEach((square) => {
            square.innerHTML = "";
        });
    }

    #closeModal() {
        this.$.modal.classList.add("hidden");
    }

    #closeAll() {
        this.#closeModal();
        this.#closeMenu();
    }

    #toggleMenu() {
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuBtn.classList.toggle("border");

        //flip icon
        const icon = this.#qs("i", this.$.menuBtn);
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    #closeMenu() {
        this.$.menuItems.classList.add("hidden");
        this.$.menuBtn.classList.remove("border");

        //flip icon
        const icon = this.#qs("i", this.$.menuBtn);
        icon.classList.add("fa-chevron-down");
        icon.classList.remove("fa-chevron-up");
    }

    #setTurnIndicator(player: Player) {
        const icon = document.createElement("i");
        const label = document.createElement("p");

        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        label.classList.add(player.colorClass);
        label.innerText = `${player.name}, you're up!`;

        this.$.turn.replaceChildren(icon, label);
    }

    #handlePlayerMove(squareEl: Element, player: Player) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        squareEl.replaceChildren(icon);
    }

    #initializeMoves(moves: Move[]) {
        this.$$.squares.forEach((square) => {
            const existingMove = moves.find(
                (move) => move.squareId === +square.id
            );
            if (existingMove)
                this.#handlePlayerMove(square, existingMove.player);
        });
    }

    #qs(selector: string, parent?: Element) {
        const el = parent
            ? parent.querySelector(selector)
            : document.querySelector(selector);
        if (!el) throw new Error("Element not found" + selector);
        return el;
    }

    #qsa(selector: string, parent?: Element) {
        const el = parent
            ? parent.querySelectorAll(selector)
            : document.querySelectorAll(selector);
        if (!el) throw new Error("Element not found" + selector);
        return el;
    }

    #delegate(
        el: Element,
        selector: string,
        eventKey: string,
        handler: (el: Element) => void
    ) {
        el.addEventListener(eventKey, (e) => {
            if (!(e.target instanceof Element)) {
                throw new Error("Event target is not an element");
            }
            if (e.target.matches(selector)) {
                handler(e.target);
            }
        });
    }
}

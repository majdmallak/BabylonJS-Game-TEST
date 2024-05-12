import { Engine } from "@babylonjs/core/Engines/engine";
import Game from "./game";
import Menu from "./menu";
import { GlobalManager } from "./globalmanager";
import CollisionSystem from "./collisionSystem";

let engine;
let canvas;
let game;
let menu;


window.onload = () => { 
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    window.addEventListener("resize", () => {
        engine.resize();
    });
    game = new Game(engine, canvas);
    menu = new Menu();
    document.getElementById("startButton").addEventListener("click", () => {
        game.resetGameState();
        menu.startGame();
        game.start();
    });    
    document.getElementById("resumeButton").addEventListener("click",() => {
        menu.resumeGame();
        game.continueGame();
        
    });
    document.getElementById("menuButton").addEventListener("click", menu.openMenu.bind(menu));
    document.getElementById("mainMenuButton").addEventListener("click", menu.returnToMainMenu.bind(menu));
    document.getElementById("endGameButton").addEventListener("click", () => {
        menu.returnToMainMenu();
        game.resetGameState();
        location.reload();
    });
}



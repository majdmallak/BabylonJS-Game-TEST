import { Engine } from "@babylonjs/core/Engines/engine";
import Game from "./game";

let engine;
let canvas;
let game;


window.onload = () => { 
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    window.addEventListener("resize", () => {
          engine.resize();
      });
    game = new Game(engine, canvas);
    game.start();
}
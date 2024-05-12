import game from "./game";
import { GlobalManager } from './globalmanager';
class Menu {
    constructor() {
    }


    openMenu() {
        this.stopGame();
        document.getElementById("menu").style.display = "block";
        document.getElementById("renderCanvas").style.display = "none";
    }
    resumeGame() {
        document.getElementById("menu").style.display = "none";
        document.getElementById("renderCanvas").style.display = "block";
    }
    stopGame() {
        GlobalManager.engine.stopRenderLoop();
    }

    startGame() {
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("menuButton").style.display = "block";
        document.getElementById("renderCanvas").style.display = "block";
    }
    returnToMainMenu() {
        this.stopGame();
        document.getElementById("mainMenu").style.display = "block";
        document.getElementById("renderCanvas").style.display = "none";
        document.getElementById("menu").style.display = "none";
        document.getElementById("menuButton").style.display = "none";
        document.getElementById("endGame").style.display = "none";
        document.getElementById("gameBody").style.backgroundImage = "url('./mainMenuPic.jpg')";
    }
    endGame() {
        this.stopGame();
        document.getElementById("endGame").style.display = "block";
        document.getElementById("renderCanvas").style.display = "none";
        document.getElementById("menuButton").style.display = "none";
        document.getElementById("mainMenuButton").style.display = "block";
        document.getElementById("endGame").style.display = "block";
        document.getElementById("gameBody").style.backgroundImage = "url('./endGamePic.jpg')";

    }



}
export default Menu;
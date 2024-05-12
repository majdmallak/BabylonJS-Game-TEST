import { Color3, Color4, CreateGround, CubeTexture, DirectionalLight, Engine, FollowCamera, FreeCamera, HDRCubeTexture, HemisphericLight, KeyboardEventTypes, Material, Scene, ShadowGenerator, Sound, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";


import musicUrl from "../assets/music/ambientMusic.mp3";

import Player from './player';
import Arena from './arena';
import { GlobalManager } from './globalmanager';
import { levels } from './levels';
import CollisionSystem from "./collisionSystem";
import Menu from "./menu";

class Game {
    engine;
    canvas;
    scene;

    camera;
    light;
    menu;
    startTimer;

    player;
    arena;
    inputMap = {};
    actions = {};
    dead = false;
    bInspector = false;

    currentLevel = 0;
    gameState = {
        level: 0,
        playerPosition: null
    };
    constructor(engine, canvas) {
        GlobalManager.engine = engine;
        GlobalManager.canvas = canvas;
    }

    async init() {
        GlobalManager.engine.displayLoadingUI();
        await this.createScene();
        this.initKeyboard();

        this.arena = new Arena();
        await this.arena.init();
        await this.arena.loadLevel(levels[this.currentLevel]);

        this.player = new Player(this.arena.playerSpawnPoint);
        await this.player.init();
        this.collisionSystem = new CollisionSystem(GlobalManager.scene);
        this.menu = new Menu();
       this.collisionsEnabled();
      
    
        GlobalManager.engine.hideLoadingUI();
    }


    initKeyboard() {
        GlobalManager.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.inputMap[kbInfo.event.code] = true;
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.inputMap[kbInfo.event.code] = false;
                    this.actions[kbInfo.event.code] = true;
                    break;
            }
        });
    }

    async start() {
        if (this.dead) {
            this.dead = false;
        }
        await this.init();
        GlobalManager.engine.runRenderLoop(() => {

            const deltaTime = GlobalManager.engine.getDeltaTime() / 1000;
            GlobalManager.update(deltaTime);

            this.update(deltaTime);
            this.player.update(this.inputMap, deltaTime);
            this.collisionSystem.checkCollisions(this.player.mesh);

            this.storeGameState();
            
            if (this.actions["KeyN"]) {
                this.currentLevel++;
                if (this.currentLevel >= levels.length) this.currentLevel = 0;
                
                GlobalManager.engine.displayLoadingUI();
                this.arena.loadLevel(levels[this.currentLevel]).then(() => {
                    // Reset player position to the spawn point of the new level
                    this.player.mesh.position.copyFrom(this.arena.playerSpawnPoint);
                    this.collisionSystem.enableCollision("HVGirl_primitive6"); 
                    this.collisionSystem.enableCollision("obstacle1");
                    this.collisionSystem.enableCollision("obstacle2");
                    this.collisionSystem.enableCollision("obstacle3");
                    this.collisionSystem.enableCollision("obstacle4");
                    this.collisionSystem.enableCollision("obstacle5");
                    this.collisionSystem.enableCollision("obstacle6");
                    this.collisionSystem.enableCollision("obstacle7");
                    this.collisionSystem.enableCollision("obstacle8");
                    this.collisionSystem.enableCollision("obstacle9");
                    this.collisionSystem.enableCollision("obstacle10");
                    this.collisionSystem.enableCollision("finishLineFlag");
                    GlobalManager.engine.hideLoadingUI();
                });
            }
            

            this.actions = {};

            GlobalManager.scene.render();
            if (this.dead) {
                GlobalManager.engine.stopRenderLoop();
            }
        });
    }

    update(deltaTime) {
        this.arena.update(deltaTime);
        this.startTimer += deltaTime;
    }
    storeGameState() {
        this.gameState.level = this.currentLevel;
        if (this.gameState.playerPosition) {
            this.player.position.copyFrom(this.gameState.playerPosition);
        }
    }

    restoreGameState() {
        this.currentLevel = this.gameState.level;
        if (this.gameState.playerPosition) {
            this.player.position.copyFrom(this.gameState.playerPosition);
        }
    }
    continueGame() {
        this.start();
    }
    resetGameState() {
        this.dead = true;
        this.gameState.level = 0;
        this.resetPlayerPosition();
    }
    pauseGame() {
        GlobalManager.engine.stopRenderLoop();
        this.player.isGamePaused = true;

    }
    resetPlayerPosition() {
        // Check if the player and spawn point are defined
        if (this.player && this.arena && this.arena.playerSpawnPoint) {
            // Set the player's position to the spawn point
            this.player.mesh.position.copyFrom(this.arena.playerSpawnPoint);
        } else {
            console.error("Player or spawn point is not defined.");
        }
    }

    collisionsEnabled()  {
        this.collisionSystem.enableCollision("HVGirl_primitive6");
        this.collisionSystem.enableCollision("obstacle1");
        this.collisionSystem.enableCollision("obstacle2");
        this.collisionSystem.enableCollision("obstacle3");
        this.collisionSystem.enableCollision("obstacle4");
        this.collisionSystem.enableCollision("obstacle5");
        this.collisionSystem.enableCollision("obstacle6");
        this.collisionSystem.enableCollision("obstacle7");
        this.collisionSystem.enableCollision("finishLineFlag");
        
        this.collisionSystem.onCollisionEnter("finishLineFlag" , () => {
            this.pauseGame();
            this.menu.endGame();  
            this.resetGameState();  

        });

        this.collisionSystem.onCollisionEnter("obstacle1" , () => {
            this.pauseGame();
            this.menu.endGame();
            this.resetGameState();

        });
        this.collisionSystem.onCollisionEnter("obstacle2" , () => {
            this.pauseGame();
            this.menu.endGame();
            this.resetGameState();

        });
        this.collisionSystem.onCollisionEnter("obstacle3" , () => {
            this.pauseGame();
            this.menu.endGame();
            this.resetGameState();

        });
        this.collisionSystem.onCollisionEnter("obstacle4" , () => {
            this.pauseGame();
            this.menu.endGame();
            this.resetGameState();

        });
        this.collisionSystem.onCollisionEnter("obstacle5" , () => {
            this.pauseGame();
            this.menu.endGame();
            this.resetGameState();

        });
        this.collisionSystem.onCollisionEnter("obstacle6" , () => {
            this.pauseGame();
            this.menu.endGame();
            this.resetGameState();

        });
        this.collisionSystem.onCollisionEnter("obstacle7" , () => {
            this.pauseGame();
            this.menu.endGame();
            this.resetGameState();

        });
    }
    async createScene() {
        GlobalManager.scene = new Scene(GlobalManager.engine);
    
        GlobalManager.camera = new FollowCamera("FollowCam", new Vector3(0, 10, -10), GlobalManager.scene);
        GlobalManager.camera.lockedTarget = this.player;
        GlobalManager.camera.radius = 10;
        GlobalManager.camera.heightOffset = 4;
        GlobalManager.camera.rotationOffset = 180;
        GlobalManager.camera.cameraAcceleration = 0.05;
        GlobalManager.camera.maxCameraSpeed = 20;
    
        // Remove camera inputs
        GlobalManager.camera.inputs.clear();
    
        GlobalManager.light = new HemisphericLight("light", new Vector3(0, 1, 0), GlobalManager.scene);
        GlobalManager.light.diffuse = new Color3(1, 1, 1);
        GlobalManager.light.specular = new Color3(1, 1, 1);
        GlobalManager.light.groundColor = new Color3(0.2, 0.2, 0.2);
    
        this.music = new Sound("music", musicUrl, GlobalManager.scene, undefined, { loop: true, autoplay: false, volume: 0.4 });
    }
    
}

export { Game as default, Game };
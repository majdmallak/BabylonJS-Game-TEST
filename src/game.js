import {AxesViewer, Color3, FollowCamera, FreeCamera, HemisphericLight, KeyboardEventTypes, MeshBuilder, Scalar, Scene, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core";
import Player from "./player";
import { GridMaterial } from "@babylonjs/materials";

import { Inspector } from "@babylonjs/inspector";
import Arena from "./arena";
// import meshUrl from "../assets/Models/HVGirl.glb"


class Game {
    engine;
    canvas;
    scene;
    arena;
    startTimer;
    player;

    cameraArena;
    playerCamera;
    light;
    bInspector = false;
    actions = {};
    inputMap = {};

    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
    }
    async init() {
        this.engine.displayLoadingUI();
        await this.createScene();
        this.arena = new Arena(this.scene, this.cameraArena);
        await this.arena.init();
        this.player = new Player(this.scene, this.cameraArena, this.arena.playerSpawnPoint);
        await this.player.init();
        this.initKeyboard();
        this.engine.hideLoadingUI();
    }
   
    


    initKeyboard() {

        this.scene.onKeyboardObservable.add((kbInfo) => {
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
        await this.init();
        Inspector.Show(this.scene,{});
        this.startTimer = 0;
        this.engine.runRenderLoop(() => {
            let delta = this.engine.getDeltaTime() / 1000.0;
            this.update(delta);
            if (this.actions["KeyI"]) {
                if (this.bInspector) {
                    Inspector.Hide();
                } else {
                Inspector.Show(this.scene, {});
                }
                this.bInspector = !this.bInspector;
            }
            // Reset actions
            this.actions = {};
            this.scene.render();
        });
    }

    update(delta) {
        this.arena.update(delta);
        this.player.update(delta, this.inputMap, this.actions);
        this.startTimer += delta;

    }
    updateMoves(delta) {
        
    }

    async createScene() {
        // Create a basic bjs scence object (non mesh)  
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color3(0.4, 0.4, 1);   
        // this.scene.collisionsEnabled = true;   

        // creates and positions a free camera ( non-mesh)
        this.cameraArena = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        // targets the camera to scene origin
        this.cameraArena.setTarget(new Vector3(0, 0, 0));
        // attaches the camera to the canvas
        this.cameraArena.attachControl(this.canvas, true);
       
        // creates a basic light, aiming 0,1,0 - to the sky (non-mesh)
        this.light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        // default intensity is 1, lets dim the light a small amount
        this.light.intensity = 1.0;

        // new AxesViewer(this.scene, 5);

        // SceneLoader.ImportMesh("", "", meshUrl, this.scene, (newMeshes) => {
        //     newMeshes[0].name = "player";
        //     newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
        //     this.camera.target = newMeshes[0];
        // });
        return this.scene;
    }
}
export default Game;

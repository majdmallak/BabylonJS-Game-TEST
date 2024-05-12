import { SceneLoader, Vector3 } from '@babylonjs/core';
import { GlobalManager } from './globalmanager';

const ForwardSpeed = 3.4;
const StrafeSpeed = 1.5;
import playerMeshUrl from "../assets/Models/HVGirl.glb";

class Player {
    mesh;
    animations = {};
    currentAnimation = "";
    gameIsPaused = false;
    moveInput = Vector3.Zero(); // Initialize moveInput here
    constructor(spawnPoint) {
        this.spawnPoint = spawnPoint;
        this.isMoving = false;
        this.gameIsPaused = false;
    }

    async init() {
        const result = await SceneLoader.ImportMeshAsync("", "", playerMeshUrl, GlobalManager.scene);
        this.mesh = result.meshes[0];
        this.mesh.position = this.spawnPoint.clone();
        this.mesh.checkCollisions = true;
        this.mesh.scaling.scaleInPlace(0.1);
        result.animationGroups.forEach(group => {
            this.animations[group.name] = group;
            if (group.name === "Walking") {
                group.loopAnimation = true;
            }
        });

        GlobalManager.camera.lockedTarget = this.mesh;
        this.playAnimation("Idle");
    }
    evaluateAnimation() {
        const isMoving = !this.moveInput.equals(Vector3.Zero());

        if (isMoving && this.currentAnimation !== "Walking") {
            this.playAnimation("Walking", 1.0);
        } else if (!isMoving && this.currentAnimation !== "Idle") {
            this.playAnimation("Idle", 1.0);
        }
    }

    playAnimation(name, speedFactor = 1.0) {
        if (this.currentAnimation !== name) {
            if (this.currentAnimation) {
                this.animations[this.currentAnimation].stop();
            }
            this.animations[name].play(true);
            this.animations[name].speedRatio = speedFactor;
            this.currentAnimation = name;
        }
    }

    update(inputMap, deltaTime) {
        if (!this.gameIsPaused) {
            this.getInputs(inputMap);
            this.move(deltaTime);
        }
    }

    getInputs(inputMap) {
        if (!this.gameIsPaused) {
            let x = 0, y = 0, z = 0;

            if (inputMap["KeyD"]) {
                x += StrafeSpeed;
            }
            if (inputMap["KeyA"]) {
                x -= StrafeSpeed;
            }
            if (inputMap["KeyW"]) {
                z += ForwardSpeed;
            }
            if (inputMap["KeyS"]) {
                z -= ForwardSpeed;
            }

            let newMoveInput = new Vector3(x, y, z);
            if (!this.moveInput.equals(newMoveInput)) {
                this.moveInput = newMoveInput;
                this.evaluateAnimation();
            }
        }
    }

    move(deltaTime) {
        if (!this.gameIsPaused) {
            let desiredMove = this.moveInput.clone().scale(ForwardSpeed * deltaTime);
            let newPosition = this.mesh.position.add(desiredMove);
            this.mesh.position = newPosition;
        }
    }
}

export default Player;

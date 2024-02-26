import { AxesViewer, Color3, MeshBuilder, Quaternion, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core";
const walkingSpeed = 5;
const runningSpeed = 15;
import animationsUrl from "../assets/Models/charchterAnimations.glb";


class Player{
    mesh;
    axes;
    scene;
    camera;
    // Vecteur d'input
    moveInput = Vector3.Zero();
    // Vecteur de deplacement
    moveDirection = Vector3.Zero();
    
    SpawnPoint;
animations ={};
animationStates = {};

    
    constructor(scene, camera, spawnPoint)
    {  
        this.scene = scene;
        this.camera = camera;
        this.SpawnPoint = spawnPoint;
        

    }
    async init() {
        const result = await SceneLoader.ImportMeshAsync("", animationsUrl, "", this.scene);
        // Assuming the first mesh is the player
        this.mesh = result.meshes[0];
        this.mesh.position = this.SpawnPoint.clone();
        this.mesh.scaling = new Vector3(1,1,1);
    
        // Initialize the animations dictionary
        this.animations = {
            idle: null,
            walking: null,
            running: null,
            runningJump: null
        };

        Object.keys(this.animations).forEach(key => {
            this.animationStates[key] = { isStarted: false };
        });
        // Iterate over the loaded animation groups and assign them
        result.animationGroups.forEach((group) => {
            if (group.name.includes("idle")) {
                this.animations.idle = group;
            } else if (group.name.includes("walking")) {
                this.animations.walking = group;
            } else if (group.name.includes("running")) {
                this.animations.running = group;
            }
            else if (group.name.includes("runningJump")) {
                this.animations.runningJump = group;
            }
        });
    
        // Play idle animation by default if it exists
        if (this.animations.idle) {
            this.animations.idle.start(true);
        }
    }
    
   
    update(delta, inputMap)
    {
        this.getInputs(inputMap);
        this.applyCameraToInputs();
        this.move(delta);
    }
   
    // getInputs(inputMap) {
    //     let moving = false;
    //     this.moveInput.set(0, 0, 0);
    
    //     if (inputMap["KeyA"]) {
    //         this.moveInput.x = -1;
    //         moving = true;
    //     } else if (inputMap["KeyD"]) {
    //         this.moveInput.x = 1;
    //         moving = true;
    //     }
    
    //     if (inputMap["KeyW"]) {
    //         this.moveInput.z = 1;
    //         moving = true;
    //     } else if (inputMap["KeyS"]) {
    //         this.moveInput.z = -1;
    //         moving = true;
    //     }
    getInputs(inputMap) {
        let moving = false;
        let jumping = false;
        this.moveInput.set(0, 0, 0);
    
        // Movement input
        if (inputMap["KeyA"]) {
            this.moveInput.x = -1;
            moving = true;
        } else if (inputMap["KeyD"]) {
            this.moveInput.x = 1;
            moving = true;
        }
    
        if (inputMap["KeyW"]) {
            this.moveInput.z = 1;
            moving = true;
        } else if (inputMap["KeyS"]) {
            this.moveInput.z = -1;
            moving = true;
        }
    
        // Jumping input
        if (inputMap["Space"]) {
            jumping = true;
        }
    
        // Determine which animation to play based on input
        if (jumping) {
            this.playAnimation("runningJump");
        } else if (moving) {
            const isRunning = inputMap["ShiftLeft"] || inputMap["ShiftRight"];
            this.currentSpeed = isRunning ? runningSpeed : walkingSpeed;
            this.playAnimation(isRunning ? "running" : "walking");
        } else {
            this.playAnimation("idle");
        }
    }
    

    // playAnimation(name) {
    //     Object.keys(this.animations).forEach((key) => {
    //         if (key === name) {
    //             if (!this.animationStates[key].isStarted) {
    //                 this.animations[key].play(true);
    //                 this.animationStates[key].isStarted = true; // Update the state here
    //             }
    //         } else {
    //             this.animations[key].stop();
    //             this.animationStates[key].isStarted = false; // Reset the state here
    //         }
    //     });
    // }
    playAnimation(name) {
        Object.keys(this.animations).forEach((key) => {
            const animation = this.animations[key];
            if (key === name) {
                if (animation && !this.animationStates[key].isStarted) {
                    animation.play(true);
                    this.animationStates[key].isStarted = true;
                }
            } else {
                if (animation) {
                    animation.stop();
                    this.animationStates[key].isStarted = false;
                }
            }
        });
    }
    // getInputs( inputMap) {
    //     this.moveInput.set(0, 0, 0);

    //     if (inputMap["KeyA"]) {
    //         this.moveInput.x = -1;
    //     } else if (inputMap["KeyD"]) {
    //         this.moveInput.x = 1;
            
    //     }
    //     if (inputMap["KeyW"]) {
    //         this.moveInput.z = 1;

    //     } else if (inputMap["KeyS"]) {
    //         this.moveInput.z = -1;
    //     }
        
    // }
    applyCameraToInputs()
    {
        this.moveDirection.set(0, 0, 0);
        if (this.moveInput.length() != 0 ) {
            // recup le forward de la camera
            //reset Y
            // normaliser
            let forward = this.getForwardVector(this.camera);
            forward.y = 0;
            forward.normalize();
            forward.scaleInPlace(this.moveInput.z);
            // recup le right de la camera
            // reset Y
            // normaliser
            let right = this.getRightVector(this.camera);
            right.y = 0;
            right.normalize();
            right.scaleInPlace(this.moveInput.x);
            // add les 2 vecteurs
            this.moveDirection = right.add(forward);
            // normaliser
            this.moveDirection.normalize();
        }
    }
    move(delta)
    {
        if (this.moveDirection.length() != 0 ) {
            // On regarde dans la direction du mouvement (attention meme space donc ici on se contente de deplacer le mesh et de le faire regarder dans la direction du mouvement)
            this.mesh.lookAt(this.mesh.position.add(this.moveDirection));
            this.moveDirection.scaleInPlace(walkingSpeed * delta);
            this.mesh.position.addInPlace(this.moveDirection);
            // slerp pour une rotation plus douce
            // this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, this.mesh.lookAt(this.mesh.position.add(this.moveDirection)), 0.2);

        }
        
    }
    getUpVector(_mesh, refresh)
    {
        _mesh.computeWorldMatrix(true, refresh);
        var up_local = new Vector3(0, 1, 0);
        const worlMatrix = _mesh.getWorldMatrix();
        return Vector3.TransformNormal(up_local, worlMatrix);
    }
    getForwardVector(_mesh, refresh)
    {
        _mesh.computeWorldMatrix(true, refresh);
        var forward_local = new Vector3(0, 0, 1);
        const worlMatrix = _mesh.getWorldMatrix();
        return Vector3.TransformNormal(forward_local, worlMatrix);
    }
    getRightVector(_mesh, refresh)
    {
        _mesh.computeWorldMatrix(true, refresh);
        var right_local = new Vector3(1, 0, 0);
        const worlMatrix = _mesh.getWorldMatrix();
        return Vector3.TransformNormal(right_local, worlMatrix);
    }
   
    
}

export default Player;
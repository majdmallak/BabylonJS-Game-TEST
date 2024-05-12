import { Scene, Mesh } from "@babylonjs/core";

class CollisionSystem {
    constructor(scene) {
        this.scene = scene;
        this.collisionHandlers = {};
    }

    enableCollision(meshName) {
        const mesh = this.scene.getMeshByName(meshName);
        if (mesh) {
            mesh.checkCollisions = true;
        } else {
            console.warn(`Mesh with name ${meshName} not found in the scene.`);
        }
    }
    onCollisionEnter(meshName, callback) {
        this.collisionHandlers[meshName] = callback;
    }

    checkCollisions(playerMesh) {
        this.scene.meshes.forEach((mesh) => {
            if (mesh.checkCollisions && mesh !== playerMesh) {
                if (playerMesh.intersectsMesh(mesh, false)) {
                    const handler = this.collisionHandlers[mesh.name];
                    if (handler) {
                        handler();
                    }
                }
            }
        });
    }
    
}

export default CollisionSystem;

import { MeshBuilder, SceneLoader, Vector3 } from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import "@babylonjs/loaders/glTF";



import { GlobalManager } from './globalmanager';

class Arena {

    mesh;

    playerSpawnPoint;

    assetContainer = null;

    constructor() {
    }

    async init() {

    }

    async loadLevel(level) {
        try {
            if (this.assetContainer) {
                this.assetContainer.dispose();
            }
    
            this.assetContainer = await SceneLoader.LoadAssetContainerAsync("", level.model, GlobalManager.scene);
            this.assetContainer.addAllToScene();
    
            for (let aNode of this.assetContainer.transformNodes) {
                if (aNode.name.includes("Spawn_p1")) {
                    //Player start 
                    aNode.computeWorldMatrix(true);
                    this.playerSpawnPoint = aNode.getAbsolutePosition();
                    aNode.dispose();
                }
            }
    
            // Enable collisions for obstacle meshes
            for (let childMesh of this.assetContainer.meshes) {
                if (childMesh.metadata && childMesh.metadata.gltf && childMesh.metadata.gltf.extras) {
                    let extras = childMesh.metadata.gltf.extras;
                    //Recup les datas supp.
                    console.log(extras);
                }
                if (childMesh.getTotalVertices() > 0) {
                    // Objet 3D
                    childMesh.receiveShadows = true;
                    GlobalManager.addShadowCaster(childMesh);
                } else {
                    // RAS
                }
    
               
            }
        } catch (error) {
            console.error("Error loading level:", error);
            // Handle the error, such as displaying a message to the user or retrying the operation
        }
    }
    
    

    
    // PlayerIndex as a parameter (later)
    getSpawnPoint() {
        return this.playerSpawnPoint.clone();
    }

    update() {

    }

}

export default Arena;
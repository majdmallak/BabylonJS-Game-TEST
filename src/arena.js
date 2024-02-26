import { Material, MeshBuilder, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core";
import arenaLevel1Url from "../assets/Models/arena_level1.glb";



class Arena {

    scene;
    camera;

    mesh;

    playerSpawnPoint;//peut etre un tableau pour contenir plusieurs spawn point

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
    }

    // async init() {
    //     const result = await SceneLoader.ImportMeshAsync("", "", arenaLevel1Url, this.scene);
    //     this.mesh = result.meshes[0];

    //     // Inside the init() method
    //     const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
    //     // const texture = new Texture("red-background-material.jpg", this.scene);
    //     // groundMaterial.diffuseTexture = texture;
    //     this.mesh.material = groundMaterial;
    //     for (let childMesh of result.meshes) {
    //         if (childMesh.name.includes("spawn_p1")) {
    //             //spawn player 
    //             childMesh.computeWorldMatrix(true);
    //             this.playerSpawnPoint = childMesh.getAbsolutePosition();
    //             childMesh.dispose();
    //         }
    //         else {
    //             if (childMesh.getTotalVertices() > 0) {
    //                 //objet 3d
    //             }
    //             else {
    //             }
    //         }

    //         this.mesh = result.meshes[0];
    //     }
    // }
    async init() {
        const result = await SceneLoader.ImportMeshAsync("", "", arenaLevel1Url, this.scene);
    
        // // Define your custom material outside the loop
        //  const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
        //  groundMaterial.diffuseTexture = new Texture(floorTexture, this.scene);
    
        result.meshes.forEach((childMesh) => {
            if (childMesh.name.includes("spawn_p1")) {
                // Handle spawn point logic
                childMesh.computeWorldMatrix(true);
                this.playerSpawnPoint = childMesh.getAbsolutePosition();
                childMesh.dispose(); // Consider if disposing is necessary, as it removes the mesh
            // } else {
            //     // Apply the custom material to each mesh
            //     // childMesh.material = groundMaterial;
            }
        });
    }
    

    update(delta) {
    }
    getSpawnPoint(PlayerIndex) {

        return this.playerSpawnPoint.clone();
    }
    
    

}
export default Arena;   
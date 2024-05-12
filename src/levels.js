import arenaLevel1Url from "/Users/majdmallak/Documents/babylonGameTest/BabylonJS-Game-TEST/assets/Models/racingTrackLevel1.glb";
import arenaLevel2Url from "/Users/majdmallak/Documents/babylonGameTest/BabylonJS-Game-TEST/assets/Models/racingTrackLevel2.glb";
import "@babylonjs/loaders/glTF";

const level1 = {

    name : "Niveau 1",
    model : arenaLevel1Url,
  
}
const level2 = {

    name : "Niveau 2",
    model : arenaLevel2Url,
  
}



export const levels = [
    level1,
    level2
]

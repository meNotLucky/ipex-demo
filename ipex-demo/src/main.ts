import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import * as VIEWPORT from './viewport';
import * as SELECTION from './selection';

const canvas = (document.getElementById("render-canvas") as HTMLCanvasElement);
const engine = new BABYLON.Engine(canvas, true, { stencil: true });

VIEWPORT.createViewport(engine);
const scene = VIEWPORT.getScene();

const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");
sphere.setPositionWithLocalVector(new BABYLON.Vector3(2,0,0));
sphere.refreshBoundingInfo({});

const importResult = await BABYLON.ImportMeshAsync("models/combi.glb", scene);
let combiMesh = importResult.meshes[1];
SELECTION.setSelectedMesh((combiMesh as BABYLON.Mesh));

engine.runRenderLoop(function() {
    scene.render();
});

window.addEventListener("resize", function() { engine.resize() });
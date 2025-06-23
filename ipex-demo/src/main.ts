import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import * as VIEWPORT from './viewport';
import * as MODELS from './models';

// Create the environment
const canvas = (document.getElementById("render-canvas") as HTMLCanvasElement);
const engine = new BABYLON.Engine(canvas, true, { stencil: true });
const scene = VIEWPORT.createViewport(engine);

// Load models and add meshes to the scene
MODELS.asyncLoadModels([
    { path: 'models/combi.glb', position: new BABYLON.Vector3(0, 0.36, 0) },
    { path: 'models/lamp.glb', position: new BABYLON.Vector3(2, 0, 0), scaling: new BABYLON.Vector3(0.25, 0.25, 0.25)},
    { path: 'models/carno.glb', position: new BABYLON.Vector3(-2, 0, 0), scaling: new BABYLON.Vector3(0.25, 0.25, 0.25)}
], scene);

// Render the scene
engine.runRenderLoop(function() {
    scene.render();
});

window.addEventListener("resize", function() { engine.resize() });
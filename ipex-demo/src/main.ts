import * as BAB from '@babylonjs/core';

const canvas = document.getElementById("render-canvas");
const engine = new BAB.Engine(canvas);
const scene = new BAB.Scene(engine);

engine.runRenderLoop(function() {
    scene.render();
});
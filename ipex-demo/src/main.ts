import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import * as SELECTION from './selection';

const canvas = (document.getElementById("render-canvas") as HTMLCanvasElement);
const engine = new BABYLON.Engine(canvas, true, { stencil: true });

const scene = new BABYLON.Scene(engine);
scene.createDefaultCameraOrLight(true, false, true);

const importResult = await BABYLON.ImportMeshAsync("models/combi.glb", scene);
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");

scene.onPointerObservable.add((pointerInfo) => {
  switch (pointerInfo.type) {
    case BABYLON.PointerEventTypes.POINTERPICK: {
        if (pointerInfo.pickInfo == null)
            break;

        let mesh = pointerInfo.pickInfo.pickedMesh;
        if (pointerInfo.pickInfo.hit && mesh != null)
            SELECTION.setSelectedMesh((mesh as BABYLON.Mesh));
    }
      break;
    }
});

engine.runRenderLoop(function() {
    scene.render();
});

window.addEventListener("resize", function() { engine.resize() });
import * as BABYLON from '@babylonjs/core';
import * as SELECTION from './selection';
import * as GUI from '@babylonjs/gui';
import * as GUI_HELPERS from './gui_helpers';
import * as TRANSFORM from './transform';
import { GridMaterial } from '@babylonjs/materials/Grid';

let scene : BABYLON.Scene;
let gridMesh : BABYLON.Mesh;

/**
 * Creates a scene, camera and grid
 * @param engine The engine to use for rendering the scene.
 */
export function createViewport(engine : BABYLON.Engine) {    
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);
    scene.createDefaultLight();

    const camera = new BABYLON.ArcRotateCamera(
        "arcCam", 
        Math.PI / 3, // alpha: 90 degrees
        Math.PI / 3, // beta: 45 degrees
        6,          // radius: 10 units away
        new BABYLON.Vector3(0, 0, 0), // target
        scene
    );

    camera.wheelPrecision = 12;
    camera.attachControl(engine.getRenderingCanvas(), true);

    gridMesh = BABYLON.MeshBuilder.CreateTiledGround("gridMesh", {xmin: -10, zmin: -10, xmax: 10, zmax: 10, updatable: false}, scene);
    gridMesh.isPickable = false;

    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    GUI_HELPERS.createVector3Field("extent", "Apply Model Scaling", new BABYLON.Vector3(1.25, 1.25, 1.25), new BABYLON.Vector2(60, 60), (value : BABYLON.Vector3) => {
        const selectedMesh = SELECTION.getSelectedMesh(scene);
        if (selectedMesh)
            TRANSFORM.extendMesh(selectedMesh, value);
    }, advancedTexture);

    var groundMaterial = new GridMaterial("groundMaterial", scene);
    groundMaterial.majorUnitFrequency = 5;
    groundMaterial.minorUnitVisibility = 0.45;
    groundMaterial.gridRatio = 0.5;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
    groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    groundMaterial.opacity = 0.2;
    gridMesh.material = groundMaterial;

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
}

export function getScene() : BABYLON.Scene
{
    return scene;
}

export function getGridMesh() : BABYLON.Mesh
{
    return gridMesh;
}

const animFPS = 24
const frameCount = 1 * animFPS
const animSpeed = 2.0;

export function retargetCamera(scene : BABYLON.Scene, newTarget : BABYLON.Vector3)
{
    const camera : BABYLON.ArcRotateCamera = (scene.activeCamera as BABYLON.ArcRotateCamera);
    if (camera == null)
        return;

    const animCameraTarget = new BABYLON.Animation(
        "animCameraTarget",
        "target",
        animFPS,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const animKeys = [
        { frame: 0, value: camera.target.clone() },
        { frame: frameCount, value: newTarget },
    ];

    animCameraTarget.setKeys(animKeys)

    const ease = new BABYLON.SineEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    animCameraTarget.setEasingFunction(ease);

    scene.beginDirectAnimation(camera, [animCameraTarget], 0, frameCount, false, animSpeed);
}
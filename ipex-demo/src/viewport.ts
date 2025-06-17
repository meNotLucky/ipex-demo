import * as BABYLON from '@babylonjs/core';
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
    scene.createDefaultCameraOrLight(true, false, true);

    gridMesh = BABYLON.MeshBuilder.CreateTiledGround("gridMesh", {xmin: -10, zmin: -10, xmax: 10, zmax: 10, updatable: false}, scene);
    gridMesh.isPickable = false;

    var groundMaterial = new GridMaterial("groundMaterial", scene);
    groundMaterial.majorUnitFrequency = 5;
    groundMaterial.minorUnitVisibility = 0.45;
    groundMaterial.gridRatio = 0.5;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
    groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    groundMaterial.opacity = 0.2;
    gridMesh.material = groundMaterial;
}

export function getScene() : BABYLON.Scene
{
    return scene;
}

export function getGridMesh() : BABYLON.Mesh
{
    return gridMesh;
}
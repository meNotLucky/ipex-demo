import * as BABYLON from '@babylonjs/core';
import { getGridMesh } from './viewport';
import { retargetCamera } from './viewport';

/** Holds references to the selected meshes for each scene */
let selectedMeshes = new Map<BABYLON.Scene, BABYLON.Nullable<BABYLON.Mesh>>();
/** Holds references to the highlight layers created for each scene */
let highlightLayers = new Map<BABYLON.Scene, BABYLON.Nullable<BABYLON.HighlightLayer>>();

/** Global alpha for selection outline pulse animation */
let selectionAnimPulseAlpha : number = 0;

/**
 * Selects a new mesh for the scene and highlights it, can be queried with getSelectedMesh()
 * @param mesh The mesh to be selected, it needs to currently be in a scene
*/
export function setSelectedMesh(mesh: BABYLON.Nullable<BABYLON.Mesh>)
{
    if (mesh == null)
        return;

    let scene = mesh.getScene();

    if (hasSelectedMesh(scene))
        clearSelectedMesh(scene);

    if (!hasSceneLayer(scene))
        addNewSceneLayer(scene);

    selectedMeshes.set(scene, mesh);
    
    selectionAnimPulseAlpha = 0;
    highlightLayers.get(scene)?.addMesh((mesh as BABYLON.Mesh), BABYLON.Color3.Yellow());

    retargetCamera(scene, mesh.position);
}

/**
 * Clears the currently selected mesh for the given scene
 * @param scene The scene to clear mesh selection in
 * */
export function clearSelectedMesh(scene: BABYLON.Scene)
{
    if (!hasSceneLayer(scene))
        return;
    if (!hasSelectedMesh(scene))
        return;

    highlightLayers.get(scene)?.removeMesh((getSelectedMesh(scene) as BABYLON.Mesh));

    selectedMeshes.set(scene, null);
}

/**
 * Check if the given scene currently has a mesh selected
 * @param scene The scene to check for mesh selection
 * @returns true | false
 */
export function hasSelectedMesh(scene: BABYLON.Scene) : boolean
{
    return selectedMeshes.has(scene) && selectedMeshes.get(scene) != null;
}

/**
 * Get the selected mesh for the given scene, if available
 * @param scene The scene to get the selected mesh from
 * @returns The selected mesh
 */
export function getSelectedMesh(scene: BABYLON.Scene) : BABYLON.Nullable<BABYLON.Mesh>
{
    if (!hasSelectedMesh(scene))
        return null;

    return (selectedMeshes.get(scene) as BABYLON.Nullable<BABYLON.Mesh>);
}

/**
 * Checks if a scene layer has already been added
 * @param scene The scene to check for
 * @returns true | false
 */
function hasSceneLayer(scene: BABYLON.Scene) : boolean
{
    return selectedMeshes.has(scene) && highlightLayers.has(scene);
}

/**
 * Adds a new scene layer
 * @param scene The scene layer to add
 */
function addNewSceneLayer(scene: BABYLON.Scene)
{
    selectedMeshes.set(scene, null);

    let sceneHighlightLayer = new BABYLON.HighlightLayer("selectionHighlight", scene);
    sceneHighlightLayer.innerGlow = false;
    sceneHighlightLayer.addExcludedMesh(getGridMesh());

    scene.registerBeforeRender(() => {
        selectionAnimPulseAlpha += 0.02;
        const blurSize = 0.3; const blurAnimOffset = 0.2;
        sceneHighlightLayer.blurHorizontalSize = blurSize + (Math.cos(selectionAnimPulseAlpha) * blurAnimOffset) + blurAnimOffset;
        sceneHighlightLayer.blurVerticalSize = blurSize + (Math.cos(selectionAnimPulseAlpha) * blurAnimOffset) + blurAnimOffset;
        
        if (selectionAnimPulseAlpha >= Number.MAX_VALUE)
            selectionAnimPulseAlpha = 0;
    });

    highlightLayers.set(scene, sceneHighlightLayer);
}
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

/** Holds all assets containers for all scenes */
let sceneAssetContainers = new  Map<BABYLON.Scene, BABYLON.AssetContainer[]>();

/** Simple class to define import options for the model to load. */
class ModelToLoad {
    path : string = "";
    position? : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    scaling? : BABYLON.Vector3 = BABYLON.Vector3.One();
}

/**
 * Async loads all models and adds them to the scene when finished.
 * @param models The models to load.
 * @param scene The scene to add the models to.
 */
export async function asyncLoadModels(models : ModelToLoad[], scene : BABYLON.Scene) : Promise<void>
{
    const assetContainers = await Promise.all(models.map(async (model) => BABYLON.LoadAssetContainerAsync(model.path, scene)));

    if (!sceneAssetContainers.has(scene))
        sceneAssetContainers.set(scene, []);

    for (var i = 0; i < models.length; i++) {

        var container = assetContainers[i];
        container.addAllToScene();

        if (models[i].position != undefined)
            container.meshes[0].position = models[i].position!;

        if (models[i].scaling != undefined)
            container.meshes[0].scaling = models[i].scaling!;
        
        container.meshes[0].computeWorldMatrix(true);
        container.meshes[0].refreshBoundingInfo({});

        sceneAssetContainers.get(scene)?.push(container);
    };

    return Promise.resolve();
}

/**
 * Gets the root node of any given mesh.
 * @param mesh Mesh to find root for.
 * @returns The root node.
 */
export function getMeshRoot(mesh : BABYLON.AbstractMesh) : BABYLON.AbstractMesh
{
    let current = mesh;
    while (current.parent) {
        current = (current.parent as BABYLON.Mesh);
    }

    return current;
}

/**
 * Gets all meshes contained in the model the given mesh belongs to.
 * @param mesh Source mesh.
 * @returns All meshes in the model.
 */
export function getAllMeshesFromModel(mesh : BABYLON.AbstractMesh) : BABYLON.AbstractMesh[]
{
    var root = getMeshRoot(mesh);
    var meshes = root.getChildMeshes();
    meshes.push(root)
    return meshes;
}
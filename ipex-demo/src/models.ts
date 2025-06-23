import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

let sceneAssetContainers = new  Map<BABYLON.Scene, BABYLON.AssetContainer[]>();

class ModelToLoad {
    path : string = "";
    position? : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    scaling? : BABYLON.Vector3 = BABYLON.Vector3.One();
}

export async function asyncLoadFiles(models : ModelToLoad[], scene : BABYLON.Scene) : Promise<void>
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

        sceneAssetContainers.get(scene)?.push(container);
    };

    return Promise.resolve();
}

export function getMeshRoot(mesh : BABYLON.AbstractMesh) : BABYLON.AbstractMesh
{
    let current = mesh;
    while (current.parent) {
        current = (current.parent as BABYLON.Mesh);
    }

    return current;
}

export function getAllMeshesFromModel(mesh : BABYLON.AbstractMesh) : BABYLON.AbstractMesh[]
{
    var root = getMeshRoot(mesh);
    var meshes = root.getChildMeshes();
    meshes.push(root)
    return meshes;
}
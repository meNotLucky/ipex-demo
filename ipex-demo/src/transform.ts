import * as BABYLON from '@babylonjs/core';

/**
 * Extends a mesh vertices by the given Vector3 factor
 * @param mesh Mesh to extend.
 * @param factor Factor to extend vertices by.
 */
export function extendMesh(mesh : BABYLON.Mesh, factor : BABYLON.Vector3)
{
    let vertPositions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    if (vertPositions == null)
        return;

    const meshPivot = mesh.getPivotPoint();
    for (let i = 0; i < vertPositions.length; i += 3) {
        const extendDir = new BABYLON.Vector3(vertPositions[i] - meshPivot.x, vertPositions[i + 1] - meshPivot.y, vertPositions[i + 2] - meshPivot.z);
        vertPositions[i] = meshPivot.x + factor.x * extendDir.x;
        vertPositions[i + 1] = meshPivot.y + factor.y * extendDir.y;
        vertPositions[i + 2] = meshPivot.z + factor.z * extendDir.z;
    }

    mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, vertPositions);
    mesh.computeWorldMatrix(true);
    mesh.refreshBoundingInfo({});
}

/**
 * Moves the mesh vertices by the given Vector3 distance.
 * @param mesh Mesh to move.
 * @param distance Distance to move vertices by.
 */
export function moveMesh(mesh : BABYLON.Mesh, distance : BABYLON.Vector3)
{
    let vertPositions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    if (vertPositions == null)
        return;

    for (let i = 0; i < vertPositions.length; i += 3) {
        vertPositions[i] += distance.x;
        vertPositions[i + 1] += distance.y;
        vertPositions[i + 2] += distance.z;
    }

    mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, vertPositions);
    mesh.computeWorldMatrix(true);
    mesh.refreshBoundingInfo({});
}

/**
 * Animates a mesh to "inflate" like a balloon, for funsies.
 * @param mesh The mesh to inflate.
 * @param scaleFactor The total size multiplier.
 * @param duration Duration of the animation in milliseconds.
 */
export function inflateMesh(mesh: BABYLON.AbstractMesh) {
    const inflationAnim = new BABYLON.Animation(
        "inflate",
        "scaling",
        24,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    inflationAnim.setKeys([
        { frame: 0, value: mesh.scaling.clone() },
        { frame: 24, value: mesh.scaling.multiplyByFloats(1.5, 1.5, 1.5) },
    ]);

    const flyAnim = new BABYLON.Animation(
        "fly",
        "position",
        24,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    flyAnim.setKeys([
        { frame: 0, value: mesh.position.clone() },
        { frame: 512, value: mesh.position.copyFromFloats(1, 100, 1) },
    ]);

    const inflationFunc = new BABYLON.QuadraticEase();
    inflationFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    inflationAnim.setEasingFunction(inflationFunc);

    const flyFunc = new BABYLON.QuadraticEase();
    flyFunc.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
    flyAnim.setEasingFunction(flyFunc);

    mesh.animations = [];
    mesh.animations.push(inflationAnim);
    mesh.animations.push(flyAnim);

    mesh.getScene().beginAnimation(mesh, 0, 512, false);
}
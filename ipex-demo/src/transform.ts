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
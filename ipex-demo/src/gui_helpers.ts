import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui'

/**
 * Creates a vector3 input field with a button and callback and adds it to the given dynamic texture.
 * @param fieldName Defines control name for each component, formats as {fieldName}_button, {fieldName}_X/Y/Z.
 * @param fieldLabel Text label to show on button for field.
 * @param defaultValue Default value for each Vector component.
 * @param screenPosition Position for field, (0,0) == top left.
 * @param callback Callback executed when the field button is pressed.
 * @param dynamicTexture Dynamic texture the GUI elements should be displayed in.
 */
export function createVector3Field(fieldName : string, fieldLabel : string, defaultValue : BABYLON.Vector3, screenPosition : BABYLON.Vector2, callback : (value : BABYLON.Vector3) => void, dynamicTexture : GUI.AdvancedDynamicTexture)
{
    var xInput = createNumericInput(`${fieldName}_x`, "X", defaultValue.x, new BABYLON.Vector2(screenPosition.x + 200, screenPosition.y), dynamicTexture);
    var yInput = createNumericInput(`${fieldName}_y`, "Y", defaultValue.y, new BABYLON.Vector2(screenPosition.x + 324, screenPosition.y), dynamicTexture);
    var zInput = createNumericInput(`${fieldName}_z`, "Z", defaultValue.z, new BABYLON.Vector2(screenPosition.x + 448, screenPosition.y), dynamicTexture);
    createButton(`${fieldName}_button`, fieldLabel, screenPosition, () => {
        callback(new BABYLON.Vector3(Number(xInput.text), Number(yInput.text), Number(zInput.text)))
    }, dynamicTexture);
}

/**
 * Creates a button and callback and adds it to the given dynamic texture.
 * @param buttonName Defines control name for the button component.
 * @param buttonLabel Text label to show on button.
 * @param screenPosition Position for button, (0,0) == top left.
 * @param callback Callback executed when the button is pressed.
 * @param dynamicTexture Dynamic texture the GUI element should be displayed in.
 * @returns the created GUI.Button object.
 */
export function createButton(buttonName : string, buttonLabel : string, screenPosition : BABYLON.Vector2, callback : () => void, dynamicTexture : GUI.AdvancedDynamicTexture) : GUI.Button
{
    var button = GUI.Button.CreateSimpleButton(buttonName, buttonLabel);
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button.height = "32px";
    button.width = "180px";
    button.color = "white";
    button.background = "black";
    button.left = `${screenPosition.x}px`;
    button.top = `${screenPosition.y}px`;
    button.onPointerClickObservable.add(callback);
    dynamicTexture.addControl(button);
    return button;
}

/**
 * Creates an input field that only allows numeric values and adds it to the given dynamic texture.
 * @param inputName Defines control name for the input component.
 * @param placeholderText Text label that shows up when the field is empty.
 * @param defaultValue Callback executed when the button is pressed.
 * @param screenPosition Position for input field, (0,0) == top left.
 * @param dynamicTexture Dynamic texture the GUI element should be displayed in.
 * @returns the created GUI.InputText object.
 */
export function createNumericInput(inputName : string, placeholderText : string, defaultValue : Number, screenPosition : BABYLON.Vector2, dynamicTexture : GUI.AdvancedDynamicTexture) : GUI.InputText
{
    var input = new GUI.InputText(inputName, `${defaultValue}`);
    input.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    input.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    input.height = "32px";
    input.width = "120px";
    input.color = "white";
    input.background = "black";
    input.left = `${screenPosition.x}px`;
    input.top = `${screenPosition.y}px`;
    input.placeholderText = placeholderText;
    input.onBeforeKeyAddObservable.add((input) => {
        input.addKey = /^\d*\.?\d*$/.test(input.currentKey);
    });
    dynamicTexture.addControl(input);
    return input;
}
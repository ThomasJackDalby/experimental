function createSliderInput(id, parent_div, label, min, max, start) {
    let form_group = _createFormGroup(id, parent_div, label)
    let input = createSlider(min, max, start);
    input.attribute("id", id)
    input.attribute("class", "form-range");
    input.parent(form_group.id());
    return input;
}

function createColorPickerInput(id, parent_div, label, start) {
    let form_group = _createFormGroup(id, parent_div, label)
    let input = createColorPicker(start);
    input.attribute("id", id)
    input.attribute("class", "form-control form-control-color");
    input.parent(form_group.id()); 
    return input;
}

function createTextInput(id, parent_div, label, start) {
    let form_group = _createFormGroup(id, parent_div, label)
    let input = createInput(start);
    input.attribute("id", id)
    input.attribute("class", "form-control");
    input.parent(form_group.id());
    return input;
}

function createCheckInput(id, parent_div, label, start) {
    let form_group = _createFormGroup(id, parent_div, label, "form-check-label")
    let input = createCheckbox();
    input.attribute("id", id)
    input.attribute("class", "form-check-input");
    input.parent(form_group.id());
    return input;
}

function createButtonInput(id, parent_div, label, method) {
    let form_group = _createFormGroup(id, parent_div)
    let input = createButton(label);
    input.mousePressed(method);
    input.attribute("id", id)
    input.attribute("class", "btn btn-secondary");
    input.parent(form_group.id());
    return input;
}

function _createFormGroup(id, parent_div, label, label_class) {
    let form_group_id = id + "-form-group";

    let form_group = createDiv();
    form_group.attribute("id", form_group_id);
    form_group.attribute("class", "form-group form-inline");
    form_group.parent(parent_div);
    
    if (label !== undefined) {
        let input_label = createElement("label", label);
        input_label.attribute("for", id);
        if (label_class === undefined) input_label.attribute("class", "form-label");
        else input_label.attribute("class", label_class);
        input_label.parent(form_group_id);
    }
    
    return form_group;
}
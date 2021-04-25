function createSliderInput(id, parent_div, label, min, max, start) {

    let form_group_id = id + "-form-group";

    let form_group = createDiv();
    form_group.attribute("id", form_group_id);
    form_group.attribute("class", "form-group");
    form_group.parent(parent_div);
    
    let slider_label = createElement("label", label);
    slider_label.attribute("for", id);
    slider_label.attribute("class", "form-label");
    slider_label.parent(form_group_id);
    
    let slider = createSlider(min, max, start);
    slider.attribute("id", id)
    slider.attribute("class", "form-range");
    slider.parent(form_group_id);

    return slider;
}

function createColorPickerInput(id, parent_div, label, start) {

    let form_group_id = id + "-form-group";

    let form_group = createDiv();
    form_group.attribute("id", form_group_id);
    form_group.attribute("class", "form-group");
    form_group.parent(parent_div);
    
    let input_label = createElement("label", label);
    input_label.attribute("for", id);
    input_label.attribute("class", "form-label");
    input_label.parent(form_group_id);
    
    let input = createColorPicker(start);
    input.attribute("id", id)
    input.attribute("class", "form-range");
    input.parent(form_group_id);

    return input;
}
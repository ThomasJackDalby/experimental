from isometric_renderer import IsometricRenderer

cubes = {
    (0, 0, 0) : 0
}

ir = IsometricRenderer()
ir.render(cubes, "examples/example_1.png")
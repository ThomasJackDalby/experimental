from isometric_renderer import IsometricRenderer

cube_types = [
    (255, 0, 0),
    (0, 255, 0),
    (0, 0, 255)
]

cubes = {
    (0, 0, 0) : 0,
    (1, 0, 0) : 1,
    (2, 0, 0) : 2
}

ir = IsometricRenderer(cube_types=cube_types)
ir.render(cubes, "examples/example_2.png")
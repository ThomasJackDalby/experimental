"""tetris.py: Renders a tetris-esk scene using the SolidFillRenderer"""

import random
from numpy.random import normal
from cubes.tools import add
from cubes import RayTracer, SolidFillRenderer
from rich.traceback import install
install(show_locals=True)

TETRIS_PIECES = [
    [(-1, 0, 0), (-1, 1, 0), (0, 0, 0), (1, 0, 0)],
    [(-1, 0, 0), (-1, -1, 0), (0, 0, 0), (1, 0, 0)],
    [(0, 0, 0), (0, -1, 0), (1, 0, 0), (-1, 0, 0)],
    [(0, 0, 0), (1, 0, 0), (2, 0, 0), (3, 0, 0)],
    [(0, 0, 0), (1, 0, 0), (1, 1, 0), (2, 1, 0)],
    [(0, 0, 0), (1, 0, 0), (1, -1, 0), (2, -1, 0)],
    [(0, 0, 0), (1, 0, 0), (0, 1, 0), (1, 1, 0)],
]

TETRIS_COLOURS = [
    (0, 240, 240),
    (240, 240, 0),
    (0, 240, 0),
    (0, 0, 240),
    (240, 0, 0),
    (240, 0, 240),
]
NUMBER_OF_PIECES = 500
STANDARD_DEVIATION = 6
BASE_SIZE = 30

ray_tracer = RayTracer()
renderer = SolidFillRenderer()
piece_index = 0
for piece in TETRIS_PIECES:
    scene = ray_tracer.ray_trace({ p : 0 for p in piece })
    renderer.render(scene, f"examples/tetris/{piece_index}.png")
    piece_index += 1

def rotate_xy(piece):
    return [(-cube[1], cube[0], cube[2]) for cube in piece]

def rotate_xz(piece):
    return [(-cube[2], cube[1], cube[0]) for cube in piece]

cubes = {}

for x in range(int(-BASE_SIZE/2), int(BASE_SIZE/2)):
    for y in range(int(-BASE_SIZE/2), int(BASE_SIZE/2)):
        cubes[(x, y, 0)] = 0

cube_types = [(51, 51, 51)]
for cube_index in range(NUMBER_OF_PIECES):
    piece = random.choice(TETRIS_PIECES)
    colour = random.choice(TETRIS_COLOURS)
    cube_types.append(colour)
    # position randomly
    x = int(normal(scale=STANDARD_DEVIATION))
    y = int(normal(scale=STANDARD_DEVIATION))

    # rotate it randomly
    for i in range(random.randint(0, 3)):
        piece = rotate_xy(piece)
    for i in range(random.randint(0, 3)):
        piece = rotate_xz(piece)

    # work out z
    z = 0
    while True:
        free = True
        transformed_piece = []
        for cube in piece:
            transformed_cube = add(cube, (x, y, z))
            if transformed_cube in cubes:
                free = False
                z += 1
                break
            transformed_piece.append(transformed_cube)
        if free:
            break

    for cube in transformed_piece:
        cubes[cube] = cube_index

scene = ray_tracer.ray_trace(cubes)
renderer = SolidFillRenderer(cube_types=cube_types)
renderer.render(scene, f"examples/tetris/tetris.png")

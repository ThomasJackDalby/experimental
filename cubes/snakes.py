import random, logging
from cubes import SolidFillRenderer, RayTracer
from rich.traceback import install
install(show_locals=True)

WIDTH = 50
HEIGHT = 33
MIN_SNAKE_LENGTH = 100
SNAKE_LENGTH_RANGE = 100
NUMBER_OF_SNAKES = 500

DIRECTIONS = [
    (0,0,1),
    (0,0,-1),
    (0,1,0),
    (0,-1,0),
    (1,0,0),
    (-1,0,0)
]

hex_fills = [
    "e8e9f3",
    "cecece",
    "a6a6a8",
    "272635",
    "b1e5f2"
]

def oddr_to_cube(i, j):
    x = int(i + (j + (j % 2)) / 2)
    z = int(j)
    y = int(x - z)
    return -x, -y, z

def convert_hex_to_rgb(hex):
    hex = hex.lstrip("#")
    return tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))

def add(a, b):
    return (a[0]+b[0], a[1]+b[1], a[2]+b[2])

class Snake:
    def __init__(self) -> None:
        self.length = MIN_SNAKE_LENGTH + random.randint(0, SNAKE_LENGTH_RANGE)

cubes = {}
for snake in range(NUMBER_OF_SNAKES):
    colour = random.randint(0, len(hex_fills)-1)
    
    current_pos = (0,0,0)
    while current_pos in cubes:
        i = random.randint(0, WIDTH)
        j = random.randint(0, HEIGHT)
        current_pos = oddr_to_cube(i, j)

    cubes[current_pos]=colour
    snake_length = MIN_SNAKE_LENGTH + random.randint(0, SNAKE_LENGTH_RANGE)
    for i in range(snake_length-1):
        directions = list(DIRECTIONS)
        while len(directions) > 0:
            direction = random.choice(directions)
            next_pos = add(current_pos, direction)
            if next_pos in cubes:
                directions.remove(direction)
            else:
                current_pos = next_pos
                cubes[current_pos] = colour
                break

ray_tracer = RayTracer()
scene = ray_tracer.ray_trace(cubes)

renderer = SolidFillRenderer(cube_types=[convert_hex_to_rgb(fill) for fill in hex_fills], triangle_edge=20, background=(0, 0, 0))
renderer.render(scene, "outputs/snakes.png")
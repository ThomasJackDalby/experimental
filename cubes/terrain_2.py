import random
from perlin_noise import PerlinNoise
from cubes import RayTracer, SolidFillRenderer
from rich.traceback import install
install(show_locals=True)

SCALE = 0.9
OCTAVES = 3
X_MAX = 500
Y_MAX = 500

GRASS = [0, 1 ,2]
ROCK = [3, 4, 5]
WATER = [6]
DIRT = [9, 10, 11]

CUBE_TYPES = [
    (90, 158, 35),
    (82, 148, 25),
    (70, 138, 15),
    (52, 52, 52),
    (52, 52, 52),
    (52, 52, 52),
    (50, 166, 168),
    (50, 166, 168),
    (50, 166, 168),
    (117, 76, 11),
    (117, 76, 11),
    (117, 76, 11)
]

noise = PerlinNoise(octaves=OCTAVES)
data = { }

water_level = 7
for y in range(X_MAX):
    for x in range(Y_MAX):
        for z in range(water_level):
            data[(x, y, z)] = random.choice(WATER)

for y in range(X_MAX):
    for x in range(Y_MAX):
        n = noise((SCALE*x/X_MAX, SCALE*y/Y_MAX))*20+10
        z_max = int(n)
        for z in range(z_max):
            if z < z_max - 5:
                cube = random.choice(ROCK)
            elif z < z_max - 2:
                cube = random.choice(DIRT)
            else:
                cube = random.choice(GRASS)
            data[(x, y, z)] = cube

ray_tracer = RayTracer()
scene = ray_tracer.ray_trace(data)

renderer = SolidFillRenderer(cube_types=CUBE_TYPES)
renderer.render(scene, "examples/terrain_2.png")
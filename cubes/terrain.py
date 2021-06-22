from perlin_noise import PerlinNoise
from isometric_renderer import IsometricRenderer

SCALE = 0.9
OCTAVES = 3
X_MAX = 50
Y_MAX = 50

GRASS = 0
ROCK = 1
WATER = 2
DIRT = 3

CUBE_TYPES = [
    (82, 148, 25),
    (52, 52, 52),
    (50, 166, 168),
    (117, 76, 11)
]

noise = PerlinNoise(octaves=OCTAVES)
data = { }

water_level = 7
for y in range(X_MAX):
    for x in range(Y_MAX):
        for z in range(water_level):
            data[(x, y, z)] = WATER

for y in range(X_MAX):
    for x in range(Y_MAX):
        n = noise((SCALE*x/X_MAX, SCALE*y/Y_MAX))*20+10
        z_max = int(n)
        for z in range(z_max):
            if z < z_max - 5:
                cube = ROCK
            elif z < z_max - 2:
                cube = DIRT
            else:
                cube = GRASS
            data[(x, y, z)] = cube

renderer = IsometricRenderer(cube_types=CUBE_TYPES)
renderer.render(data, "examples/terrain.png")
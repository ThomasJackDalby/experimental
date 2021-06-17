from perlin_noise import PerlinNoise
import cubes

SCALE = 0.9
OCTAVES = 3
X_MAX = 20
Y_MAX = 20

noise = PerlinNoise(octaves=OCTAVES)
data = { }
for y in range(X_MAX):
    for x in range(Y_MAX):
        n = noise((SCALE*x/X_MAX, SCALE*y/Y_MAX))*20+10
        z_max = int(n)
        for z in range(z_max):
            data[(x, y, z)] = 0

cubes.render(data, "test.jpg")
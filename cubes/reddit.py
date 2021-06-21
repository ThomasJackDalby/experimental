import json, random, numpy
from isometric_renderer import IsometricRenderer

with open("data.json", "r") as file:
    data = json.load(file)

FILLS = [
    [(202, 114, 188), (130, 56, 115), (62, 18, 43)],
    [(203, 137, 224), (160, 100, 188), (64, 42, 63)],
    [(175, 143, 242), (105, 73, 196), (37, 22, 87)],
    (114, 116, 237),
    (54, 100, 245),
    (40, 117, 173)
]

cube_types = [ ]
for cube_type in data["cube_types"]:
    cube_size = (max((x for x, _, _ in cube_type)) - min((x for x, _, _ in cube_type)) + 1,
        max((y for _, y, _ in cube_type)) - min((y for _, y, _ in cube_type)) + 1,
        max((z for _, _, z in cube_type)) - min((z for _, _, z in cube_type)) + 1)
    cube_types.append((cube_type, cube_size))

cube_sizes = list(set((cube_size for _, cube_size in cube_types)))
CUBE_SCALE = numpy.lcm.reduce(cube_sizes)

def oddr_to_cube(i, j):
    x = int(i + (j + (j % 2)) / 2)
    z = int(j)
    y = int(x - z)
    return -x, -y, z

cubes = { }
for i in range(30):
    for j in range(20):
        x, y, z = oddr_to_cube(i, j)
        cubes[(x, y, z)] = random.randint(1, len(cube_types)-1) if (z + y) % 3 == 0 else 0
        # cubes[(x-1, y+1, z-1)] = 0
        cubes[(x-1, y, z)] = 0
        cubes[(x, y, z-1)] = 0
        cubes[(x, y+1, z-1)] = 0

scaled_cubes = { }
for cx, cy, cz in cubes:
    # fill_layer = cx - cy + cz

    cube = cubes[(cx, cy, cz)]
    cube_type, cube_range = cube_types[cube]
    scale = (int(CUBE_SCALE[0] / cube_range[0]), int(CUBE_SCALE[1] / cube_range[1]) , int(CUBE_SCALE[2] / cube_range[2]))
    ax = cx * CUBE_SCALE[0]
    ay = cy * CUBE_SCALE[1]
    az = cz * CUBE_SCALE[2]
    for px, py, pz in cube_type:
        tx = ax + px * scale[0]
        ty = ay + py * scale[1]
        tz = az + pz * scale[2]
        for x in range(scale[0]):
            for y in range(scale[1]):
                for z in range(scale[2]):
                    scaled_cubes[(tx + x, ty + y, tz + z)] = int(cx / 2) % len(FILLS)

renderer = IsometricRenderer(cube_types=FILLS, triangle_edge=20)

renderer.render(scaled_cubes, "cubes.png")
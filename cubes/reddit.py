import json, random, numpy, os
from cubes import IsometricRenderer

DEFAULT_DATA_FILE_PATH = "reddit.json"
FILLS = [
    [(202, 114, 188), (130, 56, 115), (62, 18, 43)],
    [(203, 137, 224), (160, 100, 188), (64, 42, 63)],
    [(175, 143, 242), (105, 73, 196), (37, 22, 87)],
    (114, 116, 237),
    (54, 100, 245),
    (40, 117, 173)
]

DEFAULT_HEX_FILLS = [
    "AED9B0",
    "9BDCAA",
    "87B38C",
    "5E5F4D",
    "43443F"
]

def convert_hex_to_rgb(hex):
    hex = hex.lstrip("#")
    return tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))

def convert_rgb_to_fill(rgb):
        light_shade = (0, 0, 0)
        dark_shade = (0, 0, 0)
        return (rgb, light_shade, dark_shade)

def oddr_to_cube(i, j):
    x = int(i + (j + (j % 2)) / 2)
    z = int(j)
    y = int(x - z)
    return -x, -y, z

def load_cube_types(data_file_path=None):
    if data_file_path is None:
        data_file_path = DEFAULT_DATA_FILE_PATH

    if not os.path.exists(data_file_path):
        generate_cubes(data_file_path)

    with open(data_file_path, "r") as file:
        data = json.load(file)

    cube_types = [ ]
    for cube_type in data["cube_types"]:
        cube_size = (max((x for x, _, _ in cube_type)) - min((x for x, _, _ in cube_type)) + 1,
            max((y for _, y, _ in cube_type)) - min((y for _, y, _ in cube_type)) + 1,
            max((z for _, _, z in cube_type)) - min((z for _, _, z in cube_type)) + 1)
        cube_types.append((cube_type, cube_size))
    return cube_types

def generate_cubes(file_path):
    type_0 = {
        (0, 0, 0),
    }
    type_1 = {
        (0, 0, 0),
        (1, 0, 0),
        (2, 0, 0),
        (0, 1, 0),
        (1, 1, 0),
        (2, 1, 0),
        (0, 2, 0),
        (1, 2, 0),
        (2, 2, 0),
        (0, 0, 1),
        (0, 1, 1),
        (0, 2, 1),
        (1, 1, 1),
        (1, 2, 1),
        (2, 2, 1),
        (0, 0, 2),
        (0, 1, 2),
        (0, 2, 2),
        (1, 2, 2),
        (2, 2, 2),
    }
    type_2 = {
        (0, 0, 0),
        (2, 0, 0),
        (0, 1, 0),
        (0, 2, 0),
        (1, 2, 0),
        (2, 2, 0),
        (2, 0, 1),
        (0, 2, 1),
        (0, 0, 2),
        (1, 0, 2),
        (2, 0, 2),
        (2, 1, 2),
        (0, 2, 2),
        (2, 2, 2),
    }
    type_3 = { (x, y, 0 ) for x in range(4) for y in range(4) }
    type_3 = type_3.union({ (x, 3, z ) for x in range(4) for z in range(4) })
    type_3 = type_3.union({ (0, y, z ) for y in range(4) for z in range(4) })
    type_3 = type_3.union({ (1, 2, z ) for z in range(4) })
    type_3 = type_3.union({ (1, y, 1 ) for y in range(4) })
    type_3 = type_3.union({ (x, 2, 1 ) for x in range(4) })
    type_3.add((1, 1, 2))
    type_3.add((2, 1, 2))
    type_3.add((2, 2, 2))
    type_3.add((2, 1, 1))
    type_4 = { (x, y, 0 ) for x in range(4) for y in range(4) }
    type_4 = type_4.union({ (x, 3, z ) for x in range(4) for z in range(4) })
    type_4 = type_4.union({ (0, y, z ) for y in range(4) for z in range(4) })
    type_4.add((1, 1, 2))
    type_4.add((2, 1, 2))
    type_4.add((2, 2, 2))
    type_4.add((2, 1, 1))

    data = {
        "cube_types" : [
            list(type_0),
            list(type_1),
            list(type_2),
            list(type_3),
            list(type_4),
        ]
    }

    with open(file_path, "w") as file:
        json.dump(data, file)

def get_scaled_cubes(cube_types, width, height, fills):
    cube_sizes = list(set((cube_size for _, cube_size in cube_types)))
    cube_scale = numpy.lcm.reduce(cube_sizes)

    cubes = { }
    for i in range(width):
        for j in range(height):
            x, y, z = oddr_to_cube(i, j)
            cubes[(x, y, z)] = random.randint(1, len(cube_types)-1) if (z + y) % 3 == 0 else 0
            cubes[(x-1, y, z)] = 0
            cubes[(x, y, z-1)] = 0
            cubes[(x, y+1, z-1)] = 0

    scaled_cubes = { }
    for cx, cy, cz in cubes:
        cube = cubes[(cx, cy, cz)]
        cube_type, cube_range = cube_types[cube]
        scale = (int(cube_scale[0] / cube_range[0]), int(cube_scale[1] / cube_range[1]) , int(cube_scale[2] / cube_range[2]))
        ax = cx * cube_scale[0]
        ay = cy * cube_scale[1]
        az = cz * cube_scale[2]
        for px, py, pz in cube_type:
            tx = ax + px * scale[0]
            ty = ay + py * scale[1]
            tz = az + pz * scale[2]
            for x in range(scale[0]):
                for y in range(scale[1]):
                    for z in range(scale[2]):
                        scaled_cubes[(tx + x, ty + y, tz + z)] = int(cx / 2) % len(fills)
    return scaled_cubes


if __name__ == "__main__":
    import argparse, json
    
    # hex_colours = [
    #     "3C4C55",
    #     "446268",
    #     "5C8C9B",
    #     "9ABAB4",
    #     "B4F5EE"
    # ]

    hex_colours = [
        "e8e9f3",
        "cecece",
        "a6a6a8",
        "272635",
        "b1e5f2"
    ]

    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument("output_file_path")
    parser.add_argument("-w", "--width", type=int, default=None, help="The number of cubes to span horizontally.")
    parser.add_argument("-d", "--depth", type=int, default=None, help="The number of cubes to span vertically.")
    parser.add_argument("-hf", "--hex_fills", default=None, nargs="+", help="A list of hex values used to fill the cubes.")
    parser.add_argument("-l", "--load", default=None)
    parser.add_argument("-s", "--save", default=None)
    args = parser.parse_args()

    config = {
        "width" : 30,
        "depth" : 20,
        "hex_fills" : hex_colours
    }
    if args.load is not None: 
        with open(args.load, "r") as file:
            config = json.load(file)
        
    if args.width is not None: config["width"] = args.width
    if args.depth is not None: config["depth"] = args.depth
    if args.hex_fills is not None and len(args.hex_fills) > 0: config["hex_fills"] = args.hex_fills
    if args.output_file_path is not None: config["output_file_path"] = args.output_file_path

    default_config_file_path = f"{os.path.splitext(config['output_file_path'])[0]}.json"
    if args.save is not None:
        target_config_file_path = args.save
    elif not os.path.exists(default_config_file_path):
        target_config_file_path = default_config_file_path
    else: target_config_file_path = None

    if target_config_file_path is not None:
        with open(target_config_file_path, "w") as file:
            json.dump(config, file)

    rgb_colours = [convert_hex_to_rgb(hex) for hex in config["hex_fills"]]
    fill_colours = [convert_rgb_to_fill(rgb) for rgb in rgb_colours]

    cube_types = load_cube_types()
    scaled_cubes = get_scaled_cubes(cube_types, config["width"], config["depth"], fill_colours)

    renderer = IsometricRenderer(cube_types=rgb_colours, triangle_edge=20, background=(0, 0, 0))
    renderer.render(scaled_cubes, config["output_file_path"])
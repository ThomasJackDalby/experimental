from cubes.tile_set import TileSet
from typing import Text
from cubes import RayTracer, TextureRenderer
from rich.traceback import install
install(show_locals=True)

cube_types = [ 
    [
        "test_side_1",
        "test_side_2",
        "test_side_3",
        "test_side_4",
        "test_side_5",
        "test_side_6"
    ]
]

cubes = { (0, 0, 0) : 0 }

ray_tracer = RayTracer()
scene = ray_tracer.ray_trace(cubes)

tile_set = TileSet()
tile_set.load_sheet("tile_sets/test.json")

renderer = TextureRenderer(tile_set, cube_types)
renderer.render(scene, "texture.png")
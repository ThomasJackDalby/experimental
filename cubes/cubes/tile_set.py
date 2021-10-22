import os, json, logging
from cubes.constants import FACE_LEFT, FACE_RIGHT, FACE_TOP
from cubes import TileCreator 
from PIL import Image, ImageDraw

logger = logging.getLogger("cubes.tile_set")

class TileSet:

    def __init__(self) -> None:
        self.tiles = {}
        self.tile_creator = TileCreator()

    def load_sheet(self, file_path):
        with open(file_path, "r") as file:
            tile_set = json.load(file)

        folder_path = os.path.dirname(file_path)
        relative_file_path = tile_set["source"]
        file_path = os.path.join(folder_path, relative_file_path)
        tile_set_image = Image.open(file_path, 'r')
        for tile_id in tile_set["tiles"]:
            tile_area = tile_set["tiles"][tile_id]
            tile_image = tile_set_image.crop(tile_area)
            self.tiles[tile_id] = self.tile_creator.process_tile(tile_image)

    def get_tile(self, tile_id, face_id, is_odd):
        if tile_id not in self.tiles:
            raise Exception()
        return self.tiles[tile_id][2*face_id+int(is_odd)]

if __name__ == "__main__":
    tile_set = TileSet()
    tile_set.load_sheet("tile_sets/test.json")

    tile_id = "test"
    tile_set.get_tile(tile_id, FACE_LEFT, True).save("left-odd.png")
    tile_set.get_tile(tile_id, FACE_LEFT, False).save("left-even.png")
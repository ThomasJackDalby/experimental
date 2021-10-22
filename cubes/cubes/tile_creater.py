from cubes.constants import FACE_LEFT, FACE_RIGHT, FACE_TOP
import math, json, os, logging
from PIL import Image, ImageDraw, ImageOps

logger = logging.getLogger("cubes.tile_creator")

def get_minmax(points):
    min_x = min(x for x, _ in points)
    min_y = min(y for _, y in points)
    max_x = max(x for x, _ in points)
    max_y = max(y for _, y in points)
    return min_x, min_y, max_x, max_y

class TileCreator:

    class Deformer:
        def __init__(self, source, target) -> None:
            self.source = source
            self.target = target

        def getmesh(self, img):
            return [(self.target, self.source)]

        @staticmethod
        def create_left(triangle_width, triangle_height, offset_x, offset_y):
            tw, th = triangle_width, triangle_height
            ox, oy = offset_x, offset_y

            source = (0, oy, 0, th + 2 * oy, tw + ox, th + oy, tw + ox, 0)
            target = (0, 0, tw, int(1.5 * th))
            source = tuple((int(math.floor(v)) for v in source))
            target = tuple((int(math.floor(v)) for v in target))
            return TileCreator.Deformer(source, target)

        @staticmethod
        def create_right(triangle_width, triangle_height, offset_x, offset_y):
            tw, th = triangle_width, triangle_height
            ox, oy = offset_x, offset_y

            source = (0, oy, 0, th + 2 * oy, tw + ox, th + oy, tw + ox, 0)
            target = (0, 0, tw, int(1.5 * th))
            source = tuple((int(math.floor(v)) for v in source))
            target = tuple((int(math.floor(v)) for v in target))
            return TileCreator.Deformer(source, target)

        @staticmethod
        def create_top(triangle_width, triangle_height, offset_x, offset_y):
            tw, th = triangle_width, triangle_height
            ox, oy = offset_x, offset_y

            source = (0, oy, 0, th + 2 * oy, tw + ox, th + oy, tw + ox, 0)
            target = (0, 0, 2*tw, th)
            source = tuple((int(math.floor(v)) for v in source))
            target = tuple((int(math.floor(v)) for v in target))
            return TileCreator.Deformer(source, target)

    def __init__(self, triangle_edge=24) -> None:
        self.triangle_edge = triangle_edge
        self.triangle_width = int(3**0.5 * 0.5 * triangle_edge)
        self.triangle_height = int(triangle_edge)

        self.offset_x = self.triangle_height/self.triangle_width * (self.triangle_height-self.triangle_width)
        self.offset_y = 0.5 * self.triangle_height
        self.offset_x = int(math.floor(self.offset_x))
        self.offset_y = int(math.floor(self.offset_y))

        self.left_right_expanded_size = (int(self.triangle_width), int(self.triangle_height + 2 * self.offset_y))

        self.create_deformers()
        self.create_masks()

    def create_deformers(self):
        self.left_deformer = TileCreator.Deformer.create_left(self.triangle_width, self.triangle_height, self.offset_x, self.offset_y)
        self.right_deformer = TileCreator.Deformer.create_right(self.triangle_width, self.triangle_height, self.offset_x, self.offset_y)
        self.top_deformer = TileCreator.Deformer.create_top(self.triangle_width, self.triangle_height, self.offset_x, self.offset_y)

    def create_masks(self):
        odd_points = self.get_triangle_points(True)
        even_points = self.get_triangle_points(False)

        self.left_odd_points = [(x, y+self.offset_y) for x,y in odd_points]
        self.left_even_points = even_points
        self.right_odd_points = odd_points
        self.right_even_points = [(x, y+self.offset_y) for x,y in even_points]

        self.left_odd_mask = self.create_mask(self.left_odd_points)
        self.left_even_mask = self.create_mask(self.left_even_points)
        self.right_odd_mask = self.create_mask(self.right_odd_points)
        self.right_even_mask = self.create_mask(self.right_even_points)

    def process(self, tile_image, face_id):
        resized_image = tile_image.resize((self.triangle_width, self.triangle_height), resample=Image.NEAREST)

        if face_id == FACE_LEFT:
            deformer = self.left_deformer
            odd_points = self.left_odd_points
            even_points = self.left_even_points
            odd_mask = self.left_odd_mask
            even_mask = self.left_even_mask
            expanded_size = self.left_right_expanded_size
        elif face_id == FACE_RIGHT:
            deformer = self.right_deformer
            odd_points = self.right_odd_points
            even_points = self.right_even_points
            odd_mask = self.right_odd_mask
            even_mask = self.right_even_mask
            expanded_size = self.left_right_expanded_size
        elif face_id == FACE_TOP:
            pass

        expanded_image = Image.new("RGBA", expanded_size, 255)
        if face_id == FACE_LEFT or face_id == FACE_RIGHT:
            expanded_image.paste(resized_image, (0, int(self.offset_y)))
        else:
            pass
        deformed_image = ImageOps.deform(expanded_image, deformer, Image.NEAREST)

        def mask_image(mask, points):
            masked_image = Image.new("RGBA", self.expanded_size, 255)
            masked_image.paste(deformed_image, mask=mask)
            return masked_image.crop(get_minmax(points))

        odd_tile_image = mask_image(odd_mask, odd_points)
        even_tile_image = mask_image(even_mask, even_points)

        return odd_tile_image, even_tile_image

    def process_tile(self, tile_image):
        left_odd_tile, left_even_tile = self.process(tile_image, FACE_LEFT)
        right_odd_tile, right_even_tile = self.process(tile_image, FACE_RIGHT)
        top_odd_tile, top_even_tile = self.process(tile_image, FACE_TOP)

        return [
            left_odd_tile,
            left_even_tile,
            right_odd_tile,
            right_even_tile,
            top_odd_tile,
            top_even_tile,
        ]

    def create_mask(self, points): 
        mask_image = Image.new("L", self.expanded_size, 0)
        draw = ImageDraw.Draw(mask_image)
        draw.polygon(points, fill=255, outline=255)
        return mask_image

    def create_odd_mask(self):
        points = self.get_triangle_points(True)
        return self.create_mask(points)

    def get_triangle_points(self, odd):
        tw, th = self.triangle_width, self.triangle_height
        if odd:
            a = (0, 0.5*th)
            c = (tw, 0)
            b = (tw, th)
        else:
            a = (tw, 0.5*th)
            b = (0, 0)
            c = (0, th)
        return [a, b, c]
        
if __name__ == "__main__":
    tile_creator = TileCreator()
    tile_creator.process_tile_set("tile_sets/test.json")
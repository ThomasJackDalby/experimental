import logging, json, os
from pathlib import PurePosixPath
from cubes import Scene
from cubes.colors import WHITE, BLACK
from PIL import Image, ImageDraw

logger = logging.getLogger("cubes.texture_renderer")

class TextureRenderer:

    def __init__(self, tile_set, cube_types, background=WHITE, margin=0, triangle_edge=100, draw_faces=True, draw_edges=True):
        self.cube_types = cube_types
        self.background = background
        self.margin = margin
        self.should_render_faces = draw_faces
        self.should_render_edges = draw_edges
        self.triangle_edge = triangle_edge
        self.triangle_height = 3**0.5 * 0.5 * self.triangle_edge
        self.tile_set = tile_set

    def render(self, source, file_path):
        if isinstance(source, Scene):
            scene = source
        else:
            scene = Scene.load(source)

        self.image_width = int(scene.ij.di.range * self.triangle_height + 2 * self.margin)
        self.image_height = int((scene.ij.dj.range + scene.ij.di.range) * 0.5 * self.triangle_edge - scene.xyz.dy.range * self.triangle_edge)
        self.image_size = (self.image_width, self.image_height)
        logger.debug("image_width: %d image_height: %d", self.image_width, self.image_height)
    
        image = Image.new('RGB', self.image_size, self.background)

        self.render_faces(image, scene)

        logger.info("Saving...")
        image.save(file_path, quality=95)  
    
    def create_transform(self, scene):
        def transform(p):
            x, y = p
            y = self.image_height - (y + (scene.ij.di.max - 2 - scene.xyz.dy.max) * 0.5 * self.triangle_edge)
            return x, y
        return transform

    def get_tile(self, cube_type, face):


        tile_id = self.cube_types[cube_type][face]
        return self.tiles[tile_id]

    def render_faces(self, image, scene):
        if not self.should_render_faces:
            return

        transform = self.create_transform(scene)

        logger.debug("Rendering faces.")
        triangles = scene.get_triangles()
        for i, j in triangles:
            collision = scene.get_collision(i, j)
            if collision is None:
                continue
            cube_type, position, face = collision

            tile_image = self.get_tile(cube_type, face)

            points = self.get_triangle(i, j, transform)
            x = min(x for x, _ in points)
            y = min(y for _, y in points)
            offset = (int(x), int(y))
            print(offset)
            image.paste(tile_image, offset)

    def get_triangle(self, i, j, transform):
        triangle_height = self.triangle_height
        triangle_edge = self.triangle_edge

        if j % 2 == 0: # Left
            j_offset = 0.5*(2+j-i)
            a = (i * triangle_height, j_offset * triangle_edge)
            b = ((i+1) * triangle_height, (j_offset+0.5) * triangle_edge)
            c = ((i+1) * triangle_height, (j_offset-0.5) * triangle_edge)
        else:
            a = ((i+1) * triangle_height, ((j+1)/2+0.5-0.5*i) * triangle_edge)
            b = (i * triangle_height, ((j+1)/2-0.5*i) * triangle_edge)
            c = (i * triangle_height, ((j+1)/2+1-0.5*i) * triangle_edge)

        return [transform(p) for p in [a, b, c]]

    def render_triangle(self, image, i, j):
        img = Image.open('/path/to/file', 'r')
        img_w, img_h = img.size

        bg_w, bg_h = image.size

        image.save('out.png')
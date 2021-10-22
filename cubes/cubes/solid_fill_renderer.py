"""solid_fill_renderer.py: Renders isometric images of voxels using solid colours for the faces."""

import logging
from PIL import Image, ImageDraw
from cubes import Scene, RayTracer
from cubes.tools import dist
from cubes.colors import WHITE, BLACK

logger = logging.getLogger("cubes.solid_fill_renderer")

EDGE_CHECKS = [
    (0, 0, 1),
    (1, 1, 1),
    (2, 0, -1)
]

class SolidFillRenderer:

    def __init__(self, cube_types = [], background=WHITE, margin=0, triangle_edge=100, draw_faces=True, draw_edges=True):
        self.background = background
        self.margin = margin
        self.should_render_faces = draw_faces
        self.should_render_edges = draw_edges
        self.default_fill = self.get_face_fill((52, 52, 52))

        self.triangle_edge = triangle_edge
        self.triangle_height = 3**0.5 * 0.5 * self.triangle_edge

        # convert any single colours into face_fills
        for i, fill in enumerate(cube_types):
            cube_types[i] = self.get_face_fill(fill)
        self.cube_types = cube_types

    def render(self, source, file_path):
        if isinstance(source, Scene):
            scene = source
        else:
            scene = Scene.load(source)

        self.image_width = int(scene.ij.di.range * self.triangle_height + 2 * self.margin)
        self.image_height = int((scene.ij.dj.range + scene.ij.di.range) * 0.5 * self.triangle_edge - scene.xyz.dy.range * self.triangle_edge)
        self.image_size = (self.image_width, self.image_height)
        logger.debug("image_width: %d image_height: %d", self.image_width, self.image_height)

        def transform(p):
            x, y = p
            y = self.image_height - (y + (scene.ij.di.max - 2 - scene.xyz.dy.max) * 0.5 * self.triangle_edge)
            return x, y

        image = Image.new('RGB', self.image_size, self.background)
        draw = ImageDraw.Draw(image)

        self.render_faces(draw, scene, transform)
        self.render_edges(draw, scene, transform)

        logger.info("Saving...")
        image.save(file_path, quality=95)  

    def render_faces(self, draw, scene, transform):
        if not self.should_render_faces:
            return

        logger.debug("Rendering faces.")
        triangles = scene.get_triangles()
        for i, j in triangles:
            collision = scene.get_collision(i, j)
            if collision is None:
                continue
            cube_type, position, face = collision

            points = self.get_triangle(i, j, transform)
            fill = self.get_fill(cube_type, face)
            draw.polygon(points, fill=fill, outline=None)

    def render_edges(self, draw, scene, transform):
        if not self.should_render_edges:
            return

        logger.info("Drawing edge lines")
        triangles = scene.get_triangles()
        for i, j in triangles:
            if j % 2 != 0:
                continue

            collision = scene.get_collision(i, j)
            points = self.get_triangle(i, j, transform)

            if collision is not None:
                cube_type, position, face = collision

            for check in EDGE_CHECKS:
                k = check[0]
                ci = i+check[1]
                cj = j+check[2]
                other_collision = scene.get_collision(ci, cj)
                if other_collision is not None:
                    other_cube_type, other_position, other_face = other_collision

                draw_line = False
                if collision is None and other_collision is None:
                    draw_line = False
                elif collision is None or other_collision is None: # if one is none, draw line
                    draw_line = True
                elif face != other_face: # if not the same face draw line
                    draw_line = True
                elif cube_type != other_cube_type: # if not the same face draw line
                    draw_line = True
                elif dist(position, other_position) > 1:
                    draw_line = True
                else:
                    draw_line = False

                if draw_line:
                    a = points[k]
                    b = points[(k+1)%len(points)]
                    draw.line((a, b), fill=BLACK, width=2)

    def get_fill(self, cube_type, face):
        if cube_type >= 0 and cube_type < len(self.cube_types) and face >= 0 and face <= 2:
            return self.cube_types[cube_type][face]
        else:
            return self.default_fill[face]

    def get_face_fill(self, fill):
        if isinstance(fill, list):
            return fill
        else:
            return [
                fill,
                (int(fill[0]*0.8), int(fill[1]*0.8), int(fill[2]*0.8)),
                (int(fill[0]*0.6), int(fill[1]*0.6), int(fill[2]*0.6))
            ]

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

if __name__ == "__main__":
    import random
    cubes = { }
    cubes[(0, 0, 0)] = 0
    for y in range(10):
        for x in range(10):
            z_max = int(random.random() * 5) + 1
            for z in range(z_max):
                cubes[(x, y, z)] = random.randint(0, 2)

    ray_tracer = RayTracer()
    scene = ray_tracer.ray_trace(cubes)

    renderer = SolidFillRenderer(background=(0, 0, 0))
    renderer.render(scene, "outputs/test.png")
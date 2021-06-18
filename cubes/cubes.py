"""cubes.py: """

from tools import add, sub, get_mean, dist
from PIL import Image, ImageDraw

RAY_DIRECTION = (1, -1, 1)

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
YELLOW = (255, 255, 0)
RED = (255, 0, 0)

CUBE_FILLS = [
    (82, 148, 25),
    (52, 52, 52),
    (50, 166, 168),
    (117, 76, 11)
]
EDGE_CHECKS = [
    (0, 0, 1),
    (1, 1, 1),
    (2, 0, -1)
]

class IsometricRenderer:

    def __init__(self, options={}):
        self.options = options

        self.triangle_edge = options.get("triangle_edge", 100)
        self.triangle_height = options.get("triangle_height", 3**0.5/2 * self.triangle_edge)
        self.margin = options.get("margin", 0)

    def render(self, data, file_path):
        # evaluate limits of input data
        x_min = min(x for x, _, _ in data)
        y_min = min(y for _, y, _ in data)
        z_min = min(z for _, _, z in data)
        x_max = max(x for x, _, _ in data)+1
        y_max = max(y for _, y, _ in data)+1
        z_max = max(z for _, _, z in data)+1
        x_range = x_max - x_min
        y_range = y_max - y_min
        z_range = z_max - z_min

        print("x_min:", x_min, "y_min:", y_min, "z_min:", z_min)
        print("x_max:", x_max, "y_max:", y_max, "z_max:", z_max)


        # def check_point_within_limits(xyz):
        #     if x < x_min or x >= x_max:
        #         return False
        #     if y < y_min or y >= x_max:
        #         return False
        #     if z < z_min or z >= x_max:
        #         return False
        #     return True

        def get_index(args):
            (x, y, z) = args
            if x < x_min or x >= x_max or y < y_min or y >= y_max or z < z_min or z >= z_max:
                return -1
            return (x-x_min) + (y-y_min) * x_range + (z-z_min) * (x_range * y_range)

        # convert input data to an array
        cubes = [None] * x_range * y_range * z_range
        for point in data:
            index = get_index(point)
            cube = data[point]
            try:
                cubes[index] = cube
            except:
                print(point, index)
                exit()

        def get_cube(point):
            index = get_index(point)
            if index < 0 or index >= len(cubes):
                return None
            return cubes[index]

        i_max = x_max + y_max
        j_max = (y_max + z_max) * 2

        print("i_max:", i_max, "j_max:", j_max)

        def check_triangle_in_limits(i, j):
            if i < 0 or j < 0:
                return False
            if j > 2*(z_max + i) or j < 2*(i-x_max)+1:
                return False
            return True

        image_width = int(i_max * self.triangle_height + 2 * self.margin)
        image_height = int((j_max + i_max) * 0.5 * self.triangle_edge - y_max * self.triangle_edge)
        # offset = (z_max + (x_max**2 + y_max**2)**0.5)
        # image_height = int(offset * self.triangle_edge + 2 * self.margin)

        def transform(p):
            # TODO: need to decide what to round to here/if its needed (i think it is due to pixels.)
            x, y = p

            y = image_height - (y + (i_max - 2) * 0.5 * self.triangle_edge - 0.5 * y_max * self.triangle_edge)

            # x = round(p[0] + self.margin)
            # y = round(image_height - i_max * 0.5 * self.triangle_edge - (p[1] + self.margin))
            return (x, y)

        image = Image.new('RGB', (image_width, image_height), WHITE)
        draw = ImageDraw.Draw(image)

        def ray_trace(i, j, debug=False):
            """ ray traces a triangle through the cubes to see what face it should be. Each triangle has three cube axes it could be."""
            if j % 2 == 0: # left
                a = ((i, 0, int(j/2)), 1)
                b = ((i, -1, int(j/2)), 2)
                c = ((i+1, -1, int(j/2)), 0)
            else:
                a = ((i, 0, int((j-1)/2)), 1)
                b = ((i, -1, int((j-1)/2)), 0)
                c = ((i-1, 0, int((j-1)/2)), 2)
            rays = [a, b, c]
            collisions = []
            for ray, face in rays:
                if ray[0] < x_max and ray[1] >= 0 and ray[2] < z_max: # ray is inside cube
                    while ray[0] < x_max and ray[1] >= 0 and ray[2] < z_max:
                        ray = add(ray, RAY_DIRECTION)

                while ray[0] >= 0 and ray[1] < y_max and ray[2] >= 0:
                    ray = sub(ray, RAY_DIRECTION)
                    cube = get_cube(ray)
                    if cube is not None:
                        collisions.append((cube, ray, face))
                        break
            
            # get top collision
            max_quadrance = 0
            max_cube = None
            for collision in collisions:
                ray = collision[1]
                quadrance = ray[0]**2+(y_max - ray[1])**2+ray[2]**2
                if debug: print(ray, quadrance)
                if quadrance > max_quadrance:
                    max_cube = collision
                    max_quadrance = quadrance

            return max_cube

        def get_triangle(i, j):
            if j % 2 == 0: # Left
                j_offset = 0.5*(2+j-i)
                a = (i * self.triangle_height, j_offset * self.triangle_edge)
                b = ((i+1) * self.triangle_height, (j_offset+0.5) * self.triangle_edge)
                c = ((i+1) * self.triangle_height, (j_offset-0.5) * self.triangle_edge)
            else:
                a = ((i+1) * self.triangle_height, ((j+1)/2+0.5-0.5*i) * self.triangle_edge)
                b = (i * self.triangle_height, ((j+1)/2-0.5*i) * self.triangle_edge)
                c = (i * self.triangle_height, ((j+1)/2+1-0.5*i) * self.triangle_edge)
            return [transform(p) for p in [a, b, c]]

        collisions = [None] * i_max * j_max
        for i in range(i_max):
            for j in range(j_max):
                if j > 2*(z_max + i) or j < 2*(i-x_max)+1:
                    continue
                collision = ray_trace(i, j)
                if collision is not None:
                    collisions[i + j * i_max] = collision

        def get_collision(i, j):
            if i < 0 or j < 0: return None
            if i >= i_max or j > j_max: return None
            index = i + j * i_max
            if index >= len(collisions): return None
            return collisions[index]

        if True:
            for i in range(i_max):
                for j in range(j_max):
                    if not check_triangle_in_limits(i, j):
                        continue

                    collision = get_collision(i, j)
                    points = get_triangle(i, j)
                    if collision is not None:
                        cube_type, position, face = collision
                        # if face == 0: shade = position[2] / z_max
                        # elif face == 1: shade = position[1] / y_max
                        # elif face == 2: shade = position[0] / x_max
                        # shade = int(shade * 50) + 50
                        
                        if cube_type < len(CUBE_FILLS):
                            fill = CUBE_FILLS[cube_type]
                        else:
                            fill = (52, 52, 52)

                        if face == 1:
                            fill = (int(fill[0]*0.9), int(fill[1]*0.9), int(fill[2]*0.9))
                        if face == 2:
                            fill = (int(fill[0]*0.8), int(fill[1]*0.8), int(fill[2]*0.8))

                        # height_modifier = position[2] / z_max
                        # fill = (int(fill[0]*height_modifier), int(fill[1]*height_modifier), int(fill[2]*height_modifier))

                        draw.polygon(points, fill=fill, outline=None)

        def draw_centered_text(xy, text, fill=BLACK):
            w, h = draw.textsize(text)
            draw.text((xy[0]-w/2, xy[1]-h/2), text, fill)

        # draw the edge lines
        if True:
            for i in range(i_max):
                for j in range(j_max):
                    if j % 2 != 0 or not check_triangle_in_limits(i, j):
                        continue

                    collision = get_collision(i, j)
                    if collision is not None:
                        cube_type, position, face = collision
                    points = get_triangle(i, j)

                    center = get_mean(points)
                    text = f"{(i, j)}\n{position}\n{face}" if collision is not None else f"{(i, j)}"
                    for check in EDGE_CHECKS:
                        k = check[0]
                        ci = i+check[1]
                        cj = j+check[2]
                        other_points = get_triangle(ci, cj)
                        other_center = get_mean(other_points)
                        other_collision = get_collision(ci, cj)
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

        if False:
            for i in range(i_max):
                for j in range(j_max):
                    if j > 2*(z_max + i) or j < 2*(i-x_max)+1:
                        continue
                    collision = get_collision(i, j)
                    if collision is not None:
                        _, position, face = collision
                        text = str(face)
                        points = get_triangle(i, j)
                        center = (sum(p[0] for p in points)/3, sum(p[1] for p in points)/3)
                        draw_centered_text(center, text)

        image.save(file_path, quality=95)

# 10, 1, 10
# 1, 10, 1
# 5, 5, 5

if __name__ == "__main__":
    import random
    cubes = { }
    cubes[(0, 0, 0)] = 0
    for y in range(10):
        for x in range(10):
            z_max = int(random.random() * 5) + 1
            for z in range(z_max):
                cubes[(x, y, z)] = random.randint(0, 2)

    renderer = IsometricRenderer()
    renderer.render(cubes, "test.jpg")
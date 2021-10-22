from cubes.constants import *
import logging
from cubes import Scene
from cubes.tools import add, sub

logger = logging.getLogger("cubes.ray_tracer")

RAY_DIRECTION = (1, -1, 1)

def calculate_rays(i, j):
    if j % 2 == 0: # left
        a = ((i, 0, int(j/2)), FACE_RIGHT)
        b = ((i, -1, int(j/2)), FACE_TOP)
        c = ((i+1, -1, int(j/2)), FACE_LEFT)
    else:
        a = ((i, 0, int((j-1)/2)), FACE_RIGHT)
        b = ((i, -1, int((j-1)/2)), FACE_LEFT)
        c = ((i-1, 0, int((j-1)/2)), FACE_TOP)
    return a, b, c

def convert_dict_to_list(data, xyz):
    cubes = [None] * xyz.dx.range * xyz.dy.range * xyz.dz.range
    for point in data:
        index = xyz.get_index(*point)
        cube = data[point]
        if index > len(cubes):
            print(index, len(cubes))
        cubes[index] = cube
    return cubes

class RayTracer:
    def __init__(self) -> None:
        pass
    
    def ray_trace(self, data):
        logger.info("Ray tracing the scene...")

        scene = Scene.from_data(data)
        offset = scene.xyz.get_min()
        data = { sub(point, offset) : data[point] for point in data }

        scene = Scene.from_data(data)
        data = convert_dict_to_list(data, scene.xyz)

        self.cube_rays = {}
        triangles = list(scene.get_triangles())
        logger.info("Scene has %d triangles, so roughly %d rays.", len(triangles), len(triangles)/3)
        for i, j in triangles:
            collision = self._single_ray_trace(data, scene.xyz, i, j)
            index = scene.ij.get_index(i, j)

            if collision is not None and index is None:
                logger.debug("Ahhhhh %d %d", i, j)

            if collision is not None and index is not None:
                scene.cubes[index] = collision
        return scene

    def _single_ray_trace(self, data, xyz, i, j, debug=False):
        """ ray traces a triangle through the cubes to see what face it should be. Each triangle has three cube axes it could be."""
        def get_cube(point):
            index = xyz.get_index(*point)
            if index is None:
                return None
            if index < 0 or index >= len(data):
                raise Exception()
            return data[index]

        rays = calculate_rays(i, j)
        collisions = []
        for start_ray, face in rays:
            cube = None
            if start_ray in self.cube_rays:
                cube, ray = self.cube_rays[start_ray]
            else:
                ray = start_ray
                if ray[0] < xyz.dx.max and ray[1] >= 0 and ray[2] < xyz.dz.max:
                    while ray[0] < xyz.dx.max and ray[1] >= 0 and ray[2] < xyz.dz.max:
                        ray = add(ray, RAY_DIRECTION)
                    ray = add(ray, RAY_DIRECTION)

                while ray[0] >= 0 and ray[1] < xyz.dy.max and ray[2] >= 0:
                    cube = get_cube(ray)
                    if cube is not None:
                        break
                    ray = sub(ray, RAY_DIRECTION)
                self.cube_rays[start_ray] = (cube, ray)
            if cube is not None:
                collisions.append((cube, ray, face))
        
        max_quadrance = 0
        max_cube = None
        for collision in collisions:
            ray = collision[1]
            quadrance = ray[0]**2+(xyz.dy.max - ray[1])**2+ray[2]**2
            if debug: print(ray, quadrance)
            if quadrance > max_quadrance:
                max_cube = collision
                max_quadrance = quadrance

        return max_cube
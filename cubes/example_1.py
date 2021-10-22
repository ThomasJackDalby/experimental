from cubes import RayTracer, SolidFillRenderer

cubes = {
    (0, 0, 0) : 0
}

ray_tracer = RayTracer()
scene = ray_tracer.ray_trace(cubes)

renderer = SolidFillRenderer()
renderer.render(scene, "examples/example_1.png")
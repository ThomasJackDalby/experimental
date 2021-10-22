import json 

class Range:
    def __init__(self, min, max) -> None:
        self.min = min
        self.max = max
        self.range = self.max - self.min

    def inside(self, value):
        return value >= self.min and value < self.max

    def to_dict(self):
        return {
            "min" : self.min,
            "max" : self.max,
        }

    def __repr__(self) -> str:
        return f"Range: {self.min} {self.max}"

    @staticmethod
    def from_data(data):
        return Range(min(data), max(data)+1)

class Grid2D:
    def __init__(self, di, dj) -> None:
        self.di = di
        self.dj = dj

    def get_index(self, i, j):
        if not self.di.inside(i) or not self.dj.inside(j):
            return None
        return (i-self.di.min) + (j-self.dj.min) * self.di.range

    def get_indexes(self): 
        return ((i, j) for i in range(self.di.min, self.di.max+1) for j in range(self.dj.min, self.dj.max+1))

    def to_dict(self):
        return {
            "di" : self.di.to_dict(),
            "dj" : self.dj.to_dict(),
        }

    def __repr__(self) -> str:
        return f"<Grid2D[{self.di}][{self.dj}]/>"

class Grid3D:
    def __init__(self, dx, dy, dz) -> None:
        self.dx = dx
        self.dy = dy
        self.dz = dz

    def get_min(self):
        return (self.dx.min, self.dy.min, self.dz.min)

    def get_index(self, x, y, z):
        if not self.inside(x, y, z):
            return None
        return (x-self.dx.min) + (y-self.dy.min) * self.dx.range + (z-self.dz.min) * (self.dx.range * self.dy.range)

    def get_indexes(self): 
        return ((x, y, z) for x in range(self.dx.min, self.dx.max+1) for y in range(self.dy.min, self.dy.max+1) for z in range(self.dz.min, self.dz.max+1))

    def inside(self, x, y, z):
        return self.dx.inside(x) and self.dy.inside(y) and self.dz.inside(z)

    def to_dict(self):
        return {
            "dx" : self.dx.to_dict(),
            "dy" : self.dy.to_dict(),
            "dz" : self.dz.to_dict(),
        }

    def __repr__(self) -> str:
        return f"<Grid3D[{self.dx}][{self.dy}][{self.dz}]/>"

class Scene:
    def __init__(self, xyz):
        self.xyz = xyz
        i_max = self.xyz.dx.max + self.xyz.dy.max
        j_max = (self.xyz.dy.max + self.xyz.dz.max) * 2

        self.ij = Grid2D(Range(0, i_max), Range(0, j_max))
        self.cubes = [None] * self.ij.di.range * self.ij.dj.range

    def get_collision(self, i, j):
        index = self.ij.get_index(i, j)
        if index == None:
            return None
        return self.cubes[index]

    def check_triangle_in_limits(self, i, j):
        if i < 0 or j < 0:
            return False
        if j > 2*(self.xyz.dz.max + i) or j < 2*(i-self.xyz.dx.max)+1:
            return False
        return True

    def get_triangles(self):
        return ((i, j) for i, j in self.ij.get_indexes() if self.check_triangle_in_limits(i, j))

    def to_dict(self):
        return {
            "xyz" : self.xyz.to_dict(),
            "ij" : self.ij.to_dict(),
            "cubes" : self.cubes
        }

    @staticmethod
    def from_data(data):
        dx = Range.from_data([x for x, _, _ in data])
        dy = Range.from_data([y for _, y, _ in data])
        dz = Range.from_data([z for _, _, z in data])
        xyz = Grid3D(dx, dy, dz)
        return Scene(xyz)

    @staticmethod
    def save(file_path, model):
        template = model.to_dict()
        with open(file_path, "w") as file:
            json.dump(template, file)

    @staticmethod
    def load(file_path):
        with open(file_path, "r") as file:
            template = json.load(file)
        xyz = Grid3D.from_dict()
        scene = Scene() 
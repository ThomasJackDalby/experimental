"""tools.py: common numerical functions"""

def add(a, b):
    return (a[0]+b[0], a[1]+b[1], a[2]+b[2])

def sub(a, b):
    return (a[0]-b[0], a[1]-b[1], a[2]-b[2])

def dist(a, b):
    return abs(b[0]-a[0])+abs(b[1]-a[1])+abs(b[2]-a[2])

def get_mean(points):
    return (sum(p[0] for p in points)/len(points), sum(p[1] for p in points)//len(points))

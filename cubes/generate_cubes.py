import json

type_0 = {
    (0, 0, 0),
}
type_1 = {
    (0, 0, 0),
    (1, 0, 0),
    (2, 0, 0),
    (0, 1, 0),
    (1, 1, 0),
    (2, 1, 0),
    (0, 2, 0),
    (1, 2, 0),
    (2, 2, 0),
    (0, 0, 1),
    (0, 1, 1),
    (0, 2, 1),
    (1, 1, 1),
    (1, 2, 1),
    (2, 2, 1),
    (0, 0, 2),
    (0, 1, 2),
    (0, 2, 2),
    (1, 2, 2),
    (2, 2, 2),
}

type_2 = {
    (0, 0, 0),
    (2, 0, 0),
    (0, 1, 0),
    (0, 2, 0),
    (1, 2, 0),
    (2, 2, 0),
    (2, 0, 1),
    (0, 2, 1),
    (0, 0, 2),
    (1, 0, 2),
    (2, 0, 2),
    (2, 1, 2),
    (0, 2, 2),
    (2, 2, 2),
}

type_3 = { (x, y, 0 ) for x in range(4) for y in range(4) }
type_3 = type_3.union({ (x, 3, z ) for x in range(4) for z in range(4) })
type_3 = type_3.union({ (0, y, z ) for y in range(4) for z in range(4) })
type_3 = type_3.union({ (1, 2, z ) for z in range(4) })
type_3 = type_3.union({ (1, y, 1 ) for y in range(4) })
type_3 = type_3.union({ (x, 2, 1 ) for x in range(4) })
type_3.add((1, 1, 2))
type_3.add((2, 1, 2))
type_3.add((2, 2, 2))
type_3.add((2, 1, 1))

type_4 = { (x, y, 0 ) for x in range(4) for y in range(4) }
type_4 = type_4.union({ (x, 3, z ) for x in range(4) for z in range(4) })
type_4 = type_4.union({ (0, y, z ) for y in range(4) for z in range(4) })
# type_4 = type_4.union({ (1, 2, z ) for z in range(4) })
# type_4 = type_4.union({ (1, y, 1 ) for y in range(4) })
# type_4 = type_4.union({ (x, 2, 1 ) for x in range(4) })
type_4.add((1, 1, 2))
type_4.add((2, 1, 2))
type_4.add((2, 2, 2))
type_4.add((2, 1, 1))

# type_5 = {} 

data = {
    "cube_types" : [
        list(type_0),
        list(type_1),
        list(type_2),
        list(type_3),
        list(type_4),
        # list(type_5),
    ]
}

with open("data.json", "w") as file:
    json.dump(data, file)
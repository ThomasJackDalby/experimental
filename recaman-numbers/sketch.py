from svg_toolkit import *

CACHE = [0]
VISITED = set([0])

def calculate(n):
    if n < 0: raise Exception("Not supported for negative terms.")
    if n < len(CACHE): return CACHE[n]

    start = calculate(n-1)
    delta = n

    result = None
    if start - delta > 0 and not start - delta in VISITED: result = start - delta
    else: result = start + delta

    VISITED.add(result)
    CACHE.append(result)

    return result

def draw(file_path, n, margin=0, scale=1):
    data = [calculate(n) for n in range(n)]
    x_offset = margin
    width = max(data) * scale + 2 * margin
    height = n * scale + 2 * margin
    y_offset = height / 2

    stroke_weight(0.5)
    background(255, 255, 255)
    view_box(0, 0, width, height)

    state = False
    increasing = True
    for i, ex in enumerate(data[1:]):
        sx = data[i]
        cx = sx + (ex - sx) / 2
        radius = abs((ex - sx) / 2)

        # if we're changing direction, we don't flip
        if increasing and ex > sx: state = not state
        if not increasing and ex < sx: state = not state
        increasing = ex > sx

        move_command = ["M", sx * scale + x_offset, y_offset]
        arc_command = ["A", radius, radius, 0, 0, 0 if state else 1, ex * scale + x_offset, y_offset]

        path(move_command + arc_command) 

    save(file_path)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("n", type=int)
    parser.add_argument("-f", "--file_path", type=str)
    parser.add_argument("-m", "--margin", type=float, default=0)

    args = parser.parse_args()

    draw(args.file_path, args.n, args.margin)

import struct
import zlib
from pathlib import Path

import numpy as np

SIZE = 256
OUT = Path(__file__).resolve().parent.parent / "public" / "textures"


def write_png(path, rgb):
    h, w, _ = rgb.shape
    raw = b"".join(b"\x00" + rgb[y].tobytes() for y in range(h))
    body = zlib.compress(raw, 9)

    def chunk(kind, data):
        return (
            struct.pack(">I", len(data))
            + kind
            + data
            + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
        )

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
    png += chunk(b"IDAT", body)
    png += chunk(b"IEND", b"")
    path.write_bytes(png)


def tileable_noise(size, freq, rng, stretch_y=1.0, stretch_x=1.0):
    white = rng.normal(size=(size, size))
    spectrum = np.fft.fft2(white)
    axis = np.fft.fftfreq(size) * size
    radius = np.sqrt(
        (axis[:, None] * stretch_y) ** 2 + (axis[None, :] * stretch_x) ** 2
    )
    field = np.real(np.fft.ifft2(spectrum * np.exp(-((radius / freq) ** 2))))
    field -= field.min()
    peak = field.max()
    return field / peak if peak > 0 else field


def fbm(size, freq, octaves, rng, gain=0.5, stretch_y=1.0, stretch_x=1.0):
    total = np.zeros((size, size))
    amplitude = 1.0
    weight = 0.0
    for i in range(octaves):
        total += amplitude * tileable_noise(
            size, freq * (2**i), rng, stretch_y, stretch_x
        )
        weight += amplitude
        amplitude *= gain
    return total / weight


def cellular(size, count, rng):
    seeds = rng.uniform(0, size, (count, 2))
    gy, gx = np.mgrid[0:size, 0:size]
    nearest = np.full((size, size), np.inf)
    second = np.full((size, size), np.inf)
    for sy, sx in seeds:
        dy = np.abs(gy - sy)
        dy = np.minimum(dy, size - dy)
        dx = np.abs(gx - sx)
        dx = np.minimum(dx, size - dx)
        dist = np.sqrt(dy * dy + dx * dx)
        closer = dist < nearest
        second = np.where(closer, nearest, np.minimum(second, dist))
        nearest = np.where(closer, dist, nearest)
    return nearest, second


def normalize(field):
    lo, hi = field.min(), field.max()
    return (field - lo) / (hi - lo) if hi > lo else field * 0


def shade(height, strength=1.0):
    gy = np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)
    gx = np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)
    return np.clip((gx * 0.6 + gy * 0.8) * strength, -1, 1)


def ramp(t, dark, light):
    dark = np.array(dark, dtype=float)
    light = np.array(light, dtype=float)
    return dark[None, None, :] + t[:, :, None] * (light - dark)[None, None, :]


def to_rgb(arr):
    return np.clip(arr, 0, 255).astype(np.uint8)


def oak(rng):
    x = np.mgrid[0:SIZE, 0:SIZE][1]
    warp = fbm(SIZE, 3, 3, rng, stretch_y=3.4) * 30
    rings = np.abs(np.sin((x + warp) * (np.pi * 9 / SIZE)))
    rings = rings**0.42
    fibre = fbm(SIZE, 34, 4, rng, stretch_y=7.0)
    hairline = tileable_noise(SIZE, 150, rng, stretch_y=14.0)
    height = normalize(rings * 0.58 + fibre * 0.27 + hairline * 0.15)
    base = ramp(height, (19, 12, 5), (92, 63, 30))
    base += shade(height, 74)[:, :, None]
    pores = (fbm(SIZE, 90, 2, rng, stretch_y=5.0) < 0.26) * 30
    base -= pores[:, :, None] * np.array([1.0, 0.92, 0.82])[None, None, :]
    return to_rgb(base)


def stone(rng):
    nearest, second = cellular(SIZE, 150, rng)
    grit = fbm(SIZE, 90, 3, rng)
    mottle = fbm(SIZE, 7, 5, rng)
    facets = normalize(second - nearest)
    height = normalize(mottle * 0.46 + grit * 0.36 + facets * 0.18)
    base = ramp(height, (26, 23, 18), (126, 116, 96))
    base += shade(height, 96)[:, :, None]
    speck = fbm(SIZE, 130, 2, rng)
    base += ((speck > 0.68) * 30)[:, :, None]
    base -= ((speck < 0.24) * 24)[:, :, None]
    seams = np.exp(-(((second - nearest) / 0.9) ** 2)) * 20
    base -= seams[:, :, None]
    return to_rgb(base)


def leather(rng):
    nearest, second = cellular(SIZE, 620, rng)
    plateau = np.clip(normalize(second - nearest) * 2.6, 0, 1)
    plateau = plateau**0.7
    creases = fbm(SIZE, 5, 4, rng)
    fine = fbm(SIZE, 120, 2, rng)
    height = normalize(plateau * 0.62 + creases * 0.24 + fine * 0.14)
    base = ramp(height, (28, 16, 8), (114, 76, 44))
    base += shade(height, 66)[:, :, None]
    wear = fbm(SIZE, 8, 3, rng)
    base += ((wear - 0.5) * 30)[:, :, None]
    return to_rgb(base)


def parchment(rng):
    fibre = fbm(SIZE, 60, 3, rng)
    blotch = fbm(SIZE, 6, 4, rng)
    height = normalize(fibre * 0.35 + blotch * 0.65)
    base = ramp(height, (128, 108, 78), (196, 176, 138))
    base += shade(height, 26)[:, :, None]
    stains = (fbm(SIZE, 4, 3, rng) < 0.34) * 18
    base -= stains[:, :, None] * np.array([0.7, 0.85, 1.0])[None, None, :]
    return to_rgb(base)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, maker, seed in (
        ("oak", oak, 11),
        ("stone", stone, 23),
        ("leather", leather, 37),
        ("parchment", parchment, 53),
    ):
        write_png(OUT / f"{name}.png", maker(np.random.default_rng(seed)))
        print(f"wrote {name}.png")


if __name__ == "__main__":
    main()

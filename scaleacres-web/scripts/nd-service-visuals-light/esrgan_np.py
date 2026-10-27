"""Real-ESRGAN realesr-general-x4v3 (SRVGGNetCompact) inference in NumPy, no PyTorch.
Usage: python3 esrgan_np.py weights.pth in_dir out_dir"""
import pickle, sys, zipfile, os, glob
import numpy as np
from PIL import Image


def load_pth(path):
    z = zipfile.ZipFile(path)
    root = [n for n in z.namelist() if n.endswith("data.pkl")][0].rsplit("/", 1)[0]

    class Storage:
        def __init__(self, key, dtype):
            self.key, self.dtype = key, dtype

    def rebuild(storage, offset, size, stride, *a):
        buf = np.frombuffer(z.read(f"{root}/data/{storage.key}"), dtype=storage.dtype)
        n = int(np.prod(size)) if size else 1
        arr = buf[offset:offset + n] if all(stride[i] >= stride[i + 1] for i in range(len(stride) - 1)) else None
        if arr is None:
            arr = np.lib.stride_tricks.as_strided(buf[offset:], size, [s * buf.itemsize for s in stride]).copy()
        return arr.reshape(size).astype(np.float32)

    class U(pickle.Unpickler):
        def find_class(self, mod, name):
            if name == "_rebuild_tensor_v2":
                return rebuild
            if name == "FloatStorage":
                return np.float32
            if mod == "collections" and name == "OrderedDict":
                import collections
                return collections.OrderedDict
            if mod.startswith("torch"):
                return lambda *a, **k: None
            return super().find_class(mod, name)

        def persistent_load(self, pid):
            _, typ, key, _loc, _n = pid
            return Storage(key, np.float32)

    sd = U(z.open(f"{root}/data.pkl")).load()
    return sd.get("params", sd)


def conv3(x, w, b):
    # x: C,H,W ; w: O,C,3,3 -> O,H,W  (padding 1) via im2col + matmul
    C, H, W = x.shape
    xp = np.pad(x, ((0, 0), (1, 1), (1, 1)), mode="reflect" if False else "constant")
    cols = np.empty((C, 9, H, W), np.float32)
    k = 0
    for dy in range(3):
        for dx in range(3):
            cols[:, k] = xp[:, dy:dy + H, dx:dx + W]
            k += 1
    out = w.reshape(w.shape[0], -1) @ cols.reshape(C * 9, H * W)
    return out.reshape(-1, H, W) + b[:, None, None]


def prelu(x, a):
    return np.where(x > 0, x, x * a[:, None, None])


def run(sd, img):
    x = np.asarray(img, np.float32).transpose(2, 0, 1) / 255.0
    keys = sorted({k.split(".")[1] for k in sd if k.startswith("body.")}, key=int)
    h = x
    i = 0
    while i < len(keys):
        k = keys[i]
        h = conv3(h, sd[f"body.{k}.weight"], sd[f"body.{k}.bias"])
        if i + 1 < len(keys) and f"body.{keys[i+1]}.weight" in sd and sd[f"body.{keys[i+1]}.weight"].ndim == 1:
            h = prelu(h, sd[f"body.{keys[i+1]}.weight"])
            i += 2
        else:
            i += 1
    r = 4
    C, H, W = h.shape
    h = h.reshape(3, r, r, H, W).transpose(0, 3, 1, 4, 2).reshape(3, H * r, W * r)
    base = x.repeat(r, axis=1).repeat(r, axis=2)
    out = np.clip(h + base, 0, 1)
    return Image.fromarray((out.transpose(1, 2, 0) * 255 + 0.5).astype(np.uint8))


def tiled(sd, img, tile=96, pad=8):
    W, H = img.size
    out = Image.new("RGB", (W * 4, H * 4))
    for y in range(0, H, tile):
        for x in range(0, W, tile):
            x0, y0 = max(0, x - pad), max(0, y - pad)
            x1, y1 = min(W, x + tile + pad), min(H, y + tile + pad)
            up = run(sd, img.crop((x0, y0, x1, y1)))
            cx, cy = (x - x0) * 4, (y - y0) * 4
            w, h = (min(x + tile, W) - x) * 4, (min(y + tile, H) - y) * 4
            out.paste(up.crop((cx, cy, cx + w, cy + h)), (x * 4, y * 4))
    return out


if __name__ == "__main__":
    sd = load_pth(sys.argv[1])
    os.makedirs(sys.argv[3], exist_ok=True)
    files = sorted(glob.glob(os.path.join(sys.argv[2], "*")))
    only = set(sys.argv[4:])
    for f in files:
        n = os.path.splitext(os.path.basename(f))[0]
        if only and n not in only:
            continue
        im = Image.open(f).convert("RGB")
        tiled(sd, im).save(os.path.join(sys.argv[3], n + ".png"))
        print(n, im.size, flush=True)

"""Shared helpers for the Section 05 cover scenes (Blender 5.2 / Cycles, run with the `bpy` module).

Every client asset is used as an unmodified image texture: screens are emissive at strength 1 under
the Khronos PBR Neutral view transform (so UI colours stay true), print is lit like paper or vinyl.
Geometry, materials and light are procedural; no stock imagery or generated pictures.
"""
import math
import os
import sys

import bpy
import bmesh
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")


def arg(name, default):
    """--name=value after `--` on the command line."""
    for a in sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []:
        if a.startswith(f"--{name}="):
            return type(default)(a.split("=", 1)[1])
    return default


def reset(samples=128):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = arg("samples", samples)
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.015
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.max_bounces = 10
    sc.cycles.glossy_bounces = 6
    sc.cycles.transmission_bounces = 8
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.render.resolution_x = arg("w", 2400)
    sc.render.resolution_y = arg("h", 1500)
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_depth = "8"
    sc.view_settings.view_transform = "Khronos PBR Neutral"
    sc.view_settings.exposure = 0.0
    sc.render.threads_mode = "AUTO"
    return sc


def world_color(rgb, strength=1.0):
    w = bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (*rgb, 1)
    bg.inputs["Strength"].default_value = strength
    return w


def world_sky(elev_deg, rot_deg, strength=1.0, kind="MULTIPLE_SCATTERING", air=1.0, dust=1.0):
    w = bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    nt = w.node_tree
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = kind
    sky.sun_elevation = math.radians(elev_deg)
    sky.sun_rotation = math.radians(rot_deg)
    sky.air_density = air
    sky.aerosol_density = dust
    sky.sun_disc = True
    bg = nt.nodes["Background"]
    bg.inputs["Strength"].default_value = strength
    nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    return w


# ---------------------------------------------------------------- materials

def principled(name, color=(0.8, 0.8, 0.8), rough=0.5, metal=0.0, coat=0.0, coat_rough=0.05, spec=0.5, emit=None, emit_strength=0.0, transmission=0.0, ior=1.45, alpha=1.0):
    m = bpy.data.materials.new(name)
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Coat Roughness"].default_value = coat_rough
    p.inputs["Specular IOR Level"].default_value = spec
    p.inputs["Transmission Weight"].default_value = transmission
    p.inputs["IOR"].default_value = ior
    p.inputs["Alpha"].default_value = alpha
    if emit:
        p.inputs["Emission Color"].default_value = (*emit, 1)
        p.inputs["Emission Strength"].default_value = emit_strength
    return m


def load(path, noncolor=False):
    im = bpy.data.images.load(path, check_existing=True)
    if noncolor:
        im.colorspace_settings.name = "Non-Color"
    return im


def tex(nt, path, interp="Cubic", ext="EXTEND", noncolor=False):
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = load(path, noncolor)
    t.interpolation = interp
    t.extension = ext
    return t


def screen_mat(name, path, strength=1.0, gloss=0.04):
    """An emissive display under glass: exact pixels at strength 1, with a clear reflective coat."""
    m = bpy.data.materials.new(name)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    t = tex(nt, path)
    p.inputs["Base Color"].default_value = (0, 0, 0, 1)
    p.inputs["Roughness"].default_value = 0.5
    p.inputs["Specular IOR Level"].default_value = 0.0
    p.inputs["Coat Weight"].default_value = 1.0
    p.inputs["Coat Roughness"].default_value = gloss
    p.inputs["Coat IOR"].default_value = 1.5
    p.inputs["Emission Strength"].default_value = strength
    nt.links.new(t.outputs["Color"], p.inputs["Emission Color"])
    return m


def print_mat(name, path, rough=0.55, emit=0.0, coat=0.0, sheen=0.0, bump=0.0):
    """Printed artwork (paper, card or vinyl). `emit` adds a little backlight for lightboxes."""
    m = bpy.data.materials.new(name)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    t = tex(nt, path)
    nt.links.new(t.outputs["Color"], p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = rough
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Coat Roughness"].default_value = 0.12
    p.inputs["Sheen Weight"].default_value = sheen
    if emit:
        nt.links.new(t.outputs["Color"], p.inputs["Emission Color"])
        p.inputs["Emission Strength"].default_value = emit
    if bump:
        n = nt.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = 900
        n.inputs["Detail"].default_value = 2
        b = nt.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value = bump
        nt.links.new(n.outputs["Fac"], b.inputs["Height"])
        nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m


def foil_mat(name, logo_path, base=(0.012, 0.012, 0.013), base_rough=0.55, foil_rough=0.22, emboss=0.35, sheen=0.2, fit=(1.0, 1.0)):
    """Soft-touch base with the logo hot-foiled: the logo's own pixels drive a metallic layer, its
    alpha masks it and embosses it slightly."""
    m = bpy.data.materials.new(name)
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    t = tex(nt, logo_path, ext="CLIP")
    if fit != (1.0, 1.0):
        # the plate is `fit` times the logo size: scale UVs about the centre
        uvn = nt.nodes.new("ShaderNodeTexCoord")
        mp = nt.nodes.new("ShaderNodeMapping")
        mp.inputs["Scale"].default_value = (fit[0], fit[1], 1)
        mp.inputs["Location"].default_value = (0.5 - 0.5 * fit[0], 0.5 - 0.5 * fit[1], 0)
        nt.links.new(uvn.outputs["UV"], mp.inputs["Vector"])
        nt.links.new(mp.outputs["Vector"], t.inputs["Vector"])
    a = nt.nodes.new("ShaderNodeBsdfPrincipled")
    a.inputs["Base Color"].default_value = (*base, 1)
    a.inputs["Roughness"].default_value = base_rough
    a.inputs["Sheen Weight"].default_value = sheen
    f = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(t.outputs["Color"], f.inputs["Base Color"])
    f.inputs["Metallic"].default_value = 1.0
    f.inputs["Roughness"].default_value = foil_rough
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(t.outputs["Alpha"], mix.inputs["Fac"])
    nt.links.new(a.outputs["BSDF"], mix.inputs[1])
    nt.links.new(f.outputs["BSDF"], mix.inputs[2])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = emboss
    b.inputs["Distance"].default_value = 0.0004
    nt.links.new(t.outputs["Alpha"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], f.inputs["Normal"])
    nt.links.new(b.outputs["Normal"], a.inputs["Normal"])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return m


def stone_mat(name, base=(0.86, 0.84, 0.8), vein=(0.45, 0.43, 0.4), scale=1.6, rough=0.18, coat=0.4, vein_width=0.04, warp=9.0):
    """Procedural marble/travertine: distorted wave bands for veins over soft cloudy noise."""
    m = bpy.data.materials.new(name)
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    co = nt.nodes.new("ShaderNodeTexCoord")
    w = nt.nodes.new("ShaderNodeTexWave")
    w.wave_type = "BANDS"
    w.inputs["Scale"].default_value = scale
    w.inputs["Distortion"].default_value = warp
    w.inputs["Detail"].default_value = 8
    w.inputs["Detail Scale"].default_value = 1.6
    nt.links.new(co.outputs["Object"], w.inputs["Vector"])
    r = nt.nodes.new("ShaderNodeValToRGB")
    r.color_ramp.elements[0].position = 0.0
    r.color_ramp.elements[0].color = (*vein, 1)
    r.color_ramp.elements[1].position = vein_width
    r.color_ramp.elements[1].color = (*base, 1)
    nt.links.new(w.outputs["Fac"], r.inputs["Fac"])
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale * 2.2
    n.inputs["Detail"].default_value = 6
    nt.links.new(co.outputs["Object"], n.inputs["Vector"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 0.12
    nt.links.new(r.outputs["Color"], sock(mix, "A_Color"))
    nt.links.new(n.outputs["Color"], sock(mix, "B_Color"))
    nt.links.new(sock(mix, "Result_Color", True), p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = rough
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Coat Roughness"].default_value = 0.08
    return m


def sock(node, ident, out=False):
    """Socket by identifier (Mix nodes share display names across float/vector/colour sockets)."""
    for s in (node.outputs if out else node.inputs):
        if s.identifier == ident:
            return s
    raise KeyError(ident)


def assign(obj, *mats):
    # clearing the slots resets polygon material indices, so keep and restore them
    polys = getattr(obj.data, "polygons", [])
    idx = [p.material_index for p in polys]
    obj.data.materials.clear()
    for m in mats:
        obj.data.materials.append(m)
    for p, i in zip(polys, idx):
        p.material_index = i
    return obj


# ---------------------------------------------------------------- geometry

def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def rounded_slab(name, w, h, t, r, seg=10, top_mat=None, side_mat=None, bevel=0.0):
    """Rounded-rectangle slab centred on the origin, top face at z = t. The top face is UV-mapped
    0..1 across the full width/height (so a texture fills it, clipped by the rounded corners);
    material 0 = sides and bottom, material 1 = top."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    r = min(r, w / 2 - 1e-5, h / 2 - 1e-5)
    pts = []
    for cx, cy, a0 in ((w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)):
        for i in range(seg + 1):
            a = math.radians(a0 + 90 * i / seg)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    bot = [bm.verts.new((x, y, 0)) for x, y in pts]
    top = [bm.verts.new((x, y, t)) for x, y in pts]
    ft = bm.faces.new(top)
    ft.material_index = 1
    fb = bm.faces.new(list(reversed(bot)))
    fb.material_index = 0
    n = len(pts)
    for i in range(n):
        f = bm.faces.new((bot[i], bot[(i + 1) % n], top[(i + 1) % n], top[i]))
        f.material_index = 0
        f.smooth = True
    uv = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for lp in f.loops:
            x, y, _ = lp.vert.co
            lp[uv].uv = (x / w + 0.5, y / h + 0.5)
    bm.to_mesh(me)
    bm.free()
    ob = link(bpy.data.objects.new(name, me))
    if bevel:
        mod = ob.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        mod.limit_method = "ANGLE"
        mod.harden_normals = False
    if side_mat or top_mat:
        assign(ob, side_mat or top_mat, top_mat or side_mat)
    return ob


def box(name, sx, sy, sz, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, bevel=0.0, seg=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=[math.radians(a) for a in rot])
    ob = bpy.context.object
    ob.name = name
    ob.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = ob.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = seg
    if mat:
        assign(ob, mat)
    return ob


def plane(name, w, h, loc=(0, 0, 0), rot=(0, 0, 0), mat=None):
    """Plane w × h (UV 0..1), facing +Z before rotation."""
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=[math.radians(a) for a in rot])
    ob = bpy.context.object
    ob.name = name
    ob.scale = (w, h, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        assign(ob, mat)
    return ob


def cyl(name, r, depth, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, verts=64):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=[math.radians(a) for a in rot])
    ob = bpy.context.object
    ob.name = name
    bpy.ops.object.shade_smooth()
    if mat:
        assign(ob, mat)
    return ob


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0)):
    ob = link(bpy.data.objects.new(name, None))
    ob.location = loc
    ob.rotation_euler = [math.radians(a) for a in rot]
    return ob


def parent(child, par):
    child.parent = par
    return child


# ---------------------------------------------------------------- lights + camera

def light(name, kind, loc, energy, color=(1, 1, 1), size=1.0, size_y=None, target=None, rot=None, spot_deg=None, blend=0.3, shadow_soft=None):
    d = bpy.data.lights.new(name, kind)
    d.energy = energy
    d.color = color
    if kind == "AREA":
        d.shape = "RECTANGLE" if size_y else "SQUARE"
        d.size = size
        if size_y:
            d.size_y = size_y
    if kind == "SPOT":
        d.spot_size = math.radians(spot_deg or 45)
        d.spot_blend = blend
        d.shadow_soft_size = size
    if kind == "POINT":
        d.shadow_soft_size = size
    if kind == "SUN":
        d.angle = math.radians(shadow_soft or 1.0)
    ob = link(bpy.data.objects.new(name, d))
    ob.location = loc
    if target is not None:
        aim(ob, target)
    elif rot is not None:
        ob.rotation_euler = [math.radians(a) for a in rot]
    return ob


def aim(ob, target):
    v = Vector(target) - ob.location
    ob.rotation_euler = v.to_track_quat("-Z", "Y").to_euler()


def camera(loc, target, lens=50, fstop=None, focus=None, shift=(0, 0), focus_obj=None):
    d = bpy.data.cameras.new("Camera")
    d.lens = lens
    d.sensor_width = 36
    d.shift_x, d.shift_y = shift
    ob = link(bpy.data.objects.new("Camera", d))
    ob.location = loc
    aim(ob, target)
    if fstop:
        d.dof.use_dof = True
        d.dof.aperture_fstop = fstop
        d.dof.focus_distance = focus if focus else (Vector(target) - Vector(loc)).length
        if focus_obj:
            d.dof.focus_object = focus_obj
    bpy.context.scene.camera = ob
    return ob


def render(name):
    out = arg("out", os.path.join(HERE, "out"))
    os.makedirs(out, exist_ok=True)
    sc = bpy.context.scene
    sc.render.filepath = os.path.join(out, f"{name}.png")
    if arg("blend", 0):
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out, f"{name}.blend"))
    bpy.ops.render.render(write_still=True)
    print("rendered", sc.render.filepath)


# ---------------------------------------------------------------- palms (silhouettes)

_LEAF = {}


def frond_material():
    """Pinnate frond as an alpha texture drawn with PIL (not a photograph)."""
    if "m" in _LEAF:
        return _LEAF["m"]
    import random as _r
    from PIL import Image, ImageDraw, ImageFilter
    path = os.path.join(arg("out", os.path.join(HERE, "out")), "_frond.png")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im = Image.new("RGBA", (1024, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.line([(0, 128), (1024, 128)], fill=(255, 255, 255, 255), width=6)
    for i in range(70):
        x = 20 + i * 14
        L = 115 * math.sin(math.pi * min(1, (x + 60) / 1080)) + 8
        for s in (-1, 1):
            d.line([(x, 128), (x + 46, 128 + s * L)], fill=(255, 255, 255, 255), width=9)
    im.filter(ImageFilter.GaussianBlur(0.6)).save(path)
    leaf = bpy.data.materials.new("frond")
    nt = leaf.node_tree
    p = nt.nodes["Principled BSDF"]
    t = tex(nt, path, ext="CLIP")
    p.inputs["Base Color"].default_value = (0.012, 0.016, 0.008, 1)
    p.inputs["Roughness"].default_value = 1.0
    p.inputs["Specular IOR Level"].default_value = 0.0
    nt.links.new(t.outputs["Alpha"], p.inputs["Alpha"])
    _LEAF["m"] = leaf
    _LEAF["trunk"] = principled("trunk", (0.02, 0.016, 0.012), rough=0.8)
    return leaf


def poly_curve(name, pts, radius, mat):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 3
    sp = cu.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for p, (x, y, z) in zip(sp.points, pts):
        p.co = (x, y, z, 1)
    ob = link(bpy.data.objects.new(name, cu))
    assign(ob, mat)
    return ob


def palm(x, y, h, lean=(0, 0), n=19, size=1.0, rng=None):
    import random as _random
    from mathutils import Matrix
    rnd = rng or _random
    leaf = frond_material()
    pts = [(x + lean[0] * (i / 11) ** 2 * h, y + lean[1] * (i / 11) ** 2 * h, i / 11 * h) for i in range(12)]
    poly_curve(f"trunk{x}_{y}", pts, 0.2 * size, _LEAF["trunk"])
    top = Vector(pts[-1])
    for k in range(n):
        a = 360 * k / n + rnd.uniform(-10, 10)
        droop = rnd.uniform(-38, 4)
        bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=2, size=1)
        fr = bpy.context.object
        fr.name = f"frond{x}_{y}_{k}"
        fr.scale = (3.6 * size, 1.3 * size, 1)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        fr.data.transform(Matrix.Translation((1.8 * size, 0, 0)))
        sag = rnd.uniform(0.07, 0.12) / size
        for v in fr.data.vertices:  # arch and droop, folded along the rib
            v.co.z -= sag * v.co.x ** 2 + 0.35 * abs(v.co.y)
        assign(fr, leaf)
        fr.location = top
        fr.rotation_euler = (math.radians(rnd.uniform(-12, 12)), math.radians(droop), math.radians(a))
    return top

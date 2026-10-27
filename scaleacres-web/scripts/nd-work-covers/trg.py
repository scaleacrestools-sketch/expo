"""TRG — launch campaign. A night launch-event gate restaged in 3D around the genuine TRG launch gate
layout (TRG and TRG The Mall logos on the header), with the genuine "15 Years of Income" creative as
backlit panels on both pillars, a red carpet, uplights and palms."""
import os, sys, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *  # noqa: E402,F403
from PIL import Image

random.seed(400)
reset(160)
OUT = arg("out", os.path.join(HERE, "out"))
os.makedirs(OUT, exist_ok=True)

# logos cut from the genuine creative (unaltered pixels, on its own navy)
post = Image.open(os.path.join(SRC, "trg-post.jpg")).convert("RGB")
TRG_LOGO, MALL_LOGO = os.path.join(OUT, "_trg-logo.png"), os.path.join(OUT, "_trg-mall-logo.png")
post.crop((40, 60, 345, 215)).save(TRG_LOGO)
post.crop((955, 60, 1245, 215)).save(MALL_LOGO)
NAVY_SRGB = (2, 53, 101)
NAVY = tuple(((c / 255 + 0.055) / 1.055) ** 2.4 if c / 255 > 0.04045 else c / 255 / 12.92 for c in NAVY_SRGB)
FLEX = 1.0  # backlight strength shared by the header and the logo panels so they read as one print


# ---- night sky
w = bpy.data.worlds.new("World")
bpy.context.scene.world = w
nt = w.node_tree
co = nt.nodes.new("ShaderNodeTexCoord")
sep = nt.nodes.new("ShaderNodeSeparateXYZ")
nt.links.new(co.outputs["Generated"], sep.inputs["Vector"])
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].color = (0.16, 0.12, 0.2, 1)
ramp.color_ramp.elements[1].position = 0.45
ramp.color_ramp.elements[1].color = (0.006, 0.01, 0.03, 1)
e = ramp.color_ramp.elements.new(0.1)
e.color = (0.05, 0.07, 0.17, 1)
nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
nt.links.new(ramp.outputs["Color"], nt.nodes["Background"].inputs["Color"])
nt.nodes["Background"].inputs["Strength"].default_value = 1.0

# ---- ground: large stone pavers, slightly damp
pave = bpy.data.materials.new("pavers")
pn = pave.node_tree
pp = pn.nodes["Principled BSDF"]
brk = pn.nodes.new("ShaderNodeTexBrick")
brk.inputs["Scale"].default_value = 0.6
brk.inputs["Mortar Size"].default_value = 0.008
brk.inputs["Color1"].default_value = (0.2, 0.18, 0.16, 1)
brk.inputs["Color2"].default_value = (0.16, 0.145, 0.13, 1)
brk.inputs["Mortar"].default_value = (0.05, 0.045, 0.04, 1)
pco = pn.nodes.new("ShaderNodeTexCoord")
pn.links.new(pco.outputs["Object"], brk.inputs["Vector"])
pn.links.new(brk.outputs["Color"], pp.inputs["Base Color"])
pp.inputs["Roughness"].default_value = 0.42
pp.inputs["Coat Weight"].default_value = 0.35
pp.inputs["Coat Roughness"].default_value = 0.18
box("ground", 400, 400, 1, loc=(0, 0, -0.5), mat=pave)

carpet = principled("carpet", (0.2, 0.004, 0.009), rough=0.92)
carpet.node_tree.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = 0.25
box("carpet", 2.6, 40, 0.015, loc=(0, 6, 0.0075), mat=carpet)

# ---- the gate
navy_clad = principled("navy_clad", (0.008, 0.02, 0.055), rough=0.38, metal=0.5)
gold = principled("gold", (0.8, 0.58, 0.28), rough=0.25, metal=1.0)
header_flex = principled("header_flex", NAVY, rough=0.6, emit=NAVY, emit_strength=FLEX)
OPEN, PW, PD, PH = 5.0, 2.5, 1.1, 6.2
for sx in (-1, 1):
    cx = sx * (OPEN / 2 + PW / 2)
    box(f"pillar{sx}", PW, PD, PH, loc=(cx, 0, PH / 2), mat=navy_clad, bevel=0.01)
    box(f"plinth{sx}", PW + 0.2, PD + 0.2, 0.35, loc=(cx, 0, 0.175), mat=gold, bevel=0.01)
    # framed backlit panel with the genuine creative (4:5)
    box(f"frame{sx}", 2.16, 0.06, 2.66, loc=(cx, -PD / 2 - 0.02, 3.35), mat=gold, bevel=0.006)
    plane(f"panel{sx}", 2.0, 2.5, loc=(cx, -PD / 2 - 0.055, 3.35), rot=(90, 0, 0), mat=print_mat(f"trg_panel{sx}", os.path.join(SRC, "trg-post.jpg"), rough=0.5, emit=0.85))
    for z in (1.55, 5.35):
        box(f"trim{sx}{z}", PW, 0.03, 0.03, loc=(cx, -PD / 2 - 0.015, z), mat=gold)
HW = OPEN + 2 * PW + 0.6
box("header", HW, PD + 0.3, 1.7, loc=(0, 0, PH + 0.85), mat=navy_clad, bevel=0.01)
plane("header_face", HW - 0.3, 1.4, loc=(0, -(PD + 0.3) / 2 - 0.01, PH + 0.85), rot=(90, 0, 0), mat=header_flex)
LW = 2.1
plane("logo_trg", LW, LW * 155 / 305, loc=(-HW / 2 + 0.25 + LW / 2 + 0.3, -(PD + 0.3) / 2 - 0.02, PH + 0.85), rot=(90, 0, 0), mat=print_mat("trg_logo", TRG_LOGO, rough=0.6, emit=FLEX))
plane("logo_mall", LW * 290 / 305, LW * 155 / 305, loc=(HW / 2 - 0.25 - LW * 290 / 305 / 2 - 0.3, -(PD + 0.3) / 2 - 0.02, PH + 0.85), rot=(90, 0, 0), mat=print_mat("trg_mall", MALL_LOGO, rough=0.6, emit=FLEX))
for z in (PH + 0.12, PH + 1.58):
    box(f"htrim{z}", HW, 0.03, 0.03, loc=(0, -(PD + 0.3) / 2 - 0.02, z), mat=gold)

# ---- stanchions along the carpet
rope = principled("rope", (0.25, 0.01, 0.015), rough=0.7)
for sx in (-1, 1):
    posts = []
    for i in range(6):
        y = -9.5 + i * 1.9
        x = sx * 1.75
        cyl(f"post{sx}{i}", 0.035, 0.95, loc=(x, y, 0.475), mat=gold, verts=24)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, location=(x, y, 0.98))
        assign(bpy.context.object, gold)
        cyl(f"pbase{sx}{i}", 0.17, 0.03, loc=(x, y, 0.015), mat=gold, verts=32)
        posts.append((x, y))
    for (x1, y1), (x2, y2) in zip(posts, posts[1:]):
        pts = [(x1, y1 + (y2 - y1) * t, 0.9 - 0.22 * math.sin(math.pi * t)) for t in [k / 12 for k in range(13)]]
        poly_curve(f"rope{sx}{y1}", pts, 0.02, rope)

# ---- beyond the gate: a lit pathway with festoon lights and a glowing pavilion
bulb = principled("bulb", (0, 0, 0), emit=(1.0, 0.72, 0.4), emit_strength=30)
wire = principled("wire", (0.01, 0.01, 0.01), rough=0.6)
for row in range(5):
    y = 4 + row * 4.0
    pts = [(-5 + 10 * t, y, 5.4 - 0.9 * math.sin(math.pi * t)) for t in [k / 24 for k in range(25)]]
    poly_curve(f"wire{row}", pts, 0.008, wire)
    for (x, yy, z) in pts[1:-1:2]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(x, yy, z - 0.1), segments=12, ring_count=8)
        assign(bpy.context.object, bulb)
light("pav_glow", "AREA", (0, 44, 4), 900, (1.0, 0.64, 0.36), size=12, target=(0, 0, 1))
hedge = principled("hedge", (0.008, 0.014, 0.006), rough=0.95)
for sx in (-1, 1):
    box(f"hedge{sx}", 12, 1.4, 1.7, loc=(sx * 11.4, 1.2, 0.85), mat=hedge, bevel=0.3)
    box(f"hedgein{sx}", 1.2, 36, 1.3, loc=(sx * 4.2, 22, 0.65), mat=hedge, bevel=0.3)
sil = principled("sil", (0.004, 0.005, 0.01), rough=0.9)
for i in range(70):
    x = random.choice((-1, 1)) * random.uniform(30, 220)
    h = random.uniform(4, 12)
    box(f"far{i}", random.uniform(8, 24), 10, h, loc=(x, random.uniform(140, 220), h / 2), mat=sil)
for i in range(9):  # palms seen through the gate
    palm(random.uniform(-9, 9), random.uniform(40, 60), random.uniform(8, 12), lean=(random.uniform(-0.05, 0.05), 0), size=1.0)

for sx in (-1, 1):
    palm(sx * 8.6, 2.5, 9.5, lean=(sx * 0.04, 0), size=1.0)
    palm(sx * 11.5, 7.0, 11, lean=(-sx * 0.03, 0), size=1.1)
    palm(sx * 7.2, 14.0, 8.5, lean=(sx * 0.02, 0), size=0.95)

# ---- light: warm uplights grazing the pillars, a soft front fill, header downlights
for sx in (-1, 1):
    cx = sx * (OPEN / 2 + PW / 2)
    for dx in (-0.85, 0.85):
        sp = light(f"up{sx}{dx}", "SPOT", (cx + dx, -PD / 2 - 0.55, 0.12), 1100, (1.0, 0.78, 0.5), size=0.05, spot_deg=36, blend=0.5)
        aim(sp, (cx + dx * 0.6, -PD / 2, 5.8))
for x in (-3.5, 0, 3.5):
    sp = light(f"hd{x}", "SPOT", (x, -3.5, 9.8), 900, (1.0, 0.86, 0.7), size=0.3, spot_deg=40, blend=0.6)
    aim(sp, (x * 0.6, 0, PH + 0.85))
light("fill", "AREA", (3, -16, 4), 220, (0.62, 0.7, 1.0), size=8, target=(0, 0, 3))
light("carpet", "AREA", (0, -6, 6), 110, (1.0, 0.8, 0.6), size=4, target=(0, -6, 0))

camera((2.6, -17.0, 1.7), (0.35, 0, 3.8), lens=30)
render("trg-the-mall")

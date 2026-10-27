"""SeaBreeze Villas — brand presentation. The genuine SeaBreeze roll-up and hoarding artwork in a
sales-gallery setting: the roll-up standing on travertine, the hoarding artwork framed on a
lime-plaster wall, late sun casting palm shadows.

Both artworks are cut from the ScaleAcres profile (p. 19, 614 × 345 px pages), perspective-corrected
and enlarged 4× with Lanczos only (no AI). Replace them with the original print files when supplied."""
import os, sys, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *  # noqa: E402,F403

random.seed(19)
reset(160)
world_color((0.55, 0.5, 0.45), 0.25)
SB = os.path.join(SRC, "seabreeze")
GREEN = (0.012, 0.06, 0.04)  # SeaBreeze brand green, for the frame and standee base cap

# ---- room: travertine floor, lime-plaster wall
floor = bpy.data.materials.new("travertine_floor")
fn = floor.node_tree
fp = fn.nodes["Principled BSDF"]
brk = fn.nodes.new("ShaderNodeTexBrick")
brk.inputs["Scale"].default_value = 0.8
brk.inputs["Mortar Size"].default_value = 0.004
brk.inputs["Color1"].default_value = (0.62, 0.55, 0.46, 1)
brk.inputs["Color2"].default_value = (0.58, 0.51, 0.42, 1)
brk.inputs["Mortar"].default_value = (0.42, 0.37, 0.3, 1)
fco = fn.nodes.new("ShaderNodeTexCoord")
fn.links.new(fco.outputs["Object"], brk.inputs["Vector"])
fn.links.new(brk.outputs["Color"], fp.inputs["Base Color"])
fp.inputs["Roughness"].default_value = 0.35
fp.inputs["Coat Weight"].default_value = 0.2
box("floor", 20, 20, 0.1, loc=(0, 0, -0.05), mat=floor)

plaster = principled("plaster", (0.78, 0.74, 0.68), rough=0.85)
pn = plaster.node_tree
nz = pn.nodes.new("ShaderNodeTexNoise")
nz.inputs["Scale"].default_value = 18
nz.inputs["Detail"].default_value = 10
bm = pn.nodes.new("ShaderNodeBump")
bm.inputs["Strength"].default_value = 0.12
pn.links.new(nz.outputs["Fac"], bm.inputs["Height"])
pn.links.new(bm.outputs["Normal"], pn.nodes["Principled BSDF"].inputs["Normal"])
box("wall", 14, 0.2, 5, loc=(0, 2.4, 2.5), mat=plaster)

# ---- framed hoarding artwork on the wall (genuine, 256 × 96 source ratio)
frame = principled("frame", GREEN, rough=0.45)
AW, AH = 3.2, 3.2 * 96 / 256
box("art_frame", AW + 0.1, 0.05, AH + 0.1, loc=(0.55, 2.27, 1.75), mat=frame, bevel=0.004)
plane("art", AW, AH, loc=(0.55, 2.243, 1.75), rot=(90, 0, 0), mat=print_mat("sb_hoarding", os.path.join(SB, "hoarding.png"), rough=0.55, coat=0.05))

# ---- roll-up standee (genuine, 94 × 229 source ratio)
alu = principled("alu", (0.75, 0.75, 0.76), rough=0.25, metal=1.0)
RW, RH = 0.85, 0.85 * 229 / 94
S = empty("standee", (-1.05, 0.55, 0), (0, 0, 16))
parent(box("base", RW + 0.08, 0.2, 0.09, loc=(0, 0, 0.045), mat=alu, bevel=0.02), S)
parent(cyl("pole", 0.009, RH + 0.05, loc=(0, 0.06, (RH + 0.05) / 2 + 0.05), mat=alu, verts=16), S)
parent(box("topbar", RW + 0.02, 0.025, 0.025, loc=(0, -0.005, RH + 0.09), mat=alu), S)
parent(plane("banner", RW, RH, loc=(0, -0.03, RH / 2 + 0.085), rot=(90, 0, 0), mat=print_mat("sb_rollup", os.path.join(SB, "rollup.png"), rough=0.55, sheen=0.05)), S)
parent(plane("banner_back", RW, RH, loc=(0, -0.026, RH / 2 + 0.085), rot=(-90, 0, 0), mat=principled("bback", (0.8, 0.8, 0.78), rough=0.7)), S)

# a low travertine bench and a ceramic pot for scale
box("bench", 1.6, 0.42, 0.42, loc=(1.6, 1.5, 0.21), mat=stone_mat("bench", base=(0.7, 0.64, 0.56), vein=(0.67, 0.61, 0.53), scale=0.8, rough=0.4, vein_width=0.02, warp=1.0), bevel=0.01)
cyl("pot", 0.2, 0.55, loc=(-2.0, 1.75, 0.275), mat=principled("pot", (0.55, 0.45, 0.36), rough=0.7))

# ---- sun through palm fronds, warm late afternoon
SUN = Vector((-0.7, -0.45, 0.55)).normalized()
for i in range(16):
    t = Vector((random.uniform(-2.5, 2.8), random.uniform(1.6, 2.2), random.uniform(1.0, 3.6))) + SUN * random.uniform(1.6, 2.4)
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=2, size=1)
    fr = bpy.context.object
    fr.scale = (2.2, 0.7, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    for v in fr.data.vertices:
        v.co.z -= 0.12 * v.co.x ** 2
    assign(fr, frond_material())
    fr.location = t
    fr.rotation_euler = (math.radians(random.uniform(40, 110)), math.radians(random.uniform(-30, 30)), math.radians(random.uniform(0, 180)))
    fr.visible_camera = False
sun = light("sun", "SUN", (0, 0, 5), 4.0, (1.0, 0.8, 0.58), shadow_soft=0.7)
aim(sun, tuple(Vector((0, 0, 5)) - SUN))
light("fill", "AREA", (1.5, -4.0, 2.2), 260, (0.9, 0.92, 1.0), size=3.5, target=(0, 1.0, 1.2))

camera((1.35, -3.6, 1.25), (-0.15, 1.2, 1.25), lens=32, fstop=5.6, focus_obj=bpy.data.objects["banner"])
render("seabreeze-villas")

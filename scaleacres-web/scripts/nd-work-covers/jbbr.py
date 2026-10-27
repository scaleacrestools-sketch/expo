"""JBBR Group — brand identity. The genuine JBBR logo hot-foiled on a black presentation box, folder and
business cards, with the genuine "We don't just hand over keys" creative as a satin art print, on
travertine in low window light."""
import os, sys, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *  # noqa: E402,F403
from mathutils import Matrix

random.seed(2003)
reset(160)
world_color((0.05, 0.038, 0.028), 1.0)
LOGO = os.path.join(SRC, "jbbr-logo.png")
LR = 834 / 1095  # logo height / width

travertine = stone_mat("travertine", base=(0.66, 0.57, 0.46), vein=(0.6, 0.51, 0.4), scale=0.9, rough=0.32, coat=0.25, vein_width=0.02, warp=1.5)
soft_black = principled("soft_black", (0.012, 0.012, 0.013), rough=0.55)
soft_black.node_tree.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = 0.2
edge_black = principled("edge_black", (0.02, 0.02, 0.021), rough=0.5)
brass = principled("brass", (0.78, 0.56, 0.3), rough=0.22, metal=1.0)
paper_edge = principled("paper_edge", (0.85, 0.82, 0.76), rough=0.7)

box("table", 2.4, 1.6, 0.04, loc=(0, 0.2, -0.02), mat=travertine)


def foil_plate(name, pw, ph, logo_w, z, par, offset=(0, 0)):
    """A plate covering a whole pw × ph face at height z, with the logo (logo_w wide) foiled at its centre."""
    m = foil_mat(f"foil_{name}", LOGO, fit=(pw / logo_w, ph / (logo_w * LR)))
    return parent(plane(name, pw, ph, loc=(offset[0], offset[1], z), mat=m), par)


# ---- presentation box: base + overhanging lid, logo foiled on the lid
B = empty("box", (-0.15, 0.06, 0), (0, 0, 17))
parent(box("box_base", 0.296, 0.236, 0.05, loc=(0, 0, 0.025), mat=soft_black, bevel=0.0015), B)
parent(box("box_lid", 0.302, 0.242, 0.03, loc=(0, 0, 0.0615), mat=soft_black, bevel=0.002), B)
foil_plate("box_logo", 0.298, 0.238, 0.15, 0.0766, B)

# ---- folder with the art print on top
F = empty("folder", (0.15, 0.07, 0), (0, 0, -9))
parent(box("folder", 0.225, 0.305, 0.008, loc=(0, 0, 0.004), mat=soft_black, bevel=0.0012), F)
P = empty("print", (0.165, 0.045, 0.0082), (0, 0, -15))
parent(box("print_card", 0.2, 0.25, 0.0012, loc=(0, 0, 0.0006), mat=paper_edge), P)
parent(plane("print_face", 0.2, 0.25, loc=(0, 0, 0.00125), mat=print_mat("jbbr_print", os.path.join(SRC, "jbbr-post.jpg"), rough=0.42, coat=0.08, sheen=0.1, bump=0.02)), P)


# ---- business cards: a loose stack and one card face-up
for i in range(6):
    c = empty(f"cardp{i}", (-0.035 + random.uniform(-0.002, 0.002), -0.185 + random.uniform(-0.002, 0.002), i * 0.00045), (0, 0, 32 + random.uniform(-2.5, 2.5)))
    parent(box(f"card{i}", 0.09, 0.055, 0.00042, loc=(0, 0, 0.00021), mat=soft_black), c)
foil_plate("card_logo_top", 0.0896, 0.0546, 0.042, 0.00044, c)
c2 = empty("card_loose", (0.075, -0.175, 0), (0, 0, -21))
parent(box("card_l", 0.09, 0.055, 0.00042, loc=(0, 0, 0.00021), mat=soft_black), c2)
foil_plate("card_logo2", 0.0896, 0.0546, 0.042, 0.00044, c2)

# ---- a brass key
K = empty("key", (-0.06, -0.075, 0.0034), (0, 0, 196))
bpy.ops.mesh.primitive_torus_add(major_radius=0.016, minor_radius=0.0032, location=(0, 0, 0))
parent(assign(bpy.context.object, brass), K)
bpy.ops.object.shade_smooth()
parent(cyl("shaft", 0.0027, 0.06, loc=(0.048, 0, 0), rot=(0, 90, 0), mat=brass, verts=24), K)
parent(box("bit1", 0.007, 0.012, 0.0045, loc=(0.068, -0.007, 0), mat=brass), K)
parent(box("bit2", 0.005, 0.008, 0.0045, loc=(0.058, -0.005, 0), mat=brass), K)
parent(cyl("collar", 0.0042, 0.004, loc=(0.02, 0, 0), rot=(0, 90, 0), mat=brass, verts=24), K)

# ---- window gobo + leaves between the sun and the table
SUN = Vector((-0.75, 0.55, 0.42)).normalized()
G = empty("gobo", tuple(SUN * 1.6), (0, 0, 0))
aim(G, (0, 0, 0))
mull = principled("mull", (0, 0, 0), rough=1)
for i in range(-3, 4):
    parent(box(f"mv{i}", 0.024, 3.0, 0.035, loc=(i * 0.34, 0, 0), mat=mull), G)
for j in range(-3, 4):
    parent(box(f"mh{j}", 3.0, 0.028, 0.035, loc=(0, j * 0.42, 0), mat=mull), G)
# leaf sprays (simple ellipses) in front of one pane for organic shadow
leafm = principled("leaf", (0, 0, 0), rough=1)
for i in range(26):
    bpy.ops.mesh.primitive_circle_add(vertices=16, radius=0.045, fill_type="NGON", location=(0.42 + random.uniform(-0.25, 0.25), 0.25 + random.uniform(-0.3, 0.3), 0.05))
    lf = bpy.context.object
    lf.scale = (2.6, 0.75, 1)
    lf.rotation_euler = (0, 0, random.uniform(0, 3.14))
    assign(lf, leafm)
    parent(lf, G)
sun = light("sun", "SUN", (0, 0, 3), 5.5, (1.0, 0.76, 0.52), shadow_soft=0.6)
aim(sun, tuple(Vector((0, 0, 3)) - SUN))
light("fill", "AREA", (0.35, -0.9, 0.7), 9, (0.95, 0.88, 0.8), size=1.6, target=(0, 0, 0))
light("bounce", "AREA", (-0.2, 0.9, 0.35), 3, (1.0, 0.8, 0.6), size=1.2, target=(0, 0, 0))

camera((0.17, -0.73, 0.67), (0.015, 0.005, 0.0), lens=48, fstop=5.0, focus_obj=bpy.data.objects["box_logo"])
render("jbbr-group")

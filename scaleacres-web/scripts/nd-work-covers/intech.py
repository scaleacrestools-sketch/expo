"""Intech Developers — website design. The live Intech site (built by ScaleAcres) on a laptop and a
phone, on a marble table at dusk in front of a slatted-wood interior."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *  # noqa: E402,F403

reset(160)
world_color((0.018, 0.016, 0.016), 1.0)

# ---- materials
alu = principled("alu", (0.16, 0.16, 0.17), rough=0.3, metal=1.0)
alu_dark = principled("alu_dark", (0.07, 0.07, 0.075), rough=0.42, metal=1.0)
key = principled("key", (0.012, 0.012, 0.013), rough=0.45)
glass_black = principled("glass_black", (0.004, 0.004, 0.005), rough=0.08, coat=1.0, coat_rough=0.02)
pad = principled("pad", (0.15, 0.15, 0.16), rough=0.22, metal=0.6)
marble = stone_mat("marble", base=(0.6, 0.59, 0.575), vein=(0.47, 0.46, 0.45), scale=1.1, rough=0.14, coat=0.5, vein_width=0.012, warp=4.0)
walnut = principled("walnut", (0.055, 0.03, 0.017), rough=0.45, coat=0.25, coat_rough=0.3)
wall = principled("wall", (0.02, 0.018, 0.017), rough=0.8)
ceramic = principled("ceramic", (0.02, 0.02, 0.022), rough=0.32, coat=0.6, coat_rough=0.12)
coffee = principled("coffee", (0.03, 0.012, 0.004), rough=0.05)
titanium = principled("titanium", (0.42, 0.4, 0.37), rough=0.28, metal=1.0)
stand_mat = principled("stand", (0.03, 0.03, 0.03), rough=0.5)

# ---- table + room
box("table", 3.0, 1.6, 0.04, loc=(0, 0.35, -0.02), mat=marble)
box("wall", 6, 0.05, 3, loc=(0, 1.32, 1.4), mat=wall)
for i in range(70):
    x = -2.2 + i * 0.062
    box(f"slat{i}", 0.038, 0.035, 2.6, loc=(x, 1.27, 1.3), mat=walnut)
# warm cove light along the top of the slats (far out of focus)
plane("cove", 5, 0.03, loc=(0, 1.22, 2.55), rot=(90, 0, 0), mat=principled("cove", (0, 0, 0), emit=(1.0, 0.62, 0.32), emit_strength=18))

# ---- laptop (14" class, open ~105°)
L = empty("laptop", (-0.07, 0.04, 0), (0, 0, 9))
base = parent(rounded_slab("base", 0.312, 0.221, 0.0145, 0.012, side_mat=alu, top_mat=alu, bevel=0.0018), L)
well = parent(rounded_slab("well", 0.29, 0.112, 0.0003, 0.004, side_mat=alu_dark, top_mat=alu_dark), L)
well.location = (0, 0.039, 0.0143)
for r in range(5):
    for c in range(14):
        k = parent(rounded_slab(f"k{r}{c}", 0.0162, 0.0158, 0.0011, 0.0022, side_mat=key, top_mat=key), L)
        k.location = (-0.1222 + c * 0.0188, 0.0805 - r * 0.0198, 0.0141)
sp = parent(rounded_slab("space", 0.092, 0.0158, 0.0011, 0.0022, side_mat=key, top_mat=key), L)
sp.location = (0, 0.0805 - 5 * 0.0198, 0.0141)
tp = parent(rounded_slab("trackpad", 0.128, 0.078, 0.0002, 0.006, side_mat=pad, top_mat=pad), L)
tp.location = (0, -0.058, 0.0145)

H = parent(empty("hinge", (0, 0.1105, 0.0145), (-14, 0, 0)), L)
lid = parent(rounded_slab("lid", 0.312, 0.215, 0.0055, 0.012, side_mat=alu, top_mat=alu, bevel=0.0012), H)
lid.rotation_euler = (math.radians(90), 0, 0)
lid.location = (0, 0.0055, 0.1085)
bez = parent(rounded_slab("bezel", 0.304, 0.209, 0.0004, 0.009, side_mat=glass_black, top_mat=glass_black), H)
bez.rotation_euler = (math.radians(90), 0, 0)
bez.location = (0, 0.0, 0.1085)
scr = parent(plane("screen", 0.2848, 0.178, rot=(90, 0, 0), mat=screen_mat("intech_desktop", os.path.join(SRC, "intech-web-desktop.png"))), H)
scr.location = (0, -0.0006, 0.1115)

# ---- phone on a low stand, leaning back 14°
P = empty("phone", (0.25, -0.03, 0), (0, 0, -16))
ph = parent(empty("phone_tilt", (0, 0.004, 0.0735), (76, 0, 0)), P)
body = parent(rounded_slab("body", 0.0712, 0.1494, 0.0082, 0.0112, side_mat=titanium, top_mat=glass_black, bevel=0.0011), ph)
body.location = (0, 0, -0.0041)
pscr = parent(rounded_slab("pscreen", 0.0672, 0.1454, 0.00015, 0.0088, side_mat=glass_black, top_mat=screen_mat("intech_mobile", os.path.join(SRC, "intech-web-mobile.png"))), ph)
pscr.location = (0, 0, 0.0041)
isl = parent(rounded_slab("island", 0.019, 0.0056, 0.0001, 0.0028, side_mat=glass_black, top_mat=glass_black), ph)
isl.location = (0, 0.0727 - 0.0075, 0.00428)
parent(box("stand_back", 0.05, 0.012, 0.06, loc=(0, 0.03, 0.03), rot=(-14, 0, 0), mat=stand_mat, bevel=0.002), P)
parent(box("stand_lip", 0.062, 0.03, 0.006, loc=(0, -0.006, 0.003), mat=stand_mat, bevel=0.0015), P)

# ---- mug
cyl("mug", 0.04, 0.094, loc=(-0.33, 0.2, 0.047), mat=ceramic)
cyl("coffee", 0.036, 0.002, loc=(-0.33, 0.2, 0.088), mat=coffee)
bpy.ops.mesh.primitive_torus_add(major_radius=0.024, minor_radius=0.0055, location=(-0.372, 0.2, 0.05), rotation=(math.radians(90), 0, 0))
assign(bpy.context.object, ceramic)
bpy.ops.object.shade_smooth()

# ---- light: warm dusk from the window side, a soft cool fill, a rim from behind right
light("key", "AREA", (-1.15, 0.55, 0.85), 38, (1.0, 0.7, 0.45), size=1.3, target=(-0.05, 0.05, 0.08))
light("rim", "AREA", (0.95, 0.95, 0.55), 14, (1.0, 0.82, 0.62), size=0.9, target=(0.1, 0.0, 0.1))
light("fill", "AREA", (0.35, -1.3, 0.9), 5, (0.82, 0.88, 1.0), size=2.2, target=(0, 0.05, 0.1))

camera((0.36, -0.86, 0.36), (0.07, 0.045, 0.11), lens=55, fstop=5.6, focus_obj=scr)
render("intech-developers")

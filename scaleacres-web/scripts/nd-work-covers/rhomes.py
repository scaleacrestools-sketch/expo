"""Rhomes Miraabilis — social media campaign. Genuine Miraabilis reels on two phones and the campaign
posts as printed cards on limestone, in daylight with palm-leaf shadows.

Sources are cut from the ScaleAcres profile (pp. 21–22), whose pages are 614 × 345 px, and enlarged
4× with Real-ESRGAN (src/rhomes/*). Replace them with the original 1080 px exports when supplied."""
import os, sys, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *  # noqa: E402,F403

random.seed(4)
reset(160)
world_color((0.62, 0.6, 0.58), 0.22)
R = os.path.join(SRC, "rhomes")

lime = stone_mat("limestone", base=(0.74, 0.72, 0.68), vein=(0.68, 0.66, 0.62), scale=1.4, rough=0.62, coat=0.05, vein_width=0.04, warp=2.0)
box("table", 2.4, 1.6, 0.04, loc=(0, 0.2, -0.02), mat=lime)
paper = principled("paper", (0.88, 0.87, 0.85), rough=0.75)
glass_black = principled("glass_black", (0.004, 0.004, 0.005), rough=0.08, coat=1.0, coat_rough=0.02)
titanium = principled("titanium", (0.5, 0.48, 0.45), rough=0.3, metal=1.0)


def phone(name, img, loc, yaw):
    P = empty(name, loc, (0, 0, yaw))
    body = parent(rounded_slab(f"{name}_body", 0.0712, 0.1494, 0.0082, 0.0112, side_mat=titanium, top_mat=glass_black, bevel=0.0011), P)
    scr = parent(rounded_slab(f"{name}_scr", 0.0672, 0.1454, 0.00015, 0.0088, side_mat=glass_black, top_mat=screen_mat(f"{name}_screen", img)), P)
    scr.location = (0, 0, 0.0082)
    return P, scr


def card(name, img, loc, yaw, w=0.088, ratio=119 / 102, z=0.0):
    C = empty(name, (loc[0], loc[1], z), (0, 0, yaw))
    parent(box(f"{name}_stock", w, w * ratio, 0.0009, loc=(0, 0, 0.00045), mat=paper), C)
    parent(plane(f"{name}_face", w, w * ratio, loc=(0, 0, 0.00092), mat=print_mat(f"{name}_print", img, rough=0.5, coat=0.06, sheen=0.05)), C)
    return C


PA, scrA = phone("phoneA", os.path.join(R, "reel-miraabilis.png"), (-0.125, -0.012, 0), 11)
phone("phoneB", os.path.join(R, "reel-kayaking.png"), (0.245, -0.03, 0), -14)
card("c1", os.path.join(R, "post-great-moves.png"), (-0.02, 0.068), -7)
card("c2", os.path.join(R, "post-chess.png"), (0.075, 0.062), 6, z=0.0011)
card("c3", os.path.join(R, "post-la-fioreza-signature.png"), (0.168, 0.078), -9)
card("c4", os.path.join(R, "post-la-fioreza-interior.png"), (0.012, -0.062), 10, z=0.0)
card("c5", os.path.join(R, "post-la-fioreza-social.png"), (0.11, -0.058), -4, z=0.0011)

# palm fronds between the sun and the table cast the leaf shadows
SUN = Vector((-0.6, 0.35, 0.72)).normalized()
for i in range(11):
    t = Vector((random.uniform(-0.2, 0.3), random.uniform(-0.12, 0.16), 0)) + SUN * random.uniform(0.55, 0.9)
    palm_top = t
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=2, size=1)
    fr = bpy.context.object
    fr.scale = (0.9, 0.32, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    for v in fr.data.vertices:
        v.co.z -= 0.25 * v.co.x ** 2
    assign(fr, frond_material())
    fr.location = palm_top
    fr.rotation_euler = (math.radians(random.uniform(-20, 20)), math.radians(random.uniform(-15, 15)), math.radians(random.uniform(0, 180)))
    fr.visible_camera = False
sun = light("sun", "SUN", (0, 0, 3), 3.0, (1.0, 0.93, 0.84), shadow_soft=0.9)
aim(sun, tuple(Vector((0, 0, 3)) - SUN))
light("fill", "AREA", (0.3, -0.8, 0.8), 14, (0.9, 0.93, 1.0), size=1.6, target=(0, 0, 0))

camera((0.06, -0.42, 0.53), (0.06, 0.006, 0.0), lens=52, fstop=6.3, focus_obj=scrA)
render("rhomes")

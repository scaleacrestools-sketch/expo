"""SID Realtech — outdoor branding. The genuine Ellington 86 launch creative on a lit portrait hoarding
at sunset, low angle, with a procedural skyline, palms and highway light trails."""
import os, sys, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *  # noqa: E402,F403

random.seed(86)
reset(160)
SUN_DIR = Vector((0.55, 1.0, 0.035)).normalized()  # low sun, ahead and to the right, behind the skyline


def sunset_sky():
    """Hand-built dusk sky: warm horizon to deep blue zenith, a sun glow and faint stratus."""
    w = bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    nt = w.node_tree
    bg = nt.nodes["Background"]
    co = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(co.outputs["Generated"], sep.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    cr = ramp.color_ramp
    cr.elements[0].position = 0.0
    cr.elements[0].color = (1.0, 0.42, 0.16, 1)
    cr.elements[1].position = 0.5
    cr.elements[1].color = (0.05, 0.08, 0.2, 1)
    for pos, col in ((0.05, (0.95, 0.5, 0.26, 1)), (0.14, (0.62, 0.42, 0.42, 1)), (0.27, (0.22, 0.27, 0.45, 1))):
        e = cr.elements.new(pos)
        e.color = col
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    dot = nt.nodes.new("ShaderNodeVectorMath")
    dot.operation = "DOT_PRODUCT"
    dot.inputs[1].default_value = SUN_DIR
    nt.links.new(co.outputs["Generated"], dot.inputs[0])
    glow = nt.nodes.new("ShaderNodeMapRange")
    glow.inputs["From Min"].default_value = 0.86
    glow.inputs["From Max"].default_value = 1.0
    glow.interpolation_type = "SMOOTHERSTEP"
    nt.links.new(dot.outputs["Value"], glow.inputs["Value"])
    pw = nt.nodes.new("ShaderNodeMath")
    pw.operation = "POWER"
    pw.inputs[1].default_value = 3.0
    nt.links.new(glow.outputs["Result"], pw.inputs[0])
    add = nt.nodes.new("ShaderNodeMix")
    add.data_type = "RGBA"
    add.blend_type = "ADD"
    sock(add, "B_Color").default_value = (2.4, 1.05, 0.4, 1)
    nt.links.new(pw.outputs["Value"], add.inputs["Factor"])
    nt.links.new(ramp.outputs["Color"], sock(add, "A_Color"))
    # stratus: stretched noise, only near the horizon
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1.0, 1.0, 9.0)
    nt.links.new(co.outputs["Generated"], mp.inputs["Vector"])
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 2.6
    nz.inputs["Detail"].default_value = 6
    nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
    cl = nt.nodes.new("ShaderNodeMapRange")
    cl.inputs["From Min"].default_value = 0.52
    cl.inputs["From Max"].default_value = 0.72
    nt.links.new(nz.outputs["Fac"], cl.inputs["Value"])
    band = nt.nodes.new("ShaderNodeMapRange")
    band.inputs["From Min"].default_value = 0.2
    band.inputs["From Max"].default_value = 0.04
    nt.links.new(sep.outputs["Z"], band.inputs["Value"])
    m2 = nt.nodes.new("ShaderNodeMath")
    m2.operation = "MULTIPLY"
    nt.links.new(cl.outputs["Result"], m2.inputs[0])
    nt.links.new(band.outputs["Result"], m2.inputs[1])
    m3 = nt.nodes.new("ShaderNodeMath")
    m3.operation = "MULTIPLY"
    m3.inputs[1].default_value = 0.55
    nt.links.new(m2.outputs["Value"], m3.inputs[0])
    cloud = nt.nodes.new("ShaderNodeMix")
    cloud.data_type = "RGBA"
    sock(cloud, "B_Color").default_value = (0.42, 0.2, 0.17, 1)
    nt.links.new(m3.outputs["Value"], cloud.inputs["Factor"])
    nt.links.new(sock(add, "Result_Color", True), sock(cloud, "A_Color"))
    nt.links.new(sock(cloud, "Result_Color", True), bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 1.0


sunset_sky()

HAZE = (0.62, 0.42, 0.42)


def hazed(name, color, rough=0.4, metal=0.0, start=300.0, end=1600.0, amount=0.3, windows=False):
    """A facade that fades into the sunset haze with distance (cheap aerial perspective)."""
    m = principled(name, color, rough=rough, metal=metal)
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    p = nt.nodes["Principled BSDF"]
    if windows:
        co = nt.nodes.new("ShaderNodeTexCoord")
        br = nt.nodes.new("ShaderNodeTexBrick")
        br.inputs["Scale"].default_value = 0.18
        br.inputs["Brick Width"].default_value = 0.6
        br.inputs["Row Height"].default_value = 0.5
        br.inputs["Mortar Size"].default_value = 0.16
        br.inputs["Color1"].default_value = (1.0, 0.7, 0.42, 1)
        br.inputs["Color2"].default_value = (0, 0, 0, 1)
        br.inputs["Mortar"].default_value = (0, 0, 0, 1)
        br.offset = 0.0
        nt.links.new(co.outputs["Object"], br.inputs["Vector"])
        nz = nt.nodes.new("ShaderNodeTexWhiteNoise")
        nz.noise_dimensions = "3D"
        nt.links.new(co.outputs["Object"], nz.inputs["Vector"])
        gt = nt.nodes.new("ShaderNodeMath")
        gt.operation = "GREATER_THAN"
        gt.inputs[1].default_value = 0.9
        mul = nt.nodes.new("ShaderNodeMix")
        mul.data_type = "RGBA"
        mul.blend_type = "MULTIPLY"
        mul.inputs["Factor"].default_value = 1.0
        snap = nt.nodes.new("ShaderNodeVectorMath")
        snap.operation = "SNAP"
        snap.inputs[1].default_value = (3.33, 3.33, 2.78)
        nt.links.new(co.outputs["Object"], snap.inputs[0])
        nt.links.new(snap.outputs["Vector"], nz.inputs["Vector"])
        nt.links.new(nz.outputs["Value"], gt.inputs[0])
        nt.links.new(br.outputs["Color"], sock(mul, "A_Color"))
        nt.links.new(gt.outputs["Value"], sock(mul, "B_Color"))
        nt.links.new(sock(mul, "Result_Color", True), p.inputs["Emission Color"])
        p.inputs["Emission Strength"].default_value = 2.2
    cam = nt.nodes.new("ShaderNodeCameraData")
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = start
    mr.inputs["From Max"].default_value = end
    mr.inputs["To Max"].default_value = amount
    nt.links.new(cam.outputs["View Distance"], mr.inputs["Value"])
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*HAZE, 1)
    em.inputs["Strength"].default_value = 0.45
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(mr.outputs["Result"], mix.inputs["Fac"])
    nt.links.new(p.outputs["BSDF"], mix.inputs[1])
    nt.links.new(em.outputs["Emission"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return m


curve = poly_curve


# ---- ground, road, light trails
grass = principled("grass", (0.014, 0.016, 0.009), rough=0.95)
gn = grass.node_tree
_nz = gn.nodes.new("ShaderNodeTexNoise")
_nz.inputs["Scale"].default_value = 0.15
_nz.inputs["Detail"].default_value = 8
_rp = gn.nodes.new("ShaderNodeValToRGB")
_rp.color_ramp.elements[0].color = (0.006, 0.007, 0.005, 1)
_rp.color_ramp.elements[1].color = (0.03, 0.03, 0.018, 1)
gn.links.new(_nz.outputs["Fac"], _rp.inputs["Fac"])
gn.links.new(_rp.outputs["Color"], gn.nodes["Principled BSDF"].inputs["Base Color"])
box("ground", 2000, 2000, 1, loc=(0, 0, -0.5), mat=grass)
road = principled("asphalt", (0.018, 0.018, 0.02), rough=0.55, coat=0.15, coat_rough=0.35)
import mathutils
RD = Vector((0.8, 0.6, 0)).normalized()
R0 = Vector((-53, -14.0, 0))  # sweeps in behind the hoarding, then recedes toward the skyline
road_rot = math.degrees(math.atan2(RD.x, RD.y))
box("road", 16, 900, 0.05, loc=(R0.x + RD.x * 440, R0.y + RD.y * 440, 0.0), rot=(0, 0, -road_rot), mat=road)
red = principled("tail", (0, 0, 0), emit=(1.0, 0.07, 0.03), emit_strength=9)
white = principled("head", (0, 0, 0), emit=(1.0, 0.8, 0.55), emit_strength=12)
side = Vector((RD.y, -RD.x, 0))
for lane, (off, m, zz) in enumerate([(-6.5, white, 0.72), (-4.0, white, 0.85), (3.6, red, 0.7), (6.2, red, 0.62), (-1.5, white, 0.6)]):
    base = R0 + side * off
    pts = [tuple(base + RD * d + Vector((0, 0, zz + 0.04 * math.sin(d * 0.2 + lane)))) for d in range(0, 700, 4)]
    curve(f"trail{lane}", pts, 0.018, m)
for i in range(40):
    d = 40 + i * 16
    pos = R0 + RD * d - side * 9.0
    cyl(f"lp{i}", 0.08, 9, loc=(pos.x, pos.y, 4.5), mat=principled("lpole", (0.02, 0.02, 0.02), rough=0.5))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(pos.x + side.x * 1.2, pos.y + side.y * 1.2, 8.9))
    assign(bpy.context.object, principled("lbulb", (0, 0, 0), emit=(1.0, 0.7, 0.4), emit_strength=12))

# ---- skyline (procedural towers, aerial haze by distance)
glass = hazed("tower", (0.012, 0.014, 0.022), rough=0.12, metal=0.55, windows=True)
for i in range(140):
    x = random.uniform(-60, 700)
    y = random.uniform(330, 1150)
    w = random.uniform(16, 38)
    h = random.uniform(30, 115) * (1.7 if random.random() < 0.18 else 1)
    box(f"tw{i}", w, random.uniform(16, 36), h, loc=(x, y, h / 2), mat=glass)

palm(-13.5, 9, 12.5, lean=(0.06, 0.02), size=1.25)
palm(-17.5, 15, 10.5, lean=(-0.05, 0.0), size=1.1)
palm(-10.5, 20, 8.5, lean=(0.04, 0.0), size=0.95)
palm(26, 38, 12, lean=(0.06, 0.0))
palm(32, 52, 13.5, lean=(-0.04, 0.0), size=1.05)
palm(40, 70, 11, lean=(0.03, 0.0))

# ---- the hoarding: 6.4 × 8 m portrait face on a steel unipole with catwalk and lamps
HB = empty("hoarding", (-3.2, 15.0, 0), (0, 0, -18))
FW, FH, BOT = 6.4, 8.0, 6.0
steel = principled("steel", (0.05, 0.052, 0.055), rough=0.45, metal=0.85)
parent(cyl("pole", 0.42, BOT + 0.5, loc=(0, 0.6, (BOT + 0.5) / 2), mat=steel), HB)
parent(box("frame", FW + 0.42, 0.42, FH + 0.42, loc=(0, 0.25, BOT + FH / 2), mat=steel, bevel=0.03), HB)
face = parent(plane("face", FW, FH, loc=(0, 0.035, BOT + FH / 2), rot=(90, 0, 0), mat=print_mat("sid_flex", os.path.join(SRC, "sid-post.jpg"), rough=0.6, emit=0.5)), HB)
face.scale = (1, 1, 1)
parent(box("catwalk", FW + 0.4, 1.1, 0.08, loc=(0, -0.45, BOT - 0.35), mat=steel), HB)
for i in range(9):
    parent(box(f"rail{i}", 0.04, 0.04, 0.9, loc=(-FW / 2 + i * FW / 8, -0.98, BOT + 0.1), mat=steel), HB)
parent(box("railtop", FW + 0.4, 0.05, 0.05, loc=(0, -0.98, BOT + 0.55), mat=steel), HB)
lamp_face = principled("lampface", (0, 0, 0), emit=(1.0, 0.86, 0.66), emit_strength=60)
for i, lx in enumerate((-2.4, -0.8, 0.8, 2.4)):
    parent(box(f"arm{i}", 0.06, 1.6, 0.06, loc=(lx, -1.35, BOT - 0.3), rot=(-20, 0, 0), mat=steel), HB)
    head = parent(box(f"lamp{i}", 0.5, 0.22, 0.12, loc=(lx, -2.1, BOT - 0.05), rot=(-38, 0, 0), mat=steel, bevel=0.01), HB)
    parent(plane(f"lampglass{i}", 0.42, 0.16, loc=(lx, -2.04, BOT + 0.03), rot=(52, 0, 0), mat=lamp_face), HB)
    sp = light(f"spot{i}", "SPOT", (0, 0, 0), 2600, (1.0, 0.86, 0.68), size=0.15, spot_deg=70, blend=0.6)
    parent(sp, HB)
    sp.location = (lx, -2.2, BOT + 0.05)
    sp.rotation_euler = Vector((0, 2.25, 4.2)).to_track_quat("-Z", "Y").to_euler()

# ---- sun
sun = light("sun", "SUN", (0, 0, 50), 1.6, (1.0, 0.55, 0.3), shadow_soft=1.2)
aim(sun, tuple(Vector((0, 0, 50)) - SUN_DIR))

camera((5.0, -10.0, 2.2), (0.6, 15, 8.3), lens=34)
render("sid-realtech")

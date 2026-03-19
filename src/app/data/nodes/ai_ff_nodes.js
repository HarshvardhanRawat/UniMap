export const navigationNodes = [

  // ─── MAIN CORRIDOR (horizontal, y≈104.37) ────────────────────────────────
  { id: "FF_Corridor01", name: "FF Corridor Node 01", map: "AI_FF", x: 49.32,    y: 104.3704, type: "corridor" },
  { id: "FF_Corridor02", name: "FF Corridor Node 02", map: "AI_FF", x: 87.9231,  y: 104.3704, type: "corridor" },
  { id: "FF_Corridor03", name: "FF Corridor Node 03", map: "AI_FF", x: 128.28,   y: 104.3704, type: "corridor" },
  { id: "FF_Corridor04", name: "FF Corridor Node 04", map: "AI_FF", x: 130.9722, y: 104.3704, type: "corridor" },
  { id: "FF_Corridor05", name: "FF Corridor Node 05", map: "AI_FF", x: 282.12,   y: 104.3704, type: "corridor" },
  { id: "FF_Corridor06", name: "FF Corridor Node 06", map: "AI_FF", x: 419.52,   y: 104.22,   type: "corridor" },
  { id: "FF_Corridor07", name: "FF Corridor Node 07", map: "AI_FF", x: 495.12,   y: 104.3704, type: "corridor" },
  { id: "FF_Corridor08", name: "FF Corridor Node 08", map: "AI_FF", x: 539.4,    y: 104.22,   type: "corridor" },
  { id: "FF_Corridor09", name: "FF Corridor Node 09", map: "AI_FF", x: 557.88,   y: 104.22,   type: "corridor" },
  { id: "FF_Corridor10", name: "FF Corridor Node 10", map: "AI_FF", x: 586.907,  y: 104.3704, type: "corridor" },
  { id: "FF_Corridor11", name: "FF Corridor Node 11", map: "AI_FF", x: 645.1461, y: 104.3704, type: "corridor" },

  // ─── VERTICAL SPUR (x≈645.15, north-south) ────────────────────────────────
  { id: "FF_Corridor12", name: "FF Corridor Node 12 (North)",  map: "AI_FF", x: 645.1461, y: 56.3052,  type: "corridor" },
  { id: "FF_Corridor13", name: "FF Corridor Node 13 (South1)", map: "AI_FF", x: 645.1461, y: 116.64,   type: "corridor" },
  { id: "FF_Corridor14", name: "FF Corridor Node 14 (South2)", map: "AI_FF", x: 645.1461, y: 127.1259, type: "corridor" },
  { id: "FF_Corridor15", name: "FF Corridor Node 15 (South3)", map: "AI_FF", x: 645.1461, y: 140.8709, type: "corridor" },
  { id: "FF_Corridor16", name: "FF Corridor Node 16 (South4)", map: "AI_FF", x: 645.1461, y: 150.9008, type: "corridor" },

  // ─── STAIRS & LIFT ────────────────────────────────────────────────────────
  {
    id: "AI_FF_Stairs01", name: "Stairs 01", map: "AI_FF",
    x: 495.12, y: 92.52, type: "stairs",
    connects_to: { map: "AI_GF", node: "AI_GF_Stairs01" }
  },
  {
    id: "AI_FF_Stairs02", name: "Stairs 02", map: "AI_FF",
    x: 130.9722, y: 92.4356, type: "stairs",
    connects_to: { map: "AI_GF", node: "AI_GF_Stairs02" }
  },
  {
    id: "AI_FF_Elevator", name: "Elevator", map: "AI_FF",
    x: 419.76, y: 91.8, type: "lift",
    connects_to: { map: "AI_GF", node: "AI_GF_Elevator" }
  },

  // ─── ROOMS ────────────────────────────────────────────────────────────────
  { id: "room_AI_FF_M101",   name: "M101",           map: "AI_FF", x: 539.4,    y: 91.8,     type: "room" },
  { id: "room_AI_FF_M102",   name: "M102",           map: "AI_FF", x: 419.28,   y: 116.64,   type: "room" },
  { id: "room_AI_FF_M103",   name: "M103",           map: "AI_FF", x: 282.12,   y: 116.64,   type: "room" },
  { id: "room_AI_FF_M104",   name: "M104",           map: "AI_FF", x: 281.16,   y: 91.8,     type: "room" },
  { id: "room_AI_FF_M105",   name: "M105",           map: "AI_FF", x: 128.28,   y: 116.64,   type: "room" },
  { id: "room_AI_FF_MaleWC", name: "Male Washroom",  map: "AI_FF", x: 87.9231,  y: 85.653,   type: "room" },
  { id: "room_AI_FF_FemWC",  name: "Female Washroom",map: "AI_FF", x: 50.4287,  y: 85.653,   type: "room" },

  // ─── TEACHER CABINS ───────────────────────────────────────────────────────
  { id: "cabin_AI_FF_Dr_Archana_Prerna",   name: "Dr. Archana Acharya / Dr. Prerna Mishra", map: "AI_FF", x: 557.88,   y: 116.64,   type: "room" },
  { id: "cabin_AI_FF_Dr_Rajni_HOD_AI",     name: "Dr. Rajni Ranjan Singh – HOD AI",         map: "AI_FF", x: 586.547,  y: 116.64,   type: "room" },
  { id: "cabin_AI_FF_Dr_Neeraj_Mishra",    name: "Dr. Neeraj Mishra",                        map: "AI_FF", x: 629.82,   y: 140.8709, type: "room" },
  { id: "cabin_AI_FF_Dr_Tej_Singh",        name: "Dr. Tej Singh",                            map: "AI_FF", x: 629.82,   y: 151.1614, type: "room" },
  { id: "cabin_AI_FF_Dr_Pawan_Dubey",      name: "Dr. Pawan Dubey",                          map: "AI_FF", x: 635.2318, y: 157.3922, type: "room" },
  { id: "cabin_AI_FF_Dr_Bhagat_Raghuwanshi", name: "Dr. Bhagat S. Raghuwanshi",             map: "AI_FF", x: 658.6461, y: 127.1259, type: "room" },
  { id: "cabin_AI_FF_Dr_Hardev_Pal",       name: "Dr. Hardev Singh Pal",                     map: "AI_FF", x: 658.6461, y: 116.64,   type: "room" },
  { id: "cabin_AI_FF_Shubha_Mishra",       name: "Shubha Mishra",                            map: "AI_FF", x: 658.6461, y: 56.3052,  type: "room" },
  { id: "cabin_AI_FF_Dr_Anu_Sayal",        name: "Dr. Anu Sayal",                            map: "AI_FF", x: 635.2318, y: 50.8558,  type: "room" },
]

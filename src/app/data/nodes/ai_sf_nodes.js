export const navigationNodes = [

  // ─── MAIN CORRIDOR (horizontal, y≈102.81) ────────────────────────────────
  { id: "SF_Corridor01", name: "SF Corridor Node 01", map: "AI_SF", x: 49.7009,  y: 102.8052, type: "corridor" },
  { id: "SF_Corridor02", name: "SF Corridor Node 02", map: "AI_SF", x: 88.5065,  y: 102.8052, type: "corridor" },
  { id: "SF_Corridor03", name: "SF Corridor Node 03", map: "AI_SF", x: 129.6659, y: 102.8052, type: "corridor" },
  { id: "SF_Corridor04", name: "SF Corridor Node 04", map: "AI_SF", x: 282.0182, y: 102.8052, type: "corridor" },
  { id: "SF_Corridor05", name: "SF Corridor Node 05", map: "AI_SF", x: 350.8748, y: 102.8052, type: "corridor" },
  { id: "SF_Corridor06", name: "SF Corridor Node 06", map: "AI_SF", x: 373.1791, y: 102.8052, type: "corridor" },
  { id: "SF_Corridor07", name: "SF Corridor Node 07", map: "AI_SF", x: 397.8313, y: 102.8052, type: "corridor" },
  { id: "SF_Corridor08", name: "SF Corridor Node 08", map: "AI_SF", x: 419.4,    y: 102.8052, type: "corridor" },
  { id: "SF_Corridor09", name: "SF Corridor Node 09", map: "AI_SF", x: 495.12,   y: 102.8052, type: "corridor" },
  { id: "SF_Corridor10", name: "SF Corridor Node 10", map: "AI_SF", x: 558.0,    y: 102.8052, type: "corridor" },
  { id: "SF_Corridor11", name: "SF Corridor Node 11", map: "AI_SF", x: 643.4402, y: 102.8052, type: "corridor" },

  // ─── VERTICAL SPUR (x≈643.5, north-south) ────────────────────────────────
  { id: "SF_Corridor12", name: "SF Corridor Node 12 (North)",  map: "AI_SF", x: 643.9617, y: 56.5009,  type: "corridor" },
  { id: "SF_Corridor13", name: "SF Corridor Node 13 (South)",  map: "AI_SF", x: 643.4402, y: 146.9273, type: "corridor" },

  // ─── STAIRS & LIFT ────────────────────────────────────────────────────────
  {
    id: "AI_SF_Stairs01", name: "Stairs 01", map: "AI_SF",
    x: 495.12, y: 92.52, type: "stairs",
    connects_to: { map: "AI_FF", node: "AI_FF_Stairs01" }
  },
  {
    id: "AI_SF_Stairs02", name: "Stairs 02", map: "AI_SF",
    x: 131.28, y: 92.52, type: "stairs",
    connects_to: { map: "AI_FF", node: "AI_FF_Stairs02" }
  },
  {
    id: "AI_SF_Elevator", name: "Elevator", map: "AI_SF",
    x: 419.76, y: 91.8, type: "lift",
    connects_to: { map: "AI_FF", node: "AI_FF_Elevator" }
  },

  // ─── ROOMS ────────────────────────────────────────────────────────────────
  { id: "room_AI_SF_M201",   name: "M201",            map: "AI_SF", x: 558.0,    y: 91.8,     type: "room" },
  { id: "room_AI_SF_M202",   name: "M202",            map: "AI_SF", x: 419.4,    y: 116.64,   type: "room" },
  { id: "room_AI_SF_M203",   name: "M203",            map: "AI_SF", x: 282.24,   y: 116.64,   type: "room" },
  { id: "room_AI_SF_M204",   name: "M204",            map: "AI_SF", x: 281.16,   y: 91.92,    type: "room" },
  { id: "room_AI_SF_M205",   name: "M205",            map: "AI_SF", x: 128.28,   y: 116.64,   type: "room" },
  { id: "room_AI_SF_MaleWC", name: "Male Washroom",   map: "AI_SF", x: 88.5065,  y: 84.5443,  type: "room" },
  { id: "room_AI_SF_FemWC",  name: "Female Washroom", map: "AI_SF", x: 50.2187,  y: 85.1965,  type: "room" },

  // ─── TEACHER CABINS ───────────────────────────────────────────────────────
  { id: "cabin_AI_SF_Dr_Abhishek_HOD_CST",    name: "Dr. Abhishek Dixit – HOD Centre of CST", map: "AI_SF", x: 558.0,    y: 116.64,   type: "room" },
  { id: "cabin_AI_SF_Dr_Atul_Chauhan",         name: "Dr. Atul Chauhan",                       map: "AI_SF", x: 350.8748, y: 92.7617,  type: "room" },
  { id: "cabin_AI_SF_Dr_Priyanka_Garg",        name: "Dr. Priyanka Garg",                      map: "AI_SF", x: 397.8313, y: 92.7617,  type: "room" },
  { id: "cabin_AI_SF_Dr_Manjree_ProVC",        name: "Dr. Manjree Pandit – Pro Vice-Chancellor",map: "AI_SF", x: 373.1791, y: 115.1965, type: "room" },
  { id: "cabin_AI_SF_Dr_Sumit_Dhariwal",       name: "Dr. Sumit Dhariwal",                     map: "AI_SF", x: 630.0704, y: 141.2183, type: "room" },
  { id: "cabin_AI_SF_Dr_Sunil_Shukla",         name: "Dr. Sunil Kumar Shukla",                 map: "AI_SF", x: 630.0704, y: 151.4128, type: "room" },
  { id: "cabin_AI_SF_Dr_Nandkishor_Joshi",     name: "Dr. Nandkishor Joshi",                   map: "AI_SF", x: 635.942,  y: 156.5346, type: "room" },
  { id: "cabin_AI_SF_Dr_Vibha_Tiwari",         name: "Dr. Vibha Tiwari",                       map: "AI_SF", x: 659.2129, y: 56.9314,  type: "room" },
  { id: "cabin_AI_SF_Ramnaresh_Sharma",        name: "Ramnaresh Sharma",                       map: "AI_SF", x: 635.942,  y: 51.2183,  type: "room" },
]

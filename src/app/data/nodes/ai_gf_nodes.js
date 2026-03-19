export const navigationNodes = [

  // ─── MAIN CORRIDOR (horizontal, y≈273.39) ────────────────────────────────
  { id: "GF_Corridor01", name: "GF Corridor Node 01", map: "AI_GF", x: 142.4783, y: 273.3913, type: "corridor" },
  { id: "GF_Corridor02", name: "GF Corridor Node 02", map: "AI_GF", x: 180.9997, y: 273.3913, type: "corridor" },
  { id: "GF_Corridor03", name: "GF Corridor Node 03", map: "AI_GF", x: 223.3882, y: 273.3913, type: "corridor" },
  { id: "GF_Corridor04", name: "GF Corridor Node 04", map: "AI_GF", x: 311.6522, y: 273.3913, type: "corridor" },
  { id: "GF_Corridor05", name: "GF Corridor Node 05", map: "AI_GF", x: 375.1739, y: 273.3913, type: "corridor" },
  { id: "GF_Corridor06", name: "GF Corridor Node 06", map: "AI_GF", x: 452.913,  y: 273.3913, type: "corridor" },
  { id: "GF_Corridor07", name: "GF Corridor Node 07", map: "AI_GF", x: 513.05,   y: 273.3913, type: "corridor" },
  { id: "GF_Corridor08", name: "GF Corridor Node 08", map: "AI_GF", x: 588.8,    y: 273.3913, type: "corridor" },
  { id: "GF_Corridor09", name: "GF Corridor Node 09", map: "AI_GF", x: 632.96,   y: 273.3913, type: "corridor" },
  { id: "GF_Corridor10", name: "GF Corridor Node 10", map: "AI_GF", x: 651.2711, y: 273.3913, type: "corridor" },
  { id: "GF_Corridor11", name: "GF Corridor Node 11", map: "AI_GF", x: 680.36,   y: 273.3913, type: "corridor" },
  { id: "GF_Corridor12", name: "GF Corridor Node 12", map: "AI_GF", x: 738.7446, y: 273.3913, type: "corridor" },

  // ─── VERTICAL SPUR (x≈738.7, north-south) ────────────────────────────────
  { id: "GF_Corridor13", name: "GF Corridor Node 13 (North)",  map: "AI_GF", x: 738.6957, y: 225.1304, type: "corridor" },
  { id: "GF_Corridor14", name: "GF Corridor Node 14 (South1)", map: "AI_GF", x: 738.6957, y: 295.8859, type: "corridor" },
  { id: "GF_Corridor15", name: "GF Corridor Node 15 (South2)", map: "AI_GF", x: 738.5,    y: 319.7564, type: "corridor" },

  // ─── STAIRS & LIFT ────────────────────────────────────────────────────────
  {
    id: "AI_GF_Stairs01", name: "Stairs 01", map: "AI_GF",
    x: 588.8, y: 260.56, type: "stairs",
    connects_to: { map: "AI_FF", node: "AI_FF_Stairs01" }
  },
  {
    id: "AI_GF_Stairs02", name: "Stairs 02", map: "AI_GF",
    x: 225.0024, y: 260.7065, type: "stairs",
    connects_to: { map: "AI_FF", node: "AI_FF_Stairs02" }
  },
  {
    id: "AI_GF_Elevator", name: "Elevator", map: "AI_GF",
    x: 513.3532, y: 260.56, type: "lift",
    connects_to: { map: "AI_FF", node: "AI_FF_Elevator" }
  },

  // ─── BUILDING ENTRY ───────────────────────────────────────────────────────
  {
    id: "ai_entry_gf", name: "AI Building Entry", map: "AI_GF",
    x: 451.1359, y: 361.7772, type: "entry",
    connects_to: { map: "Campus_Map", node: "AiBuilding_Entry" }
  },

  // ─── ROOMS ────────────────────────────────────────────────────────────────
  { id: "room_AI_GF_M001",   name: "M001",              map: "AI_GF", x: 633.08,  y: 260.56,  type: "room" },
  { id: "room_AI_GF_M003",   name: "M003",              map: "AI_GF", x: 375.8,   y: 285.4,   type: "room" },
  { id: "room_AI_GF_M003b",  name: "M002",       map: "AI_GF", x: 512.96,  y: 285.4,   type: "room" },
  { id: "room_AI_GF_M004",   name: "M004",              map: "AI_GF", x: 374.587, y: 260.2826, type: "room" },
  { id: "room_AI_GF_M005",   name: "M005",              map: "AI_GF", x: 221.7741, y: 285.2209, type: "room" },
  { id: "room_AI_GF_M007",   name: "M007 – CIoT Lab",   map: "AI_GF", x: 651.397, y: 285.4979, type: "room" },
  { id: "room_AI_GF_MaleWC", name: "Male Washroom",     map: "AI_GF", x: 181.2801, y: 253.96,  type: "room" },
  { id: "room_AI_GF_FemWC",  name: "Female Washroom",   map: "AI_GF", x: 143.48,  y: 253.96,  type: "room" },

  // ─── TEACHER CABINS ───────────────────────────────────────────────────────
  { id: "cabin_AI_GF_Dr_Praveen_Bansal",    name: "Dr. Praveen Bansal – HOD CIoT",            map: "AI_GF", x: 680.36,  y: 285.4,   type: "room" },
  { id: "cabin_AI_GF_Dr_Kaushal_Sengar",    name: "Dr. Kaushal Pratap Sengar",                map: "AI_GF", x: 723.6691, y: 320.3082, type: "room" },
  { id: "cabin_AI_GF_Dr_Bhavna_Rathore",   name: "Dr. Bhavna Rathore",                       map: "AI_GF", x: 753.2538, y: 295.8859, type: "room" },
  { id: "cabin_AI_GF_Dr_Murli_Manohar",    name: "Dr. Murli Manohar",                        map: "AI_GF", x: 753.2538, y: 224.7811, type: "room" },
  { id: "cabin_AI_GF_Dr_Dhananjay_Aditya", name: "Dr. Dhananjay Bisen / Dr. Aditya Dubey",  map: "AI_GF", x: 728.5467, y: 220.2832, type: "room" },
]

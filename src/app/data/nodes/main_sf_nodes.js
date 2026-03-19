export const navigationNodes = [

  // ─── CORRIDOR 23 (main horizontal, y≈149.0) ──────────────────────────────────
  { id: "Corridor23_01", name: "Corridor 23 Node 01", map: "Main_SF", x: 711.6032, y: 293.2684, type: "corridor" },
  { id: "Corridor23_02", name: "Corridor 23 Node 02", map: "Main_SF", x: 711.5543, y: 232.6326, type: "corridor" },
  { id: "Corridor23_03", name: "Corridor 23 Node 03", map: "Main_SF", x: 711.4891, y: 201.4913, type: "corridor" },
  { id: "Corridor23_04", name: "Corridor 23 Node 04", map: "Main_SF", x: 711.5502, y: 149.0239, type: "corridor" },
  { id: "Corridor23_05", name: "Corridor 23 Node 05", map: "Main_SF", x: 706.9239, y: 149.0239, type: "corridor" },
  { id: "Corridor23_06", name: "Corridor 23 Node 06", map: "Main_SF", x: 677.3478, y: 149.0239, type: "corridor" },
  { id: "Corridor23_07", name: "Corridor 23 Node 07", map: "Main_SF", x: 659.9347, y: 149.0239, type: "corridor" },
  { id: "Corridor23_08", name: "Corridor 23 Node 08", map: "Main_SF", x: 629.6739, y: 149.0239, type: "corridor" },
  { id: "Corridor23_09", name: "Corridor 23 Node 09", map: "Main_SF", x: 607.8913, y: 149.0239, type: "corridor" },
  { id: "Corridor23_10", name: "Corridor 23 Node 10", map: "Main_SF", x: 563.0217, y: 149.1186, type: "corridor" },
  { id: "Corridor23_11", name: "Corridor 23 Node 11", map: "Main_SF", x: 511.3695, y: 148.9348, type: "corridor" },
  { id: "Corridor23_12", name: "Corridor 23 Node 12", map: "Main_SF", x: 453.0326, y: 149.0239, type: "corridor" },
  { id: "Corridor23_13", name: "Corridor 23 Node 13", map: "Main_SF", x: 386.6739, y: 281.138,  type: "corridor" },
  { id: "Corridor23_14", name: "Corridor 23 Node 14", map: "Main_SF", x: 386.6739, y: 188.8181, type: "corridor" },
  { id: "Corridor23_15", name: "Corridor 23 Node 15", map: "Main_SF", x: 386.6739, y: 230.4586, type: "corridor" },
  { id: "Corridor23_16", name: "Corridor 23 Node 16", map: "Main_SF", x: 386.6739, y: 149.2239, type: "corridor" },
  { id: "Corridor23_17", name: "Corridor 23 Node 17", map: "Main_SF", x: 373.2174, y: 148.8883, type: "corridor" },
  { id: "Corridor23_18", name: "Corridor 23 Node 18", map: "Main_SF", x: 357.2608, y: 149.0239, type: "corridor" },
  { id: "Corridor23_19", name: "Corridor 23 Node 19", map: "Main_SF", x: 349.7608, y: 149.2847, type: "corridor" },
  { id: "Corridor23_20", name: "Corridor 23 Node 20", map: "Main_SF", x: 345.9782, y: 149.2239, type: "corridor" },
  { id: "Corridor23_21", name: "Corridor 23 Node 21", map: "Main_SF", x: 334.3695, y: 149.1543, type: "corridor" },
  { id: "Corridor23_22", name: "Corridor 23 Node 22", map: "Main_SF", x: 298.5,    y: 149.0239, type: "corridor" },
  { id: "Corridor23_23", name: "Corridor 23 Node 23", map: "Main_SF", x: 219.0652, y: 149.0239, type: "corridor" },
  { id: "Corridor23_24", name: "Corridor 23 Node 24", map: "Main_SF", x: 67.6304,  y: 149.0301, type: "corridor" },
  { id: "Corridor23_25", name: "Corridor 23 Node 25", map: "Main_SF", x: 27.7174,  y: 148.9031, type: "corridor" },

  // ─── STAIRS ───────────────────────────────────────────────────────────────────
  {
    id: "Stair04_SF", name: "Stair 04", map: "Main_SF",
    x: 28.0434, y: 130.5021, type: "stairs",
    connects_to: { map: "Main_FF", node: "Stair04" }
  },
  {
    id: "Stair05_SF", name: "Stair 05", map: "Main_SF",
    x: 707.2826, y: 136.1108, type: "stairs",
    connects_to: { map: "Main_FF", node: "Stair05" }
  },

  // ─── ROOM NODES ───────────────────────────────────────────────────────────────
  { id: "room_J201",  name: "Exam Room J201",         map: "Main_SF", x: 67.4347,  y: 136.1108, type: "room" },
  { id: "room_J202",  name: "Communication Lab J202",  map: "Main_SF", x: 219.2608, y: 135.85,   type: "room" },
  { id: "room_J203",  name: "J203 (Dr. Nidhi Saxena)", map: "Main_SF", x: 298.5652, y: 135.7195, type: "room" },
  { id: "room_J204",  name: "Project Lab J204",        map: "Main_SF", x: 376.1087, y: 230.4586, type: "room" },
  { id: "room_J205",  name: "J205",                   map: "Main_SF", x: 386.6739, y: 346.2413, type: "room" },
  { id: "room_J206",  name: "J206",                   map: "Main_SF", x: 511.6304, y: 135.4586, type: "room" },
  { id: "room_J208",  name: "Computer Lab J208",       map: "Main_SF", x: 702.3056, y: 232.5918, type: "room" },
  { id: "room_J209",  name: "J209",                   map: "Main_SF", x: 711.5502, y: 345.5681, type: "room" },
  { id: "room_FemaleWashroom_SF", name: "Female Washroom", map: "Main_SF", x: 563.2218, y: 136.1108, type: "room" },

  // ─── CORRIDOR 23 EAST WING – ET DEPT (x≈629–711, y≈136–162) ─────────────────

  { id: "cabin_Dr_Vandana_HOD_ET",        name: "Dr. Vandana Vikas Thakare – HOD Dept. of ET",               map: "Main_SF", x: 629.6739, y: 136.1108, type: "room" },
  { id: "cabin_Dr_Yogesh_Himanshu",        name: "Dr. Yogesh Kumar & Dr. Himanshu Singh",                    map: "Main_SF", x: 608.413,  y: 136.1108, type: "room" },
  { id: "cabin_Prof_DK_Parsediya",         name: "Prof. D. K. Parsediya (NSS)",                              map: "Main_SF", x: 677.2826, y: 162.0673, type: "room" },
  { id: "cabin_Prof_Pooja_Sahoo",          name: "Prof. Pooja Sahoo",                                        map: "Main_SF", x: 660.326,  y: 162.0673, type: "room" },

  // ─── CORRIDOR 23 CENTRE WEST – ET / CSE DEPT (x≈298–373, y≈99–162) ──────────

  { id: "cabin_Dr_Nidhi_Saxena",           name: "Dr. Nidhi Saxena – J203",                                  map: "Main_SF", x: 298.5652, y: 135.7195, type: "room" },
  { id: "cabin_Dr_Rahul_Dubey_ET",         name: "Dr. Rahul Dubey (ET)",                                     map: "Main_SF", x: 345.7826, y: 124.1108, type: "room" },
  { id: "cabin_Dr_Varun_Sharma",           name: "Dr. Varun Sharma",                                         map: "Main_SF", x: 349.8548, y: 161.676,  type: "room" },
  { id: "cabin_Dr_Deepak_Batham",          name: "Dr. Deepak Batham",                                        map: "Main_SF", x: 334.4199, y: 161.676,  type: "room" },
  { id: "cabin_Dr_Karuna_Markam",          name: "Dr. Karuna Markam",                                        map: "Main_SF", x: 357.2608, y: 99.1652,  type: "room" },
  { id: "cabin_Dr_Shubhi_Kansal",          name: "Dr. Shubhi Kansal",                                        map: "Main_SF", x: 373.2174, y: 98.2847,  type: "room" },

  // ─── CORRIDOR 23 CENTRE – LABS ────────────────────────────────────────────────

  { id: "cabin_Communication_Lab_J202",    name: "Communication Lab – J202",                                 map: "Main_SF", x: 219.2608, y: 135.85,   type: "room" },
  { id: "cabin_Project_Lab_J204",          name: "Project Lab – J204",                                       map: "Main_SF", x: 376.1087, y: 230.4586, type: "room" },
  { id: "cabin_Computer_Lab_J208",         name: "Computer Lab – J208",                                      map: "Main_SF", x: 702.3056, y: 232.5918, type: "room" },

  // ─── CORRIDOR 23 WEST END ─────────────────────────────────────────────────────

  { id: "cabin_Exam_Room_J201",            name: "Exam Room – J201",                                         map: "Main_SF", x: 67.4347,  y: 136.1108, type: "room" },
]

import {
  FaGripHorizontal,
  FaArchive,
  FaLeaf,
  FaHome,
  FaSeedling,
  FaClipboard,
  FaUser,
  FaTree
} from "react-icons/fa";
import ScienceIcon from '@mui/icons-material/Science';
const dashboardData = [
  {
    name: "Areas",
    route: "/areas",
    icon: <FaGripHorizontal className="me-3" />,
  },
  {
    name: "Culture Plans",
    route: "/crops",
    icon: <FaLeaf className="me-3" />,
  },
  {
    name: "Tasks",
    route: "/tasks",
    icon: <FaArchive className="me-3" />,
  },
];

const cropsData = [
  {
    id: 6,
    varieties: "Asparagus plant",
    batchId: "As-20mar",
    seedingDate: "01/04/2023",
    daysSinceSeeding: 21,
    remain: 7,
    qty: 50,
    qtyUnit: "Trays",
    // lastWatering: "-",
    day: 7,
    seeding: 0,
    growing: 777,
    dumped: 0,
  },
  {
    id: 55,
    varieties: "Aloe vera plant",
    batchId: "Al-24mar",
    seedingDate: "15/04/2023",
    daysSinceSeeding: 28,
    remain: 15,
    qty: 100,
    qtyUnit: "Pots",
    // lastWatering: "-",
    day: 15,
    seeding: 0,
    growing: 2,
    dumped: 0,
  },
];
const cultureData = [
  {
    Culture_ID: 1,
    Plant_ID: "Aloe vera",
    Medium: "Murashige and Skoog (MS)",
    Duration_Of_Culture: 28,
    Duration_Of_Bud_Regeneration: 28,
    Duration_Of_Multiply_Bud: 28,
    Duration_Of_Rooting: 28,
    Temperature_Min: 24.0,
    Temperature_Max: 25.0,
    Light_Intensity: "2000-3000",
    Lighting_Time: "8-10"
  },
  {
    Culture_ID: 2,
    Plant_ID: "Asparagus officinalis",
    Medium: "Murashige and Skoog (MS)",
    Duration_Of_Culture: 28,
    Duration_Of_Bud_Regeneration: 28,
    Duration_Of_Multiply_Bud: 28,
    Duration_Of_Rooting: 56,
    Temperature_Min: 24.0,
    Temperature_Max: 25.0,
    Light_Intensity: "2000-3000",
    Lighting_Time: "10-12"
  }
]


  //data for admin user
const adminNavData = [
  {
    name: "Dashboard",
    route: "/",
    icon: <FaHome className="me-3" />,
  },
  {
    name: "Micropropagation",
    route: "/micropropagation",
    icon: <FaSeedling className="me-3" />,
  },
  {
    name: "Areas",
    route: "/areas",
    icon: <FaGripHorizontal className="me-3" />,
  },
  {
    name: "Materials",
    route: "/materials",
    icon: <FaArchive className="me-3" />,
  },
  {
    name: "Crops",
    route: "/crops",
    icon: <FaLeaf className="me-3" />,
  },
  {
    name: "Culture Medium",
    route: "/cultureMediums",
    icon: <ScienceIcon className="me-3" />,
  },
  {
    name: "Plant",
    route: "/plants",
    icon: <FaTree className="me-3" />,
  },
  {
    name: "Tasks",
    route: "/tasks",
    icon: <FaClipboard className="me-3" />,
  },
  {
    name: "Users",
    route: "/users",
    icon: <FaUser className="me-3" />,
  },
];
//data for normal user
const userNavData = [
  {
    name: "Dashboard",
    route: "/",
    icon: <FaHome className="me-3" />,
  },
  {
    name: "Micropropagation",
    route: "/micropropagation",
    icon: <FaSeedling className="me-3" />,
  },
  {
    name: "Areas",
    route: "/areas",
    icon: <FaGripHorizontal className="me-3" />,
  },
  {
    name: "Materials",
    route: "/materials",
    icon: <FaArchive className="me-3" />,
  },
  {
    name: "Crops",
    route: "/crops",
    icon: <FaLeaf className="me-3" />,
  },
  {
    name: "Culture Medium",
    route: "/cultureMediums",
    icon: <ScienceIcon className="me-3" />,
  },
  {
    name: "Plant",
    route: "/plants",
    icon: <FaTree className="me-3" />,
  },
  {
    name: "Tasks",
    route: "/tasks",
    icon: <FaClipboard className="me-3" />,
  },
  {
    name: "Account",
    route: "/account",
    icon: <FaUser className="me-3" />,
  },
];


const notesData = [
  {
  id: 41,
  title: "Implement new software updates.",
  createdOn: "07/09/2021",
  },
  {
  id: 42,
  title:
  "Organize team-building activities for better collaboration.",
  createdOn: "07/09/2021",
  },
  {
  id: 43,
  title: "Develop strategies for improving customer satisfaction.",
  createdOn: "19/07/2021",
  },
  ];  
  ;

const areaData = [
  {
    id: 51,
    name: "Lab 01",
    type: "Tissue culture room",
    size: 1,
    unit: "m2",
    batches: 20,
    quantity: 50,
    edit: true,
  },
  {
    id: 52,
    name: "Lab 02",
    type: "Tissue culture laboratory",
    size: 35,
    unit: "m2",
    batches: 0,
    quantity: 0,
    edit: true,
  },
  {
    id: 53,
    name: "Lab 03",
    type: "Tissue culture room",
    size: 30,
    unit: "m2",
    batches: 2,
    quantity: 200,
    edit: true,
  },
];

const materialData = [
  {
    id: 1,
    category: "Fruit",
    name: "Fruit 1",
    price: "4€",
    producedBy: "Farm Fresh",
    qty: 256,
    additionalNote: `Các chồi in vitro (3,0 - 4,0 cm) được chuyển lên môi trường ½ MS bổ sung 15 g/l
    sucrose, 8 g/l agar, 0,5 g/l than hoạt tính và bổ sung kết hợp NAA (0,5 - 2,0 mg/l) để
    thăm dò khẳ năng tạo rễ và phát triển thành cây con in vitro hoàn chỉnh. `
  },
  {
    id: 2,
    category: "Seed",
    name: "Seed 2",
    price: "3€",
    producedBy: "Kultiva",
    qty: 725,
    additionalNote: "Organic"
  },
  {
    id: 3,
    category: "Vegetable",
    name: "Vegetable 3",
    price: "7€",
    producedBy: "Organic Harvest",
    qty: 113,
    additionalNote: ""
  },
  {
    id: 4,
    category: "Fruit",
    name: "Fruit 4",
    price: "8€",
    producedBy: "Farm Fresh",
    qty: 342,
    additionalNote: "Non-GMO"
  },
  {
    id: 5,
    category: "Seed",
    name: "Seed 5",
    price: "1€",
    producedBy: "Kultiva",
    qty: 693,
    additionalNote: ""
  },
  {
    id: 6,
    category: "Vegetable",
    name: "Vegetable 6",
    price: "6€",
    producedBy: "Organic Harvest",
    qty: 903,
    additionalNote: "Organic"
  },
  {
    id: 7,
    category: "Fruit",
    name: "Fruit 7",
    price: "2€",
    producedBy: "Farm Fresh",
    qty: 654,
    additionalNote: "Non-GMO"
  },
  {
    id: 8,
    category: "Seed",
    name: "Seed 8",
    price: "9€",
    producedBy: "Kultiva",
    qty: 875,
    additionalNote: ""
  },
  {
    id: 9,
    category: "Vegetable",
    name: "Vegetable 9",
    price: "5€",
    producedBy: "Organic Harvest",
    qty: 14,
    additionalNote: "Organic"
  },
  {
    id: 10,
    category: "Fruit",
    name: "Fruit 10",
    price: "3€",
    producedBy: "Farm Fresh",
    qty: 882,
    additionalNote: ""
  }
  ];

const micropropagationData = [
  {
    id: 61,
    category: "Seed",
    name: "Romaine",
    price: "2€",
    producedBy: "Kultiva",
    qty: 1000,
    additionalNotes: "",
  },
];

export {
  dashboardData,
  cropsData,
  adminNavData,
  userNavData,
  notesData,
  areaData,
  materialData,
  micropropagationData,
  cultureData
};

var defConstants = {
  USPopulation: 3.2e8,
  USEmissions: 6e9, // ton CO2 / yr
  gasCarbonIntensity: 8.89e-3, // ton CO2 / gal
  carVMT: 9300, // mi / yr
  gasEfficiency: 22, // mi / gallon
  electricityCarbonIntensity: 55.3, // kg CO2 / million Btu
  electricityUsage: 13400, // kWh / yr
  foodCarbonIntensity: 2.5, // ton CO2 / yr for 2600-kcal diet
  sccMin: 0.0, // $ / ton CO2
  sccMax: 200.0,
  scc: 40
};

var constants = {};
for (key in defConstants) {
  constants[key] = defConstants[key];
}

var sliders = [
  // { id: "gas",
  //   txt: "Base price of gas",
  //   unit: "$/gal",
  //   dom: [3.0, 4.0],
  //   val: constants.gasBasePrice,
  //   vOff: 0.0*sHt,
  //   hOff: 0.0*(sWd+sPad),
  //   nPlaces: 2,
  //   dragmove: function (newVal) {
  //     constants.gasBasePrice = newVal;
  //   }
  // },
  { id: "elecUsage",
    txt: "Electricity usage",
    unit: "kWh/yr",
    dom: [0, constants.electricityUsage*2.],
    val: constants.electricityUsage,
    def: constants.electricityUsage*1.,
    vOff: 1.0,
    hOff: 0.0,
    nPlaces: -2,
    dragmove: function (newVal) {
      constants.electricityUsage = newVal;
    }
  },
  // { id: "elecBase",
  //   txt: "Electricity base rate",
  //   unit: "$/kWh",
  //   dom: [0.05, 0.25],
  //   val: constants.electricityBasePrice,
  //   vOff: 2.0*sHt,
  //   hOff: 0.0*(sWd + sPad),
  //   nPlaces: 2,
  //   dragmove: function (newVal) {
  //     constants.electricityBasePrice = newVal;
  //   }
  // },
  { id: "elecCarbonIntensity",
    txt: "Carbon intensity of electricity",
    unit: "kg CO2/MBtu",
    dom: [30., 80.],
    val: constants.electricityCarbonIntensity,
    def: constants.electricityCarbonIntensity*1.,
    vOff: 1.0,
    hOff: 1.0,
    nPlaces: 1,
    dragmove: function (newVal) {
      constants.electricityCarbonIntensity = newVal;
    }
  },
  { id: "foodCarbonIntensity",
    txt: "Carbon intensity of diet",
    unit: "ton CO2/yr",
    dom: [1.5, 3.3],
    val: constants.foodCarbonIntensity,
    def: constants.foodCarbonIntensity*1.,
    vOff: 0.0,
    hOff: 2.0,
    nPlaces: 1,
    dragmove: function (newVal) {
      constants.foodCarbonIntensity = newVal;
    }
  },
  { id: "carVMT",
    txt: "Miles driven",
    unit: "mi",
    dom: [0.0, 25000.0],
    val: constants.carVMT,
    def: constants.carVMT*1.,
    vOff: 0.0,
    hOff: 1.0,
    nPlaces: -2,
    dragmove: function (newVal) {
      constants.carVMT = newVal;
    }
  },
  { id: "gasEfficiency",
    txt: "Car fuel efficiency",
    unit: "mi/gal",
    dom: [10.0, 60.0],
    val: constants.gasEfficiency,
    def: constants.gasEfficiency*1.,
    vOff: 0.0,
    hOff: 0.0,
    nPlaces: 0,
    dragmove: function (newVal) {
      constants.gasEfficiency = newVal;
    }
  },
  { id: "totalCarbon",
    txt: "Total carbon emissions",
    unit: "ton CO2/yr",
    dom: [1e9, 10e9],
    val: constants.USEmissions,
    def: constants.USEmissions*1.,
    vOff: 1.0,
    hOff: 2.0,
    nPlaces: 1,
    dragmove: function (newVal) {
      constants.USEmissions = newVal;
    },
    tickstyle: 'sci'
  }
];
var costs = [
  { id : "scc",
    txt: "Social cost of carbon",
    unit: "$/ton CO2",
    nPlaces: 0,
    fcn: function(scc) {
      return scc;
    }
  },
  { id: "dividend",
    txt: "Carbon dividend",
    unit: "$/yr",
    nPlaces: -1,
    fcn: function(scc) {
      return constants.USEmissions * scc / constants.USPopulation;
    }
  },
  { id: "gas",
    txt: "Gasoline surcharge",
    unit: "$/yr",
    nPlaces: -1,
    fcn: function(scc) {
      gasPrice = (scc * constants.gasCarbonIntensity);
      return gasPrice * constants.carVMT / constants.gasEfficiency;
    }
  },
  { id: "elec",
    txt: "Electricity surcharge",
    unit: "$/yr",
    nPlaces: -1,
    fcn: function(scc) {
      electricityPrice = (
  			  scc * constants.electricityCarbonIntensity / 1000 / 1000000 / 0.000293);
      return electricityPrice * constants.electricityUsage;
    }
  },
  { id: "food",
    txt: "Food surcharge",
    unit: "$/yr",
    nPlaces: -1,
    fcn: function(scc) {
      return constants.foodCarbonIntensity * scc;
    }
  }
];
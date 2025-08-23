
// Component category grouping
export const categoryGroups = {
  "Infrastructure": ["bhoaOffices", "bhoaCottage", "jettyParkingLot", "roads", "circles"],
  "Utilities": ["miniSubs", "pumpStations", "sewageWorks"],
  "Amenities": ["tennisCourts", "birdPark", "rutherfordTrail"],
  "Grounds": ["greenBelts", "railwayFireBreak"]
};

// Helper function to determine which group a category belongs to
export const getCategoryGroup = (categoryId: string): string => {
  for (const [groupName, categoryIds] of Object.entries(categoryGroups)) {
    if (categoryIds.includes(categoryId)) {
      return groupName;
    }
  }
  return "Other";
};

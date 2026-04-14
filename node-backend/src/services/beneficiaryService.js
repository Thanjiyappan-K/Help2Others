// src/services/beneficiaryService.js
// Equivalent to BeneficiaryService.java

const { Beneficiary } = require('../models');

class BeneficiaryService {
  async createBeneficiary(data) {
    const ben = {
      organizationName: data.organizationName,
      organizationType: data.organizationType,
      registrationNumber: data.registrationNumber,
      establishedYear: data.establishedYear || null,
      state: data.state,
      district: data.district,
      address: data.address,
      pincode: data.pincode,

      // Handle Coordinates
      lat: data.lat || data.coordinates?.lat || null,
      lng: data.lng || data.coordinates?.lng || null,

      contactPerson: data.contactPerson,
      phoneNumber: data.phoneNumber,
      email: data.email,

      totalCapacity: parseInt(data.totalCapacity, 10),
      currentOccupancy: parseInt(data.currentOccupancy, 10),
      maleCount: data.maleCount ? parseInt(data.maleCount, 10) : 0,
      femaleCount: data.femaleCount ? parseInt(data.femaleCount, 10) : 0,
      childrenCount: data.childrenCount ? parseInt(data.childrenCount, 10) : 0,
      elderlyCount: data.elderlyCount ? parseInt(data.elderlyCount, 10) : 0,
      specialNeedsCount: data.specialNeedsCount ? parseInt(data.specialNeedsCount, 10) : 0,

      // Handle MealTypes
      breakfast: Boolean(data.mealTypes?.breakfast),
      lunch: Boolean(data.mealTypes?.lunch),
      dinner: Boolean(data.mealTypes?.dinner),
      snacks: Boolean(data.mealTypes?.snacks),

      // Handle DietaryRestrictions
      vegetarian: Boolean(data.dietaryRestrictions?.vegetarian),
      vegan: Boolean(data.dietaryRestrictions?.vegan),
      glutenFree: Boolean(data.dietaryRestrictions?.glutenFree),
      nutFree: Boolean(data.dietaryRestrictions?.nutFree),
      diabetic: Boolean(data.dietaryRestrictions?.diabetic),
      otherRestrictions: data.dietaryRestrictions?.other ? String(data.dietaryRestrictions.other) : null,

      frequencyOfSupply: data.frequencyOfSupply,
      priorityLevel: data.priorityLevel,
      additionalNotes: data.additionalNotes,
    };

    return await Beneficiary.create(ben);
  }
}

module.exports = new BeneficiaryService();

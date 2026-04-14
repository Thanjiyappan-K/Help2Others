// src/services/donationService.js
// Equivalent to DonationService.java

const { Donation, RecurringSchedule } = require('../models');

class DonationService {
  parseDateTime(date, time) {
    if (date && time) {
      let timeStr = time;
      if (time.length === 5) timeStr += ':00'; // Append seconds if missing
      const dateStr = `${date}T${timeStr}`;
      return new Date(dateStr);
    }
    return null;
  }

  async createDonation(data, file) {
    const donationData = {
      foodType: data.foodType,
      description: data.description,
      quantity: data.quantity,
      unit: data.unit,
      address: data.address,
      city: data.city,
      district: data.district || data.city || null,
      zipCode: data.zipCode,
      lat: data.lat != null && data.lat !== '' ? Number(data.lat) : null,
      lng: data.lng != null && data.lng !== '' ? Number(data.lng) : null,
      donorRef: data.donorRef || data.donor_ref || null,
      specialInstructions: data.specialInstructions,
      isRecurring: data.isRecurring === 'true' || data.isRecurring === true,
      status: 'pending' // Default Status for SocialWorker visibility
    };

    // Handle File Upload
    if (file) {
      donationData.imageUrl = `/uploads/${file.filename}`;
    }

    if (donationData.isRecurring) {
      donationData.recurringFrequency = data.recurringFrequency;
    }

    // Combine Date and Time strings into Date objects
    donationData.expiryDatetime = this.parseDateTime(data.expiryDate, data.expiryTime);
    donationData.pickupStartDatetime = this.parseDateTime(data.pickupStartDate, data.pickupStartTime);
    donationData.pickupEndDatetime = this.parseDateTime(data.pickupEndDate, data.pickupEndTime);

    // Save Donation
    const savedDonation = await Donation.create(donationData);

    // Handle Recurring Schedule
    if (donationData.isRecurring) {
      await this.createInitialSchedule(savedDonation.id, data.pickupStartDate, data.recurringFrequency);
    }

    return savedDonation.id;
  }

  async createInitialSchedule(donationId, startDateStr, frequency) {
    if (!startDateStr) return;

    let nextDate = new Date(startDateStr);
    switch (frequency) {
      case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
      case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
      case 'biweekly': nextDate.setDate(nextDate.getDate() + 14); break;
      case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
    }

    await RecurringSchedule.create({
      donationId: donationId,
      nextOccurrenceDate: nextDate.toISOString().split('T')[0] // Get YYYY-MM-DD
    });
  }
}

module.exports = new DonationService();

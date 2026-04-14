/**
 * Stable JSON shape for frontend (snake_case IDs) regardless of Sequelize camelCase models.
 */

function pickDonation(d) {
  const x = d.get ? d.get({ plain: true }) : d;
  return x;
}

function serializeBeneficiary(b) {
  if (!b) return null;
  const x = b.get ? b.get({ plain: true }) : b;
  return {
    beneficiary_id: x.id,
    organization_name: x.organizationName,
    organization_type: x.organizationType,
    state: x.state,
    district: x.district,
    address: x.address,
    pincode: x.pincode,
    lat: x.lat,
    lng: x.lng,
    contact_person: x.contactPerson,
    phone_number: x.phoneNumber,
    email: x.email,
    is_approved: x.isApproved,
    is_active: x.isActive,
  };
}

function serializeDonation(d) {
  const x = pickDonation(d);
  const ben = x.beneficiary ? serializeBeneficiary(x.beneficiary) : null;
  return {
    donation_id: x.id,
    food_type: x.foodType,
    description: x.description,
    quantity: x.quantity,
    unit: x.unit,
    image_url: x.imageUrl,
    expiry_datetime: x.expiryDatetime,
    pickup_start_datetime: x.pickupStartDatetime,
    pickup_end_datetime: x.pickupEndDatetime,
    is_recurring: x.isRecurring,
    recurring_frequency: x.recurringFrequency,
    address: x.address,
    city: x.city,
    district: x.district,
    zip_code: x.zipCode,
    lat: x.lat,
    lng: x.lng,
    donor_ref: x.donorRef,
    special_instructions: x.specialInstructions,
    status: x.status,
    beneficiary_id: x.beneficiary_id,
    verified_by: x.verifiedBy,
    delivered_by: x.deliveredBy,
    created_at: x.createdAt,
    beneficiary: ben,
  };
}

module.exports = { serializeDonation, serializeBeneficiary };

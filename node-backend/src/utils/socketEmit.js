function emitDonationUpdate(io, payload) {
  if (!io) return;
  io.emit('donation_status_changed', payload);
  if (payload.donationId != null) {
    io.to(`donation:${payload.donationId}`).emit('donation_status_changed', payload);
  }
  if (payload.district) {
    io.to(`district:${payload.district}`).emit('donation_status_changed', payload);
  }
  if (payload.volunteerId != null) {
    io.to(`volunteer:${payload.volunteerId}`).emit('donation_status_changed', payload);
  }
}

module.exports = { emitDonationUpdate };

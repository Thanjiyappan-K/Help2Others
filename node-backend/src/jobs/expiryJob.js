const cron = require('node-cron');
const { Op } = require('sequelize');
const { Donation, DonationStatusLog } = require('../models');
const { emitDonationUpdate } = require('../utils/socketEmit');
const { getIo } = require('../utils/socketHub');

// Run every minute
const start = () => {
  cron.schedule('* * * * *', async () => {
    console.log('⏱️ Running background expiry check job...');
    try {
      const expiredDonations = await Donation.findAll({
        where: {
          status: 'pending',
          expiryDatetime: {
            [Op.lt]: new Date()
          }
        }
      });
      
      if (expiredDonations.length > 0) {
        console.log(`Found ${expiredDonations.length} expired pending donations. Marking as expired.`);
        for (const donation of expiredDonations) {
          const oldStatus = donation.status;
          donation.status = 'expired';
          await donation.save();

          await DonationStatusLog.create({
            donation_id: donation.id,
            previous_status: oldStatus,
            new_status: 'expired',
            changedBy: 'System Cron',
            remarks: 'Donation marked expired — pickup window passed while still pending.',
          });

          const district = donation.district || donation.city;
          emitDonationUpdate(getIo(), {
            donationId: donation.id,
            oldStatus,
            newStatus: 'expired',
            changedBy: 'System Cron',
            timestamp: new Date(),
            district,
            donorRef: donation.donorRef,
          });
        }
      }
    } catch (error) {
      console.error('Error running expiry job:', error);
    }
  });
};

module.exports = { start };

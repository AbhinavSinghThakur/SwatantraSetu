import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ['customer', 'worker', 'coop_admin', 'federation_admin'], default: 'customer' },
    phone: String,
    city: String,
    verified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    otpHash: String,
    otpExpiresAt: Date,
    otpLastSentAt: Date,
    workerId: String,
    cooperativeId: String,
  },
  { timestamps: true }
);

const workerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    skill: String,
    skillId: String,
    cooperativeId: String,
    cooperative: String,
    verified: Boolean,
    rating: Number,
    experienceYears: Number,
    jobsCompleted: Number,
    languages: [String],
    serviceArea: String,
    city: String,
    availability: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
    startingRate: Number,
    certifications: [String],
    insurance: {
      welfare: Boolean,
      accident: Boolean,
      health: Boolean,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

workerSchema.index({ location: '2dsphere' });

const bookingSchema = new mongoose.Schema(
  {
    customerId: String,
    customerName: String,
    workerId: String,
    workerName: String,
    service: String,
    status: { type: String, enum: ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rejected'], default: 'pending' },
    type: { type: String, enum: ['instant', 'scheduled', 'emergency', 'recurring'], default: 'instant' },
    scheduledAt: Date,
    address: String,
    amount: Number,
    paymentMethod: String,
    paymentStatus: String,
    cooperative: String,
    notes: String,
    offlineQueued: Boolean,
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Worker = mongoose.models.Worker || mongoose.model('Worker', workerSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

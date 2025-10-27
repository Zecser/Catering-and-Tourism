import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
    userId: mongoose.Types.ObjectId;
    otp: string;
    purpose: 'password_reset' | 'email_verification';
    expiresAt: Date;
    isUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: String,
        required: true,
        length: 6
    },
    purpose: {
        type: String,
        enum: ['password_reset', 'email_verification'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // Auto-delete expired OTPs
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for faster queries
OTPSchema.index({ userId: 1, purpose: 1, isUsed: 1 });

export const OTP = mongoose.model<IOTP>("OTP", OTPSchema);

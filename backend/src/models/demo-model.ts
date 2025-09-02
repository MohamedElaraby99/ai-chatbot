import mongoose, { Schema, Document } from 'mongoose';

export interface IDemo extends Document {
	name: string;
	email: string;
	company?: string;
	useCase: string;
	message?: string;
	status: 'pending' | 'approved' | 'rejected' | 'contacted';
	submittedAt: Date;
	contactedAt?: Date;
	notes?: string;
}

const demoSchema = new Schema<IDemo>({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	company: {
		type: String,
		trim: true
	},
	useCase: {
		type: String,
		required: true,
		enum: ['business', 'education', 'personal', 'research', 'customer-support', 'other']
	},
	message: {
		type: String,
		trim: true
	},
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected', 'contacted'],
		default: 'pending'
	},
	submittedAt: {
		type: Date,
		default: Date.now
	},
	contactedAt: {
		type: Date
	},
	notes: {
		type: String,
		trim: true
	}
});

// Index for efficient queries
demoSchema.index({ email: 1, submittedAt: -1 });
demoSchema.index({ status: 1, submittedAt: -1 });

export default mongoose.model<IDemo>('Demo', demoSchema);

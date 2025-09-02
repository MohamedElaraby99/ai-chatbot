import { Request, Response } from 'express';
import Demo from '../models/demo-model.js';

// Submit a new demo request
export const submitDemoRequest = async (req: Request, res: Response) => {
	try {
		const { name, email, company, useCase, message } = req.body;

		// Validate required fields
		if (!name || !email || !useCase) {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and use case are required'
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: 'Please provide a valid email address'
			});
		}

		// Validate use case
		const validUseCases = ['business', 'education', 'personal', 'research', 'customer-support', 'other'];
		if (!validUseCases.includes(useCase)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid use case selected'
			});
		}

		// Check if user already submitted a request recently (within 24 hours)
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
		const existingRequest = await Demo.findOne({
			email: email.toLowerCase(),
			submittedAt: { $gte: oneDayAgo }
		});

		if (existingRequest) {
			return res.status(429).json({
				success: false,
				message: 'You have already submitted a demo request recently. Please wait 24 hours before submitting another request.'
			});
		}

		// Create new demo request
		const demoRequest = new Demo({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			company: company?.trim(),
			useCase,
			message: message?.trim(),
			status: 'pending'
		});

		await demoRequest.save();

		// TODO: Send notification email to admin team
		// TODO: Send confirmation email to user

		res.status(201).json({
			success: true,
			message: 'Demo request submitted successfully',
			data: {
				id: demoRequest._id,
				submittedAt: demoRequest.submittedAt
			}
		});

	} catch (error) {
		console.error('Error submitting demo request:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error. Please try again later.'
		});
	}
};

// Get all demo requests (admin only)
export const getAllDemoRequests = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10, status, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const skip = (pageNum - 1) * limitNum;

		// Build filter
		const filter: any = {};
		if (status && status !== 'all') {
			filter.status = status;
		}

		// Build sort
		const sort: any = {};
		sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

		const demoRequests = await Demo.find(filter)
			.sort(sort)
			.skip(skip)
			.limit(limitNum)
			.select('-__v');

		const total = await Demo.countDocuments(filter);

		res.status(200).json({
			success: true,
			data: demoRequests,
			pagination: {
				currentPage: pageNum,
				totalPages: Math.ceil(total / limitNum),
				totalItems: total,
				itemsPerPage: limitNum
			}
		});

	} catch (error) {
		console.error('Error fetching demo requests:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Get demo request by ID (admin only)
export const getDemoRequestById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const demoRequest = await Demo.findById(id).select('-__v');

		if (!demoRequest) {
			return res.status(404).json({
				success: false,
				message: 'Demo request not found'
			});
		}

		res.status(200).json({
			success: true,
			data: demoRequest
		});

	} catch (error) {
		console.error('Error fetching demo request:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Update demo request status (admin only)
export const updateDemoRequestStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status, notes, contactedAt } = req.body;

		// Validate status
		const validStatuses = ['pending', 'approved', 'rejected', 'contacted'];
		if (status && !validStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid status value'
			});
		}

		const updateData: any = {};
		if (status) updateData.status = status;
		if (notes !== undefined) updateData.notes = notes;
		if (contactedAt) updateData.contactedAt = contactedAt;
		if (status === 'contacted' && !contactedAt) {
			updateData.contactedAt = new Date();
		}

		const demoRequest = await Demo.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		).select('-__v');

		if (!demoRequest) {
			return res.status(404).json({
				success: false,
				message: 'Demo request not found'
			});
		}

		res.status(200).json({
			success: true,
			message: 'Demo request updated successfully',
			data: demoRequest
		});

	} catch (error) {
		console.error('Error updating demo request:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

// Delete demo request (admin only)
export const deleteDemoRequest = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const demoRequest = await Demo.findByIdAndDelete(id);

		if (!demoRequest) {
			return res.status(404).json({
				success: false,
				message: 'Demo request not found'
			});
		}

		res.status(200).json({
			success: true,
			message: 'Demo request deleted successfully'
		});

	} catch (error) {
		console.error('Error deleting demo request:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
};

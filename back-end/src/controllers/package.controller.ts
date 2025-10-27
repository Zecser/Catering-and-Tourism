import { NextFunction, Request, Response } from 'express';
import Package from '../models/package.model';
import { applyFormValidation, PackageZodSchema } from '../validations/package.validation';
import { sendEmail } from '../utils/email';
import { getEnvVariable } from '../utils/helpers';
import { generateHtmlContent, generateTextContent } from '../utils/plan-appication';

// Create a new package
export const createPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validation = PackageZodSchema.safeParse(req.body);

        if (!validation.success) {
            throw validation.error
        }

        const { title, description, price, features } = validation.data;
        const newPackage = new Package({
            title,
            description,
            price,
            features,
        });

        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        console.log("Error in create package :", error)
        next(error)
    }
};

// Get all packages
export const getAllPackages = async (_req: Request, res: Response): Promise<void> => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error });
    }
};

// Get a Budget Package by ID
export const getPackageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const packageData = await Package.findById(id);

        if (!packageData) {
            res.status(404).json({ message: 'Package not found' });
            return;
        }

        res.status(200).json(packageData);
    } catch (error) {
        console.log("Error in fetching package :", error)
        next(error)
    }
};

// Update a Budget Package by ID
export const updatePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const validation = PackageZodSchema.safeParse(req.body);

        if (!validation.success) {
            throw validation.error
        }
        const { title, description, price, features } = validation.data;

        const updatedPackage = await Package.findByIdAndUpdate(
            id,
            { title, description, price, features },
            { new: true }
        );

        if (!updatedPackage) {
            res.status(404).json({ message: 'Package not found' });
            return;
        }

        res.status(200).json(updatedPackage);
    } catch (error) {
        console.log("Error in fetching package :", error)
        next(error)
    }
};

// Delete a Budget Package by ID
export const deletePackage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedPackage = await Package.findByIdAndDelete(id);

        if (!deletedPackage) {
            res.status(404).json({ message: 'Package not found' });
            return;
        }

        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting package', error });
    }
};

// Send Plan Application
export const sendPlanApplication = async (req: Request, res: Response): Promise<void> => {
    try {

        const validation = applyFormValidation.safeParse(req.body);

        if (!validation.success) {
            throw validation.error
        }
        const { name,
            email,
            phone = "N/A",
            whatsapp = "N/A",
            location = "N/A",
        } = validation.data;

        const { planId,
            planTitle = "N/A",
            planPrice = "N/A", } = req?.body;

        if (!email || !name || !planId) {
            res.status(400).json({ message: "Missing required fields: name, email, or planId." });
            return
        }

        const subject = `New Plan Application: ${planTitle}`;

        const htmlContent = generateHtmlContent({
            name,
            email,
            phone,
            whatsapp,
            location,
            planId,
            planTitle,
            planPrice,
        });

        const textContent = generateTextContent({
            name,
            email,
            phone,
            whatsapp,
            location,
            planId,
            planTitle,
            planPrice,
        });

        await sendEmail(getEnvVariable("ADMIN_EMAIL"), subject, textContent, htmlContent);
        res.status(200).json({ message: "Application sent successfully" });
    } catch (err) {
        console.error("Email sending failed:", err);
        res.status(500).json({ message: "Failed to send application" });
    }
};




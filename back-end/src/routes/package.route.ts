import { Router } from 'express'
import { createPackage, deletePackage, getAllPackages, getPackageById, sendPlanApplication, updatePackage } from '../controllers/package.controller';
import { authMiddleware } from '../middlewares/auth.middleware';


const router = Router()

router.post('/', authMiddleware, createPackage); // Create a new package
router.get('/', getAllPackages); // Get all packages
router.get('/:id', getPackageById); // Get a package by ID
router.put('/:id',authMiddleware, updatePackage); // Update a package by ID
router.delete('/:id',authMiddleware, deletePackage); // Delete a package by ID
router.post('/send-plan-application', sendPlanApplication); // Send plan application via email

export default router;

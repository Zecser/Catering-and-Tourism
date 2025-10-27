import { Request, Response } from "express";
import mongoose from "mongoose";
import MenuCategory from "../models/menu.model";

// Helper function to validate ObjectId
const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Get single category by ID
export const getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        let { id } = req.params;

        // Remove colon prefix if present
        if (id.startsWith(':')) {
            id = id.substring(1);
        }

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            res.status(400).json({ error: "Invalid category ID format" });
            return;
        }

        const category = await MenuCategory.findById(id);
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        // Clean up any null/undefined/empty items
        const originalLength = category.items.length;
        category.items = category.items.filter(item => item !== null && item !== undefined && item !== '');

        if (category.items.length !== originalLength) {
            if (category.items.length === 0) {
                // Delete category if no valid items remain
                await MenuCategory.findByIdAndDelete(id);
                res.status(404).json({ error: "Category deleted as it had no valid items" });
                return;
            } else {
                // Save category with cleaned items
                await category.save();
            }
        }

        res.json(category);
    } catch (err) {
        console.error("Error getting category:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await MenuCategory.find();

        // Clean up any categories with null/empty items
        for (const category of categories) {
            const originalLength = category.items.length;
            category.items = category.items.filter(item => item !== null && item !== undefined && item !== '');

            if (category.items.length !== originalLength) {
                if (category.items.length === 0) {
                    // Delete category if no valid items remain
                    await MenuCategory.findByIdAndDelete(category._id);
                } else {
                    // Save category with cleaned items
                    await category.save();
                }
            }
        }

        // Fetch updated categories after cleanup
        const updatedCategories = await MenuCategory.find();
        res.json(updatedCategories);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// Add category
export const addCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: "Name required" });
            return;
        }

        const newCategory = new MenuCategory({ name });
        await newCategory.save();
        res.json(newCategory);
    } catch (err) {
        res.status(500).json({ error: "Error adding category" });
    }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        await MenuCategory.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted" });
    } catch {
        res.status(500).json({ error: "Error deleting category" });
    }
};

// Add item
export const addItem = async (req: Request, res: Response): Promise<void> => {
    try {
        let { categoryId } = req.params;

        // Remove colon prefix if present
        if (categoryId.startsWith(':')) {
            categoryId = categoryId.substring(1);
        }

        // Validate ObjectId format
        if (!isValidObjectId(categoryId)) {
            res.status(400).json({ error: "Invalid category ID format" });
            return;
        }

        const { item } = req.body;

        if (!item) {
            res.status(400).json({ error: "Item name required" });
            return;
        }

        const category = await MenuCategory.findById(categoryId);
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        category.items.push(item);
        await category.save();

        res.json(category);
    } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).json({ error: "Error adding item" });
    }
};

// Edit item
export const editItem = async (req: Request, res: Response): Promise<void> => {
    try {
        let { categoryId, itemIndex } = req.params;

        // Remove colon prefix if present
        if (categoryId.startsWith(':')) {
            categoryId = categoryId.substring(1);
        }

        // Validate ObjectId format
        if (!isValidObjectId(categoryId)) {
            res.status(400).json({ error: "Invalid category ID format" });
            return;
        }

        const { value } = req.body;

        if (!value || value.trim() === '') {
            res.status(400).json({ error: "Item value is required" });
            return;
        }

        const category = await MenuCategory.findById(categoryId);
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        // Validate item index
        const index = parseInt(itemIndex);
        if (index < 0 || index >= category.items.length) {
            res.status(400).json({ error: "Invalid item index" });
            return;
        }

        // Check if the item at this index exists and is not null
        if (category.items[index] === null || category.items[index] === undefined) {
            res.status(400).json({ error: "Item at this index is null or undefined" });
            return;
        }

        // Update the item
        category.items[index] = value.trim();
        await category.save();

        res.json(category);
    } catch (err) {
        console.error("Error editing item:", err);
        res.status(500).json({ error: "Error editing item" });
    }
};

// Delete item
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        let { categoryId, itemIndex } = req.params;

        // Remove colon prefix if present
        if (categoryId.startsWith(':')) {
            categoryId = categoryId.substring(1);
        }

        // Validate ObjectId format
        if (!isValidObjectId(categoryId)) {
            res.status(400).json({ error: "Invalid category ID format" });
            return;
        }

        const category = await MenuCategory.findById(categoryId);
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        // Validate item index
        const index = parseInt(itemIndex);
        if (index < 0 || index >= category.items.length) {
            res.status(400).json({ error: "Invalid item index" });
            return;
        }

        // Remove the item from the array using splice
        category.items.splice(index, 1);

        // Filter out any null/undefined values that might exist
        category.items = category.items.filter(item => item !== null && item !== undefined && item !== '');


        // Save the category with remaining items
        await category.save();
        res.json({ message: "Item deleted successfully" });

    } catch {
        res.status(500).json({ error: "Error deleting item" });
    }
};

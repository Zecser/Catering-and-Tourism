import { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react"; // icons
import { MenuSkeleton, LoadingSkeleton } from "./skeleton";
import { useMenuManagement } from "../hooks/useMenuManagement";

const ConfirmDialog = ({
    message,
    onConfirm,
    onCancel,
}: {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-sm mx-auto">
            <p className="text-gray-800 mb-4 text-sm md:text-base">{message}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm md:text-base order-2 sm:order-1"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg bg-vivid-pink hover:bg-dark-magenta text-white text-sm md:text-base order-1 sm:order-2"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

const AdminMenu = () => {
    // Local state for form inputs and edit modes
    const [newCategory, setNewCategory] = useState("");
    const [newItem, setNewItem] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [originalValue, setOriginalValue] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });

    const {
        // State from Redux
        categories,
        activeCategory,
        isLoading,
        isSaving,
        error,

        // Actions
        createCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
        setActiveCategory,
        clearError,
    } = useMenuManagement();

    // Handler functions
    const handleDeleteCategory = (category: any) => {
        setConfirmAction(() => async () => {
            await deleteCategory(category._id);
        });
        setConfirmOpen(true);
    };

    const handleDeleteItem = (index: number) => {
        if (!activeCategory) return;
        setConfirmAction(() => async () => {
            await deleteItem(activeCategory._id, index);
        });
        setConfirmOpen(true);
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        const existingCategory = categories.find(c => c.name.toLowerCase() === newCategory.toLowerCase());
        if (existingCategory) {
            return; // Error will be handled by the API
        }

        const success = await createCategory(newCategory);
        if (success) {
            setNewCategory("");
        }
    };

    const handleAddItem = async () => {
        if (!newItem.trim() || !activeCategory) return;

        const existingItem = activeCategory.items.find(c => c.toLowerCase() === newItem.toLowerCase());
        if (existingItem) {
            return; // Error will be handled by the API
        }

        const success = await addItem(activeCategory._id, newItem);
        if (success) {
            setNewItem("");
        }
    };

    const handleEditItem = (index: number) => {
        if (!activeCategory) return;
        setEditIndex(index);
        const currentValue = activeCategory.items[index];
        setEditValue(currentValue);
        setOriginalValue(currentValue);
    };

    const handleSaveEdit = async () => {
        if (editIndex === null || !activeCategory) return;

        const existingItem = activeCategory.items.find(c => c.toLowerCase() === editValue.toLowerCase());
        if (existingItem) {
            return; // Error will be handled by the API
        }

        const success = await updateItem(activeCategory._id, editIndex, editValue);
        if (success) {
            setEditIndex(null);
            setEditValue("");
            setOriginalValue("");
        }
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setEditValue("");
        setOriginalValue("");
    };


    const handleConfirm = () => {
        confirmAction();
        setConfirmOpen(false);
    };

    const handleCancel = () => setConfirmOpen(false);

    // Show skeleton while loading categories 
    if (isLoading && categories.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-soft-pink via-white to-soft-pink">
                <div className="container mx-auto px-4 py-4 md:py-8">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-bold text-dark-magenta mb-2">
                            Menu Management
                        </h1>
                        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Manage your restaurant menu categories and items.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[...Array(6)].map((_, idx) => (
                            <MenuSkeleton key={idx} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-soft-pink via-white to-soft-pink">
            {error && (
                <div className="bg-red-600 text-white p-4 text-center">
                    {error}
                    <button
                        onClick={clearError}
                        className="ml-2 underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {isSaving && categories.length > 0 && <LoadingSkeleton />}

            <div className="container mx-auto px-4 py-4 md:py-8">
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-dark-magenta mb-2">
                        Menu Management
                    </h1>
                    <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Manage your restaurant menu categories and items.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 md:gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="flex items-center gap-1 border border-gray-300 rounded-full px-1 md:px-2 bg-gray-50 min-w-0"
                                >
                                    <button
                                        onClick={() => setActiveCategory(category)}
                                        className={`py-1 md:py-2 px-1 md:px-4 text-xs md:text-sm font-semibold transition-all text-dark-magenta truncate ${activeCategory?._id === category._id
                                            ? "text-vivid-pink underline underline-offset-4"
                                            : "hover:text-vivid-pink"
                                            }`}
                                    >
                                        {category.name.toUpperCase()}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category)}
                                        className="text-red-400 hover:text-red-600 bg-white rounded-full p-1 pl-0 hover:bg-red-50 flex-shrink-0"
                                    >
                                        <Trash2 size={16} className="md:hidden" />
                                        <Trash2 size={22} className="hidden md:block" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Category */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New Category"
                                className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded text-gray-800 bg-white placeholder-gray-500 focus:border-vivid-pink focus:outline-none"
                            />
                            <button
                                onClick={handleAddCategory}
                                disabled={!newCategory.trim() || isSaving}
                                className={`py-2 px-4 rounded-lg text-sm md:text-base ${newCategory.trim() && !isSaving
                                    ? "bg-vivid-pink hover:bg-dark-magenta text-white"
                                    : "bg-gray-500 cursor-not-allowed text-gray-300"
                                    }`}
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Confirm dialog for deleting categories and items*/}
                {confirmOpen && (
                    <ConfirmDialog
                        message="Are you sure you want to delete this?"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}

                {activeCategory ? (
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                        <h2 className="text-lg md:text-2xl font-bold text-dark-magenta mb-4 md:mb-6">{activeCategory.name.toUpperCase()}</h2>

                        {/* Add Item */}
                        <div className="flex flex-col sm:flex-row gap-2 mb-4 md:mb-6">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder={`Add new item in ${activeCategory.name}`}
                                className="flex-1 px-3 py-2 text-sm md:text-base rounded border border-gray-300 text-gray-800 bg-white placeholder-gray-500 focus:border-vivid-pink focus:outline-none"
                            />
                            <button
                                onClick={handleAddItem}
                                disabled={!newItem.trim() || isSaving}
                                className={`py-2 px-4 md:px-6 rounded-lg text-sm md:text-base ${newItem.trim() && !isSaving
                                    ? "bg-vivid-pink hover:bg-dark-magenta text-white"
                                    : "bg-gray-500 cursor-not-allowed text-gray-300"
                                    }`}
                            >
                                + Add Item
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4 md:gap-6">
                            {activeCategory.items.map((item: string, index: number) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 md:p-4 text-gray-800 flex justify-between items-center  w-full hover:shadow-xl transition-shadow duration-200"
                                >
                                    {editIndex === index ? (
                                        <div className="flex gap-2 w-full">
                                            <input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="px-3 py-2  text-sm md:text-base rounded border border-gray-300 flex-1 focus:border-vivid-pink focus:outline-none"
                                            />
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={
                                                    !editValue.trim() || editValue === originalValue || isSaving
                                                }
                                                className={` px-1 py-1 sm:px-3 sm:py-2 rounded-lg text-sm md:text-base flex items-center gap-2 ${!editValue.trim() || editValue === originalValue || isSaving
                                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                    : "bg-vivid-pink hover:bg-dark-magenta text-white"
                                                    }`}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className=" px-1 py-1 sm:px-3 sm:py-2 rounded-lg text-sm md:text-base bg-red-400 hover:bg-red-600 text-white flex items-center gap-2"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-sm md:text-md font-medium text-dark-magenta truncate">{item.toUpperCase()}</h3>
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEditItem(index)}
                                                    className="text-vivid-pink hover:text-dark-magenta p-1"
                                                >
                                                    <Edit2 size={16} className="md:hidden" />
                                                    <Edit2 size={20} className="hidden md:block" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(index)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                >
                                                    <Trash2 size={16} className="md:hidden" />
                                                    <Trash2 size={20} className="hidden md:block" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <p className="text-gray-600">No categories available. Add one above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMenu;


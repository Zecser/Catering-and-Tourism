import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import ServiceTable from "../../features/admin-services/components/serviceTable";
import ServiceTableSkeleton from "../../features/admin-services/components/ServiceTableSkeleton";
import CreateModal from "../../features/admin-services/components/CreateModal";
import EditModal from "../../features/admin-services/components/EditModal";
import DeleteModal from "../../features/admin-services/components/DeleteModal";
import type { Service } from "../../features/admin-services/types";
import type { ServiceSchema } from "../../features/admin-services/validations/serviceSchema";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchServicesStart,
  fetchServicesSuccess,
  fetchServicesFailure,
  createServiceStart,
  createServiceSuccess,
  createServiceFailure,
  updateServiceStart,
  updateServiceSuccess,
  updateServiceFailure,
  deleteServiceStart,
  deleteServiceSuccess,
  deleteServiceFailure,
} from "../../store/adminServicesSlice";
import api from "../../lib/api";

const Services: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { services, isLoading, isFetched } = useSelector((state: RootState) => state.adminServices);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  // Fetch services from API
  const fetchServices = async () => {
    dispatch(fetchServicesStart());
    try {
      const res = await api.get(`/services?page=1&limit=1000`);
      dispatch(fetchServicesSuccess(res.data.services));
    } catch (err: any) {
      dispatch(fetchServicesFailure(err?.message || "Failed to fetch services"));
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchServices();
    }
  }, [isFetched]);

  // Handlers
  const handleAdd = () => setIsCreateModalOpen(true);

  const handleEdit = useCallback((service: Service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  }, []);

   const handleDelete = useCallback((id: string) => {
    const service = services.find((s) => s._id === id);
    if (service) {
      setDeletingService(service);
      setIsDeleteModalOpen(true);
    }
  }, [services]);

  // Create Service
  const createService = async (formData: ServiceSchema) => {
    dispatch(createServiceStart());
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.heading) payload.append("heading", formData.heading);
      if (formData.description) payload.append("description", formData.description);
      if (formData.image instanceof File) payload.append("image", formData.image);

      const res = await api.post("/services", payload);
      dispatch(createServiceSuccess(res.data.data)); // update table immediately
      toast.success("Service created successfully");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      dispatch(createServiceFailure(err?.response?.data?.message || "Failed to create service"));
      toast.error(err?.response?.data?.message || "Failed to create service");
    }
  };

  // Update Service
  const updateService = async (id: string, formData: ServiceSchema) => {
    dispatch(updateServiceStart());
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.heading) payload.append("heading", formData.heading);
      if (formData.description) payload.append("description", formData.description);
      if (formData.image instanceof File) payload.append("image", formData.image);

      const res = await api.put(`/services/${id}`, payload);
      dispatch(updateServiceSuccess(res.data.data)); // update table immediately
      toast.success("Service updated successfully");
      setIsEditModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      dispatch(updateServiceFailure(err?.response?.data?.message || "Failed to update service"));
      toast.error(err?.response?.data?.message || "Failed to update service");
    }
  };

  // Delete Service
  const confirmDelete = async () => {
    if (!deletingService) return;
    dispatch(deleteServiceStart());
    try {
      await api.delete(`/services/${deletingService._id}`);
      dispatch(deleteServiceSuccess(deletingService._id));
      toast.success("Service deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingService(null);
    } catch (err: any) {
      dispatch(deleteServiceFailure(err?.response?.data?.message || "Failed to delete service"));
      toast.error(err?.response?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-black">Services List</h2>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition"
          >
            + Add Service
          </button>
        </div>

        {/* Conditional rendering: Skeleton while loading */}
        {isLoading ? (
          <ServiceTableSkeleton />
        ) : (
          <ServiceTable
            services={services}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        createService={createService}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        service={editingService}
        updateService={updateService}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        serviceTitle={deletingService?.title}
      />
    </div>
  );
};

export default Services;

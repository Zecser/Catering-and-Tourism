import React from "react";
import type { Service } from "../types";
import { Pen, Trash2 } from "lucide-react";

interface Props {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceRow: React.FC<{
  service: Service;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
}> = React.memo(({ service, onEdit, onDelete }) => {
  return (
    <tr key={service._id} className="hover:bg-gray-50 text-xs sm:text-sm md:text-base">
      <td className="border px-2 sm:px-4 py-2">{service.title}</td>
      <td className="border px-2 sm:px-4 py-2">{service.heading || "-"}</td>
      <td className="border px-2 sm:px-4 py-2 max-w-[120px] sm:max-w-xs truncate">
        {service.description || "-"}
      </td>
      <td className="border px-2 sm:px-4 py-2">
        {service.image?.url ? (
          <img
            src={service.image.url}
            alt={service.title}
            className="w-12 h-10 sm:w-20 sm:h-14 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 text-[10px] sm:text-sm">No Image</span>
        )}
      </td>
      <td className="border px-2 sm:px-4 py-2">
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => onEdit(service)}
            className="p-1 rounded hover:bg-blue-100"
            title="Edit Service"
          >
            <Pen className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="p-1 rounded hover:bg-red-100"
            title="Delete Service"
          >
            <Trash2 className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
});

const ServiceTable: React.FC<Props> = React.memo(({ services, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100 text-left text-xs sm:text-sm md:text-base">
          <tr>
            <th className="border px-2 sm:px-4 py-2">Title</th>
            <th className="border px-2 sm:px-4 py-2">Heading</th>
            <th className="border px-2 sm:px-4 py-2">Description</th>
            <th className="border px-2 sm:px-4 py-2">Image</th>
            <th className="border px-2 sm:px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <ServiceRow
              key={service._id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ServiceTable;

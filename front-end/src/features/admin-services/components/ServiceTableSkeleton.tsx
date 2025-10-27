import React from "react";
import { Skeleton } from "../../../components/ui/skeleton";

const ServiceTableSkeleton: React.FC = () => {
  const rows = Array.from({ length: 5 });

  return (
    <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="border px-2 sm:px-4 py-2">Title</th>
          <th className="border px-2 sm:px-4 py-2">Heading</th>
          <th className="border px-2 sm:px-4 py-2">Description</th>
          <th className="border px-2 sm:px-4 py-2">Image</th>
          <th className="border px-2 sm:px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((_, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="border px-2 sm:px-4 py-2">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="border px-2 sm:px-4 py-2">
              <Skeleton className="h-4 w-28" />
            </td>
            <td className="border px-2 sm:px-4 py-2">
              <Skeleton className="h-4 w-40" />
            </td>
            <td className="border px-2 sm:px-4 py-2">
              <Skeleton className="h-12 w-16 rounded" />
            </td>
            <td className="border px-2 sm:px-4 py-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServiceTableSkeleton;

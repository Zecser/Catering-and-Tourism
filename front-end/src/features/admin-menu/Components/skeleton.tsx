import { cn } from "../../../lib/utils";

interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-white ",
                className
            )}
            {...props}
        />
    );
};

// Menu-specific skeleton components
export const MenuSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 md:p-4 flex justify-between items-center w-full hover:shadow-xl transition-shadow duration-200">
            <Skeleton className="h-6 w-48 bg-gray-300" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded bg-gray-300" />
                <Skeleton className="h-8 w-8 rounded bg-gray-300" />
            </div>
        </div>
    );
};

// Simple overlay skeleton for loading states
export const LoadingSkeleton = () => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-80">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-6 w-6 rounded-full bg-gray-300" />
                    <Skeleton className="h-4 w-32 bg-gray-300" />
                </div>
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-3 w-full bg-white" />
                    <Skeleton className="h-3 w-3/4 bg-white" />
                </div>
            </div>
        </div>
    );
};

export { Skeleton };

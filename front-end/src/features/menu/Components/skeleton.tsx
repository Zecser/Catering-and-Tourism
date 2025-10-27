import { cn } from "../../../lib/utils";

interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-white",
                className
            )}
            {...props}
        />
    );
};

// Menu-specific skeleton components
export const MenuCategorySkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Skeleton className="h-6 w-32 bg-gray-300 mx-auto" />
        </div>
    );
};

// Mobile category button skeleton
export const MobileCategorySkeleton = () => {
    return (
        <Skeleton className="h-10 w-24 bg-gray-300 rounded-xl" />
    );
};

// Desktop sidebar skeleton
export const DesktopSidebarSkeleton = () => {
    return (
        <div className="md:w-60 lg:w-1/4 xl:w-1/5 bg-[#88086fab] rounded-r-[40px] sticky top-2 md:h-full">
            <div className="p-6 lg:p-8">
                <div className="space-y-1">
                    {[...Array(4)].map((_, idx) => (
                        <Skeleton key={idx} className="h-12 w-full bg-white/20 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export { Skeleton };
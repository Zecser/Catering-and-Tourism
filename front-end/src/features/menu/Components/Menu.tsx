import { useMenuData } from '../hooks/useMenuData';
import {
    MenuCategorySkeleton,
    MobileCategorySkeleton,
    DesktopSidebarSkeleton
} from './skeleton';

const Menu = () => {
    const {
        categories,
        activeCategory,
        isLoading,
        error,
        setActiveCategory,
        clearError,
    } = useMenuData();

    // Show loading state with skeleton
    if (isLoading) {
        return (
            <div className="bg-primary min-h-screen text-white font-sans antialiased">
                {/* Mobile skeleton */}
                <div className="sm:hidden">
                    <div className="bg-[#88086fab] p-4 sticky top-0 z-40">
                        <div className="flex overflow-x-auto space-x-2 pb-2">
                            {[...Array(4)].map((_, idx) => (
                                <MobileCategorySkeleton key={idx} />
                            ))}
                        </div>
                    </div>
                    <main className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(6)].map((_, idx) => (
                                <MenuCategorySkeleton key={idx} />
                            ))}
                        </div>
                    </main>
                </div>

                {/* Desktop skeleton */}
                <div className="hidden sm:flex">
                    <DesktopSidebarSkeleton />
                    <main className="flex-1 p-5 xl:mr-30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            {[...Array(8)].map((_, idx) => (
                                <MenuCategorySkeleton key={idx} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="bg-primary min-h-screen text-white font-sans antialiased">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-red-400 text-xl mb-4">Oops! Something went wrong</p>
                        <p className="text-gray-300 mb-4">{error}</p>
                        <button
                            onClick={clearError}
                            className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show no data state
    if (!categories || categories.length === 0) {
        return (
            <div className="bg-primary min-h-screen text-white font-sans antialiased">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-gray-300 text-xl">No menu categories available at the moment.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary min-h-screen text-white font-sans antialiased">
            {/* Mobile screen*/}
            <div className="sm:hidden">
                <div className="bg-[#88086fab] p-4 sticky top-0 z-40">
                    <div className="flex overflow-x-auto space-x-2 pb-2">
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap py-2 px-4 rounded-xl transition-all font-semibold text-sm ${activeCategory?._id === category._id
                                    ? 'bg-white text-primary underline underline-offset-4'
                                    : 'bg-transparent hover:bg-white/20'
                                    }`}
                            >
                                {category.name.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                <main className="p-4">
                    {activeCategory ? (
                        <>
                            <h1 className="text-2xl font-bold mb-6 text-center">{activeCategory.name.toUpperCase()}</h1>
                            <div className="grid grid-cols-1 gap-4">
                                {activeCategory.items.map((item: string, index: number) => (
                                    <div key={index} className="bg-white rounded-lg shadow-lg p-4 text-center">
                                        <h3 className="text-sm text-black truncate">{item.toUpperCase()}</h3>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-lg text-gray-300 text-center">No menu data available</p>
                        </div>
                    )}
                </main>
            </div>
            {/* larger screen */}
            <div className="hidden sm:flex">
                <aside className="md:w-60 lg:w-1/4 xl:w-1/5 bg-[#88086fab] rounded-r-[40px] sticky top-2 md:h-full">
                    <div className="p-6 lg:p-8">
                        <ul className="space-y-1">
                            {categories.map((category) => (
                                <li key={category._id}>
                                    <button
                                        onClick={() => setActiveCategory(category)}
                                        className={`w-full text-start py-4 px-4 xl:px- rounded-xl transition-all font-semibold text-lg ${activeCategory?._id === category._id
                                            ? 'underline underline-offset-4'
                                            : ''
                                            }`}
                                    >
                                        {category.name.toUpperCase()}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
                <main className="flex-1 p-5 xl:mr-30">
                    {activeCategory ? (
                        <>
                            <h1 className="text-3xl font-bold mb-8">{activeCategory.name.toUpperCase()}</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                {activeCategory.items.map((item: string, index: number) => (
                                    <div key={index} className="bg-white rounded-lg shadow-lg p-4 text-center">
                                        <h3 className="text-md text-black truncate">{item.toUpperCase()}</h3>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-xl text-gray-300">No menu data available</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Menu;
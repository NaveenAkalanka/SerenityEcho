import React from 'react';
import type { SoundCategory } from '../../data/soundLibrary';

interface CategoryFilterProps {
    categories: Array<{ category: SoundCategory; count: number; icon: string }>;
    selectedCategory: SoundCategory | 'All';
    onSelectCategory: (category: SoundCategory | 'All') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onSelectCategory
}) => {
    return (
        <div className="glass-effect p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
            <div className="space-y-2">
                {/* All category */}
                <button
                    onClick={() => onSelectCategory('All')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${selectedCategory === 'All'
                        ? 'bg-accent text-white shadow-lg'
                        : 'bg-navy-card hover:bg-navy-card/80 text-gray-300'
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        <span className="text-xl">🎵</span>
                        <span className="font-medium">All Sounds</span>
                    </div>
                    <span className="text-sm opacity-75">
                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                    </span>
                </button>

                {/* Individual categories */}
                {categories.map(({ category, count, icon }) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${selectedCategory === category
                            ? 'bg-accent text-white shadow-lg'
                            : 'bg-navy-card hover:bg-navy-card/80 text-gray-300'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-xl">{icon}</span>
                            <span className="font-medium text-sm">{category}</span>
                        </div>
                        <span className="text-sm opacity-75">{count}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;

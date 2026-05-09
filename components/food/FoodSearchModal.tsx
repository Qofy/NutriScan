'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Search, Plus } from 'lucide-react';
import { AppDispatch } from '@/store';

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins?: Record<string, string>;
  minerals?: Record<string, string>;
  allergens?: string[];
}

interface SelectedFood {
  food: FoodItem;
  portionSize: number;
  portionUnit: 'g' | 'oz' | 'cup';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (foods: SelectedFood[]) => void;
}

const PORTION_UNITS = {
  g: { name: 'grams', value: 1 },
  oz: { name: 'ounces', value: 28.35 },
  cup: { name: 'cups', value: 240 },
};

export default function FoodSearchModal({ isOpen, onClose, onSave }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  if (!isOpen) return null;

  const searchFoods = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/food/items/search/?q=${encodeURIComponent(query)}`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchFoods(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addFood = (food: FoodItem) => {
    if (!selectedFoods.find((f) => f.food.id === food.id)) {
      setSelectedFoods([
        ...selectedFoods,
        { food, portionSize: 100, portionUnit: 'g' },
      ]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const addCustomFood = () => {
    if (customFood.name.trim()) {
      const newFood: FoodItem = {
        id: -Date.now(),
        ...customFood,
      };
      setSelectedFoods([
        ...selectedFoods,
        { food: newFood, portionSize: 100, portionUnit: 'g' },
      ]);
      setCustomFood({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      });
      setShowCustom(false);
    }
  };

  const removeFood = (id: number) => {
    setSelectedFoods(selectedFoods.filter((f) => f.food.id !== id));
  };

  const updatePortion = (id: number, size: number, unit: 'g' | 'oz' | 'cup') => {
    setSelectedFoods(
      selectedFoods.map((f) =>
        f.food.id === id ? { ...f, portionSize: size, portionUnit: unit } : f
      )
    );
  };

  const calculateAdjustedNutrition = (food: FoodItem, size: number, unit: 'g' | 'oz' | 'cup') => {
    const gramsPerUnit = PORTION_UNITS[unit].value;
    const totalGrams = size * gramsPerUnit;
    const ratio = totalGrams / 100; // Assuming nutrition data is per 100g

    return {
      calories: Math.round(food.calories * ratio),
      protein: (food.protein * ratio).toFixed(1),
      carbs: (food.carbs * ratio).toFixed(1),
      fat: (food.fat * ratio).toFixed(1),
      fiber: (food.fiber * ratio).toFixed(1),
    };
  };

  const getTotalNutrition = () => {
    let total = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    selectedFoods.forEach(({ food, portionSize, portionUnit }) => {
      const adjusted = calculateAdjustedNutrition(food, portionSize, portionUnit);
      total.calories += adjusted.calories;
      total.protein += parseFloat(adjusted.protein);
      total.carbs += parseFloat(adjusted.carbs);
      total.fat += parseFloat(adjusted.fat);
      total.fiber += parseFloat(adjusted.fiber);
    });

    return total;
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedFoods);
    }
    onClose();
  };

  const totalNutrition = getTotalNutrition();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Add Food Items</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Search Food Database
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-3 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{food.name}</p>
                      <p className="text-sm text-gray-600">{food.calories} cal/100g</p>
                    </div>
                    <button
                      onClick={() => addFood(food)}
                      className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <p className="mt-2 text-sm text-gray-600">Searching...</p>
            )}

            {searchQuery && searchResults.length === 0 && !loading && (
              <p className="mt-2 text-sm text-gray-600">No foods found</p>
            )}
          </div>

          {/* Custom Food */}
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Custom Food Item
            </button>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <input
                type="text"
                placeholder="Food name"
                value={customFood.name}
                onChange={(e) =>
                  setCustomFood({ ...customFood, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Calories"
                  value={customFood.calories}
                  onChange={(e) =>
                    setCustomFood({
                      ...customFood,
                      calories: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={customFood.protein}
                  onChange={(e) =>
                    setCustomFood({
                      ...customFood,
                      protein: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={customFood.carbs}
                  onChange={(e) =>
                    setCustomFood({
                      ...customFood,
                      carbs: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={customFood.fat}
                  onChange={(e) =>
                    setCustomFood({
                      ...customFood,
                      fat: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addCustomFood}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowCustom(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Foods</h3>
              <div className="space-y-4 mb-4">
                {selectedFoods.map(({ food, portionSize, portionUnit }) => {
                  const adjusted = calculateAdjustedNutrition(
                    food,
                    portionSize,
                    portionUnit
                  );

                  return (
                    <div
                      key={food.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-600">
                            {adjusted.calories} cal
                          </p>
                        </div>
                        <button
                          onClick={() => removeFood(food.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Portion Control */}
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">Portion</label>
                          <input
                            type="number"
                            value={portionSize}
                            onChange={(e) =>
                              updatePortion(
                                food.id,
                                parseFloat(e.target.value) || 0,
                                portionUnit
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">Unit</label>
                          <select
                            value={portionUnit}
                            onChange={(e) =>
                              updatePortion(
                                food.id,
                                portionSize,
                                e.target.value as 'g' | 'oz' | 'cup'
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="g">Grams</option>
                            <option value="oz">Ounces</option>
                            <option value="cup">Cups</option>
                          </select>
                        </div>
                      </div>

                      {/* Nutrition Info */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-red-50 rounded p-2">
                          <div className="font-semibold text-red-700">
                            {adjusted.protein}g
                          </div>
                          <div className="text-red-600">Protein</div>
                        </div>
                        <div className="bg-yellow-50 rounded p-2">
                          <div className="font-semibold text-yellow-700">
                            {adjusted.carbs}g
                          </div>
                          <div className="text-yellow-600">Carbs</div>
                        </div>
                        <div className="bg-blue-50 rounded p-2">
                          <div className="font-semibold text-blue-700">
                            {adjusted.fat}g
                          </div>
                          <div className="text-blue-600">Fat</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Nutrition */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Total Nutrition</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {totalNutrition.calories}
                    </div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {totalNutrition.protein.toFixed(1)}g
                      </div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {totalNutrition.carbs.toFixed(1)}g
                      </div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {totalNutrition.fat.toFixed(1)}g
                      </div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {totalNutrition.fiber.toFixed(1)}g
                      </div>
                      <div className="text-xs text-gray-600">Fiber</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedFoods.length === 0}
            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
          >
            Save {selectedFoods.length > 0 && `(${selectedFoods.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

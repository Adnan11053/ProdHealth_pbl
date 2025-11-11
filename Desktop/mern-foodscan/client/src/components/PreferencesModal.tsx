import React, { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
}

const commonAllergies = [
  'gluten', 'dairy', 'nuts', 'peanuts', 'eggs', 'soy', 'fish', 'shellfish', 'sesame'
];

const dietaryOptions = [
  'vegetarian', 'vegan', 'jain', 'halal', 'kosher', 'low-sodium', 'low-sugar', 
  'organic', 'gluten-free', 'keto', 'diabetic-friendly'
];

const healthGoalOptions = [
  'weight-management', 'heart-health', 'diabetes-control', 'blood-pressure', 
  'cholesterol-management', 'digestive-health', 'immunity-boost', 'energy-boost'
];

const harmfulIngredients = [
  'artificial colors', 'artificial flavors', 'preservatives', 'trans fats', 
  'high fructose corn syrup', 'MSG', 'sodium benzoate', 'BHA', 'BHT'
];

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSave
}) => {
  const [allergies, setAllergies] = useState(userProfile.allergies);
  const [dietaryPreferences, setDietaryPreferences] = useState(userProfile.dietaryPreferences);
  const [healthGoals, setHealthGoals] = useState(userProfile.healthGoals);
  const [avoidIngredients, setAvoidIngredients] = useState(userProfile.avoidIngredients);
  const [customAllergy, setCustomAllergy] = useState('');

  if (!isOpen) return null;

  const toggleItem = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies([...allergies, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const removeCustomItem = (item: string, list: string[], setList: (list: string[]) => void) => {
    setList(list.filter(i => i !== item));
  };

  const handleSave = () => {
    onSave({
      allergies,
      dietaryPreferences,
      healthGoals,
      avoidIngredients
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#05668d]">Health Preferences</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Allergies Section */}
          <div>
            <h3 className="text-lg font-semibold text-[#05668d] mb-4">Allergies & Sensitivities</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {commonAllergies.map(allergy => (
                <button
                  key={allergy}
                  onClick={() => toggleItem(allergy, allergies, setAllergies)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    allergies.includes(allergy)
                      ? 'bg-red-100 text-red-800 border-2 border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                placeholder="Add custom allergy"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              />
              <button
                onClick={addCustomAllergy}
                className="px-4 py-2 bg-[#02c39a] text-white rounded-lg hover:bg-[#028090] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {allergies.filter(a => !commonAllergies.includes(a)).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {allergies.filter(a => !commonAllergies.includes(a)).map(allergy => (
                  <span
                    key={allergy}
                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {allergy}
                    <button
                      onClick={() => removeCustomItem(allergy, allergies, setAllergies)}
                      className="ml-2 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dietary Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-[#05668d] mb-4">Dietary Preferences</h3>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map(option => (
                <button
                  key={option}
                  onClick={() => toggleItem(option, dietaryPreferences, setDietaryPreferences)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    dietaryPreferences.includes(option)
                      ? 'bg-[#02c39a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Health Goals */}
          <div>
            <h3 className="text-lg font-semibold text-[#05668d] mb-4">Health Goals</h3>
            <div className="grid grid-cols-2 gap-2">
              {healthGoalOptions.map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleItem(goal, healthGoals, setHealthGoals)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    healthGoals.includes(goal)
                      ? 'bg-[#028090] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {goal.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients to Avoid */}
          <div>
            <h3 className="text-lg font-semibold text-[#05668d] mb-4">Ingredients to Avoid</h3>
            <div className="grid grid-cols-2 gap-2">
              {harmfulIngredients.map(ingredient => (
                <button
                  key={ingredient}
                  onClick={() => toggleItem(ingredient, avoidIngredients, setAvoidIngredients)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    avoidIngredients.includes(ingredient)
                      ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[#05668d] text-white rounded-lg font-semibold hover:bg-[#028090] transition-colors flex items-center justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Plus, X, Dumbbell, ChevronDown } from 'lucide-react';

export default function ExerciseSelector({ exercises, selectedExercises, onAdd, onRemove }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedExercises.find(selected => selected.id === ex.id)
  );

  return (
    <div className="space-y-4">
      {/* Dropdown selector */}
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="border-2 border-gray-300 rounded-lg p-2 flex justify-between items-center cursor-pointer"
        >
          <span className="text-gray-600">Select exercises</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border-b-2 border-gray-200"
            />
            <div className="max-h-40 overflow-y-auto">
              {filteredExercises.map(exercise => (
                <div
                  key={exercise.id}
                  onClick={() => {
                    onAdd(exercise);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
                  {exercise.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected exercises with fixed height */}
      <div className="overflow-y-auto h-48 pr-2">
        <div className="space-y-2">
          {selectedExercises.map(exercise => (
            <div key={exercise.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center">
                <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
                <span>{exercise.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(exercise.id)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
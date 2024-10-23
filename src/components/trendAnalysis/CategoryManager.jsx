import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

const CategoryManager = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    if (newCategory && categories.length < 7) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Manage Categories</h3>
      <div className="flex space-x-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="flex-grow"
        />
        <Button onClick={addCategory} disabled={categories.length >= 7}>
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={category}
              onChange={(e) => {
                const updatedCategories = [...categories];
                updatedCategories[index] = e.target.value;
                setCategories(updatedCategories);
              }}
              className="flex-grow"
            />
            <Button variant="destructive" onClick={() => removeCategory(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
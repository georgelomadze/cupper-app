export interface WheelGroup {
  id: string
  name: string
  color: string
  subgroups: WheelSubgroup[]
}

export interface WheelSubgroup {
  id: string
  name: string
  descriptors: string[]
}

export const WHEEL_DATA: WheelGroup[] = [
  {
    id: 'fruity',
    name: 'Fruity',
    color: '#C04040',
    subgroups: [
      { id: 'berry',       name: 'Berry',        descriptors: ['Blackberry', 'Raspberry', 'Blueberry', 'Strawberry'] },
      { id: 'dried-fruit', name: 'Dried Fruit',  descriptors: ['Raisin', 'Prune'] },
      { id: 'other-fruit', name: 'Other Fruit',  descriptors: ['Coconut', 'Cherry', 'Pomegranate', 'Pineapple', 'Grape', 'Apple', 'Peach', 'Pear'] },
      { id: 'citrus',      name: 'Citrus Fruit', descriptors: ['Grapefruit', 'Orange', 'Lemon', 'Lime'] },
    ],
  },
  {
    id: 'floral',
    name: 'Floral',
    color: '#D4609A',
    subgroups: [
      { id: 'black-tea', name: 'Black Tea', descriptors: ['Black Tea'] },
      { id: 'floral',    name: 'Floral',    descriptors: ['Chamomile', 'Rose', 'Jasmine'] },
    ],
  },
  {
    id: 'sweet',
    name: 'Sweet',
    color: '#B07A30',
    subgroups: [
      { id: 'vanilla',      name: 'Vanilla',      descriptors: ['Vanilla', 'Vanillin'] },
      { id: 'caramel',      name: 'Caramel',      descriptors: ['Caramelized', 'Toffee'] },
      { id: 'chocolate',    name: 'Chocolate',    descriptors: ['Chocolate', 'Dark Chocolate', 'Milk Chocolate'] },
      { id: 'brown-sugar',  name: 'Brown Sugar',  descriptors: ['Molasses', 'Maple Syrup', 'Honey'] },
    ],
  },
  {
    id: 'nutty-cocoa',
    name: 'Nutty / Cocoa',
    color: '#7A5C2A',
    subgroups: [
      { id: 'nutty', name: 'Nutty', descriptors: ['Peanuts', 'Hazelnut', 'Almond'] },
      { id: 'cocoa', name: 'Cocoa', descriptors: ['Cocoa', 'Dark Cocoa'] },
    ],
  },
  {
    id: 'spices',
    name: 'Spices',
    color: '#8A4A1E',
    subgroups: [
      { id: 'brown-spice', name: 'Brown Spice', descriptors: ['Clove', 'Cinnamon', 'Nutmeg', 'Anise', 'Muscat'] },
      { id: 'pungent',     name: 'Pungent',     descriptors: ['Pepper'] },
    ],
  },
  {
    id: 'roasted',
    name: 'Roasted',
    color: '#4A4A4A',
    subgroups: [
      { id: 'cereal',  name: 'Cereal',  descriptors: ['Grain', 'Malt'] },
      { id: 'burnt',   name: 'Burnt',   descriptors: ['Acrid', 'Ashy', 'Smoky', 'Brown Roast'] },
      { id: 'tobacco', name: 'Tobacco', descriptors: ['Tobacco'] },
    ],
  },
  {
    id: 'sour',
    name: 'Sour / Fermented',
    color: '#4A7A30',
    subgroups: [
      { id: 'sour',       name: 'Sour',                  descriptors: ['Sour Aromatics', 'Acetic Acid', 'Butyric Acid', 'Isovaleric Acid', 'Citric Acid', 'Malic Acid'] },
      { id: 'fermented',  name: 'Alcohol / Fermented',   descriptors: ['Winey', 'Whiskey', 'Fermented', 'Overripe'] },
    ],
  },
  {
    id: 'green',
    name: 'Green / Vegetative',
    color: '#2A7A3A',
    subgroups: [
      { id: 'olive',      name: 'Olive Oil',        descriptors: ['Olive Oil'] },
      { id: 'raw',        name: 'Raw',              descriptors: ['Under-ripe', 'Peapod', 'Fresh', 'Dark Green', 'Vegetative', 'Hay-like', 'Herb-like'] },
      { id: 'beany',      name: 'Beany',            descriptors: ['Beany'] },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    color: '#4A4A6A',
    subgroups: [
      { id: 'papery',   name: 'Papery / Musty', descriptors: ['Stale', 'Cardboard', 'Papery', 'Woody', 'Moldy/Damp', 'Musty/Dusty', 'Musty/Earthy', 'Animalic', 'Meaty/Brothy', 'Phenolic'] },
      { id: 'chemical', name: 'Chemical',        descriptors: ['Bitter', 'Salty', 'Medicinal', 'Petroleum', 'Skunky', 'Rubber'] },
    ],
  },
]

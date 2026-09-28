const categoriesData = [
  { _id: 'cat_1', name: 'Salad', slug: 'salad', image: '/assets/menu_1.png', description: 'Fresh, healthy & organic green salads', itemCount: 4, isPopular: true, order: 1 },
  { _id: 'cat_2', name: 'Rolls', slug: 'rolls', image: '/assets/menu_2.png', description: 'Delicious kathi rolls & wraps', itemCount: 4, isPopular: true, order: 2 },
  { _id: 'cat_3', name: 'Desserts', slug: 'desserts', image: '/assets/menu_3.png', description: 'Sweet cakes, ice creams & pastries', itemCount: 4, isPopular: true, order: 3 },
  { _id: 'cat_4', name: 'Sandwich', slug: 'sandwich', image: '/assets/menu_4.png', description: 'Grilled & toasted gourmet sandwiches', itemCount: 4, isPopular: true, order: 4 },
  { _id: 'cat_5', name: 'Cake', slug: 'cake', image: '/assets/menu_5.png', description: 'Freshly baked artisanal cakes', itemCount: 4, isPopular: true, order: 5 },
  { _id: 'cat_6', name: 'Pure Veg', slug: 'pure-veg', image: '/assets/menu_6.png', description: '100% pure vegetarian authentic delicacies', itemCount: 4, isPopular: true, order: 6 },
  { _id: 'cat_7', name: 'Pasta', slug: 'pasta', image: '/assets/menu_7.png', description: 'Italian creamy & tomato pastas', itemCount: 4, isPopular: true, order: 7 },
  { _id: 'cat_8', name: 'Noodles', slug: 'noodles', image: '/assets/menu_8.png', description: 'Asian noodles & stir fries', itemCount: 4, isPopular: true, order: 8 }
];

const restaurantsData = [
  {
    _id: 'rest_1',
    name: 'The Green Garden Cafe',
    slug: 'the-green-garden-cafe',
    image: '/assets/food_1.png',
    coverImage: '/assets/header_img.png',
    description: 'Organic farm-to-table salads, health bowls & artisanal fresh juices.',
    cuisine: ['Salad', 'Healthy Food', 'Pure Veg'],
    rating: 4.8,
    ratingCount: 340,
    priceRange: '$$',
    costForTwo: 400,
    deliveryTime: '20-30 min',
    deliveryFee: 25,
    minOrder: 150,
    address: { street: '12 Marine Drive', city: 'Mumbai', state: 'Maharashtra', postalCode: '400020' },
    location: { lat: 18.9438, lng: 72.823 },
    isVegOnly: true,
    isOpen: true,
    tags: ['Organic', 'Low Calorie', 'Top Rated'],
    offerText: '50% OFF up to ₹100'
  },
  {
    _id: 'rest_2',
    name: 'Rolls & Wraps Station',
    slug: 'rolls-wraps-station',
    image: '/assets/food_7.png',
    coverImage: '/assets/header_img.png',
    description: 'Sizzling hot kathi rolls, paneer wraps & spiced chicken rolls.',
    cuisine: ['Rolls', 'Fast Food', 'Street Food'],
    rating: 4.6,
    ratingCount: 520,
    priceRange: '$',
    costForTwo: 250,
    deliveryTime: '15-25 min',
    deliveryFee: 20,
    minOrder: 100,
    address: { street: '45 Bandra West', city: 'Mumbai', state: 'Maharashtra', postalCode: '400050' },
    location: { lat: 19.0596, lng: 72.8295 },
    isVegOnly: false,
    isOpen: true,
    tags: ['Quick Bite', 'Late Night'],
    offerText: 'FREE DELIVERY on orders above ₹199'
  },
  {
    _id: 'rest_3',
    name: 'Sweet Bliss Desserts & Bakery',
    slug: 'sweet-bliss-desserts',
    image: '/assets/food_9.png',
    coverImage: '/assets/header_img.png',
    description: 'Decadent ice cream scoops, jar cakes, and premium chocolates.',
    cuisine: ['Desserts', 'Cake', 'Bakery'],
    rating: 4.9,
    ratingCount: 890,
    priceRange: '$$$',
    costForTwo: 500,
    deliveryTime: '25-35 min',
    deliveryFee: 35,
    minOrder: 200,
    address: { street: '88 Juhu Tara Road', city: 'Mumbai', state: 'Maharashtra', postalCode: '400049' },
    location: { lat: 19.1075, lng: 72.8263 },
    isVegOnly: true,
    isOpen: true,
    tags: ['Best Desserts', 'Gourmet'],
    offerText: 'FLAT ₹120 OFF'
  },
  {
    _id: 'rest_4',
    name: 'Bella Italia Pasta & Pizza Bar',
    slug: 'bella-italia-pasta-pizza',
    image: '/assets/food_25.png',
    coverImage: '/assets/header_img.png',
    description: 'Handcrafted wood-fired pizzas and creamy Alfredo & Arrabbiata pastas.',
    cuisine: ['Pasta', 'Pizza', 'Italian'],
    rating: 4.7,
    ratingCount: 410,
    priceRange: '$$',
    costForTwo: 600,
    deliveryTime: '30-40 min',
    deliveryFee: 30,
    minOrder: 250,
    address: { street: '102 Powai Hiranandani', city: 'Mumbai', state: 'Maharashtra', postalCode: '400076' },
    location: { lat: 19.1197, lng: 72.905 },
    isVegOnly: false,
    isOpen: true,
    tags: ['Italian Authentic', 'Chef Special'],
    offerText: '20% OFF'
  }
];

const menuItemsData = [
  { _id: 'food_1', name: 'Greek Salad', restaurantId: 'rest_1', category: 'Salad', description: 'Fresh cucumbers, juicy tomatoes, olives & authentic feta cheese.', price: 180, image: '/assets/food_1.png', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.8 },
  { _id: 'food_2', name: 'Veg Garden Salad', restaurantId: 'rest_1', category: 'Salad', description: 'Crunchy lettuce, avocado slices, bell peppers with lemon dressing.', price: 220, image: '/assets/food_2.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.6 },
  { _id: 'food_3', name: 'Clover Protein Salad', restaurantId: 'rest_1', category: 'Salad', description: 'Sprouted clover greens, chickpeas, walnuts & honey mustard vinaigrette.', price: 240, image: '/assets/food_3.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.7 },
  { _id: 'food_4', name: 'Grilled Chicken Salad', restaurantId: 'rest_1', category: 'Salad', description: 'Herb roasted chicken breast over crisp romaine lettuce.', price: 290, image: '/assets/food_4.png', isVeg: false, isAvailable: true, isBestseller: true, rating: 4.9 },

  { _id: 'food_5', name: 'Lasagna Roll', restaurantId: 'rest_2', category: 'Rolls', description: 'Layered pasta roll stuffed with ricotta cheese & slow-cooked marinara.', price: 190, image: '/assets/food_5.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.5 },
  { _id: 'food_6', name: 'Peri Peri Paneer Roll', restaurantId: 'rest_2', category: 'Rolls', description: 'Spicy peri peri marinated cottage cheese wrapped in a crispy paratha.', price: 160, image: '/assets/food_6.png', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.7 },
  { _id: 'food_7', name: 'Smoked Chicken Roll', restaurantId: 'rest_2', category: 'Rolls', description: 'Tender charcoal-smoked chicken chunks with mint chutney wrapper.', price: 210, image: '/assets/food_7.png', isVeg: false, isAvailable: true, isBestseller: true, rating: 4.8 },
  { _id: 'food_8', name: 'Classic Veg Frankie', restaurantId: 'rest_2', category: 'Rolls', description: 'Spiced potato and corn patty wrapped with tangy onions.', price: 130, image: '/assets/food_8.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.4 },

  { _id: 'food_9', name: 'Ripple Chocolate Fudge Ice Cream', restaurantId: 'rest_3', category: 'Desserts', description: 'Rich belgian chocolate ice cream with caramel ripple swirls.', price: 150, image: '/assets/food_9.png', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.9 },
  { _id: 'food_10', name: 'Exotic Fruit Sundae', restaurantId: 'rest_3', category: 'Desserts', description: 'Fresh mango, berries & vanilla bean ice cream layers.', price: 210, image: '/assets/food_10.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.7 },
  { _id: 'food_11', name: 'Red Velvet Jar Cake', restaurantId: 'rest_3', category: 'Desserts', description: 'Moist red velvet sponge layers with cream cheese frosting.', price: 180, image: '/assets/food_11.png', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.8 },
  { _id: 'food_12', name: 'Vanilla Bean Ice Cream', restaurantId: 'rest_3', category: 'Desserts', description: 'Classic Madagascar vanilla bean double scoop.', price: 120, image: '/assets/food_12.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.5 },

  { _id: 'food_17', name: 'Chocolate Cup Cake Pack', restaurantId: 'rest_3', category: 'Cake', description: 'Assorted dark chocolate and hazelnut cupcakes.', price: 190, image: '/assets/food_17.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.6 },
  { _id: 'food_19', name: 'Butterscotch Crunch Cake (500g)', restaurantId: 'rest_3', category: 'Cake', description: 'Golden butterscotch sponge with caramelized praline crunch.', price: 450, image: '/assets/food_19.png', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.9 },

  { _id: 'food_25', name: 'Four Cheese Alfredo Pasta', restaurantId: 'rest_4', category: 'Pasta', description: 'Penne tossed in rich mozzarella, cheddar, parmesan & gorgonzola sauce.', price: 320, image: '/assets/food_25.png', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.8 },
  { _id: 'food_26', name: 'Spicy Tomato Arrabbiata Pasta', restaurantId: 'rest_4', category: 'Pasta', description: 'Fusilli pasta in fiery san marzano tomato sauce with fresh basil.', price: 280, image: '/assets/food_26.png', isVeg: true, isAvailable: true, isBestseller: false, rating: 4.6 },
  { _id: 'food_27', name: 'Creamy Mushroom Pink Pasta', restaurantId: 'rest_4', category: 'Pasta', description: 'Farfalle pasta coated in rich pink rose sauce with wild mushrooms.', price: 310, image: '/assets/food_27.png', isVeg: true, isAvailable: true, isBestseller: true, rating: 4.7 },
  { _id: 'food_28', name: 'Grilled Chicken Fettuccine', restaurantId: 'rest_4', category: 'Pasta', description: 'Ribbon fettuccine with roasted chicken breast and garlicky cream.', price: 360, image: '/assets/food_28.png', isVeg: false, isAvailable: true, isBestseller: true, rating: 4.9 }
];

const couponsData = [
  { _id: 'coup_1', code: 'WELCOME50', description: '50% OFF on your first order up to ₹100', discountType: 'PERCENTAGE', discountValue: 50, maxDiscount: 100, minOrder: 150, isActive: true },
  { _id: 'coup_2', code: 'FOODIE100', description: 'FLAT ₹100 OFF on orders above ₹399', discountType: 'FLAT', discountValue: 100, maxDiscount: 100, minOrder: 399, isActive: true },
  { _id: 'coup_3', code: 'FREEDEL', description: 'Free Delivery discount on orders above ₹199', discountType: 'FLAT', discountValue: 30, maxDiscount: 30, minOrder: 199, isActive: true }
];

const mockUsersData = [
  { _id: 'usr_admin', name: 'Admin User', email: 'admin@foodie.com', role: 'ADMIN', isVerified: true },
  { _id: 'usr_demo', name: 'Demo Customer', email: 'user@foodie.com', role: 'USER', isVerified: true }
];

module.exports = {
  categoriesData,
  restaurantsData,
  menuItemsData,
  couponsData,
  mockUsersData
};

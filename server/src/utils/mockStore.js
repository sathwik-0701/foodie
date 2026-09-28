const { categoriesData, restaurantsData, menuItemsData, couponsData, mockUsersData } = require('./seedData');

class MockStore {
  constructor() {
    this.categories = [...categoriesData];
    this.restaurants = [...restaurantsData];
    this.menuItems = [...menuItemsData];
    this.coupons = [...couponsData];
    this.users = [...mockUsersData];
    this.orders = [];
    this.reviews = [
      {
        _id: 'rev_1',
        userName: 'Aarav Sharma',
        restaurantId: 'rest_1',
        rating: 5,
        comment: 'Fresh crisp vegetables and amazing salad dressings! Will order again.',
        createdAt: new Date()
      },
      {
        _id: 'rev_2',
        userName: 'Priya Patel',
        restaurantId: 'rest_3',
        rating: 5,
        comment: 'The Red Velvet Jar cake is pure heavenly indulgence!',
        createdAt: new Date()
      }
    ];
    this.favorites = [];
    this.addresses = [
      {
        _id: 'addr_1',
        userId: 'usr_demo',
        name: 'Demo Customer',
        flat: 'Flat 402, Sunshine Heights',
        street: 'MG Road, Bandra West',
        landmark: 'Opposite City Mall',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        phone: '9876543210',
        type: 'Home',
        isDefault: true
      }
    ];
  }

  // Categories
  getCategories() { return this.categories; }
  addCategory(category) {
    const newCat = { _id: 'cat_' + Date.now(), itemCount: 0, isPopular: true, order: this.categories.length + 1, ...category };
    this.categories.push(newCat);
    return newCat;
  }
  updateCategory(id, updates) {
    const idx = this.categories.findIndex(c => c._id === id);
    if (idx !== -1) {
      this.categories[idx] = { ...this.categories[idx], ...updates };
      return this.categories[idx];
    }
    return null;
  }
  deleteCategory(id) {
    this.categories = this.categories.filter(c => c._id !== id);
    return true;
  }

  // Restaurants
  getRestaurants({ search, cuisine, isVegOnly, sort }) {
    let list = [...this.restaurants];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisine.some(c => c.toLowerCase().includes(q)) ||
        r.description.toLowerCase().includes(q)
      );
    }

    if (cuisine) {
      list = list.filter(r => r.cuisine.includes(cuisine));
    }

    if (isVegOnly === 'true' || isVegOnly === true) {
      list = list.filter(r => r.isVegOnly === true);
    }

    if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'price_low') {
      list.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sort === 'price_high') {
      list.sort((a, b) => b.costForTwo - a.costForTwo);
    } else if (sort === 'delivery_time') {
      list.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    }

    return list;
  }

  getRestaurantById(idOrSlug) {
    return this.restaurants.find(r => r._id === idOrSlug || r.slug === idOrSlug);
  }

  addRestaurant(data) {
    const newRest = {
      _id: 'rest_' + Date.now(),
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 4.5,
      ratingCount: 1,
      isOpen: true,
      cuisine: Array.isArray(data.cuisine) ? data.cuisine : [data.cuisine],
      ...data
    };
    this.restaurants.push(newRest);
    return newRest;
  }

  updateRestaurant(id, updates) {
    const idx = this.restaurants.findIndex(r => r._id === id);
    if (idx !== -1) {
      this.restaurants[idx] = { ...this.restaurants[idx], ...updates };
      return this.restaurants[idx];
    }
    return null;
  }

  deleteRestaurant(id) {
    this.restaurants = this.restaurants.filter(r => r._id !== id);
    this.menuItems = this.menuItems.filter(m => m.restaurantId !== id);
    return true;
  }

  // Menu items
  getMenuItems(restaurantId, category) {
    let list = this.menuItems;
    if (restaurantId) list = list.filter(m => m.restaurantId === restaurantId);
    if (category) list = list.filter(m => m.category === category);
    return list;
  }

  addMenuItem(data) {
    const newItem = {
      _id: 'food_' + Date.now(),
      rating: 4.6,
      isAvailable: true,
      ...data
    };
    this.menuItems.push(newItem);
    return newItem;
  }

  updateMenuItem(id, updates) {
    const idx = this.menuItems.findIndex(m => m._id === id);
    if (idx !== -1) {
      this.menuItems[idx] = { ...this.menuItems[idx], ...updates };
      return this.menuItems[idx];
    }
    return null;
  }

  deleteMenuItem(id) {
    this.menuItems = this.menuItems.filter(m => m._id !== id);
    return true;
  }

  // Orders
  createOrder(orderData) {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderId,
      orderStatus: 'PLACED',
      paymentStatus: 'PAID',
      createdAt: new Date(),
      timeline: [
        { status: 'PLACED', label: 'Order Placed', timestamp: new Date(), completed: true },
        { status: 'CONFIRMED', label: 'Restaurant Confirmed', completed: false },
        { status: 'PREPARING', label: 'Preparing Food', completed: false },
        { status: 'READY', label: 'Food Ready', completed: false },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', completed: false },
        { status: 'DELIVERED', label: 'Order Delivered', completed: false }
      ],
      ...orderData
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrders(userId) {
    if (userId) return this.orders.filter(o => o.userId === userId);
    return this.orders;
  }

  getOrderById(orderId) {
    return this.orders.find(o => o._id === orderId || o.orderId === orderId);
  }

  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.orderStatus = status;

    const statuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = statuses.indexOf(status);

    if (currentIdx !== -1) {
      order.timeline.forEach((step, idx) => {
        if (idx <= currentIdx) {
          step.completed = true;
          step.timestamp = step.timestamp || new Date();
        }
      });
    }

    return order;
  }

  // Coupons
  getCoupons() { return this.coupons; }
  validateCoupon(code, orderTotal) {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) return { valid: false, message: 'Invalid or expired coupon code' };
    if (orderTotal < coupon.minOrder) return { valid: false, message: `Minimum order amount of ₹${coupon.minOrder} required for this coupon` };

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.min((orderTotal * coupon.discountValue) / 100, coupon.maxDiscount);
    } else {
      discount = Math.min(coupon.discountValue, coupon.maxDiscount);
    }

    return { valid: true, coupon, discount };
  }

  // Addresses
  getAddresses(userId) {
    return this.addresses.filter(a => a.userId === userId);
  }

  addAddress(addressData) {
    const newAddr = { _id: 'addr_' + Date.now(), ...addressData };
    if (newAddr.isDefault) {
      this.addresses.forEach(a => { if (a.userId === newAddr.userId) a.isDefault = false; });
    }
    this.addresses.push(newAddr);
    return newAddr;
  }

  deleteAddress(id) {
    this.addresses = this.addresses.filter(a => a._id !== id);
    return true;
  }

  // Favorites
  getFavorites(userId) {
    const favRestIds = this.favorites.filter(f => f.userId === userId).map(f => f.restaurantId);
    return this.restaurants.filter(r => favRestIds.includes(r._id));
  }

  toggleFavorite(userId, restaurantId) {
    const idx = this.favorites.findIndex(f => f.userId === userId && f.restaurantId === restaurantId);
    if (idx !== -1) {
      this.favorites.splice(idx, 1);
      return { favorited: false };
    } else {
      this.favorites.push({ userId, restaurantId, createdAt: new Date() });
      return { favorited: true };
    }
  }

  // Reviews
  getReviews(restaurantId) {
    return this.reviews.filter(r => r.restaurantId === restaurantId);
  }

  addReview(reviewData) {
    const newReview = { _id: 'rev_' + Date.now(), createdAt: new Date(), ...reviewData };
    this.reviews.unshift(newReview);
    return newReview;
  }

  // Support Tickets
  getTickets(userId) {
    if (!this.tickets) this.tickets = [];
    if (userId) return this.tickets.filter(t => t.userId === userId);
    return this.tickets;
  }

  getTicketById(ticketId) {
    if (!this.tickets) this.tickets = [];
    return this.tickets.find(t => t._id === ticketId || t.ticketId === ticketId);
  }

  createTicket(ticketData) {
    if (!this.tickets) this.tickets = [];
    const ticketId = 'SUP-' + Math.floor(10000 + Math.random() * 90000);
    const newTicket = {
      _id: 'tkt_' + Date.now(),
      ticketId,
      status: 'IN_PROGRESS',
      createdAt: new Date(),
      assignedAgent: {
        name: 'Sarah Jenkins (Senior Support Lead)',
        avatar: '',
        phone: '+1-800-FOODIE-HELP'
      },
      messages: [
        {
          sender: 'SYSTEM',
          senderName: 'Foodie Assistant',
          message: `Ticket #${ticketId} created. Senior Support Agent Sarah Jenkins has been assigned to assist you with order ${ticketData.orderId || ''}.`,
          timestamp: new Date()
        },
        {
          sender: 'USER',
          senderName: ticketData.userName || 'Customer',
          message: ticketData.description,
          timestamp: new Date()
        },
        {
          sender: 'SUPPORT_AGENT',
          senderName: 'Sarah Jenkins',
          message: `Hello ${ticketData.userName || 'there'}, I'm so sorry to hear about your experience with ${ticketData.restaurantName || 'this order'}. I have reviewed your concern (${ticketData.issueCategory}) and I am escalating this to issue a full refund / replacement for you right away!`,
          timestamp: new Date(Date.now() + 1000)
        }
      ],
      ...ticketData
    };
    this.tickets.unshift(newTicket);
    return newTicket;
  }

  addMessageToTicket(ticketId, messageObj) {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return null;
    ticket.messages.push({
      timestamp: new Date(),
      ...messageObj
    });
    return ticket;
  }
}

module.exports = new MockStore();

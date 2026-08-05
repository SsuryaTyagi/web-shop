const MenuItem = require("../Models/menu.model.js");

// GET /api/menu
// Get all menu items (optionally filter by category or popular)
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, popular } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (popular !== undefined) filter.popular = popular === "true";

    const menuItems = await MenuItem.find(filter);
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: error.message });
  }
};

// GET /api/menu/:id
// Get a single menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu item", error: error.message });
  }
};

// POST /api/menu
// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const newMenuItem = new MenuItem(req.body);
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to create menu item", error: error.message });
  }
};

// PUT /api/menu/:id
// Update an existing menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to update menu item", error: error.message });
  }
};

// DELETE /api/menu/:id
// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete menu item", error: error.message });
  }
};
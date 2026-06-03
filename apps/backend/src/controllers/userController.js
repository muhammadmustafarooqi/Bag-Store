const { User } = require('@kaarvan/db');

// GET /api/v1/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// PUT /api/v1/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// POST /api/v1/users/address
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user.addresses });
  } catch (err) { next(err); }
};

// PUT /api/v1/users/address/:id
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    if (req.body.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }
    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) { next(err); }
};

// DELETE /api/v1/users/address/:id
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) { next(err); }
};

// GET /api/v1/users/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name slug images price salePrice onSale stock');
    res.json({ success: true, data: user.wishlist });
  } catch (err) { next(err); }
};

// POST /api/v1/users/wishlist/:productId
exports.addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (err) { next(err); }
};

// DELETE /api/v1/users/wishlist/:productId
exports.removeFromWishlist = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: req.params.productId },
    });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) { next(err); }
};

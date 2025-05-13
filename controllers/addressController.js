import User from "../models/User.js";

export const getAddresses = async (req, res) => {
    const user = await User.findById(req.user._id).select("addresses");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.addresses);
};

export const addAddress = async (req, res) => {
    const {
        name,
        address,
        city,
        state,
        country,
        pincode,
        phone,
        default: isDefault,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (isDefault) user.addresses.forEach((addr) => (addr.default = false));
    user.addresses.push({
        name,
        address,
        city,
        state,
        country,
        pincode,
        phone,
        default: isDefault,
    });
    await user.save();
    res.json(user.addresses);
};

export const updateAddress = async (req, res) => {
    const { addressId } = req.params;
    const {
        name,
        address,
        city,
        state,
        country,
        pincode,
        phone,
        default: isDefault,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });
    if (isDefault) user.addresses.forEach((a) => (a.default = false));
    Object.assign(addr, {
        name,
        address,
        city,
        state,
        country,
        pincode,
        phone,
        default: isDefault,
    });
    await user.save();
    res.json(user.addresses);
};

export const deleteAddress = async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.addresses.id(addressId).remove();
    await user.save();
    res.json(user.addresses);
};

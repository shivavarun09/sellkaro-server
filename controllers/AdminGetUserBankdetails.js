const BankAccount = require("../Model/bankAccountModel");

// GET /bankaccount/:userId  (Admin only)
const getUserBankAccountByAdmin = async (req, res) => {
  try {
    // Check admin role (assuming req.user is set by auth middleware)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const { userId } = req.params;

    const bankAccount = await BankAccount.findOne({ user: userId })
    .select("accountHolderName accountNumber ifscCode bankName");

    if (!bankAccount) {
      return res.status(404).json({ message: "No bank account found for this user" });
    }

    res.status(200).json({
      message: "Bank account fetched successfully",
      data: bankAccount,
    });
  } catch (error) {
    console.error("Error fetching bank account by admin:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getUserBankAccountByAdmin;

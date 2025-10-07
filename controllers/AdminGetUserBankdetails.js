// GET /bankaccount/:userId  (Admin only)
const BankAccount = require("../Model/bankAccountModel");

const getUserBankAccountByAdmin = async (req, res) => {
  try {
    const { userId } = req.params; // admin gives userId in the URL

    const bankAccount = await BankAccount.findOne({ user: userId });

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
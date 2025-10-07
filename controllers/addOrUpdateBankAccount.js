const BankAccount = require("../Model/bankAccountModel");
const BankAddMail = require("../utils/nodeMailer")

// Add or update bank account
const addOrUpdateBankAccount = async (req, res) => {
  try {
    const { bankName,accountHolderName, accountNumber, ifscCode } = req.body;

    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already has a bank account
    let bankAccount = await BankAccount.findOne({ user: req.user._id });

    if (bankAccount) {
      // Update existing
            bankAccount.bankName = bankName;
                  bankAccount.accountHolderName = accountHolderName;

      bankAccount.accountNumber = accountNumber;
      bankAccount.ifscCode = ifscCode;

      await bankAccount.save();

      return res.status(200).json({
        message: "Bank account updated successfully",
        data: bankAccount,
      });
    } else {
      // Create new
      bankAccount = await BankAccount.create({
        user: req.user._id,
                bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
      });
// Sending Bank acccount added email to user
await BankAddMail(
   req.user.email,
      "New Bank Account Added",
      `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Hello, ${req.user.name}!</h2>
        <p>Your bank account has been successfully added on SELLKARO.</p>
        <p>Bank Name: ${bankName}</p>
        <p>Account No: ${accountNumber}</p>
        <p>Ifsc code: ${ifscCode}</p>
      </div>`
);


      return res.status(201).json({
        message: "Bank account added successfully",
        data: bankAccount,
      });
    }
  } catch (error) {
    console.error("Error adding/updating bank account:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch logged-in user's bank account
const getBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOne({ user: req.user._id });

    if (!bankAccount) {
      return res.status(404).json({ message: "No bank account found" });
    }

    res.status(200).json({
      message: "Bank account fetched successfully",
      data: bankAccount,
    });
  } catch (error) {
    console.error("Error fetching bank account:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addOrUpdateBankAccount, getBankAccount };

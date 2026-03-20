const Transaction = require("../models/Transaction");
const Resource = require("../models/Resource");
const Withdrawal = require("../models/Withdrawal");

const todayString = () => new Date().toISOString().split("T")[0];

const toTransactionDto = (t) => ({
  id: t.id,
  date: t.date,
  resourceName: t.resourceName,
  resourceId: t.resourceId,
  amount: t.amount,
  status: t.status,
  buyerId: t.buyerId,
  sellerId: t.sellerId,
});

const checkout = async (req, res) => {
  const buyerId = req.user.id;
  const { paymentMethod, items, card } = req.body;

  // PaymentMethod/card is already validated by zod in routes; we just ensure resources match business rules.
  const resourceIds = items.map((i) => i.resourceId);
  const resources = await Resource.find({ id: { $in: resourceIds } }).lean();

  if (resources.length !== resourceIds.length) {
    return res.status(400).json({ message: "One or more resources are invalid" });
  }

  const byId = new Map(resources.map((r) => [r.id, r]));

  for (const item of items) {
    const r = byId.get(item.resourceId);
    if (!r) return res.status(400).json({ message: `Invalid resource: ${item.resourceId}` });
    if (r.status !== "verified") {
      return res.status(400).json({ message: `Resource is not purchasable: ${r.title}` });
    }
  }

  const date = todayString();
  const timestamp = Date.now();

  const txns = items.map((item, idx) => {
    const r = byId.get(item.resourceId);
    const amount = (r.price ?? 0) * item.quantity;
    const t = {
      id: `t${timestamp}-${item.resourceId}-${idx}`,
      date,
      resourceName: r.title,
      resourceId: r.id,
      amount,
      status: "pending",
      buyerId,
      sellerId: r.uploadedBy,
      paymentMethod,
    };

    if (paymentMethod === "card" && card) {
      t.cardLast4 = card.cardLast4;
      t.expiryMonth = card.expiryMonth;
      t.expiryYear = card.expiryYear;
    }

    return t;
  });

  try {
    const created = await Transaction.insertMany(txns);
    return res.status(201).json({ transactions: created.map(toTransactionDto) });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create checkout transactions" });
  }
};

const updateTransactionStatus = async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  const txn = await Transaction.findOne({ id: transactionId });
  if (!txn) return res.status(404).json({ message: "Transaction not found" });

  const from = txn.status;
  const allowed =
    (from === "pending" && status === "paid") ||
    (from === "pending" && status === "verified") ||
    (from === "verified" && status === "paid");

  if (!allowed) {
    return res.status(400).json({
      message: `Invalid status transition from '${from}' to '${status}'`,
    });
  }

  txn.status = status;
  await txn.save();

  return res.json({ transaction: toTransactionDto(txn) });
};

const getTransactions = async (req, res) => {
  const { role, id } = req.user;

  const query = role === "admin" ? {} : { $or: [{ buyerId: id }, { sellerId: id }] };
  const txns = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ transactions: txns.map(toTransactionDto) });
};

const withdraw = async (req, res) => {
  const sellerId = req.user.id;

  const paid = await Transaction.aggregate([
    { $match: { sellerId, status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const grossPaid = paid[0]?.total ?? 0;

  const withdrawn = await Withdrawal.aggregate([
    { $match: { sellerId, status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const alreadyWithdrawn = withdrawn[0]?.total ?? 0;

  const availableNet = Math.max(0, grossPaid - alreadyWithdrawn);
  if (availableNet <= 0) {
    return res.status(400).json({ message: "No available earnings to withdraw" });
  }

  const withdrawal = await Withdrawal.create({
    id: `w${Date.now()}-${sellerId}`,
    sellerId,
    amount: availableNet,
    status: "completed",
    date: todayString(),
  });

  return res.status(201).json({
    message: "Withdrawal processed successfully",
    withdrawal: {
      id: withdrawal.id,
      sellerId: withdrawal.sellerId,
      amount: withdrawal.amount,
      status: withdrawal.status,
      date: withdrawal.date,
    },
    availableAfter: Math.max(0, availableNet - availableNet),
  });
};

const getWithdrawals = async (req, res) => {
  const sellerId = req.user.id;
  const withdrawals = await Withdrawal.find({ sellerId }).sort({ createdAt: -1 }).lean();

  return res.json({
    withdrawals: withdrawals.map((w) => ({
      id: w.id,
      sellerId: w.sellerId,
      amount: w.amount,
      status: w.status,
      date: w.date,
    })),
  });
};

module.exports = {
  checkout,
  updateTransactionStatus,
  getTransactions,
  withdraw,
  getWithdrawals,
};


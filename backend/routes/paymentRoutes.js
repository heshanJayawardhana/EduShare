const express = require("express");
const { z } = require("zod");

const { requireUser, requireRole } = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validateMiddleware");
const paymentController = require("../controllers/paymentController");

const checkoutSchema = z
  .object({
    paymentMethod: z.enum(["card", "paypal"]),
    items: z
      .array(
        z.object({
          resourceId: z.string().min(1),
          quantity: z.number().int().min(1).max(20),
        })
      )
      .min(1),
    card: z
      .object({
        cardLast4: z.string().regex(/^\d{4}$/),
        expiryMonth: z.number().int().min(1).max(12),
        expiryYear: z.number().int().min(2000).max(2099),
      })
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.paymentMethod === "card" && !val.card) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card details are required when paymentMethod is 'card'",
        path: ["card"],
      });
    }

    if (val.paymentMethod === "paypal" && val.card) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card details must be omitted when paymentMethod is 'paypal'",
        path: ["card"],
      });
    }
  });

const transactionStatusSchema = z.object({
  status: z.enum(["paid", "verified"]),
});

const router = express.Router();

router.get("/transactions", requireUser, paymentController.getTransactions);

router.post(
  "/checkout",
  requireUser,
  requireRole(["student"]),
  validateBody(checkoutSchema),
  paymentController.checkout
);

router.patch(
  "/transactions/:transactionId/status",
  requireUser,
  requireRole(["admin"]),
  validateBody(transactionStatusSchema),
  paymentController.updateTransactionStatus
);

router.post("/withdraw", requireUser, requireRole(["student"]), paymentController.withdraw);

router.get("/withdrawals", requireUser, requireRole(["student"]), paymentController.getWithdrawals);

module.exports = router;


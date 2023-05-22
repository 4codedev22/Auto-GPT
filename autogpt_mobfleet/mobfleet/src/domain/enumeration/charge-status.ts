/**
 * The ChargeStatus enumeration.
 * Reference to Status: https://docs.pagar.me/reference/cobran%C3%A7as-1
 */

export enum ChargeStatus {
      PENDING = "pending",
      PAID = "paid",
      CANCELED = "canceled",
      PROCESSING = "processing",
      FAILED = "failed",
      OVERPAID = "overpaid",
      UNDERPAID = "underpaid",
      CHARGEDBACK = "chargedback"
}




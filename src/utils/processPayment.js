const processedTransactions = new Map(); // Simulate DB

export const processPayment = async (idempotencyKey = null) => {
  await new Promise((res) => setTimeout(res, 500));
  
  // If idempotencyKey exists, return cached result
  if (idempotencyKey && processedTransactions.has(idempotencyKey)) {
    return processedTransactions.get(idempotencyKey);
  }

  const isSuccess = Math.random() > 0.5;
  const result = isSuccess
    ? { status: "SUCCESS", transactionId: "tx_" + Math.floor(Math.random() * 1e6) }
    : { status: "FAILED", errorCode: "NETWORK_ERROR" };

  if (idempotencyKey) {
    processedTransactions.set(idempotencyKey, result); // Cache result
  }

  return result;
};
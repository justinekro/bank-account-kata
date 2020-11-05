function checkBalance(balance, amount) {
	return balance + amount < 0;
}

module.exports = { checkBalance };

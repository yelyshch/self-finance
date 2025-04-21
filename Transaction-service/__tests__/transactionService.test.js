const transactionService = require('../services/transactionService');
const Transaction = require('../models/Transaction');
const { publishTransaction } = require('../broker/transactionPublisher');

jest.mock('../models/Transaction'); // мок моделі Mongo
jest.mock('../broker/transactionPublisher'); // мок RabbitMQ

publishTransaction.mockImplementation(() => {});

describe('transactionService.addTransaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('створює нову транзакцію, зберігає її і відправляє у чергу', async () => {
    const mockTransactionData = {
      amount: 150,
      type: 'income',
      category: 'salary',
      description: 'April payment',
      transaction_date: new Date('2025-04-01'),
    };

    const mockSavedTransaction = {
      _id: 'abc123',
      user_id: 'user123',
      ...mockTransactionData,
    };

    const saveMock = jest.fn().mockResolvedValue(mockSavedTransaction);

    // Підміна конструктора Transaction
    Transaction.mockImplementation(() => ({
      save: saveMock,
    }));

    const result = await transactionService.addTransaction('user123', mockTransactionData);

    expect(Transaction).toHaveBeenCalledWith({ user_id: 'user123', ...mockTransactionData });
    expect(saveMock).toHaveBeenCalled();
    expect(publishTransaction).toHaveBeenCalledWith(mockSavedTransaction);
    expect(result).toEqual(mockSavedTransaction);
  });
});

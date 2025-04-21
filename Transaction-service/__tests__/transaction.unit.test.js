const Transaction = require('../models/Transaction');
const transactionService = require('../services/transactionService');
const { publishTransaction } = require('../broker/transactionPublisher');

jest.mock('../broker/transactionPublisher', () => ({
  publishTransaction: jest.fn(),
}));

jest.mock('../models/Transaction');

describe('Transaction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('addTransaction', () => {
    it('should add a new transaction', async () => {
      const mockUserId = '64342abc123abc123abc123a';
      const mockData = {
        amount: 100,
        type: 'income',
        category: 'salary',
        description: 'Test transaction',
        transaction_date: new Date(),
      };

      const mockSavedTransaction = {
        _id: '123abc',
        user_id: mockUserId,
        ...mockData,
      };

      jest.spyOn(Transaction.prototype, 'save').mockResolvedValue(mockSavedTransaction);

      const result = await transactionService.addTransaction(mockUserId, mockData);

      expect(result).toEqual(mockSavedTransaction);
    });

    it('should publish transaction after saving', async () => {
      const mockUserId = '64342abc123abc123abc123a';
      const mockData = {
        amount: 100,
        type: 'income',
        category: 'salary',
        description: 'Test transaction',
        transaction_date: new Date(),
      };

      const mockSavedTransaction = {
        _id: '123abc',
        user_id: mockUserId,
        ...mockData,
      };

      jest.spyOn(Transaction.prototype, 'save').mockResolvedValue(mockSavedTransaction);

      await transactionService.addTransaction(mockUserId, mockData);

      expect(publishTransaction).toHaveBeenCalledWith(mockSavedTransaction);
    });

    it('should handle publishTransaction errors gracefully', async () => {
      const mockUserId = '64342abc123abc123abc123a';
      const mockData = {
        amount: 200,
        type: 'expense',
        category: 'groceries',
        description: 'Food',
        transaction_date: new Date(),
      };

      const mockSavedTransaction = {
        _id: '456def',
        user_id: mockUserId,
        ...mockData,
      };

      jest.spyOn(Transaction.prototype, 'save').mockResolvedValue(mockSavedTransaction);
      publishTransaction.mockImplementation(() => {
        throw new Error('RabbitMQ failed');
      });

      const result = await transactionService.addTransaction(mockUserId, mockData);
      expect(result).toEqual(mockSavedTransaction);
    });
  });

  describe('getTransactionById', () => {
    it('should return transaction if user is owner', async () => {
      const mockUserId = '64342abc123abc123abc123a';
      const mockTransactionId = '123abc';

      const mockTransaction = {
        _id: mockTransactionId,
        user_id: {
          toString: () => mockUserId,
        },
      };

      Transaction.findById.mockResolvedValue(mockTransaction);

      const result = await transactionService.getTransactionById(mockTransactionId, mockUserId);

      expect(result).toEqual(mockTransaction);
      expect(Transaction.findById).toHaveBeenCalledWith(mockTransactionId);
    });

    it('should throw error if user is not the owner', async () => {
      const mockUserId = '64342abc123abc123abc123a';
      const otherUserId = 'other456';
      const mockTransactionId = '123abc';

      const mockTransaction = {
        _id: mockTransactionId,
        user_id: {
          toString: () => mockUserId,
        },
      };

      Transaction.findById.mockResolvedValue(mockTransaction);

      await expect(transactionService.getTransactionById(mockTransactionId, otherUserId))
        .rejects.toThrow('Access denied');

      expect(Transaction.findById).toHaveBeenCalledWith(mockTransactionId);
    });

    it('should throw error if transaction not found', async () => {
      const mockUserId = '64342abc123abc123abc123a';
      const mockTransactionId = 'nonexistent';

      Transaction.findById.mockResolvedValue(null);

      await expect(transactionService.getTransactionById(mockTransactionId, mockUserId))
        .rejects.toThrow('Access denied');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction by ID', async () => {
      const mockTransactionId = '123abc';
      const mockDeletedTransaction = { _id: mockTransactionId, deleted: true };

      Transaction.findByIdAndDelete.mockResolvedValue(mockDeletedTransaction);

      const result = await transactionService.deleteTransaction(mockTransactionId);

      expect(result).toEqual(mockDeletedTransaction);
      expect(Transaction.findByIdAndDelete).toHaveBeenCalledWith(mockTransactionId);
    });

    it('should handle case when transaction not found', async () => {
      const mockTransactionId = 'nonexistent';

      Transaction.findByIdAndDelete.mockResolvedValue(null);

      const result = await transactionService.deleteTransaction(mockTransactionId);

      expect(result).toBeNull();
      expect(Transaction.findByIdAndDelete).toHaveBeenCalledWith(mockTransactionId);
    });
  });
});

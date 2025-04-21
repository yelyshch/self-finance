// transaction.contract.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Transaction = require('../models/Transaction');
const transactionService = require('../services/transactionService');
const { publishTransaction } = require('../broker/transactionPublisher');

// Mock RabbitMQ
jest.mock('../broker/transactionPublisher', () => ({
  connectRabbitMQ: jest.fn(),
  publishTransaction: jest.fn(),
}));

describe('Transaction Service Contract Tests', () => {
  let mongoServer;

  // Setup MongoDB Memory Server before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database and mocks before each test
  beforeEach(async () => {
    await Transaction.deleteMany({});
    jest.clearAllMocks();
  });

  describe('Contract: Transaction Creation', () => {
    it('should create a transaction and publish event with required fields', async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();
      const transactionData = {
        amount: 500,
        type: 'income',
        category: 'salary',
        description: 'Monthly salary',
        transaction_date: new Date(),
      };

      // Act
      const createdTransaction = await transactionService.addTransaction(userId, transactionData);

      // Assert - Contract Verification
      // 1. The transaction should be saved in the database
      const savedTransaction = await Transaction.findById(createdTransaction._id);
      expect(savedTransaction).toBeTruthy();
      expect(savedTransaction.amount).toBe(500);
      expect(savedTransaction.type).toBe('income');
      expect(savedTransaction.category).toBe('salary');

      // 2. Message publisher should receive expected fields
      expect(publishTransaction).toHaveBeenCalledTimes(1);
      expect(publishTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: userId,
          amount: 500,
          type: 'income',
        })
      );
    });
  });

  describe('Contract: Transaction Retrieval', () => {
    it('should return transactions matching filter criteria', async () => {
      // Arrange - Create test transactions
      const userId = new mongoose.Types.ObjectId();
      const testTransactions = [
        {
          user_id: userId,
          amount: 500,
          type: 'income',
          category: 'salary',
          description: 'Monthly salary',
          transaction_date: new Date('2023-01-15'),
        },
        {
          user_id: userId,
          amount: 100,
          type: 'expense',
          category: 'groceries',
          description: 'Weekly shopping',
          transaction_date: new Date('2023-01-20'),
        },
        {
          user_id: userId,
          amount: 200,
          type: 'expense',
          category: 'utilities',
          description: 'Electricity bill',
          transaction_date: new Date('2023-01-25'),
        },
        {
          user_id: new mongoose.Types.ObjectId(), // Different user
          amount: 300,
          type: 'income',
          category: 'freelance',
          description: 'Project payment',
          transaction_date: new Date('2023-01-30'),
        },
      ];

      // Save test transactions to database
      await Transaction.insertMany(testTransactions);

      // Act - Retrieve with filters
      const filters = { type: 'expense' };
      const transactions = await transactionService.getTransactions(userId, filters);

      // Assert - Contract Verification
      // 1. Should only return transactions for the specified user
      expect(transactions.length).toBe(2);
      transactions.forEach(transaction => {
        expect(transaction.user_id.toString()).toBe(userId.toString());
      });

      // 2. Should filter by type correctly
      transactions.forEach(transaction => {
        expect(transaction.type).toBe('expense');
      });

      // 3. Verify integrity of transaction data
      expect(transactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 100,
            category: 'groceries',
          }),
          expect.objectContaining({
            amount: 200,
            category: 'utilities',
          }),
        ])
      );
    });

    it('should sort transactions as specified in contract', async () => {
      // Arrange - Create test transactions with different dates
      const userId = new mongoose.Types.ObjectId();
      const testTransactions = [
        {
          user_id: userId,
          amount: 500,
          type: 'income',
          category: 'salary',
          description: 'Monthly salary',
          transaction_date: new Date('2023-01-15'),
        },
        {
          user_id: userId,
          amount: 100,
          type: 'expense',
          category: 'groceries',
          description: 'Weekly shopping',
          transaction_date: new Date('2023-01-20'),
        },
        {
          user_id: userId,
          amount: 200,
          type: 'expense',
          category: 'utilities',
          description: 'Electricity bill',
          transaction_date: new Date('2023-01-25'),
        },
      ];

      // Save test transactions to database
      await Transaction.insertMany(testTransactions);

      // Act - Retrieve with sorting
      const filters = { sort: 'amount_asc' };
      const transactions = await transactionService.getTransactions(userId, filters);

      // Assert - Contract Verification for sorting
      expect(transactions.length).toBe(3);

      // Verify ascending order by amount
      expect(transactions[0].amount).toBe(100);
      expect(transactions[1].amount).toBe(200);
      expect(transactions[2].amount).toBe(500);
    });
  });
});

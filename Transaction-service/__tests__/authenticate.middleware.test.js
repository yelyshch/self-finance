const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

// Mock the jwt module
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response
    mockRequest = {
      header: jest.fn()
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    nextFunction = jest.fn();

    // Mock environment variable
    process.env.JWT_SECRET = 'test_secret';
  });

  it('should call next() if valid token is provided', () => {
    // Arrange
    const mockUser = { id: '123', email: 'test@example.com' };
    mockRequest.header.mockReturnValue('Bearer valid_token');
    jwt.verify.mockReturnValue(mockUser);

    // Act
    authenticate(mockRequest, mockResponse, nextFunction);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    // Arrange
    mockRequest.header.mockReturnValue(undefined);

    // Act
    authenticate(mockRequest, mockResponse, nextFunction);

    // Assert
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/access denied/i)
      })
    );
  });

  it('should return 401 if token is invalid', () => {
    // Arrange
    mockRequest.header.mockReturnValue('Bearer invalid_token');
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act
    authenticate(mockRequest, mockResponse, nextFunction);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', 'test_secret');
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/invalid token/i)
      })
    );
  });

  it('should extract token from Authorization header correctly', () => {
    // Arrange
    const mockUser = { id: '123', email: 'test@example.com' };
    mockRequest.header.mockReturnValue('Bearer test_token_123');
    jwt.verify.mockReturnValue(mockUser);

    // Act
    authenticate(mockRequest, mockResponse, nextFunction);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('test_token_123', 'test_secret');
  });
});

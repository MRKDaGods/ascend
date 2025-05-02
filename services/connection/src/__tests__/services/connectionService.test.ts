import db from '@shared/config/db';
import connectionService from '../../services/connectionService';
import { ConnectionStatus } from '../models';

// Mock the database module
jest.mock('@shared/config/db');
const mockDb = db as jest.Mocked<typeof db>;

describe('ConnectionService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should search for users successfully', async () => {
      // Arrange
      const mockUsers = [
        { user_id: 1, first_name: 'John', last_name: 'Doe' },
        { user_id: 2, first_name: 'Jane', last_name: 'Smith' },
      ];
      const mockCount = [{ count: '2' }];
      
      // Setup mock responses
      mockDb.query.mockImplementation((query, params) => {
        // Return users for search query
        if (query.includes('search_rank DESC')) {
          return { rows: mockUsers };
        } 
        // Return count for pagination
        if (query.includes('COUNT(*)')) {
          return { rows: mockCount };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.searchUsers('John', 5, 1, 10);
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(2);
      expect(result.data).toEqual(mockUsers);
      expect(result.pagination).toEqual({
        total: 2,
        page: 1,
        limit: 10
      });
    });
  });

  describe('sendConnectionRequest', () => {
    it('should send a connection request successfully', async () => {
      // Arrange
      const mockPreferences = [{ allow_connection_requests: true }];
      const mockConnection = { 
        id: 1, 
        user_id: 1, 
        connection_id: 2, 
        status: ConnectionStatus.PENDING,
        request_direction: 'outgoing',
        message: 'Hello',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Setup mock responses
      mockDb.query.mockImplementation((query, params) => {
        if (query.includes('SELECT allow_connection_requests')) {
          return { rows: mockPreferences };
        }
        if (query.includes('SELECT 1 FROM connection_service.blocked_users')) {
          return { rows: [] }; // Not blocked
        }
        if (query.includes('SELECT 1 FROM connection_service.connections')) {
          return { rows: [] }; // No existing connection
        }
        if (query.includes('WITH sender_connection')) {
          return { rows: [mockConnection] };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.sendConnectionRequest({
        senderId: 1,
        recipientId: 2,
        message: 'Hello'
      });
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(4);
      expect(result).toEqual(mockConnection);
    });

    it('should throw an error if recipient does not accept requests', async () => {
      // Arrange
      const mockPreferences = [{ allow_connection_requests: false }];
      
      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT allow_connection_requests')) {
          return { rows: mockPreferences };
        }
        return { rows: [] };
      });
      
      // Act & Assert
      await expect(connectionService.sendConnectionRequest({
        senderId: 1,
        recipientId: 2,
        message: 'Hello'
      })).rejects.toThrow('User does not accept connection requests');
    });

    it('should throw an error if sender is blocked', async () => {
      // Arrange
      const mockPreferences = [{ allow_connection_requests: true }];
      const mockBlocked = [{ id: 1 }];
      
      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT allow_connection_requests')) {
          return { rows: mockPreferences };
        }
        if (query.includes('SELECT 1 FROM connection_service.blocked_users')) {
          return { rows: mockBlocked }; // Blocked
        }
        return { rows: [] };
      });
      
      // Act & Assert
      await expect(connectionService.sendConnectionRequest({
        senderId: 1,
        recipientId: 2,
        message: 'Hello'
      })).rejects.toThrow('Cannot send request to this user');
    });
  });

  describe('respondToConnectionRequest', () => {
    it('should accept a connection request successfully', async () => {
      // Arrange
      const mockRequest = [{ 
        id: 1, 
        user_id: 2, 
        connection_id: 1, 
        status: ConnectionStatus.PENDING,
        request_direction: 'incoming'
      }];

      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT * FROM connection_service.connections WHERE id =')) {
          return { rows: mockRequest };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.respondToConnectionRequest({
        requestId: 1,
        userId: 2,
        accept: true
      });
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(3); // Select + 2 Updates
      expect(result).toEqual({ status: ConnectionStatus.ACCEPTED });
      
      // Check that the query was called with proper status
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE connection_service.connections'),
        expect.arrayContaining([ConnectionStatus.ACCEPTED])
      );
    });

    it('should decline a connection request successfully', async () => {
      // Arrange
      const mockRequest = [{ 
        id: 1, 
        user_id: 2, 
        connection_id: 1, 
        status: ConnectionStatus.PENDING,
        request_direction: 'incoming'
      }];

      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT * FROM connection_service.connections WHERE id =')) {
          return { rows: mockRequest };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.respondToConnectionRequest({
        requestId: 1,
        userId: 2,
        accept: false
      });
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(3); // Select + 2 Updates
      expect(result).toEqual({ status: ConnectionStatus.DECLINED });
      
      // Check that the query was called with proper status
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE connection_service.connections'),
        expect.arrayContaining([ConnectionStatus.DECLINED])
      );
    });

    it('should throw an error if request is not found', async () => {
      // Arrange
      mockDb.query.mockImplementation(() => ({ rows: [] }));
      
      // Act & Assert
      await expect(connectionService.respondToConnectionRequest({
        requestId: 999,
        userId: 2,
        accept: true
      })).rejects.toThrow('Connection request not found');
    });
  });

  describe('getConnections', () => {
    it('should get connections successfully', async () => {
      // Arrange
      const mockConnections = [
        { user_id: 2, first_name: 'Jane', last_name: 'Smith', connected_at: new Date() },
        { user_id: 3, first_name: 'Bob', last_name: 'Johnson', connected_at: new Date() }
      ];
      const mockCount = [{ count: '2' }];
      
      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('JOIN user_service.profiles')) {
          return { rows: mockConnections };
        }
        if (query.includes('COUNT(*)')) {
          return { rows: mockCount };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.getConnections(1);
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(2);
      expect(result.data).toEqual(mockConnections);
      expect(result.pagination).toEqual({
        total: 2,
        page: 1,
        limit: 10
      });
    });

    it('should filter connections by search term', async () => {
      // Arrange
      const mockConnections = [
        { user_id: 2, first_name: 'Jane', last_name: 'Smith', connected_at: new Date() }
      ];
      const mockCount = [{ count: '1' }];
      
      // Setup mock responses
      mockDb.query.mockImplementation((query, params) => {
        if (query.includes('JOIN user_service.profiles')) {
          return { rows: mockConnections };
        }
        if (query.includes('COUNT(*)')) {
          return { rows: mockCount };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.getConnections(1, 'Jane');
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(2);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE $2'),
        expect.arrayContaining(['%Jane%'])
      );
      expect(result.data).toEqual(mockConnections);
    });
  });

  describe('blockUser', () => {
    it('should block a user successfully', async () => {
      // Arrange
      const mockBlockedUser = { 
        id: 1, 
        user_id: 1, 
        blocked_user_id: 2, 
        created_at: new Date() 
      };
      
      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT * FROM connection_service.blocked_users')) {
          return { rows: [] }; // Not already blocked
        }
        if (query.includes('INSERT INTO connection_service.blocked_users')) {
          return { rows: [mockBlockedUser] };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.blockUser({
        userId: 1,
        blockedUserId: 2
      });
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(4); // Select, Delete connections, Delete follows, Insert
      expect(result).toEqual(mockBlockedUser);
    });

    it('should return existing block if user is already blocked', async () => {
      // Arrange
      const mockExistingBlock = { 
        id: 1, 
        user_id: 1, 
        blocked_user_id: 2, 
        created_at: new Date() 
      };
      
      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT * FROM connection_service.blocked_users')) {
          return { rows: [mockExistingBlock] }; // Already blocked
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.blockUser({
        userId: 1,
        blockedUserId: 2
      });
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(1); // Only the select query
      expect(result).toEqual(mockExistingBlock);
    });
  });

  describe('getMutualConnections', () => {
    it('should get mutual connections successfully', async () => {
      // Arrange
      const mockMutualConnections = [
        { user_id: 3, first_name: 'Mutual', last_name: 'Friend' },
        { user_id: 4, first_name: 'Another', last_name: 'Connection' }
      ];
      const mockCount = [{ count: '2' }];
      
      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('INTERSECT')) {
          return { rows: mockMutualConnections };
        }
        if (query.includes('COUNT(*)')) {
          return { rows: mockCount };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.getMutualConnections(1, 2);
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(2);
      expect(result.data).toEqual(mockMutualConnections);
      expect(result.pagination).toEqual({
        total: 2,
        page: 1,
        limit: 10
      });
    });
  });

  describe('getConnectionsOfConnections', () => {
    it('should get network connections successfully', async () => {
      // Arrange
      const mockNetworkConnections = [
        { 
          user_id: 5, 
          first_name: 'Network', 
          last_name: 'User',
          mutual_connection_count: 2 
        }
      ];
      const mockCount = [{ count: '1' }];
      
      // Setup mock responses
      mockDb.query.mockImplementation((query) => {
        if (query.includes('ORDER BY mutual_connection_count')) {
          return { rows: mockNetworkConnections };
        }
        if (query.includes('COUNT(*)')) {
          return { rows: mockCount };
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.getConnectionsOfConnections(1);
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(2);
      expect(result.data).toEqual(mockNetworkConnections);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10
      });
    });
  });

  describe('updateConnectionPreferences', () => {
    it('should update user preferences successfully', async () => {
      // Arrange
      const mockPreferences = {
        user_id: 1,
        allow_connection_requests: true,
        allow_messages_from: 'connections_only',
        visible_to_public: false,
        visible_to_connections: true,
        visible_to_network: true,
        updated_at: new Date()
      };
      
      // Setup mock responses
      mockDb.query.mockImplementation(() => ({ rows: [mockPreferences] }));
      
      // Act
      const result = await connectionService.updateConnectionPreferences({
        userId: 1,
        allow_connection_requests: true,
        allow_messages_from: 'connections_only',
        visible_to_public: false
      });
      
      // Assert
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPreferences);
    });
  });

  describe('canViewFollowers', () => {
    it('should return true when followers are public', async () => {
      // Arrange
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT show_followers')) {
          return { rows: [{ show_followers: true }] };
        }
        if (query.includes('SELECT 1 FROM connection_service.blocked_users')) {
          return { rows: [] }; // Not blocked
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.canViewFollowers(1, 2);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return true for connections when followers are private', async () => {
      // Arrange
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT show_followers')) {
          return { rows: [{ show_followers: false }] };
        }
        if (query.includes('connection_id = $2')) {
          return { rows: [{ id: 1 }] }; // Connected
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.canViewFollowers(1, 2);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return false for non-connections when followers are private', async () => {
      // Arrange
      mockDb.query.mockImplementation((query) => {
        if (query.includes('SELECT show_followers')) {
          return { rows: [{ show_followers: false }] };
        }
        if (query.includes('connection_id = $2')) {
          return { rows: [] }; // Not connected
        }
        return { rows: [] };
      });
      
      // Act
      const result = await connectionService.canViewFollowers(1, 2);
      
      // Assert
      expect(result).toBe(false);
    });
  });
});
import * as userService from '../../services/userService';
import db from '@shared/config/db';
import { publishEvent, Events } from '@shared/rabbitMQ';
import { getUserProfile } from '@shared/utils/userProfile';
import bcrypt from 'bcryptjs';
import { UserRole } from '@shared/models';

// Mock dependencies
jest.mock('@shared/config/db');
jest.mock('@shared/rabbitMQ');
jest.mock('@shared/utils/userProfile');
jest.mock('bcryptjs');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.findUserByEmail('test@example.com');
      
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM auth_service.users WHERE email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.findUserByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.findUserById(1);
      
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM auth_service.users WHERE id = $1',
        [1]
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.findUserById(999);
      
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user with password and publish event', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.createUser(
        'John',
        'Doe',
        'test@example.com',
        'password123',
        false,
        UserRole.USER
      );
      
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO auth_service.users (email, password_hash, is_verified, role) VALUES ($1, $2, $3, $4) RETURNING *',
        ['test@example.com', 'hashed_password', false, UserRole.USER]
      );
      expect(publishEvent).toHaveBeenCalledWith(Events.USER_CREATED, {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com'
      });
      expect(result).toEqual(mockUser);
    });

    it('should create user without password for social login', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.createUser(
        'John',
        'Doe',
        'test@example.com',
        undefined,
        true
      );
      
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO auth_service.users (email, password_hash, is_verified, role) VALUES ($1, $2, $3, $4) RETURNING *',
        ['test@example.com', '', true, UserRole.USER]
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle event publishing error', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });
      (publishEvent as jest.Mock).mockRejectedValueOnce(new Error('Publish error'));
      
      console.error = jest.fn();

      const result = await userService.createUser(
        'John',
        'Doe',
        'test@example.com',
        'password123'
      );
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to publish user created event:',
        expect.any(Error)
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserEmailConfirmation', () => {
    it('should update user when token is valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com', is_verified: true };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.updateUserEmailConfirmation('test@example.com', 'valid-token');
      
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET is_verified = true, confirmation_token = NULL WHERE email = $1 AND confirmation_token = $2 RETURNING *',
        ['test@example.com', 'valid-token']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when token is invalid', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.updateUserEmailConfirmation('test@example.com', 'invalid-token');
      
      expect(result).toBeNull();
    });
  });

  describe('updateUserNewEmailConfirmation', () => {
    it('should update email when token is valid', async () => {
      const mockUser = { id: 1, email: 'new@example.com', is_verified: true };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.updateUserNewEmailConfirmation('new@example.com', 'valid-token');
      
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET is_verified = true, email = new_email, new_email = NULL, confirmation_token = NULL WHERE new_email = $1 AND confirmation_token = $2 RETURNING *',
        ['new@example.com', 'valid-token']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when token is invalid', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.updateUserNewEmailConfirmation('new@example.com', 'invalid-token');
      
      expect(result).toBeNull();
    });
  });

  describe('updateUserResetToken', () => {
    it('should update reset token for user', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await userService.updateUserResetToken('test@example.com', 'reset-token');
      
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET reset_token = $1 WHERE email = $2',
        ['reset-token', 'test@example.com']
      );
    });
  });

  describe('resetUserPassword', () => {
    it('should reset password when token is valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('new_hashed_password');
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.resetUserPassword('test@example.com', 'valid-token', 'newpassword');
      
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET password_hash = $1, reset_token = NULL WHERE email = $2 AND reset_token = $3 RETURNING *',
        ['new_hashed_password', 'test@example.com', 'valid-token']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when token is invalid', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('new_hashed_password');
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.resetUserPassword('test@example.com', 'invalid-token', 'newpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('resetUserPassword2', () => {
    it('should reset password with code', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('new_hashed_password');
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.resetUserPassword2('123456', 'test@example.com', 'newpassword');
      
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET password_hash = $1, reset_token = NULL WHERE email = $2 AND reset_token = $3 RETURNING *',
        ['new_hashed_password', 'test@example.com', '123456']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when code is invalid', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('new_hashed_password');
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.resetUserPassword2('invalid', 'test@example.com', 'newpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('updateUserPassword', () => {
    it('should update user password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('new_hashed_password');
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await userService.updateUserPassword(1, 'newpassword');
      
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET password_hash = $1 WHERE id = $2',
        ['new_hashed_password', 1]
      );
    });
  });

  describe('updateUserEmail', () => {
    it('should update user email and set confirmation token', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await userService.updateUserEmail(1, 'new@example.com', 'confirmation-token');
      
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET new_email = $1, confirmation_token = $2, is_verified = false WHERE id = $3',
        ['new@example.com', 'confirmation-token', 1]
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user and publish event', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await userService.deleteUser(1);
      
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM auth_service.users WHERE id = $1',
        [1]
      );
      expect(publishEvent).toHaveBeenCalledWith(Events.AUTH_USER_DELETED, {
        user_id: 1
      });
    });

    it('should handle event publishing error', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      (publishEvent as jest.Mock).mockRejectedValueOnce(new Error('Publish error'));
      
      console.error = jest.fn();

      await userService.deleteUser(1);
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to publish user deleted event:',
        expect.any(Error)
      );
    });
  });

  describe('updateUserFCMToken', () => {
    it('should update user FCM token', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await userService.updateUserFCMToken(1, 'fcm-token');
      
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE auth_service.users SET fcm_token = $1 WHERE id = $2',
        ['fcm-token', 1]
      );
    });
  });

  describe('getUserFCMToken', () => {
    it('should return FCM token when found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [{ fcm_token: 'fcm-token' }] });

      const result = await userService.getUserFCMToken(1);
      
      expect(db.query).toHaveBeenCalledWith(
        'SELECT fcm_token FROM auth_service.users WHERE id = $1',
        [1]
      );
      expect(result).toEqual('fcm-token');
    });

    it('should return null when FCM token not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.getUserFCMToken(1);
      
      expect(result).toBeNull();
    });
  });

  describe('createAdminUser', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = {
        ...originalEnv,
        ASCEND_ADMIN_FIRST_NAME: 'Admin',
        ASCEND_ADMIN_LAST_NAME: 'User',
        ASCEND_ADMIN_EMAIL: 'admin@example.com',
        ASCEND_ADMIN_PASSWORD: 'adminpass'
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should create admin user if it does not exist', async () => {
      (userService.findUserByEmail as jest.Mock) = jest.fn().mockResolvedValueOnce(null);
      (userService.createUser as jest.Mock) = jest.fn().mockResolvedValueOnce({ id: 1 });
      console.log = jest.fn();

      await userService.createAdminUser();
      
      expect(userService.findUserByEmail).toHaveBeenCalledWith('admin@example.com');
      expect(userService.createUser).toHaveBeenCalledWith(
        'Admin', 'User', 'admin@example.com', 'adminpass', true, UserRole.ADMIN
      );
      expect(console.log).toHaveBeenCalledWith('Created admin user:', { id: 1 });
    });

    it('should not create admin user if it already exists', async () => {
      (userService.findUserByEmail as jest.Mock) = jest.fn().mockResolvedValueOnce({ id: 1 });
      (userService.createUser as jest.Mock) = jest.fn();
      console.log = jest.fn();

      await userService.createAdminUser();
      
      expect(userService.findUserByEmail).toHaveBeenCalledWith('admin@example.com');
      expect(userService.createUser).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Admin user already exists');
    });

    it('should throw error if env variables are missing', async () => {
      process.env.ASCEND_ADMIN_EMAIL = undefined;

      await expect(userService.createAdminUser()).rejects.toThrow(
        'Missing required environment variables for admin user creation'
      );
    });
  });

  describe('getAdminUserId', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = {
        ...originalEnv,
        ASCEND_ADMIN_EMAIL: 'admin@example.com'
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return admin user ID when found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const result = await userService.getAdminUserId();
      
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id FROM auth_service.users WHERE email = $1',
        ['admin@example.com']
      );
      expect(result).toEqual(1);
    });

    it('should return null when admin user not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.getAdminUserId();
      
      expect(result).toBeNull();
    });

    it('should throw error if env variable is missing', async () => {
      process.env.ASCEND_ADMIN_EMAIL = undefined;

      await expect(userService.getAdminUserId()).rejects.toThrow(
        'ASCEND_ADMIN_EMAIL is not defined'
      );
    });
  });

  describe('reportUser', () => {
    it('should create user report', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await userService.reportUser(2, 1, 'Inappropriate behavior');
      
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO auth_service.reports (reported_id, reported_by_id, reason) VALUES ($1, $2, $3)',
        [2, 1, 'Inappropriate behavior']
      );
    });
  });

  describe('getAllUserReports', () => {
    it('should return all user reports with profiles', async () => {
      const mockReports = [
        { id: 1, reported_id: 2, reported_by_id: 1, reason: 'Inappropriate behavior' },
        { id: 2, reported_id: 3, reported_by_id: 1, reason: 'Spam' }
      ];
      const mockReporterProfile = { id: 1, name: 'Reporter' };
      const mockReportedProfile1 = { id: 2, name: 'Reported1' };
      const mockReportedProfile2 = { id: 3, name: 'Reported2' };
      
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: mockReports });
      (getUserProfile as jest.Mock)
        .mockResolvedValueOnce(mockReporterProfile)
        .mockResolvedValueOnce(mockReportedProfile1)
        .mockResolvedValueOnce(mockReporterProfile)
        .mockResolvedValueOnce(mockReportedProfile2);

      const result = await userService.getAllUserReports();
      
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM auth_service.reports');
      expect(result).toEqual([
        {
          ...mockReports[0],
          reported_by: mockReporterProfile,
          reported: mockReportedProfile1
        },
        {
          ...mockReports[1],
          reported_by: mockReporterProfile,
          reported: mockReportedProfile2
        }
      ]);
    });
  });

  describe('deleteUserReport', () => {
    it('should delete report when it exists', async () => {
      (db.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rows: [] });

      await userService.deleteUserReport(1);
      
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        'SELECT * FROM auth_service.reports WHERE id = $1',
        [1]
      );
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        'DELETE FROM auth_service.reports WHERE id = $1',
        [1]
      );
    });

    it('should throw error when report does not exist', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(userService.deleteUserReport(999)).rejects.toThrow('Report not found');
    });
  });
});

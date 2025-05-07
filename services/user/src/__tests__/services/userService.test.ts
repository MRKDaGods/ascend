import {
  getProfile,
  createOrUpdateProfile,
  checkProfileExists,
  uploadProfilePicture,
  uploadCoverPhoto,
  uploadResume,
  getUserProfilePictureURL
} from '../../services/userService';
import db from '@shared/config/db';
import * as rabbitMQ from '@shared/rabbitMQ';
import * as fileUtils from '@shared/utils/files';

// Mock the dependencies
jest.mock('@shared/config/db', () => ({
  query: jest.fn()
}));

jest.mock('@shared/rabbitMQ', () => ({
  callRPC: jest.fn(),
  publishEvent: jest.fn(),
  getRPCQueueName: jest.fn()
}));

jest.mock('@shared/utils/files', () => ({
  getPresignedUrl: jest.fn()
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return null when profile not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      const result = await getProfile(1);
      
      expect(result).toBeNull();
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM user_service.profiles WHERE user_id = $1",
        [1]
      );
    });

    it('should return profile with all related data when found', async () => {
      const mockProfile = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture_id: 'pic-123',
        cover_photo_id: 'cover-123',
        resume_id: 'resume-123',
        current_position_id: 1
      };
      
      (db.query as jest.Mock).mockImplementation((query) => {
        if (query.includes('user_service.profiles')) {
          return Promise.resolve({ rows: [mockProfile] });
        } else if (query.includes('user_service.education')) {
          return Promise.resolve({ rows: [{ school: 'Harvard' }] });
        } else if (query.includes('user_service.experience')) {
          return Promise.resolve({ rows: [{ company: 'Google' }] });
        } else if (query.includes('user_service.projects')) {
          return Promise.resolve({ rows: [{ name: 'Project X' }] });
        } else if (query.includes('user_service.courses')) {
          return Promise.resolve({ rows: [{ name: 'Course Y' }] });
        } else if (query.includes('user_service.skills')) {
          return Promise.resolve({ rows: [{ name: 'JavaScript' }] });
        } else if (query.includes('user_service.interests')) {
          return Promise.resolve({ rows: [{ name: 'Programming' }] });
        } else if (query.includes('user_service.contact_info')) {
          return Promise.resolve({ rows: [{ email: 'john@example.com' }] });
        } else if (query.includes('auth_service.users')) {
          return Promise.resolve({ rows: [{ role: 'user' }] });
        }
        return Promise.resolve({ rows: [] });
      });
      
      (fileUtils.getPresignedUrl as jest.Mock).mockImplementation((fileId) => {
        if (fileId === 'pic-123') return Promise.resolve('https://example.com/pic-123');
        if (fileId === 'cover-123') return Promise.resolve('https://example.com/cover-123');
        if (fileId === 'resume-123') return Promise.resolve('https://example.com/resume-123');
        return Promise.resolve(null);
      });
      
      const result = await getProfile(1);
      
      expect(result).not.toBeNull();
      expect(result?.first_name).toBe('John');
      expect(result?.last_name).toBe('Doe');
      expect(result?.profile_picture_url).toBe('https://example.com/pic-123');
      expect(result?.cover_photo_url).toBe('https://example.com/cover-123');
      expect(result?.resume_url).toBe('https://example.com/resume-123');
      expect(result?.education).toEqual([{ school: 'Harvard' }]);
      expect(result?.experience).toEqual([{ company: 'Google' }]);
      //expect(result?.is_admin).toBe(false);
    });

    it('should keep file IDs when keepFileIDs is true', async () => {
      const mockProfile = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture_id: 'pic-123'
      };
      
      (db.query as jest.Mock).mockImplementation((query) => {
        if (query.includes('user_service.profiles')) {
          return Promise.resolve({ rows: [mockProfile] });
        }
        return Promise.resolve({ rows: [] });
      });
      
      (fileUtils.getPresignedUrl as jest.Mock).mockResolvedValue('https://example.com/pic-123');
      
      const result = await getProfile(1, true);
      
      expect(result).not.toBeNull();
      expect(result?.profile_picture_id).toBe('pic-123');
      expect(result?.profile_picture_url).toBe('https://example.com/pic-123');
    });
  });

  describe('createOrUpdateProfile', () => {
    it('should create a new profile when one does not exist', async () => {
      // Mock getProfile to return null (profile doesn't exist)
      jest.spyOn(require('../../services/userService'), 'getProfile').mockResolvedValueOnce(null);
      
      // Mock the insert query
      (db.query as jest.Mock).mockResolvedValue({ rows: [] });
      
      // Mock the final getProfile call
      jest.spyOn(require('../../services/userService'), 'getProfile').mockResolvedValueOnce({
        first_name: 'Jane',
        last_name: 'Smith'
      });
      
      const profileData = {
        first_name: 'Jane',
        last_name: 'Smith',
        industry: 'Tech'
      };
      
      const result = await createOrUpdateProfile(1, profileData);
      
      expect(result).toEqual({ first_name: 'Jane', last_name: 'Smith' });
      // Verify INSERT was called
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_service.profiles'),
        expect.arrayContaining([1, 'Jane', 'Smith'])
      );
    });

    it('should update an existing profile', async () => {
      // Mock getProfile to return an existing profile
      jest.spyOn(require('../../services/userService'), 'getProfile').mockResolvedValueOnce({
        first_name: 'Old',
        last_name: 'Name',
        industry: 'Finance'
      });
      
      // Mock the update query
      (db.query as jest.Mock).mockResolvedValue({ rows: [] });
      
      // Mock the final getProfile call
      jest.spyOn(require('../../services/userService'), 'getProfile').mockResolvedValueOnce({
        first_name: 'New',
        last_name: 'Name',
        industry: 'Tech'
      });
      
      const profileData = {
        first_name: 'New',
        last_name: 'Name',
        industry: 'Tech'
      };
      
      const result = await createOrUpdateProfile(1, profileData);
      
      expect(result).toEqual({ first_name: 'New', last_name: 'Name', industry: 'Tech' });
      // Verify UPDATE was called
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_service.profiles'),
        expect.arrayContaining([1])
      );
    });

    it('should update profile with related entities', async () => {
      // Mock getProfile to return an existing profile
      jest.spyOn(require('../../services/userService'), 'getProfile').mockResolvedValueOnce({
        first_name: 'Old',
        last_name: 'Name'
      });
      
      // Mock db.query for all operations
      (db.query as jest.Mock).mockResolvedValue({ rows: [] });
      
      // Mock the final getProfile call
      jest.spyOn(require('../../services/userService'), 'getProfile').mockResolvedValueOnce({
        first_name: 'New',
        last_name: 'Name'
      });
      
      const profileData = {
        first_name: 'New',
        last_name: 'Name',
        //skills: [{ id: 1, name: 'JavaScript' }],
        //education: [{ school: 'MIT', degree: 'CS', field_of_study: 'AI', start_date: '2020-01-01', end_date: '2024-01-01' }],
        //experience: [{ company: 'Google', position: 'Engineer', start_date: '2020-01-01', end_date: null, description: 'Working' }]
      };
      
      await createOrUpdateProfile(1, profileData);
      
      // Verify skill operations
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM user_service.user_skills WHERE user_id = $1",
        [1]
      );
      
      // Verify education operations
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM user_service.education WHERE user_id = $1",
        [1]
      );
      
      // Verify experience operations
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM user_service.experience WHERE user_id = $1",
        [1]
      );
    });
  });

  describe('checkProfileExists', () => {
    it('should return true when profile exists', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });
      
      const result = await checkProfileExists(1);
      
      expect(result).toBe(true);
    });

    it('should return false when profile does not exist', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      const result = await checkProfileExists(1);
      
      expect(result).toBe(false);
    });
  });

  describe('uploadProfilePicture', () => {
    it('should throw an error if profile not found', async () => {
      jest.spyOn(require('../../services/userService'), 'getProfile').mockResolvedValueOnce(null);
      
      await expect(uploadProfilePicture(1, null)).rejects.toThrow('Profile not found');
    });

    it('should upload a new profile picture and delete the old one', async () => {
      // Mock profile
      jest.spyOn(require('../../services/userService'), 'getProfile')
        .mockResolvedValueOnce({ profile_picture_id: 'old-pic-id' })
        .mockResolvedValueOnce({ profile_picture_url: 'https://example.com/new-pic' });
      
      // Mock RabbitMQ operations
      (rabbitMQ.getRPCQueueName as jest.Mock).mockReturnValue('file-upload-queue');
      (rabbitMQ.callRPC as jest.Mock).mockResolvedValueOnce({ file_id: 'new-pic-id' });
      
      const mockFile = {
        buffer: Buffer.from('test-image'),
        originalname: 'profile.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      } as Express.Multer.File;
      
      const result = await uploadProfilePicture(1, mockFile);
      
      expect(rabbitMQ.callRPC).toHaveBeenCalledWith(
        'file-upload-queue',
        expect.objectContaining({
          user_id: 1,
          context: 'profile_picture'
        }),
        60000
      );
      
      expect(rabbitMQ.publishEvent).toHaveBeenCalledWith(
        expect.any(String),
        { file_id: 'old-pic-id' }
      );
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_service.profiles'),
        ['new-pic-id', 1]
      );
      
      expect(result).toEqual({ profile_picture_url: 'https://example.com/new-pic' });
    });

    it('should handle null file by removing the profile picture', async () => {
      // Mock profile
      jest.spyOn(require('../../services/userService'), 'getProfile')
        .mockResolvedValueOnce({ profile_picture_id: 'old-pic-id' })
        .mockResolvedValueOnce({ profile_picture_url: null });
      
      const result = await uploadProfilePicture(1, null);
      
      expect(rabbitMQ.callRPC).not.toHaveBeenCalled();
      
      expect(rabbitMQ.publishEvent).toHaveBeenCalledWith(
        expect.any(String),
        { file_id: 'old-pic-id' }
      );
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_service.profiles'),
        [null, 1]
      );
      
      expect(result).toEqual({ profile_picture_url: null });
    });
  });

  describe('uploadCoverPhoto', () => {
    it('should upload a new cover photo', async () => {
      // Mock profile
      jest.spyOn(require('../../services/userService'), 'getProfile')
        .mockResolvedValueOnce({ cover_photo_id: 'old-cover-id' })
        .mockResolvedValueOnce({ cover_photo_url: 'https://example.com/new-cover' });
      
      // Mock RabbitMQ operations
      (rabbitMQ.getRPCQueueName as jest.Mock).mockReturnValue('file-upload-queue');
      (rabbitMQ.callRPC as jest.Mock).mockResolvedValueOnce({ file_id: 'new-cover-id' });
      
      const mockFile = {
        buffer: Buffer.from('test-image'),
        originalname: 'cover.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      } as Express.Multer.File;
      
      const result = await uploadCoverPhoto(1, mockFile);
      
      expect(rabbitMQ.callRPC).toHaveBeenCalledWith(
        'file-upload-queue',
        expect.objectContaining({
          user_id: 1,
          context: 'cover_photo'
        }),
        60000
      );
      
      expect(result).toEqual({ cover_photo_url: 'https://example.com/new-cover' });
    });
  });

  describe('uploadResume', () => {
    it('should upload a new resume', async () => {
      // Mock profile
      jest.spyOn(require('../../services/userService'), 'getProfile')
        .mockResolvedValueOnce({ resume_id: 'old-resume-id' })
        .mockResolvedValueOnce({ resume_url: 'https://example.com/new-resume' });
      
      // Mock RabbitMQ operations
      (rabbitMQ.getRPCQueueName as jest.Mock).mockReturnValue('file-upload-queue');
      (rabbitMQ.callRPC as jest.Mock).mockResolvedValueOnce({ file_id: 'new-resume-id' });
      
      const mockFile = {
        buffer: Buffer.from('test-pdf'),
        originalname: 'resume.pdf',
        mimetype: 'application/pdf',
        size: 1024
      } as Express.Multer.File;
      
      const result = await uploadResume(1, mockFile);
      
      expect(rabbitMQ.callRPC).toHaveBeenCalledWith(
        'file-upload-queue',
        expect.objectContaining({
          user_id: 1,
          context: 'resume'
        }),
        60000
      );
      
      expect(result).toEqual({ resume_url: 'https://example.com/new-resume' });
    });
  });

  describe('getUserProfilePictureURL', () => {
    it('should return the profile picture URL when available', async () => {
      jest.spyOn(require('../../services/userService'), 'getProfile')
        .mockResolvedValueOnce({ profile_picture_url: 'https://example.com/pic' });
      
      const result = await getUserProfilePictureURL(1);
      
      expect(result).toBe('https://example.com/pic');
    });

    it('should return null when profile picture URL is not available', async () => {
      jest.spyOn(require('../../services/userService'), 'getProfile')
        .mockResolvedValueOnce({ profile_picture_url: null });
      
      const result = await getUserProfilePictureURL(1);
      
      expect(result).toBeNull();
    });

    it('should return null when profile is not found', async () => {
      jest.spyOn(require('../../services/userService'), 'getProfile')
        .mockResolvedValueOnce(null);
      
      const result = await getUserProfilePictureURL(1);
      
      expect(result).toBeNull();
    });
  });
});

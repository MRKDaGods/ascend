import { Router } from 'express';
import {
    register,
    login,
    confirmEmail,
    resendConfirmEmail,
    forgetPassword,
    resetPassword,
    updatePassword,
    updateEmail,
    socialLogin,
    deleteAccount,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register); // d
router.post('/login', login); // d
router.post('/confirm-email', confirmEmail); // d
router.post('/resend-confirm', resendConfirmEmail); // d
router.post('/forget-password', forgetPassword); // d
router.post('/reset-password', resetPassword); // d
router.put('/update-password', authenticateToken, updatePassword); // d
router.put('/update-email', authenticateToken, updateEmail); // d
router.post('/social-login', socialLogin);
router.delete('/delete-account', authenticateToken, deleteAccount);

export default router;
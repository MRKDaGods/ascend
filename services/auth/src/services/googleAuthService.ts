import { OAuth2Client, TokenPayload } from 'google-auth-library';

const CLIENT_IDS = [
    process.env.GOOGLE_CLIENT_ID_WEB || '',
    process.env.GOOGLE_CLIENT_ID_IOS || '',
    process.env.GOOGLE_CLIENT_ID_ANDROID || ''
].filter(Boolean);

const googleClient = new OAuth2Client();


export const verifyGoogleToken = async (token: string): Promise<TokenPayload | undefined> => {
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: CLIENT_IDS,
    });

    return ticket.getPayload();
};
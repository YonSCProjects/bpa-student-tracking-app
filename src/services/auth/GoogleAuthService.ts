import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_SCOPES } from '@/constants';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

export interface GoogleTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}

class GoogleAuthService {
  private isConfigured = false;

  async configure(): Promise<void> {
    if (this.isConfigured) return;

    try {
      await GoogleSignin.configure({
        scopes: GOOGLE_SCOPES,
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID, // from Google Console
        offlineAccess: true, // to get refresh token
        hostedDomain: '', // specify domain if needed
        forceCodeForRefreshToken: true,
      });
      this.isConfigured = true;
    } catch (error) {
      console.error('Google Sign-In configuration failed:', error);
      throw new Error('Failed to configure Google authentication');
    }
  }

  async signIn(): Promise<{ user: GoogleUser; tokens: GoogleTokens }> {
    try {
      await this.configure();
      
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      const user: GoogleUser = {
        id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.name || '',
        photo: userInfo.user.photo || undefined,
      };

      const authTokens: GoogleTokens = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        idToken: tokens.idToken,
      };

      return { user, tokens: authTokens };
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign-in was cancelled by user');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        throw new Error('Sign-in failed: ' + error.message);
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw new Error('Failed to sign out');
    }
  }

  async getCurrentUser(): Promise<GoogleUser | null> {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      
      return {
        id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.name || '',
        photo: userInfo.user.photo || undefined,
      };
    } catch (error) {
      console.log('No current user signed in');
      return null;
    }
  }

  async getTokens(): Promise<GoogleTokens | null> {
    try {
      const tokens = await GoogleSignin.getTokens();
      
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        idToken: tokens.idToken,
      };
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return null;
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const tokens = await GoogleSignin.getTokens();
      return tokens.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return null;
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      return false;
    }
  }
}

export const googleAuthService = new GoogleAuthService();
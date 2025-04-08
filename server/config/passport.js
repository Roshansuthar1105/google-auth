const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
  // Log the Google OAuth credentials (without revealing the full secret)
  console.log('Google OAuth Configuration:');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 8)}...` : 'Not set');
  console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Is set (starts with ' + process.env.GOOGLE_CLIENT_SECRET.substring(0, 5) + '...)' : 'Not set');
  console.log('Callback URL:', '/api/auth/google/callback');

  // Determine the correct callback URL based on environment
  const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://google-auth-htqg.onrender.com/api/auth/google/callback'
    : '/api/auth/google/callback';

  console.log('Using callback URL:', callbackURL);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Google OAuth callback received');
        console.log('Profile ID:', profile.id);
        console.log('Display Name:', profile.displayName);

        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log('Existing user found:', user.email);
            return done(null, user);
          }

          console.log('Creating new user with Google account');
          // If not, create new user
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            isGoogleAccount: true
          });

          await user.save();
          console.log('New user created:', user.email);
          return done(null, user);
        } catch (err) {
          console.error('Error in Google OAuth strategy:', err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

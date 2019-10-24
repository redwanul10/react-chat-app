const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GoogleUser = require('./model/googleUser')

module.exports = (passport)=> {
    passport.use(new GoogleStrategy({
        clientID: "540092323830-fu2ngr3laj6p672ms0op1vjj2flpu4b6.apps.googleusercontent.com",
        clientSecret: "amBsjm_w4aacaFn-0AmaAXsi",
        callbackURL: "http://www.example.com/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
          console.log(profile)
           return done(null,profile)
      }
    ));
}
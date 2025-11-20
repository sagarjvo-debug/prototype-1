# Implementation Plan: OAuth2 Integration for Flask Auth

## Goal
Add OAuth2 social login support for Google and GitHub with intelligent account linking.

## User Review Required

> [!IMPORTANT]
> **Account Linking Strategy**: When a user signs in via OAuth with an email that already exists in the system, we will automatically link the OAuth provider to the existing account rather than creating a duplicate. This requires user email verification.

> [!WARNING]
> **Email Verification Requirement**: OAuth providers (Google, GitHub) already verify emails, but existing accounts may not have verified emails. We need to ensure the existing account's email is verified before auto-linking.

## Proposed Changes

### Backend Components

#### [NEW] `models.py` - OAuthProvider Model
- Add `oauth_providers` table with columns:
  - `id`: Primary key
  - `user_id`: Foreign key to users table
  - `provider`: String ('google' or 'github')
  - `provider_user_id`: String (OAuth user ID)
  - `access_token`: Encrypted string
  - `refresh_token`: Encrypted string
  - `created_at`: Timestamp

#### [MODIFY] `requirements.txt`
- Add `authlib==1.2.0`
- Add `cryptography==41.0.0` (for token encryption)

#### [NEW] `oauth.py` - OAuth Configuration
```python
from authlib.integrations.flask_client import OAuth

oauth = OAuth()

oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='github',
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'}
)
```

#### [NEW] `routes/oauth.py` - OAuth Routes
- `GET /login/google` - Redirect to Google OAuth
- `GET /login/github` - Redirect to GitHub OAuth
- `GET /auth/google/callback` - Handle Google callback
- `GET /auth/github/callback` - Handle GitHub callback

**Account Linking Logic**:
```python
def handle_oauth_callback(provider, user_info):
    email = user_info['email']
    provider_user_id = user_info['id']
    
    # Check if OAuth connection already exists
    oauth_account = OAuthProvider.query.filter_by(
        provider=provider,
        provider_user_id=provider_user_id
    ).first()
    
    if oauth_account:
        # Existing OAuth connection - log in
        return login_user(oauth_account.user)
    
    # Check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    
    if existing_user:
        # Link OAuth to existing account
        new_oauth = OAuthProvider(
            user_id=existing_user.id,
            provider=provider,
            provider_user_id=provider_user_id,
            access_token=encrypt(token['access_token'])
        )
        db.session.add(new_oauth)
        db.session.commit()
        return login_user(existing_user)
    else:
        # Create new user with OAuth
        new_user = User(email=email, email_verified=True)
        db.session.add(new_user)
        db.session.flush()
        
        new_oauth = OAuthProvider(
            user_id=new_user.id,
            provider=provider,
            provider_user_id=provider_user_id,
            access_token=encrypt(token['access_token'])
        )
        db.session.add(new_oauth)
        db.session.commit()
        return login_user(new_user)
```

### Frontend Components

#### [MODIFY] `templates/login.html`
- Add "Sign in with Google" button (with Google branding)
- Add "Sign in with GitHub" button (with GitHub branding)
- Add divider: "Or sign in with email"

#### [NEW] `static/css/oauth-buttons.css`
- Style OAuth buttons per brand guidelines
- Add hover effects

## Verification Plan

### Automated Tests
- Test OAuth callback with new email (should create account)
- Test OAuth callback with existing email (should link account)
- Test OAuth callback with already-linked provider (should login)
- Test token encryption/decryption

### Manual Verification
1. Sign up with email first
2. Sign in with Google using same email
3. Verify account is linked (not duplicated)
4. Check that both login methods work

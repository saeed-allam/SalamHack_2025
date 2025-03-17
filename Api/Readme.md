# JWT AUTH

## Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{
"name": "testuseraaas3",
"email": "test1@example.com",
"pw": "password123"
}'
```

## login

You need to send a POST request to the login endpoint with your `email` and `password`.
Returns a JWT token that you can use to authenticate your requests.
Token contains `id`, `name`, `email`

```bash
curl -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "test1@example.com",
"pw": "password123"
}'
```

# Google Auth

## Register

The user need to be logged in in order to send a request. send the JWT as well, duh

```bash
curl -X GET \
  http://localhost:3000/api/auth/googleLogin
```

- This will redirect the user to the google login page
- After the user logs in, user will be redirectd to this endpoint `http://localhost:4200/googleLogin`
- take the cookie that is called `refresh_token` and save it in cookies
- send a request to the endpoint `http://localhost:3000/api/auth/saveGoogleToken` with the cookie and user email to be saved in the database

# content

## Fetch content

Fetches the content of the current logged in user

```bash
curl -X GET \
  http://localhost:3000/api/content/fetchContent \
  -H 'Authorization: Bearer JWT_TOKEN' \
  -H 'Cookie: GOOGLE_AUTH_COOKIE' \
```

# JWT AUTH

## Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{
"name": "",
"email": "",
"pw": ""
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
"email": "",
"pw": ""
}'
```

# Google Auth

## Get google login url

The user need to be logged in in order to send a request. send the JWT as well, duh

```bash
curl -X GET \
  http://localhost:3000/api/auth/googleLogin \
   -H "Authorization: Bearer [JWT TOKEN]"
```

- Receive Access token in json

# content

## Fetch content

Fetches the content of the current logged in user

```bash
curl -X GET \
  http://localhost:3000/api/content/fetchContent \
  -H 'Authorization: Bearer [JWT TOKEN]' \
  -H 'googletoken: [token]'
```

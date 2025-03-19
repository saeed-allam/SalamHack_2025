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

`Respond` with `JSON` containg `JWT` and `user data`

# Google Auth

## Get google login url

The user need to be logged in in order to send a request. send the JWT as well, duh

```bash
curl -X GET \
  http://localhost:3000/api/auth/googleLogin \
   -H "Authorization: [JWT]"
```

`Respond` with `Access token in json`

# content

## Fetch content

```bash
curl -X GET \
  http://localhost:3000/api/content/fetchContent \
  -H 'Authorization: [JWT]' \
  -H 'googletoken: [GAC]'
```

`Respond` with the content of the current logged in user

## Create content summery

```bash curl -X GET \
http://localhost:3000/api/summery/: \
 -H 'Authorization: [JWT]' \
 -H 'googletoken: [GAC] '
```

`Respond` with the summery of the content

# chat

## Get chat history

```bash
curl -X GET \
 http://localhost:3000/api/chat/[contentId] \
 -H 'Authorization: Bearer [JWT]'
```

`Respond` with the chat history

## Send chat message to ai

```bash
curl -X POST \
 http://localhost:3000/api/chat/[contentId] \
 -H 'Authorization: Bearer [JWT]' \
 -H 'Content-Type: application/json' \
 -d '{
"chat": "[WRITE YOUR QUESTION HERE]",
}'
```

`Respond` with the response from the AI

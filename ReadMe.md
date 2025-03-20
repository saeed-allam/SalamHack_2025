# LensFocus

# How to run

## Step 1: Install the required libraries

`Make sure you have NodeJs and Angular installed first`

After downloading the repo to your local machine:

- Go to the folder you downloaded and open it in VS code or your preferred code editor.
- Make sure you are in `SALAMHACK_2025` Folder then Open two terminal windows.
  ![Terminal](./imgs/2terminals.png)
- Navigate to the `lens_focus` directory and run `npm install`.

```bash
cd ./lens_focus && \
npm install && \
ng server
```

- In the second terminal window, navigate to the `Api` directory and run `npm install`

```bash
cd ./Api && \
npm install
```

## Step 2: Create environment variables

- Create a new file named `.env` in the `./Api` of the project and add the following lines

```bash
JWT_SECRET = "wirte your secrets here"
MONGO_DB= "wirte your secrets here"
GOOGLE_CLIENT_ID= "wirte your secrets here"
GOOGLE_CLIENT_SECRET= "wirte your secrets here"
REDIRECT_URI="http://localhost:3000/api/auth/googleCallback"
YT_API_KEY = "wirte your secrets here"
Gemini ="wirte your secrets here"
```

### JWT_SECRET

- You can use any string as your secret key, but make sure it is a strong one.

### MONGO_DB

- Go to `https://www.mongodb.com` and create an account, then create a new cluster, then create a new database and put your secret here. youtube have a lot of videos if you feel confused.

### GOOGLE SET UP

- Go to `https://console.cloud.google.com/` and create a new project.
- Search for `OAuth Consent screen` in the serach bar
- click on branding and fill in your details. - In `application home page` write: `http://localhost:4200`
- In `Authorized domains` write: `localhost.com`
- Go to audience page then under test user click `Add users` and add your own email. This email will be used to login to your app.
- In clients page press `Create cleint` and select `Web application`. name it anything. The `Authorized origins` must be `http://localhost:4200` and `Authorized redirect URIs` must be `http://localhost:3000/api/auth/googleCallback`. press save
- In Data access Click `add or remove scope` and search for `youtube.readonly`. select it then press update.
  ![Google](./imgs/google.png)

#### GOOGLE_CLIENT_ID

- Click clients then under `OAuth 2.0 client IDs` then select the name you just created
- copy the `client ID` and paste it in your `.env` file

#### GOOGLE_CLIENT_SECRET

- copy the `Client secret` and paste it in your `.env` file

## Gemini

- Go to `https://aistudio.google.com`
- on the to left click on `Get api key`
- add it to the `.env` file

Now all the keys are added to the `.env` file

## Step 3: Run the project

- close both terminals first to make sure the the `.env` files are saved and running on the new session.
- Make sure you are in `SALAMHACK_2025` Folder then Open two terminal windows.
- Navigate to the `lens_focus` directory and run `ng server`. This will start the Angular development server.

- In the second terminal window, navigate to the `Api` directory and run `npm index.js`

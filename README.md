
# [![N|Solid](https://raw.githubusercontent.com/45h1m/OxiLive/main/public/favicon.ico)](https://nodesource.com/products/nsolid) OxiLive
## Realtime Blood-Oxygen & BPM Monitoring App

### Frontend
 - Vanilla Javascript, CSS, HTML | __Single page App__
 - Custom __touch-reactive-graph__ to show saved
 - Modern UI

### Backend
- Express JS
- Multi User 
- JWT Authentication, Authorization, OTP via email, no-password signup
- Realtime data 


 
## Setup & Running App (localhost)

#### 1. Cloning repository to local 
```sh
git clone https://github.com/45h1m/OxiLive.git
cd OxiLive
```
__
### 2. Create **.env** file on app root directory
Here you put all private & sensitive information as environment variables. eg:
```sh
EMAIL_USER=oxilive.app@gmail.com
EMAIL_PASSWORD="app password of gmail"
JWT_SECRET=IFHJ34Y879RYHUIFH3YR38
```
##### __EMAIL_USER__ From the email OTP will be sent
##### __EMAIL_PASSWORD__ Add new app in email account with new password
> App password & email password are diffrent, you can add new app in email account management

##### __JWT_SECRET__ Long random string, used for authentication
__
### 3. Install Node Modules

```sh
npm i
```

### 4. Start Local Server

```sh
npm start
```

> App shound be up & running on __localhost:80__

#### Open browser and visit http://localhost:80
##### Client App will be served 
__
# API Endpoints

## /account
##### [POST] /generate
##### [POST] /verify
##### [POST] /signup
##### [POST] /userData
##### [POST] /delete

## /device
##### [POST] /dates
##### [POST] /dates/date
##### [POST] /realtime
##### [POST] /update/deviceID?oxygen=99&bpm=78

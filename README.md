# Airline-Ticket-Booking-System with COWIN Certificate Verification

After extracting the project file:

- Create **_./server/config.js_** and paste below code
    export default {
        JWT_SECRET : <--jwt_key-->,
        ATLAS_URI: <--your_mongodb_atlas_connect_url-->,
        SMTP_HOST : <--smtp-->, // ex : "smtp.gmail.com"
        SMTP_PORT : "465",
        SMTP_USERNAME : <--smtp_username-->,
        SMTP_PASSWORD : <--smtp_passwd-->,
        STRIPE_PRIVATE_KEY : <--stripe_key-->
    }

1. Starting the Server :
    - cd ./server
    - npm run start

2. Starting the React app :
    - cd ./client
    - npm start

3. Starting http server (for Bookings Requests) :
    - cd ./src/flight-booking
    - http-server -p 3055

And that's it !!!

# Airline Ticket Booking System with COWIN Certificate Verification

## Project Setup

1. After extracting the project file, create `./server/config.js` and paste the following code:

    ```javascript
    export default {
        JWT_SECRET : <--jwt_key-->,
        ATLAS_URI: <--your_mongodb_atlas_connect_url-->,
        SMTP_HOST : <--smtp-->, // ex : "smtp.gmail.com"
        SMTP_PORT : "465",
        SMTP_USERNAME : <--smtp_username-->,
        SMTP_PASSWORD : <--smtp_passwd-->,
        STRIPE_PRIVATE_KEY : <--stripe_key-->
    }
    ```

## Starting the Server

2. Navigate to the server directory:

    ```bash
    cd ./server
    ```

    Run the server:

    ```bash
    npm run start
    ```

## Starting the React App

3. Navigate to the client directory:

    ```bash
    cd ./client
    ```

    Start the React app:

    ```bash
    npm start
    ```

## Starting HTTP Server (for Booking Requests)

4. Navigate to the flight-booking directory:

    ```bash
    cd ./src/flight-booking
    ```

    Start the HTTP server:

    ```bash
    http-server -p 3055
    ```

And that's it! Your project is now set up and running.

```markdown
Please note: Replace placeholders like `<--jwt_key-->`, `<--your_mongodb_atlas_connect_url-->`, `<--smtp-->`, `<--smtp_username-->`, `<--smtp_passwd-->`, and `<--stripe_key-->` with your actual values.

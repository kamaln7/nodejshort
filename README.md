nodejshort
==========

A Node.js private URL shortener.

Getting Started
---------------

1. Add a user: `./user.js --help`
2. Start nodejshort: `npm start`
3. Browse to [localhost:3000](http://localhost:3000)

### How to shorten a link:

Currently the only way to shorten a link is to do a POST request against /create with the following parameters:

- `username`: Your username
- `password`: Your password
- `url`: The URL that you want to shorten

Output:

- Status code 403: Invalid username/password
- Status code 400: Invalid URL
- Status code 500: An error occurred while creating the URL
- Status code 201: URL created
    - Also outputs a JSON object with the alias. Example:
        ```
        {
            alias: "obier"
        }
        ```

# Shortr

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> ### URL Shortening done right.

Shortr is a Free and Open-Source URL Shortening Service.

It Features:

-   Custom Short Urls
    -   Specify your own Custom Shortr Urls to be used
-   Dashboard
    -   All your links are available in one place
-   Realtime and Granular Statistics
    -   No. of Visits
    -   Timeline of Visits
    -   Country wise Statistics
    -   Referers
    -   All available as Charts
    -   Realtime Updates

## Get Started here

[http://localhost:3000](http://localhost:3000)

## Stack

-   [Next.js](https://github.com/vercel/next.js)
-   MongoDB
-   Custom Node Server for Next.js
-   [zeit-ui/react](https://github.com/zeit-ui/react)
-   Geo-Location based on IP Address : [iplocate.io](https://www.iplocate.io/)

## API

We also provide a REST API for Url Shortening

#### Create a new Url :

    Endpoint: /api/url
    Method: POST
    Data: {
            longUrl: "Url to Shorten",
            customCode: "(Optional) Custom Shortr Code"
          }

#### Get information about all Custom Url you made:

> You have to be signed in for this

    Endpoint: /api/url
    Method: GET

#### Get information about a Custom Url :

    Endpoint: /api/url/<shortUrlCode>
    Method: GET

#### Update a Custom Url :

    Endpoint: /api/url/<shortUrlCode>
    Method: PUT
    Data: {
            urlCodeToUpdate: "Url Code to update",
            newUrlCode: "New Custom Shortr Code"
          }

#### Delete a Custom Url :

    Endpoint: /api/url/<shortUrlCode>
    Method: DELETE

## Development

Clone the Repo.
Install dependencies.

```bash
npm install
# or
yarn
```

Update Config Variables from `.env.local` file

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Contributing

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/NiketanG/Shortr/issues)

Contributions of all sorts are welcome.
When contributing, make sure you follow Code Style and Standards in the Project.

## Privacy Policy

We store the following data:

-   Actual Urls with their Shortr Urls
-   Statistics

No User data other than user email is stored. User Email is used for Dashboard.

For Users that aren't signed in, email address is not stored.

## LICENSE

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/NiketanG/Shortr/blob/master/LICENSE)

require('dotenv').config()

const publisher = "publisher";
const publisherAttributes = ["name"];

const book = "book";
const bookAttributes = ["title", "author", "publisher"];

const author = "author";
const authorAttributes = ["name", "age"];

const entities = {}

entities[publisher] = {
    serializeParams: {
        attributes: authorAttributes,
    },
    endpoint: "publisher",
}

entities[book] = {
    serializeParams: {
        attributes: bookAttributes,
        author: {
            ref: "id",
            included: false,
            attributes: authorAttributes
        },
        publisher: {
            ref: "id",
            included: false,
            attributes: publisherAttributes
        }
    },
    endpoint: "book",
}

entities[author] = {
    serializeParams: {
        attributes: publisherAttributes,
    },
    endpoint: "author"
}

export {author, book, publisher}

export default {
    entities,
    apiHost: process.env.API_HOST,
    apiPort: process.env.API_PORT
}


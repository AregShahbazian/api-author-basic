require('dotenv').config()

const publisher = "publisher";
const book = "book";
const author = "author";

const entities = {}

entities[publisher] = {
    attributes: ["name"],
    endpoint: "publisher",
}

entities[book] = {
    attributes: ["title", "author", "publisher"],
    endpoint: "book",
}

entities[author] = {
    attributes: ['name', 'age'],
    endpoint: "author"
}

export {author, book, publisher}

export default {
    entities,
    apiRoot: `http://${process.env.API_HOST}:${process.env.API_PORT}`
}


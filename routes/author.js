import express from 'express'
import {Serializer} from 'jsonapi-serializer';
import {authors} from './data'

const router = express.Router();

const author = 'author';
const authorAttributes = ['name', 'age'];
const authorSerializerParams = {
    attributes: authorAttributes
};


router.get('/', function (req, res) {
    const serializer = new Serializer(author, {
        ...authorSerializerParams,
        pluralizeType: false
    });

    const data = serializer.serialize(authors);

    res.send(data);
})
;

export default router

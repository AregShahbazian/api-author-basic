import config, {author} from "../config/index";
import express from 'express'
import {Serializer} from 'jsonapi-serializer';
import {parse} from "qs"
import {createTopLevelLinks, filterData, paginateData, sortData} from "./utils";
import {authors} from './data'

const router = express.Router();

const {
    apiHost,
    apiPort,
    entities: {
        author: {
            endpoint,
            serializeParams
        }
    }
} = config

const apiRoot = `http://${apiHost}:${apiPort}`

router.get('/', function (req, res) {
    const {_filter, _sort, _page} = parse(req.query);

    // Filter
    const filteredData = filterData(authors, _filter);
    const totalPages = _page ? Math.ceil(filteredData.length / _page.size) : undefined
    // Sort
    const sortedData = sortData(filteredData, _sort);

    // Paginate
    if(_page.number > totalPages){
        return res.status(404).send({message: `Page number ${_page.number} doesn't exist`})
    }
    const pageData = paginateData(sortedData, _page);

    const meta = _page ? {totalPages} : undefined;
    const topLevelLinks = createTopLevelLinks(apiRoot, endpoint, {_filter, _sort, _page, totalPages});

    const serializer = new Serializer(author, {
        ...serializeParams,
        pluralizeType: false,
        meta,
        topLevelLinks,
        dataLinks: {
            self: function (data, o) {
                return `${apiRoot}/${endpoint}/${o.id}`;
            }
        }
    });

    res.send(serializer.serialize(pageData));
});

router.get('/:id', function (req, res) {
    const id = req.params.id;

    const entity = authors.filter(a => a.id === id)[0];

    if(!entity){
        return res.status(404).send({message: `Entity with id '${id}' doesn't exist`})
    }

    const topLevelLinks = createTopLevelLinks(apiRoot, endpoint, {id});

    const serializer = new Serializer(author, {
        ...serializeParams,
        pluralizeType: false,
        topLevelLinks
    });

    res.send(serializer.serialize(entity));
});

router.post('/', function (req, res) {
    const id = authors.length + 1;
    const entity = {
        id,
        name: req.body.name,
        age: req.body.age
    };

    authors.push(entity);
    const topLevelLinks = createTopLevelLinks(apiRoot, endpoint, {id});

    const serializer = new Serializer(author, {
        ...serializeParams,
        pluralizeType: false,
        topLevelLinks
    });

    res.send(serializer.serialize(entity));
});

router.patch('/:id', function (req, res) {
    const id = req.params.id;

    let entity = authors.filter(a => a.id === id)[0];
    if(!entity){
        return res.status(404).send({message: `Entity with id '${id}' doesn't exist`})
    }

    entity = Object.assign(entity, req.body)

    const topLevelLinks = createTopLevelLinks(apiRoot, endpoint, {id});

    const serializer = new Serializer(author, {
        ...serializeParams,
        pluralizeType: false,
        topLevelLinks
    });

    res.send(serializer.serialize(entity));
});

router.delete('/:id', function (req, res) {
    const id = req.params.id;

    let entity = authors.filter(a => a.id === id)[0];
    if(!entity){
        return res.status(404).send({message: `Entity with id '${id}' doesn't exist`})
    }

    authors.splice(authors.indexOf(entity), 1)

    const serializer = new Serializer(author, {
        ...serializeParams,
        pluralizeType: false
    });

    res.send(serializer.serialize(entity));
});

export default router
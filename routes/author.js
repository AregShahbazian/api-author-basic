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
    // Sort
    const sortedData = sortData(filteredData, _sort)
    // Paginate
    const pageData = paginateData(sortedData, _page)

    const totalPages = _page ? Math.ceil(filteredData.length / _page.size) : undefined

    const topLevelLinks = createTopLevelLinks(apiRoot, endpoint, _filter, _sort, _page, totalPages);

    const serializer = new Serializer(author, {
        ...serializeParams,
        pluralizeType: false,
        meta: {totalPages},
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

    const serializer = new Serializer(author, {
        ...serializeParams,
        pluralizeType: false,
        topLevelLinks,
        dataLinks: {
            self: function (data, o) {
                return `${apiRoot}/${endpoint}/${o.id}`;
            }
        }
    });

    res.send(serializer.serialize(pageData));
});

export default router

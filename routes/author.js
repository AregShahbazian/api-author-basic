import config, {author} from "../config/index";
import express from 'express'
import {Serializer} from 'jsonapi-serializer';
import {parse} from "qs"
import {createTopLevelLinks, filterData, paginateData, sortData} from "./utils";
import {authors} from './data'

const router = express.Router();

const {apiRoot, entities: {author: {endpoint, attributes}}} = config

router.get('/', function (req, res) {
    const {_filter, _sort, _page} = parse(req.query);

    console.log("---------------------------------")
    // Filter
    const filteredData = filterData(authors, _filter);
    // Sort
    const sortedData = sortData(filteredData, _sort)
    // Paginate
    const {pageData, totalPages} = paginateData(sortedData, _page)

    const topLevelLinks = createTopLevelLinks(apiRoot, endpoint, _filter, _sort, _page, totalPages);

    const serializer = new Serializer(author, {
        attributes,
        pluralizeType: false,
        meta: {totalPages},
        topLevelLinks
    });

    res.send(serializer.serialize(pageData));
});


export default router

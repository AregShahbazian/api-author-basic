import {cloneDeep} from "lodash";

require('dotenv').config()
import express from 'express'
import {Serializer} from 'jsonapi-serializer';
import {parse} from "qs"


import {authors} from './data'
import {constructQueryParas, filterData, paginateData, sortData} from "./utils";

const router = express.Router();

const apiRoot = `http://${process.env.API_HOST}:${process.env.API_PORT}`;

const author = 'author';
const authorEndpoint = 'author';
const authorAttributes = ['name', 'age'];
const authorSerializerParams = {
    attributes: authorAttributes
};


router.get('/', function (req, res) {
    const {_filter, _sort, _page} = parse(req.query);

    console.log("---------------------------------")
    // Filter
    const filteredData = filterData(authors, _filter);
    // Sort
    const sortedData = sortData(filteredData, _sort)
    // Paginate
    const {pageData, totalPages} = paginateData(sortedData, _page)

    const selfQueryParams = constructQueryParas(_filter, _sort, _page.number, _page.size);
    const firstQueryParams = constructQueryParas(_filter, _sort, 1, _page.size);
    const lastQueryParams = constructQueryParas(_filter, _sort, totalPages, _page.size);
    const prevQueryParams = _page.number > 1 ?
        constructQueryParas(_filter, _sort, _page.number, _page.size) : undefined;
    const nextQueryParams = _page.number < totalPages ?
        constructQueryParas(_filter, _sort, _page.number, _page.size) : undefined;

    const topLevelLinks = {
        self: `${apiRoot}/${authorEndpoint}?${selfQueryParams}`,
        first: `${apiRoot}/${authorEndpoint}?${firstQueryParams}`,
        last: `${apiRoot}/${authorEndpoint}?${lastQueryParams}`,
        prev: prevQueryParams ? `${apiRoot}${prevQueryParams}` : undefined,
        next: nextQueryParams ? `${apiRoot}${nextQueryParams}` : undefined,
    };

    const serializer = new Serializer(author, {
        ...authorSerializerParams,
        pluralizeType: false,
        meta: {totalPages},
        topLevelLinks
    });

    res.send(serializer.serialize(pageData));
});


export default router

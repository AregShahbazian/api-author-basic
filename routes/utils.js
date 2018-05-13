import {cloneDeep, mapKeys, orderBy} from 'lodash';
import query from 'array-query'
import paginate from "paginate-array"
import {stringify} from "qs";

const applyRelation = (data, field, rel, val) => {
    switch (rel) {
        case 'gt':
            return query(field).gt(val).on(data);
        case 'gte':
            return query(field).gte(val).on(data);
        case 'lt':
            return query(field).lt(val).on(data);
        case 'lte':
            return query(field).lte(val).on(data);
        case 'search':
            return query(field).search(val).on(data);
        default:
            return data
    }
}

const filterData = (data, filterParams) => {
    if (filterParams) {
        let filteredData = cloneDeep(data)
        mapKeys(filterParams, (fieldFilters, field) => {
            mapKeys(fieldFilters, (val, rel) => {
                filteredData = applyRelation(filteredData, field, rel, val)
            })
        });
        return filteredData;
    }
    return data
};

const sortData = (data, sortParams) => {
    if (sortParams) {
        return orderBy(data, Object.keys(sortParams), Object.values(sortParams))
    }
    return data
};

const paginateData = (data, paginateParams) => {
    if(paginateParams){
        return paginate(data, paginateParams.number, paginateParams.size).data
    }
    return data
}

const createQueryParams = (filterParams, sortingParams, pageNumber, pageSize) => {
    return stringify(
        {
            _filter: filterParams,
            _sort: sortingParams,
            _page: {
                number: pageNumber,
                size: pageSize
            }
        },
        {encode: false});
};

const createFullUrl = (apiRoot, entityEndpoint, queryParams) => {
    return `${apiRoot}/${entityEndpoint}?${queryParams}`
}

const createTopLevelLinks = (apiRoot, entityEndpoint, filterParams, sortingParams, paginateParams, totalPages) => {
    return {
        self:
            createFullUrl(apiRoot, entityEndpoint,
                createQueryParams(filterParams, sortingParams, paginateParams.number, paginateParams.size)),
        first:
            createFullUrl(apiRoot, entityEndpoint,
                createQueryParams(filterParams, sortingParams, 1, paginateParams.size)),
        last:
            createFullUrl(apiRoot, entityEndpoint,
                createQueryParams(filterParams, sortingParams, totalPages, paginateParams.size)),
        prev: paginateParams.number > 1 ?
            createFullUrl(apiRoot, entityEndpoint,
                createQueryParams(filterParams, sortingParams, parseInt(paginateParams.number) - 1, paginateParams.size))
            : undefined,
        next: paginateParams.number < totalPages ?
            createFullUrl(apiRoot, entityEndpoint,
                createQueryParams(filterParams, sortingParams, parseInt(paginateParams.number) + 1, paginateParams.size))
            : undefined
    }
}

export {createQueryParams, filterData, createTopLevelLinks, paginateData, sortData}
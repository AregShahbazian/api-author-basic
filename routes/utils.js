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
    return orderBy(data, Object.keys(sortParams), Object.values(sortParams))
};

const paginateData = (data, paginateParams) => {
    return {
        pageData: paginate(data, paginateParams.number, paginateParams.size).data,
        totalPages: Math.ceil(data.length / paginateParams.size)
    }
}

const constructQueryParas = (filterParams, sortingParams, pageNumber, pageSize) => {
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


export {constructQueryParas, filterData, paginateData, sortData}
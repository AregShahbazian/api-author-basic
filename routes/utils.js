import {cloneDeep, mapKeys, orderBy} from 'lodash';
import query from 'array-query'
import paginate from "paginate-array"
import {stringify} from "qs";

export const applyRelation = (data, field, rel, val) => {
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

export const filterData = (data, filterParams) => {
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

export const sortData = (data, sortParams) => {
    if (sortParams) {
        return orderBy(data, Object.keys(sortParams), Object.values(sortParams))
    }
    return data
};

export const paginateData = (data, paginateParams) => {
    if (paginateParams) {
        return paginate(data, paginateParams.number, paginateParams.size).data
    }
    return data
}

export const createQueryParams = (filterParams, sortingParams, paginateParams) => {
    return stringify(
        {
            _filter: filterParams,
            _sort: sortingParams,
            _page: paginateParams
        },
        {encode: false});
};

export const createFullUrl = (apiRoot, entityEndpoint, {id, queryParams}) => {
    // console.log(id)
    return `${apiRoot}/${entityEndpoint}` +
        `${id ? '/' + id : ''}` +
        `${queryParams ? '?' + queryParams : ''}`
}

export const createTopLevelLinks = (apiRoot, entityEndpoint,
                                    {
                                        _filter: filterParams,
                                        _sort: sortingParams,
                                        _page: paginateParams,
                                        totalPages,
                                        id
                                    }) => {
    if (id) {
        return {self: createFullUrl(apiRoot, entityEndpoint, {id})}
    } else if (paginateParams) {
        return {
            self: createFullUrl(apiRoot, entityEndpoint,
                {
                    queryParams: createQueryParams(
                        filterParams,
                        sortingParams,
                        paginateParams)
                }),
            first: createFullUrl(apiRoot, entityEndpoint,
                {
                    queryParams: createQueryParams(
                        filterParams,
                        sortingParams,
                        {
                            number: 1,
                            size: paginateParams.size
                        })
                }),
            last: createFullUrl(apiRoot, entityEndpoint,
                {
                    queryParams: createQueryParams(
                        filterParams,
                        sortingParams,
                        {
                            number: totalPages,
                            size: paginateParams.size
                        })
                }),
            prev: paginateParams.number > 1 ? createFullUrl(apiRoot, entityEndpoint, {
                    queryParams: createQueryParams(
                        filterParams,
                        sortingParams,
                        {
                            number: parseInt(paginateParams.number) - 1,
                            size: paginateParams.size
                        })
                })
                : undefined,
            next: paginateParams.number < totalPages ? createFullUrl(apiRoot, entityEndpoint,
                {
                    queryParams: createQueryParams(
                        filterParams,
                        sortingParams,
                        {
                            number: parseInt(paginateParams.number) + 1,
                            size: paginateParams.size
                        })
                })
                : undefined
        }
    } else {
        return {
            self: createFullUrl(apiRoot, entityEndpoint,
                {queryParams: createQueryParams(filterParams, sortingParams)})
        }
    }
}

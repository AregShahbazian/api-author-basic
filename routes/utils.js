import {stringify} from 'qs'
import {cloneDeep, mapKeys} from 'lodash';
import query from 'array-query'


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
        case 'is':
            return query(field).is(val).on(data);
        default:
            return data
    }
}

const filterData = (data, filters) => {
    let filteredData = cloneDeep(data)
    mapKeys(filters, (filter, field) => {
        if (typeof filter === 'object') {
            mapKeys(filter, (val, rel) => {
                filteredData = applyRelation(filteredData, field, rel, val)
            })
        } else {
            filteredData = query(field).search(filter).on(filteredData)
        }
    });
    return filteredData;
};

const constructFullEndpoint = (filters, currentPage, pageSize, sortingComboString, endpoint) => {
    let filterQuery = !Object.keys(filters).length ? `${stringify(filters, {encode: false})}` : '';
    let pageQuery = `_page[number]=${currentPage}&_page[size]=${pageSize}`;
    let sortingQuery = sortingComboString ? `_sort=${sortingComboString}` : '';
    let queryString = [filterQuery, pageQuery, sortingQuery].filter(s => s.length).join('&');
    return `/${endpoint}?${queryString}`;
};

const getById = (data, id) => {
    return data.filter(o => o.id === id)[0]
}

export {filterData, constructFullEndpoint, getById}
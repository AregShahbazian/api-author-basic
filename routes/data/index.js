const getById = (data, id) => {
    return data.filter(o => o.id === id)[0]
};

const authors = [
    {
        'id': 'a1',
        'name': 'Twin Author 01',
        'age': '30'
    },
    {
        'id': 'a2',
        'name': 'Twin Author 02',
        'age': '30'
    },
    {
        'id': 'a3',
        'name': 'Author 03',
        'age': '33'
    },
    {
        'id': 'a4',
        'name': 'Author 04',
        'age': '34'
    },
    {
        'id': 'a5',
        'name': 'Author 05',
        'age': '35'
    },
    {
        'id': 'a6',
        'name': 'Author 06',
        'age': '36'
    },
    {
        'id': 'a7',
        'name': 'Author 07',
        'age': '37'
    },
    {
        'id': 'a8',
        'name': 'Author 08',
        'age': '38'
    },
    {
        'id': 'a9',
        'name': 'Author 09',
        'age': '39'
    },
    {
        'id': 'a10',
        'name': 'Anonymous Author',
        'age': '70'
    },
    {
        'id': 'a11',
        'name': 'Anonymous Author',
        'age': '60'
    },
    {
        'id': 'a12',
        'name': 'Anonymous Author',
        'age': '50'
    },
    {
        'id': 'a13',
        'name': 'Anonymous Author',
        'age': '40'
    }
];

const publishers = [
    {
        'id': 'p1',
        'name': 'Publisher 1',
    },
    {
        'id': 'p2',
        'name': 'Publisher 2',
    }
];

const books = [
    {
        'id': 'b1',
        'title': 'Book 1 Of Author 1, by Publisher 1',
        'author': getById(authors, 'a1'),
        'publisher': getById(publishers, 'p1')
    },
    {
        'id': 'b2',
        'title': 'Book 2 Of Author 1, by Publisher 1',
        'author': getById(authors, 'a1'),
        'publisher': getById(publishers, 'p1')
    },
    {
        'id': 'b3',
        'title': 'Book 3 Of Author 1, by Publisher 2',
        'author': getById(authors, 'a1'),
        'publisher': getById(publishers, 'p2')
    },
    {
        'id': 'b4',
        'title': 'Book 4 Of Author 13, by Publisher 2',
        'author': getById(authors, 'a13'),
        'publisher': getById(publishers, 'p2')
    },
];

export {authors, books, publishers}

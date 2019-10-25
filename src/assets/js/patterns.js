let patterns = [
    {
        'name': 'English',
        'diagonal_allowed': false,
        'cells': [
            [null, null, 1, 1, 1, null, null],
            [null, null, 1, 1, 1, null, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, null, 1, 1, 1, null, null],
            [null, null, 1, 1, 1, null, null]
        ]
    },
    {
        'name': 'European',
        'diagonal_allowed': false,
        'cells': [
            [null, null, 1, 1, 1, null, null],
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, null, null]
        ]
    },
    {
        'name': 'Wiegleb',
        'diagonal_allowed': false,
        'cells': [
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null]
        ]
    },
    {
        'name': 'Diamond (32)',
        'diagonal_allowed': false,
        'cells': [
            [null, null, null, 1, null, null, null],
            [null, null, 1, 1, 1, null, null],
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, null, null],
            [null, null, null, 1, null, null, null],
        ]
    },
    {
        'name': 'Diamond (41)',
        'diagonal_allowed': false,
        'cells': [
            [null, null, null, null, 1, null, null, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, 1, 1, 1, 1, 1, null, null],
            [null, 1, 1, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 0, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, 1, 1, null, null],
            [null, null, null, 1, 1, 1, null, null, null],
            [null, null, null, null, 1, null, null, null, null],
        ]
    },
    {
        'name': 'Triangle',
        'diagonal_allowed': true,
        'cells': [
            [null, null, null, null, 0],
            [null, null, null, 1, 1],
            [null, null, 1, 1, 1],
            [null, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ]
    }
]
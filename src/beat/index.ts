const t = ['w', 'h', 'q'];
const T = ['W', 'H', 'Q'];

const rules = {
    'W': ['H-H', 'w'],
    'H': ['Q-Q', 'h'],
    'Q': ['q']
};

export class BST {
    data: string
    left: BST
    right: BST

    constructor(data)  {
        this.data = data
    }

    
}

const W = (sentence) => {
    const l = '' + H(sentence)+H(sentence);
    const r = 'w';
    
}

const H = (sentence) => {
    const l = 'q-q'+sentence;
    const r = 'h'+sentence;
}

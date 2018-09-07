const terminals = ['w', 'h', 'q'];
const Tokens = ['W', 'H', 'Q'];

const rules = {
    'W': ['H-H', 'w'],
    'H': ['Q-Q', 'h'],
    'Q': ['q']
};

interface data {
    'sentence': string;
    'parse': string[]
};

export class BST {
    data: data
    left: BST
    right: BST

    constructor(data)  {
        this.data = data

        if (this.data.parse.length === 0) {
            console.log(this.data.sentence);
        }

        // this.left = 
    }

    
}

const W = (data) => {
    const sentence = data.sentence;

}

const H = (data) => {

}

const node = (data) => {
    // data = 'qq,H-H-H-W-W'   sentence = 'qq', tokens = 'H'
    let sentence = data.split(',')[0];
    let tokens = data.split(',')[1] || [];
    if (tokens && tokens.length > 0) {
        tokens = tokens.split('-');
    }

    console.log('sentence: ', sentence, ' tokens: ', tokens);
    if(tokens.length == 0) {
        // console.log('Sentence: ', sentence);
        // return;
    }
    const next = tokens.shift();
    // console.log('next: ', next);

    if (terminals.indexOf(next) > -1) {
        sentence = sentence + next;
        // const parse = 
        // console.log('inside: sentence ', sentence, ' next: ', next);
        node(sentence + ',' + tokens.join('-'));
    }
    const _rules = rules[next];
    // console.log('Next rules: ', _rules);
    for(const rule in _rules) {
        tokens.unshift(_rules[rule]);
        // console.log('tttokens: ', tokens);
        const parse = tokens.join('-');
        // console.log('parse: ', parse);
        node(sentence + ',' + parse);
    }
}

node(',W');


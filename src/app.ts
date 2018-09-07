const terminals = ['w', 'h', 'q'];
const Tokens = ['W', 'H', 'Q'];

const rules = {
    'W': ['w', 'H-H'],
    'H': ['Q-Q', 'h'],
    'Q': ['q']
};

let list = [];

// export class BST {
//     data: data
//     left: BST
//     right: BST

//     constructor(data)  {
//         this.data = data

//         if (this.data.parse.length === 0) {
//             console.log(this.data.sentence);
//         }

//         // this.left = 
//     }

    
// }


const node = (data) => {
    // data = 'qq,H-H-H-W-W'   sentence = 'qq', tokens = 'H'
    let sentence = data.split(',')[0];
    let tokens = data.split(',')[1] || [];
    if (tokens && tokens.length > 0) {
        tokens = tokens.split('-');
    }

    console.log('sentence: ', sentence, ' tokens: ', tokens);
    if(tokens.length == 0) {
        list.push(sentence);
    }
    const next = tokens.shift();

    if (terminals.indexOf(next) > -1) {
        sentence = sentence + next;
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

console.log(list);

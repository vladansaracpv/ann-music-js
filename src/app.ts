const terminals = ['w', 'h', 'q'];
const Tokens = ['W', 'H', 'Q'];

namespace Beat {
    
    class Note {
        duration: number;
        rules: string[];

        constructor(duration, rules) {
            this.duration = duration;
            this.rules = rules;
        }
    }

    class Data {
        sentence: string;
        parse: string;
    
        constructor(sentence, parse) {
            this.sentence = sentence;
            this.parse = parse;
        }
    };
    
    class Node {
        data: Data;
        left: null;
        right: null;
    
        constructor(data: Data) {
            this.data = data;
        }
    
        print = () => console.log(`Generated: ${this.data.sentence}, Parsing: ${this.data.parse}`);
    }
    
    class Parser {
        root: Node;
    
        grammar = {
            'W': ['w', 'HH'],
            'H': ['h', 'QQ'],
            'Q': ['q']
        };
        
        durations = {
            'w': 4,
            'h': 2,
            'q': 1
        }
    
        list: string[];
    
        constructor(root: Node) {
    
        }
    }
    
    const data = new Data('gen', 'pasr');
    const node = new Node(data);
    node.print();

}

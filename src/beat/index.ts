namespace Beat {

    class Grammar {
        terminals = ['w', 'h', 'q'];
        Tokens = ['W', 'H', 'Q'];
        durations = {
            'w': 4,
            'h': 2,
            'q': 1
        }
        rules = {
            'W': ['w', 'HH'],
            'H': ['h', 'QQ'],
            'Q': ['q']
        };
        
    }
    
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
        list: string[];
    
        constructor(root: Node) {
    
        }
    }
    
}

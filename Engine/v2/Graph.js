let graph = {
    nodes: [],
    edges: [],
    edgeCount: 0,    
    init: (nodes, edges) => {
        console.log(nodes, edges);
        graph.nodes = [];
        graph.edges = [];
        graph.edgeCount = 0;

        for(let i = 0; i < nodes; i++) {
            graph.addRandomNode(-4, 5);
        }

        let excludes = [];
        for (let i = 0; i < nodes; i++){
            let n = graph.getRandNode(excludes);
            graph.addNodeEdge(n, 1);
            excludes.push(n.id);
        }

        let saftyCount = 0;
        let goal = Math.ceil((edges*2)/graph.nodes.length);
        while (graph.edgeCount < edges) {
            let n = graph.getRandNode();
            graph.addNodeEdge(n, edges);
    
            saftyCount++;
            if (saftyCount > 10000) {
                break;
            }
        }

        //make sure this game is winnable
        let minVal = graph.edgeCount- graph.nodes.length + 1;
        let wiggle = graph.getRand(3)
        while(graph.netCash() < minVal + wiggle) {
            graph.getRandNode().add();
        }

        //but not too easy
        let maxVal = minVal + graph.getRand(3);
        while(graph.netCash() > maxVal) {
            graph.getRandNode().sub();
        }
    },
    netCash: () => {
        return graph.nodes.reduce((cash, n) => cash + n.value, 0);
    },
    addRandomNode: (lower, upper) => {
        graph.nodes.push(
            new Node(
                graph.getRand(upper - lower) + lower
            )
        );
    },
    addNodeEdge: (node, goal) => {
        let edges = node.getEdgeCount();
        if (edges >= goal) {
            return true;
        }
        let saftyCount = 0;
        while (node.getEdgeCount() < goal) {
            let ex = node.getEdgeIDs();
            ex.push(node.id);
            let add = graph.getRandNode(ex);
            
            if (!add) {
               break; 
            }

            node.addEdge(add);
            add.addEdge(node);
            graph.edges.push(new Edge(node, add));
            graph.edgeCount++;

            saftyCount++;
            if (saftyCount > 100) {
                break;
            }
        }
    },
    getRandNode: (exclude = []) => {
        if (!Array.isArray(exclude)){
            exclude = [exclude];
        }
        if (exclude.length >= graph.nodes.length) {
            return false;
        }
        let ret = null;
        while(ret == null) {
            let rand = graph.getRand(graph.nodes.length);
            let node = graph.nodes[rand];
            if (exclude.includes(node.id)) {
                continue;
            }
            ret = node;
        }
        return ret;
    },
    getRand: (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }
};
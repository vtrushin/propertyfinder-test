// https://github.com/andrewhayward/dijkstra

const sorter = (a, b) => parseFloat(a) - parseFloat(b);

const findPaths = (map, start, end) => {
    const costs = {};
    const open = {'0': [start]};
    const predecessors = {};
    let keys;

    const addToOpen = (cost, vertex) => {
        const key = '' + cost;

        if (!open[key]) {
            open[key] = []
        }

        open[key].push(vertex);
    };

    costs[start] = 0;

    while (open) {
        keys = Object.keys(open);

        if (!keys.length) {
            break;
        }

        keys.sort(sorter);

        const key = keys[0];
        const bucket = open[key];
        const node = bucket.shift();
        const currentCost = parseFloat(key);
        const adjacentNodes = map[node] || {};

        if (!bucket.length) {
            delete open[key]
        }

        for (const vertex in adjacentNodes) {
            if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
                const cost = adjacentNodes[vertex];
                const totalCost = cost + currentCost;
                const vertexCost = costs[vertex];

                if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                    costs[vertex] = totalCost;
                    addToOpen(totalCost, vertex);
                    predecessors[vertex] = node;
                }
            }
        }
    }

    if (costs[end] === undefined) {
        return null;
    } else {
        return predecessors;
    }

};

const extractShortest = (predecessors, end) => {
    const nodes = [];
    let u = end;

    while (u !== undefined) {
        nodes.push(u);
        u = predecessors[u];
    }

    nodes.reverse();

    return nodes;
};

const findShortestPath = (map, nodes) => {
    const path = [];
    let start = nodes.shift();
    let end;
    let predecessors;
    let shortest;

    while (nodes.length) {
        end = nodes.shift();
        predecessors = findPaths(map, start, end);

        if (predecessors) {
            shortest = extractShortest(predecessors, end);
            if (nodes.length) {
                path.push.apply(path, shortest.slice(0, -1));
            } else {
                return path.concat(shortest);
            }
        } else {
            return null;
        }

        start = end;
    }
};

export default (map, from, to) => findShortestPath(map, [from, to]);

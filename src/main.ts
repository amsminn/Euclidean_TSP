export { };

const IT = 1000000;
const BASE = 20;
const R = 5;

function nodeDraw(n: number, mp: { x: number, y: number }[]) {
    const cvs = document.getElementById("asdf")! as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    const __nodeDraw = (p: number, q: number) => {
        ctx.beginPath();
        ctx.arc(p * R + BASE, q * R + BASE, 10, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.fillStyle = 'blue'; ctx.fill();
    };
    for (let i = 0; i < n; i++) __nodeDraw(mp[i].x, mp[i].y);
}

function edgeDraw(mp: { x: number, y: number }[], edges: Array<[number, number]>) {
    const cvs = document.getElementById("asdf")! as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    const __edgeDraw = (edge: [number, number]) => {
        const currentMps = [mp[edge[0]], mp[edge[1]]];
        ctx.beginPath();
        ctx.moveTo(BASE + currentMps[0].x * R, BASE + currentMps[0].y * R);
        ctx.lineTo(BASE + currentMps[1].x * R, BASE + currentMps[1].y * R);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.stroke();
    };
    for (const edge of edges) __edgeDraw(edge);
}

function getCanvas() {
    const cvs = document.getElementById("asdf")! as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
}

function render
    (
        n: number,
        mp: { x: number, y: number }[],
        edge: Array<[number, number]>
    ) {
    getCanvas();
    edgeDraw(mp, edge);
    nodeDraw(n, mp);
}

function frame
    (
        gen: Generator<Array<[number, number]>, void, unknown>,
        n: number,
        mp: { x: number, y: number }[]
    ) {
    const edge = gen.next();
    if (edge.value)
        render(n, mp, edge.value);
    setTimeout(() => {
        frame(gen, n, mp);
    }, 100);
}

function* simulated_annealing(n: number, mp: { x: number, y: number }[]) {
    let T = n / 2;
    const K = 1;
    const D = 0.9999;
    let e1 = 0;
    let e2 = 0;
    const perm: number[] = [];
    mp.sort((a: { x: number, y: number }, b: { x: number, y: number }) => a.x - b.x);
    for (let i = 0; i < n; i++) perm[i] = i;
    const getidx = (idx: number) => { return (idx + n) % n; };
    const dist = (p: number, q: number) => {
        p = getidx(p); q = getidx(q);
        const a = mp[perm[p]].x - mp[perm[q]].x;
        const b = mp[perm[p]].y - mp[perm[q]].y;
        return Math.sqrt(a * a + b * b);
    };
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) T = Math.max(T, dist(i, j));
    const Swap = (p: number, q: number) => {
        p = getidx(p); q = getidx(q);
        if (p > q) {
            const tmp = p;
            p = q;
            q = tmp;
        }
        for (let i = 0; p + i < q - i; i++) {
            const tmp = perm[p + i];
            perm[p + i] = perm[q - i];
            perm[q - i] = tmp;
        }
    };
    let edge: [number, number][] = [];
    const cost = () => {
        let ret = 0;
        for (let i = 0; i < n; i++) ret += dist(i - 1, i);
        return ret;
    };
    e1 = cost();
    for (let tc = 0; tc < IT; tc++) {
        for (let i = 0; i < 1000; i++) {
            const p: number = Math.floor(Math.random() * (n));
            const q: number = Math.floor(Math.random() * (n));
            e1 = cost();
            Swap(p, q);
            e2 = cost();
            const newE: [number, number][] = [];
            for (let i = 0; i < n; i++) {
                newE.push([perm[getidx(i - 1)], perm[i]]);
            }
            const x: number = Math.exp((e1 - e2) / (K * T));
            if (e2 < e1 || x >= Math.random()) edge = newE;
            else Swap(p, q);
            T *= D;
        }
        yield edge;
    }
}

{
    const t = document.getElementById("submit");
    if (t) {
        t.onclick = () => {
            for (let i = 0; i < 10; i++) console.log(Math.random());
            const nodeCount = document.getElementById("nodeInput") as HTMLInputElement | null;
            const edgeData = document.getElementById("edgeInput") as HTMLInputElement | null;
            if (nodeCount && edgeData) {
                const n = parseInt(nodeCount.value.trim());
                const xyz = edgeData.value.trim().split(/\s/).map(qwer => parseInt(qwer));
                if (n * 2 == xyz.length) {
                    const asdf: { x: number, y: number }[] = [];
                    for (let i = 0; i < n; i++) {
                        asdf[i] = {
                            x: xyz[i * 2],
                            y: xyz[i * 2 + 1]
                        };
                    }
                    frame(simulated_annealing(n, asdf), n, asdf);
                } else document.write("정점의 개수와 간선의 개수가 모순됩니다.");
            } else document.write("Node Count & Graph Data 모두 입력하세요.");
        };
    }
}
const minCostTickets = (days, costs) => {
    const mem = new Map();

    const solve = (days, costs, pos, reachability) => {
        if (pos > days.length - 1) return 0;
        if (reachability >= days[pos]) return solve(days, costs, pos + 1, reachability);
        if (mem.has(pos)) return mem.get(pos);

        const one = costs[0] + solve(days, costs, pos + 1, days[pos]);
        const seven = costs[1] + solve(days, costs, pos + 1, days[pos] + 6);
        const month = costs[2] + solve(days, costs, pos + 1, days[pos] + 29);
        const result = Math.min(one, seven, month);

        mem.set(pos, result);
        return result;
    };

    return Math.min(
        costs[0] + solve(days, costs, 0, days[0]),
        costs[1] + solve(days, costs, 0, days[0] + 6),
        costs[2] + solve(days, costs, 0, days[0] + 29)
    );
};

module.exports = { minCostTickets };

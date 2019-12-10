const chalk = require('chalk');
const table = require('text-table');

function csv(headings, rows) {
    const string = [headings, ...rows].map(column => column.join(',')).join('\n');

    console.log(string);
}

function prettyTable(header, headings, rows) {
    const formattedHeadings = headings.map(heading => chalk.cyan(heading));
    const formattedRows = rows.map(([name, ...rest]) => [
        chalk.blue(name),
        ...rest.map(cell => chalk.yellow(cell))
    ]);

    const content = table([formattedHeadings, ...formattedRows], {
        align: rows[0].map(() => 'r')
    });

    console.log(`\n${header}\n${content}\n`);
}

function nativeTable(headings, rows) {
    if (typeof console.table !== 'function') {
        prettyTable('table output is not supported in your environment', headings, rows);
        return;
    }

    const object = rows.reduce((data, [name, ...metrics]) => ({
        ...data,
        [name]: headings.slice(1).reduce((rowData, heading, index) => ({
            ...rowData,
            [heading]: metrics[index]
        }), {})
    }), {});
    console.table(object);
}

module.exports = { csv, prettyTable, nativeTable };

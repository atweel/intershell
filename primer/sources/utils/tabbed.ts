export default (output: string | Buffer): string => {
    return output.toString().split('\n')
        .map((line) => `\t${ line }`)
        .join('\n');
};

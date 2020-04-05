import { times, constant } from 'lodash';

export default (): string => {
    return times(process.stdout.columns, constant('-')).join('');
};

import { shell } from './api/shell';

const sh = shell('/bin/sh');
const bash = shell('/bin/bash');
const dash = shell('/bin/dash');

export {
    sh,
    bash,
    dash,
};

import { shell } from './api/shell';

const sh = shell('/bin/sh');
const bash = shell('/bin/bash');
const dash = shell('/bin/dash');
const zsh = shell('/bin/zsh');

export {
    sh,
    bash,
    dash,
    zsh,
};

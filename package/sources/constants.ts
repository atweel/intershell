const DEFAULT_INTERPRETER = '/bin/sh';

const SUPPORTED_INTERPRETERS = [ DEFAULT_INTERPRETER, '/bin/bash', '/bin/dash', '/bin/zsh' ];

const TAG_FUNCTION_METADATA_KEY = 'atweel:soft-shells:tag-function';

export {
    DEFAULT_INTERPRETER,
    SUPPORTED_INTERPRETERS,
    TAG_FUNCTION_METADATA_KEY,
};

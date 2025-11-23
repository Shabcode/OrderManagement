export default {
    '/backend': {
        target: 'http://localhost:8080/',
        pathRewrite: {
            '^/backend': '',
        },
        headers: {
            Authorization: 'Basic c3lzdGVtOnA0c3N3MHJk',
        },
    },
};

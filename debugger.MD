# DEBUG package 与环境变量的配合使用

const startupDebugger = require('debug')('app:startup');
const deDebugger = require('debug')('app:db');

if(app.get('env' === 'development') {
app.use(morgan('tiny'));
startupDebugger('Morgan enabled...');
}

// Db work
deDebugger('Connected to the database...');

## \$export DEBUG=app:startup

## \$export DEBUG=app:startup,db

## \$export DEBUG=app:db

## \$export DEBUG=app:\*

## shortcut running with debugging

\$DEBGU=app:db nodemon index.js

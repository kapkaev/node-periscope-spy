# node-periscope-spy
Get Periscope lives from Twitter and store data from them

## Install
```js
npm install node-periscope-spy
```

## Use
```js
var Spy = require('node-periscope-spy');
var config = {
	consumer_key: '',
	consumer_secret: '',
	access_token: '',
	access_token_secret: ''
};
var rec = new Spy(config);

spy.follow('kapkaev');
```

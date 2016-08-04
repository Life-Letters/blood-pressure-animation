# The immunity game

Can you destroy the virus? In the immunity game, you play a b-cell trying to fight back viruses.


## Development

### Install

```
npm install
bower install
```


### Importing into other projects

- Import the `life.animations.blood-pressure` module.

- When using the module in another app, you will need to copy the `blood-pressure-assets` folder across. Add the following to the Grunt `copy` task:

	```
	copy: {
		dist: {
			files: [{
				expand: true,
				cwd: './bower_components/blood-pressure-animation/app',
				src: 'blood-pressure-assets/{,*/}*.*',
				dest: '<%= yeoman.dist %>'
			}
	```

	To make it work with a *LiveReload* server, add the following:

	```
	livereload: {
		options: {
			open: true,
			middleware: function (connect) {
				return [
					...
          connect().use(
            '/blood-pressure-assets',
            connect.static('./bower_components/blood-pressure-animation/app/blood-pressure-assets')
          ),
				];
			}
		}
	},
	```

- Add the following overrides to `bower.json`:

	```
	"overrides": {
    "p5.js-sound": {
      "main": [
        "./lib/p5.js",
        "./lib/p5.sound.js"
      ]
    }
  },
  ```
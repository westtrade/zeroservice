# ZeroService

It is a framework-agnostic stateful reactive stream service prototype, which
allow you to implement reusable application services, which can be integrated
with diffrent ui frameworks and worked in evironments, such as Electron, web or
cordova.

# Supported frameworks

- Angular (1.x)
- Polymer
- React
- Riot
- Vue

# ROADMAP

- [ ] Service collaboration
- [ ] Implement adapter for Tabrisjs
- [ ] Implement adapter for NativeScript
- [ ] Reduce size
- [ ] Improve perfomance

```

class AuthService extends ZeroService {

	constructor() {
		super()
	}

	login(){

	}

	logout(){

	}
}


AuthService.setup(AngularAdapter);

//Or ServiceManager.setup(AngularAdapter) , <- setup default adapter





```


# TODO
- [ ] Fix test coverage reporters (https://github.com/douglasduteil/isparta, https://github.com/karma-runner/karma-coverage, https://onsen.io/blog/mocha-chaijs-unit-test-coverage-es6/)
- [ ] Add to travis CI

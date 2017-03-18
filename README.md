# ZeroService
Zero service is prototype of states services

# ROADMAP

- [ ] Split into extendable services
- [ ] Service collaboration

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

# ZeroService

[![Build Status](https://travis-ci.org/westtrade/zeroservice.svg?branch=master)](https://travis-ci.org/westtrade/zeroservice)
[![Dependency Status](https://gemnasium.com/badges/github.com/westtrade/zeroservice.svg)](https://gemnasium.com/github.com/westtrade/zeroservice)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6c5b28e6096b4527b40ecef26061d784)](https://www.codacy.com/app/westtrade/zeroservice?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=westtrade/zeroservice&amp;utm_campaign=Badge_Grade)

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

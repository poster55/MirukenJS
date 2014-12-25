var miruken = require('./miruken.js'),
    Q       = require('q');
              require('./context.js'),
              require('./validate.js');

new function () { // closure

    /**
     * @namespace miruke.ioc
     */
    var ioc = new base2.Package(this, {
        name:    "ioc",
        version: miruken.version,
        parent:  miruken,
        imports: "miruken,miruken.callback,miruken.context,miruken.validate",
        exports: "Container,Registration,ComponentPolicy,Lifestyle,TransientLifestyle,SingletonLifestyle,ContextualLifestyle,ComponentModel,IoContainer,DependencyManager,DependencyResolution,DependencyResolutionError,$$composer"
    });

    eval(this.imports);

    /**
     * Composer dependency.
     */
    var $$composer = {};

    /**
     * @protocol {Container}
     */
    var Container = Protocol.extend(Disposing, {
        constructor: function (proxy, strict) {
            this.base(proxy, (strict === undefined) || strict);
        },
        /**
         * Registers on or more components in the container.
         * @param   {Any*}    registration  - Registration , ComponentModel or policies
         * @returns {Promise} a promise representing the registration.
         */
        register: function (registration) {},
        /**
         * Resolves the component for the key.
         * @param   {Any} key  - key used to identify the component
         * @returns {Any} component (or Promise) satisfying the key.
         */
        resolve: function (key) {}
    });

    /**
     * @protocol {Registration}
     */
    var Registration = Protocol.extend({
        /**
         * Encapsulates the regisration of one or more components.
         * @param {Container} container  - container to register components in
         */
        register: function (container) {}
    });

    /**
     * @protocol {ComponentPolicy}
     */
    var ComponentPolicy = Protocol.extend({
        /**
         * Applies the policy to the ComponentModel.
         * @param {ComponentModel} componentModel  - component model
         */
         apply: function (componentModel) {}
    });

    /**
     * @class {ComponentModel}
     */
    var ComponentModel = Base.extend(ComponentPolicy, {
        constructor: function () {
            var _key, _service, _class, _lifestyle, _factory,
                _dependencies = [];
            this.extend({
                getKey: function () {
                    return _key || _service || _class
                },
                setKey: function (value) { _key = value; },
                getService: function () {
                    var service = _service;
                    if (!service & $isProtocol(_key)) {
                        service = _key;
                    }
                    return service;
                },
                setService: function (value) {
                    if ($isSomething(value) &&  !$isProtocol(value)) {
                        throw new TypeError(lang.format("%1 is not a protocol.", value));
                    }
                    _service = value;
                },
                getClass: function () { return _class; },
                setClass: function (value) {
                    if ($isSomething(value) && !$isClass(value)) {
                        throw new TypeError(lang.format("%1 is not a class.", value));
                    }
                    _class = value;
                },
                getLifestyle: function () { return _lifestyle; },
                setLifestyle: function (value) { _lifestyle = value; },
                getFactory: function () {
                    var factory =  _factory;
                    if (!factory && _class) {
                        factory = _class.new.bind(_class);
                    }
                    return factory;
                },
                setFactory: function (value) {
                    if ($isSomething(value) && !$isFunction(value)) {
                        throw new TypeError(lang.format("%1 is not a function.", value));
                    }
                    _factory = value;
                },
                getDependencies: function () { return _dependencies; },
                setDependencies: function (value) { _dependencies = value; },
                manageDependencies: function (actions) {
                    if ($isFunction(actions)) {
                        var manager = new DependencyManager(_dependencies);
                        actions(manager);
                        return _dependencies;
                    }
                },
                configure: function (/* policies */) {
                    var policies = Array2.flatten(arguments);
                    switch (policies.length) {
                        case 0: return;
                        case 1:
                        case 2:
                        {
                            var clazz = (policies.length === 1) ? policies[0] : policies[1];
                            if ($isClass(clazz)) {
                                this.setKey(policies[0]);
                                this.setClass(clazz);
                                return;
                            }
                            break;
                        }
                    }
                    var _this = this;
                    policies.forEach(function (policy) {
                        if (ComponentPolicy.adoptedBy(policy)) {
                            policy.apply(_this);
                        } else {
                            throw new TypeError(lang.format("%1 is not a ComponentPolicy.", policy));
                        }
                    });
                },
                apply: function (componentModel) {
                    componentModel.setKey(_key);
                    componentModel.setService(_service);
                    componentModel.setClass(_class);
                    componentModel.setLifestyle(_lifestyle);
                    componentModel.setFactory(_factory);
                    componentModel.setDependencies(_dependencies);
                }
            });
            this.configure(arguments);
        }
    });

    /**
     * @class {DependencyManager}
     */
    var DependencyManager = Base.extend({
        constructor: function (dependencies) {
            dependencies = dependencies || [];
            this.extend({
                getDependencies: function () { return dependencies; },
                getIndex: function (index) {
                    if (dependencies.length > index) {
                        return dependencies[index];
                    }
                },
                setIndex: function (index, dependency) {
                    if ((dependencies.length <= index) ||
                        (dependencies[index] === undefined)) {
                        dependencies[index] = dependency;
                    }
                    return this;
                },
                insertIndex: function (index, dependency) {
                    dependencies.splice(index, 0, dependency);
                    return this;
                },
                replaceIndex: function (index, dependency) {
                    dependencies[index] = dependency;
                    return this;
                },
                removeIndex: function (index) {
                    if (dependencies.length > index) {
                        dependencies.splice(index, 1);
                    }
                    return this;
                },
                append: function (/* dependencies */) {
                    var deps = Array2.flatten(arguments);
                    dependencies.push.apply(dependencies, deps);
                    return this;
                },
                merge: function (other, replace) {
                    if (other !== undefined) {
                        if (other instanceof DependencyManager) {
                            other = other.getDependencies();
                        }
                        if (!(other instanceof Array)) {
                            other = [other];
                        }
                        for (var index = 0; index < other.length; ++index) {
                            var dependency = other[index];
                            if (dependency !== undefined) {
                                if (replace) {
                                    this.replaceIndex(index, dependency);
                                } else {
                                    this.setIndex(index, dependency);
                                }
                            }
                        }
                    }
                    return this;
                }
            });
        }
    });

    /**
     * @class {Lifestyle}
     */
    var Lifestyle = Base.extend(ComponentPolicy, Disposing, {
        resolve: function (factory) { return factory(); },
        trackInstance: function (instance) {
            if (instance && $isFunction(instance.dispose)) {
                var lifestyle = this;
                instance.extend({
                    dispose: function (disposing) {
                        if (disposing || lifestyle.disposeInstance(instance, true)) {
                            this.base();
                            this.dispose = this.base;
                        }
                    }
                });
            }
        },
        disposeInstance: function (instance, disposing) {
            if (!disposing && instance && $isFunction(instance.dispose)) {
                instance.dispose(true);
            }
            return !disposing;
        },
        apply: function (componentModel) {
            componentModel.setLifestyle(this);
        }
    });
    Lifestyle.implement(DisposingMixin);

   /**
     * @class {TransientLifestyle}
     */
    var TransientLifestyle = Lifestyle.extend();

   /**
     * @class {SingletonLifestyle}
     */
    var SingletonLifestyle = Lifestyle.extend({
        constructor: function (instance) {
            this.extend({
                resolve: function (factory) {
                    if (!instance) {
                        instance = factory();
                        this.trackInstance(instance);
                    }
                    return instance;
                },
                disposeInstance: function (obj, disposing) {
                    if (!disposing && (obj === instance)) {
                        if (this.base(obj, disposing)) {
                           instance = undefined;
                           return true;
                        }
                    }
                    return false;
                },
                _dispose: function() {
                    this.disposeInstance(instance);
                }
            });
        }
    });

   /**
     * @class {ContextualLifestyle}
     */
    var ContextualLifestyle = Lifestyle.extend({
        constructor: function () {
            var _cache = {};
            this.extend({
                resolve: function (factory, composer) {
                    var context = composer.resolve(Context);
                    if (context) {
                        var id       = assignID(context),
                            instance = _cache[id];
                        if (!instance) {
                            _cache[id] = instance = factory();
                            this.trackInstance(instance);
                            var lifestyle = this,
                                cancel    = context.observe({
                                contextEnded: function(_) {
                                    lifestyle.disposeInstance(instance);
                                    delete _cache[id];
                                    cancel();
                                }
                            });
                        }
                        return instance;
                    }
                },
                disposeInstance: function (instance, disposing) {
                    for (contextId in _cache) {
                        if (_cache[contextId] === instance) {
                            this.base(instance, disposing);
                            delete _cache[contextId];
                            return true;
                        } 
                    }
                    return false;
                },
                _dispose: function() {
                    for (contextId in _cache) {
                        this.disposeInstance(_cache[contextId]);
                    }
                    _cache = {};
                }
            });
        }
    });

    /**
     * @class {DependencyResolution}
     */
    var DependencyResolution = CallbackResolution.extend({
        constructor: function (key, parent) {
            var _owner;
            this.base(key);
            this.extend({
                claim: function (owner) { 
                    if (this.isResolvingDependency(key, owner)) {
                        return false;
                    }
                    _owner = owner;
                    return true;
                },
                isResolvingDependency: function (dependency, requestor) {
                    if ((dependency === key) && (requestor === _owner)) {
                        return true;
                    }
                    return parent && parent.isResolvingDependency(dependency, requestor);
                },
                formattedDependencyChain: function () {
                    return parent ? (key + " <= " + parent.formattedDependencyChain()) : key;
                }
            });
        }
    });

    /**
     * @class {DependencyResolutionError}
     * @param {DependencyResolution} dependency  - failing dependency
     * @param {String}               message     - error message
     */
    function DependencyResolutionError(dependency, message) {
        this.message    = message;
        this.dependency = dependency;
        this.stack      = new Error().stack;
    }
    DependencyResolutionError.prototype             = new Error();
    DependencyResolutionError.prototype.constructor = DependencyResolutionError;

    /**
     * @class {IoContainer}
     */
    var IoContainer = CallbackHandler.extend(Container, {
        constructor: function () {
            this.extend({
                register: function (registration) {
                    if (Registration.adoptedBy(registration)) {
                        return registration.register(this);
                    }
                    var container      = this,
                        componentModel = new ComponentModel(arguments); 
                    return Validator($composer).validate(componentModel).thenResolve({
                        componentModel: componentModel,
                            unregister: container.registerHandler(componentModel)
                    });
                },
                registerHandler: function(componentModel) {
                    return _registerHandler(this, componentModel); 
                },
                dispose: function () { $provide.removeAll(this); }
            })
        },
        $validators:[
            ComponentModel, function (validation, composer) {
                var componentModel = validation.getObject(),
                    key            = componentModel.getKey(),
                    service        = componentModel.getService(),
                    clazz          = componentModel.getClass(),
                    factory        = componentModel.getFactory();
                if (!key) {
                    validation.required('Key', 'Key could not be determined for component.');
                }
                if (!factory) {
                    validation.required('Factory', 'Factory could not be determined for component.');
                }
                if (service && clazz && !clazz.conformsTo(service)) {
                    validation.typeMismatch('Class', clazz,
                        lang.format('Class %1 does not conform to service %2.', clazz, service));
                }
            }]
    });

    /**
     * Performs the actual component registration in the container.
     * @param   {IoContainer}    container       - container
     * @param   {ComponentModel} componentModel  - component model
     * @returns {Function} function to unregister the component.
     */
    function _registerHandler(container, componentModel) {
        var key          = componentModel.getKey(),
            clazz        = componentModel.getClass(),
            lifestyle    = componentModel.getLifestyle() || new SingletonLifestyle,
            factory      = componentModel.getFactory(),
            dependencies = componentModel.getDependencies();
        if (clazz && (clazz.prototype.$inject || clazz.$inject)) {
            var manager = new DependencyManager;
            manager.merge(dependencies, true)        // dependency overrides
                   .merge(clazz.prototype.$inject)   // class definition
                   .merge(clazz.$inject);            // class level
            dependencies = manager.getDependencies();
        }
        var unbind = $provide(container, key, function (resolution, composer) {
            if ((resolution instanceof DependencyResolution) &&
                (resolution.claim(container) === false) /* cycle */) {
                return Q.reject(new DependencyResolutionError(resolution,
                    lang.format("Dependency cycle %1 detected.",
                                resolution.formattedDependencyChain())))
            }
            return lifestyle.resolve(function () {
                var promises = [], parameters = [];
                for (var index = 0; index < dependencies.length; ++index) {
                    var dependency = dependencies[index],
                        modified   = dependency instanceof Modifier,
                        use        = modified && $use.test(dependency),
                        lazy       = modified && $lazy.test(dependency),
                        optional   = modified && $optional.test(dependency),
                        promise    = modified && $promise.test(dependency),
                        containerDep;
                    dependency = Modifier.unwrap(dependency);
                    if (dependency === $$composer) {
                        dependency = composer;
                    } else if (dependency === Container) {
                        dependency = containerDep || (containerDep = Container(composer));
                    }
                    else if (use || $isNothing(dependency)) {
                        if (promise) {
                            dependency = Q(dependency);
                        }
                        if (lazy) {
                            dependency = $lift(dependency);
                        }
                    } else {
                        if (lazy) {
                            var paramDep = dependency;
                            dependency   = function () {
                                var param = _resolveDependency(paramDep, false, composer);
                                return promise ? Q(param) : param;
                            };
                        } else {
                            if (!(resolution instanceof DependencyResolution)) {
                                resolution = new DependencyResolution(resolution.getKey());
                                resolution.claim(container);
                            }
                            var paramDep = new DependencyResolution(dependency, resolution);
                            dependency   = _resolveDependency(paramDep, !optional, composer);
                            if (promise) {
                                dependency = Q(dependency);
                            } else if ($isPromise(dependency)) {
                                promises.push(dependency);
                                (function (paramPromise, paramIndex) {
                                    paramPromise.then(function (param) {
                                        parameters[paramIndex] = param;
                                    });
                                })(dependency, index);
                            }
                        }
                    }
                    parameters.push(dependency);
                }
                function createInstance () {
                    return factory.apply(container, parameters);
                }
                if (promises.length === 1) {
                    return promises[0].then(createInstance);
                } else if (promises.length > 0) {
                    return Q.all(promises).then(createInstance);
                } else {
                    return createInstance();
                }
            }, composer);
        }, lifestyle.dispose.bind(lifestyle));
        return function () { unbind(); }
    }

    function _resolveDependency(dependency, required, composer) {
        var result = composer.resolve(dependency);
        return ((result === undefined) && required)
             ? Q.reject(new DependencyResolutionError(dependency,
                   lang.format("Dependency %1 could not be resolved.",
                               dependency.formattedDependencyChain())))
             : result;
    }

    if (typeof module !== 'undefined' && module.exports)
        module.exports = exports = ioc;

    eval(this.exports);

}
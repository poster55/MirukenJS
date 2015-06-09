YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "miruken.$",
        "miruken.$inferProperties",
        "miruken.$inhertStatic",
        "miruken.$properties",
        "miruken.$proxyProtocol",
        "miruken.ArrayManager",
        "miruken.ClassMeta",
        "miruken.Delegate",
        "miruken.Disposing",
        "miruken.DisposingMixin",
        "miruken.Enum",
        "miruken.Facet",
        "miruken.IndexedList",
        "miruken.InstanceMeta",
        "miruken.Interceptor",
        "miruken.InterceptorSelector",
        "miruken.Invoking",
        "miruken.MetaBase",
        "miruken.MetaMacro",
        "miruken.MetaStep",
        "miruken.Miruken",
        "miruken.Modifier",
        "miruken.ObjectDelegate",
        "miruken.Parenting",
        "miruken.Protocol",
        "miruken.ProxyBuilder",
        "miruken.Starting",
        "miruken.Startup",
        "miruken.StrictProtocol",
        "miruken.Variance",
        "miruken.callback.$",
        "miruken.callback.$callbacks",
        "miruken.callback.AcceptingCallbackHandler",
        "miruken.callback.CallbackHandler",
        "miruken.callback.CallbackHandlerAspect",
        "miruken.callback.CallbackHandlerDecorator",
        "miruken.callback.CallbackHandlerFilter",
        "miruken.callback.CascadeCallbackHandler",
        "miruken.callback.CompositeCallbackHandler",
        "miruken.callback.Composition",
        "miruken.callback.CompositionScope",
        "miruken.callback.ConditionalCallbackHandler",
        "miruken.callback.Deferred",
        "miruken.callback.HandleMethod",
        "miruken.callback.InvocationDelegate",
        "miruken.callback.InvocationOptions",
        "miruken.callback.InvocationOptionsHandler",
        "miruken.callback.InvocationSemantics",
        "miruken.callback.Lookup",
        "miruken.callback.MethodCallbackHandler",
        "miruken.callback.ProvidingCallbackHandler",
        "miruken.callback.RejectedError",
        "miruken.callback.Resolution",
        "miruken.context.$contextual",
        "miruken.context.Context",
        "miruken.context.ContextObserver",
        "miruken.context.ContextState",
        "miruken.context.Contextual",
        "miruken.context.ContextualHelper",
        "miruken.context.ContextualMixin",
        "miruken.context.Function",
        "miruken.error.ErrorCallbackHandler",
        "miruken.error.Errors",
        "miruken.graph.Traversal",
        "miruken.graph.Traversing",
        "miruken.graph.TraversingAxis",
        "miruken.graph.TraversingMixin",
        "miruken.ioc.$",
        "miruken.ioc.$container",
        "miruken.ioc.BasedOnBuilder",
        "miruken.ioc.ComponentBuilder",
        "miruken.ioc.ComponentModel",
        "miruken.ioc.ComponentModelError",
        "miruken.ioc.ComponentPolicy",
        "miruken.ioc.Container",
        "miruken.ioc.ContextualLifestyle",
        "miruken.ioc.DependencyInspector",
        "miruken.ioc.DependencyManager",
        "miruken.ioc.DependencyModel",
        "miruken.ioc.DependencyModifiers",
        "miruken.ioc.DependencyResolution",
        "miruken.ioc.DependencyResolutionError",
        "miruken.ioc.FromBuilder",
        "miruken.ioc.FromPackageBuilder",
        "miruken.ioc.Installer",
        "miruken.ioc.InterceptorBuilder",
        "miruken.ioc.IoContainer",
        "miruken.ioc.KeyBuilder",
        "miruken.ioc.Lifestyle",
        "miruken.ioc.Registration",
        "miruken.ioc.SingletonLifestyle",
        "miruken.ioc.TransientLifestyle",
        "miruken.mvc.Controller",
        "miruken.mvc.MasterDetail",
        "miruken.mvc.MasterDetailAware",
        "miruken.mvc.Model",
        "miruken.mvc.ViewRegion",
        "miruken.ng.Directive",
        "miruken.ng.Runner",
        "miruken.ng.UseModelValidation",
        "miruken.validate.$",
        "miruken.validate.$registerValidators",
        "miruken.validate.$validateThat",
        "miruken.validate.ValidateJsCallbackHandler",
        "miruken.validate.Validating",
        "miruken.validate.Validation",
        "miruken.validate.ValidationCallbackHandler",
        "miruken.validate.ValidationRegistry",
        "miruken.validate.ValidationResult",
        "miruken.validate.Validator"
    ],
    "modules": [
        "callback",
        "context",
        "error",
        "graph",
        "ioc",
        "miruken",
        "mvc",
        "ng",
        "validate"
    ],
    "allModules": [
        {
            "displayName": "callback",
            "name": "callback",
            "description": "Package providing message handling support.<br/>\nRequires the {{#crossLinkModule \"miruken\"}}{{/crossLinkModule}} module."
        },
        {
            "displayName": "context",
            "name": "context",
            "description": "Package providing contextual support.<br />\nRequires the {{#crossLinkModule \"miruken\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"graph\"}}{{/crossLinkModule}} and \n{{#crossLinkModule \"callback\"}}{{/crossLinkModule}} modules."
        },
        {
            "displayName": "error",
            "name": "error",
            "description": "Package providing generalized error support.<br/>\nRequires the {{#crossLinkModule \"miruken\"}}{{/crossLinkModule}} and\n{{#crossLinkModule \"callback\"}}{{/crossLinkModule}} modules."
        },
        {
            "displayName": "graph",
            "name": "graph",
            "description": "Package containing graph traversal support."
        },
        {
            "displayName": "ioc",
            "name": "ioc",
            "description": "Package providing Inversion-of-Control capabilities.<br/>\nRequires the {{#crossLinkModule \"miruken\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"callback\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"context\"}}{{/crossLinkModule}} and \n{{#crossLinkModule \"validate\"}}{{/crossLinkModule}} modules."
        },
        {
            "displayName": "miruken",
            "name": "miruken",
            "description": "Package containing enhancements to the javascript language."
        },
        {
            "displayName": "mvc",
            "name": "mvc",
            "description": "Package providing Model-View-Controller abstractions.<br/>\nRequires the {{#crossLinkModule \"miruken\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"callback\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"context\"}}{{/crossLinkModule}} and \n{{#crossLinkModule \"validate\"}}{{/crossLinkModule}} modules."
        },
        {
            "displayName": "ng",
            "name": "ng",
            "description": "Package providing [Angular](https://angularjs.org) integration.<br/>\nRequires the {{#crossLinkModule \"miruken\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"callback\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"context\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"validate\"}}{{/crossLinkModule}},\n{{#crossLinkModule \"error\"}}{{/crossLinkModule}} and\n{{#crossLinkModule \"ioc\"}}{{/crossLinkModule}} modules."
        },
        {
            "displayName": "validate",
            "name": "validate",
            "description": "Package providing validation support.<br/>\nRequires the {{#crossLinkModule \"miruken\"}}{{/crossLinkModule}} and\n{{#crossLinkModule \"callback\"}}{{/crossLinkModule}} modules."
        }
    ]
} };
});
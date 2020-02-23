"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function target(func) {
    return function (e) { return func(e.target.value); };
}
exports.target = target;
function currentTarget(func) {
    return function (e) { return func(e.currentTarget.value); };
}
exports.currentTarget = currentTarget;
function createStateElement(_a) {
    var state = _a.state, values = _a.values;
    var define = Object.assign({ state: {}, values: {} }, { state: state, values: values });
    return function (methods) {
        methods.actions = methods.actions || {};
        methods.actions = methods.actions || {};
        var Ready = build(define.state, define.values, methods.actions);
        var props;
        return Ready();
    };
}
exports.createStateElement = createStateElement;
function build(state, values, actions) {
    var stateKeys = Object.keys(state);
    var ValueKeys = new Map();
    Object.entries(values).map(function (_a) {
        var valueKey = _a[0], valueBuilder = _a[1];
        ValueKeys.set(valueKey, []);
        var target = {};
        var proxy = new Proxy(target, {
            get: function (target, key) {
                ValueKeys.get(valueKey).push(key);
            }
        });
        valueBuilder.call(values, proxy);
    });
    function initState() {
        var rawState = {};
        var stateWithRealValues = {};
        stateKeys.reduce(function (elementState, key) {
            elementState[key] = react_1.default.useState(state[key]);
            stateWithRealValues[key] = elementState[key][0];
            return elementState;
        }, rawState);
        return [rawState, stateWithRealValues];
    }
    function initValues(state) {
        var valueholder = {};
        Array.from(Object.entries(values)).forEach(function (_a) {
            var key = _a[0], useMemoPrimer = _a[1];
            var neededState = ValueKeys.get(key);
            var memoStateValues = neededState.map(function (key) {
                return state[key];
            });
            var derivedValue = react_1.default.useMemo(useMemoPrimer(state), memoStateValues);
            valueholder[key] = derivedValue;
        });
        return valueholder;
    }
    function ReadyActions(state, values) {
        var proxy = {};
        var stateKeys = Object.keys(state);
        stateKeys.forEach(function (key) {
            Object.defineProperty(proxy, key, {
                get: function () {
                    return state[key][0];
                },
                set: function (value) {
                    state[key][1](value);
                }
            });
        });
        Object.keys(values).forEach(function (key) {
            Object.defineProperty(proxy, key, {
                value: values[key]
            });
        });
        var newActions = Object.keys(actions).reduce(function (action, key) {
            action[key] = function () { return actions[key](proxy); };
            return action;
        }, {});
        return [proxy, newActions];
    }
    function Ready() {
        function Element(props) {
            var _a = initState(), raw = _a[0], real = _a[1];
            var values = initValues(real);
            var _b = ReadyActions(raw, values), proxyState = _b[0], actions = _b[1];
            var View = props.view;
            return react_1.default.createElement(View, __assign({}, props, { state: proxyState }, actions));
        }
        var props;
        return {
            Element: Element,
            props: props
        };
    }
    return Ready;
}
function createContextElement(_a) {
    var state = _a.state, values = _a.values;
    var define = { state: state, values: values || {} };
    return function (action) {
        var _a = createStateElement(define)(action), Element = _a.Element, props = _a.props;
        var context = react_1.default.createContext(define);
        function ContextElement(p) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Element, __assign({}, p, { view: function (p) {
                        return react_1.default.createElement(context.Provider, { value: p }, p.children);
                    } }))));
        }
        return {
            ContextElement: ContextElement,
            Context: context,
            Consumer: context.Consumer,
            props: props
        };
    };
}
exports.createContextElement = createContextElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQVUxQixTQUFnQixNQUFNLENBQUMsSUFBUTtJQUMzQixPQUFPLFVBQUMsQ0FBSyxJQUFHLE9BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLENBQUM7QUFDekMsQ0FBQztBQUZELHdCQUVDO0FBQ0QsU0FBZ0IsYUFBYSxDQUFDLElBQVE7SUFDbEMsT0FBTyxVQUFDLENBQUssSUFBRyxPQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUEzQixDQUEyQixDQUFDO0FBQ2hELENBQUM7QUFGRCxzQ0FFQztBQUVELFNBQWdCLGtCQUFrQixDQUE2QixFQUFtQztRQUFqQyxnQkFBSyxFQUFDLGtCQUFNO0lBQ3pFLElBQU0sTUFBTSxHQUFzQixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBRWxHLE9BQU8sVUFBbUosT0FBdUI7UUFDN0ssT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXhDLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE9BQWMsQ0FBQyxDQUFDO1FBRXpFLElBQUksS0FBcUYsQ0FBQTtRQUV6RixPQUFPLEtBQUssRUFHWCxDQUFDO0lBQ04sQ0FBQyxDQUFBO0FBQ0wsQ0FBQztB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
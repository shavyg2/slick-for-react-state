import React from "react";


export type ValueShape<S> = { [key: string]: (state: S) => () => any }
export type ValueResult<T extends ValueShape<S>, S> = { [key in keyof T]: ReturnType<ReturnType<T[key]>> }
type ViewProps<S> = {state:S}
type Renderer<P> = (props:{view:(props:P)=>JSX.Element,[key:string]:any})=>JSX.Element
type NoArgument<T> = {[key in keyof T]:()=>void}


export function target(func:any){
    return (e:any)=>func(e.target.value);
}
export function currentTarget(func:any){
    return (e:any)=>func(e.currentTarget.value);
}

export function createStateElement<S, V extends ValueShape<S>>({ state,values}:{state:S,values?:V}) {
    const define:{state:S,values:V} = {state:state||{},values:values||{}} as any;
    values = define.values;
    state = define.state;

    return function <S extends typeof define.state, V extends Readonly<typeof define.values>,A extends { [key: string]: (s: S & ValueResult<V, S>) => void }>(methods: { actions: A }) {
        methods.actions = methods.actions || {} as any as A;
        const Ready = build(define.state, define.values, methods.actions as any);

        let props!:ViewProps<S & Readonly<ValueResult<V,S>>> & NoArgument<typeof methods.actions>

        return Ready() as {
            Element:Renderer<typeof props>,
            props:typeof props
        };
    }
}


function build<S, V extends ValueShape<S>, A extends { [key: string]: (s: S & ValueResult<V, S>) => any }>(state: S, values: V, actions: A) {

    const stateKeys = Object.keys(state) as unknown as Array<keyof typeof state>;
    const ValueKeys: Map<string, any> = new Map();
    


    Object.entries(values).map(([valueKey, valueBuilder]) => {
        ValueKeys.set(valueKey, [])
        const target = {};
        const proxy: any = new Proxy(target, {
            get(target, key) {
                ValueKeys.get(valueKey).push(key);
            }
        })
        valueBuilder.call(values, proxy);
    })

    function initState() {
        const rawState: any = {}
        const stateWithRealValues: any = {};
        stateKeys.reduce((elementState, key) => {
            elementState[key] = React.useState(state[key])
            stateWithRealValues[key] = elementState[key][0];
            return elementState;
        }, rawState)
        return [rawState, stateWithRealValues];
    }


    function initValues(state: any) {

        const valueholder = {} as any;

        Array.from(Object.entries(values)).forEach(([key, useMemoPrimer]) => {
            const neededState: string[] = ValueKeys.get(key);
            const memoStateValues = neededState.map(key => {
                return state[key];
            })
            const derivedValue = React.useMemo(useMemoPrimer(state), memoStateValues);
            valueholder[key] = derivedValue;
        })

        return valueholder;
    }


    function ReadyActions(state: any, values: any) {

        const proxy: any = {};
        const stateKeys = Object.keys(state);

        stateKeys.forEach((key) => {
            Object.defineProperty(proxy, key, {
                get() {
                    return state[key][0]
                },
                set(value) {
                    state[key][1](value);
                },
                enumerable:true
            })
        })

        Object.keys(values).forEach((key) => {
            Object.defineProperty(proxy, key, {
                value: values[key],
                enumerable:true
            })
        })


        const newActions = Object.keys(actions).reduce((action: any, key: string) => {

            action[key] = () => actions[key](proxy);
            return action;
        }, {} as any);


        return [proxy, newActions];
    }


    function Ready() {

        function Element(props:any) {
            const [raw, real] = initState()
            const values = initValues(real);
            const [proxyState, actions] = ReadyActions(raw, values)
            const View = props.view;
            return <View {...props} state={proxyState}  {...actions} />
        }
    
        let props!:ViewProps<S & ValueResult<V,S>> & A;
        return {
            Element:Element as any as Renderer<typeof props>,
            props,
            state:null as any as S
        };
    }

    return Ready;
}



export function createContextElement<S,V extends ValueShape<S>>({ state,values}:{state:S,values?:V}){
    const define:{state:S,values:V} = {state:state,values:values||{}} as any;
    return function<A extends { actions: { [key: string]: (s: S & ValueResult<Readonly<V>, S>) => any; }; }>(action:A){
        const {Element,props} = createStateElement<S,V>(define)(action);
        const context = React.createContext(define as any as typeof props)
        function ContextElement(p:any){
            return (
                <>  
                    <Element {...p} view={(p:typeof props)=>{
                        return <context.Provider value={p}>
                            {p.children}
                        </context.Provider>
                    }}/>
                </>
            )
        }

        return {
            ContextElement,
            Context:context,
            Consumer:context.Consumer,
            props
        }
    }
}
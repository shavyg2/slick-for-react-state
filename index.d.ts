import React from "react";
export declare type ValueShape<S> = {
    [key: string]: (state: S) => () => any;
};
export declare type ValueResult<T extends ValueShape<S>, S> = {
    [key in keyof T]: ReturnType<ReturnType<T[key]>>;
};
declare type ViewProps<S> = {
    state: S;
};
declare type Renderer<P> = (props: {
    view: (props: P) => JSX.Element;
}) => JSX.Element;
declare type NoArgument<T> = {
    [key in keyof T]: () => void;
};
export declare function target(func: any): (e: any) => any;
export declare function currentTarget(func: any): (e: any) => any;
export declare function createStateElement<S, V extends ValueShape<S>>({ state, values }: {
    state: S;
    values?: V;
}): <S_1 extends S, V_1 extends Readonly<V>, A extends {
    [key: string]: (s: S_1 & ValueResult<V_1, S_1>) => void;
}>(methods: {
    actions: A;
}) => {
    Element: Renderer<ViewProps<S_1 & Readonly<ValueResult<V_1, S_1>>> & NoArgument<A>>;
    props: ViewProps<S_1 & Readonly<ValueResult<V_1, S_1>>> & NoArgument<A>;
};
export declare function createContextElement<S, V extends ValueShape<S>>({ state, values }: {
    state: S;
    values?: V;
}): <A extends {
    actions: {
        [key: string]: (s: S & ValueResult<Readonly<V>, S>) => void;
    };
}>(action: A) => {
    ContextElement: (p: any) => JSX.Element;
    Context: React.Context<ViewProps<S & Readonly<ValueResult<Readonly<V>, S>>> & NoArgument<{
        [key: string]: (s: S & ValueResult<Readonly<V>, S>) => void;
    }>>;
    Consumer: React.ExoticComponent<React.ConsumerProps<ViewProps<S & Readonly<ValueResult<Readonly<V>, S>>> & NoArgument<{
        [key: string]: (s: S & ValueResult<Readonly<V>, S>) => void;
    }>>>;
    props: ViewProps<S & Readonly<ValueResult<Readonly<V>, S>>> & NoArgument<{
        [key: string]: (s: S & ValueResult<Readonly<V>, S>) => void;
    }>;
};
export {};
//# sourceMappingURL=index.d.ts.map
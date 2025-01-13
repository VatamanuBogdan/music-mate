interface Identifiable<I> {
    id: I
}

interface IdentifiableValue<I, V> extends Identifiable<I> {
    value: V
}

export type {
    Identifiable,
    IdentifiableValue
}

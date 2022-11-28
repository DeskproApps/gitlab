// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromiseCallback<T> = (...args: any[]) => Promise<T>

export class SequenceError {
    name = 'SequenceError'
}

const noop = () => {};

let timer: ReturnType<typeof setTimeout> | null = null

function debouncePromise<TResult>(
    fn: PromiseCallback<TResult>,
    timeout: number,
): PromiseCallback<TResult> {
    let resolve = noop;

    return (...args) => {
        if (timer) {
            clearTimeout(Number(timer));
        }

        timer = setTimeout(() => {
            resolve();
            timer = null;
        }, timeout);

        return new Promise((deferred) => {
            resolve = deferred as () => void;
        })
            .then(() => fn(...args))
            .then((data) => {
                return Promise.resolve(data);
            });
    }
}

export { debouncePromise };

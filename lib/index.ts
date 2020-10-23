import * as R from "rambda"

export let allEquals = <A> (xs : A[]) : boolean => {
  if (xs.length < 2) {
    return true
  }
  let [head, ...tail] = xs
  return R.all(R.equals(head), tail)
}

export let randomInt = (min : number) => (max : number) : number => {
  return Math.floor(Math.random() * (max - min)) + min
}

export let swap = (i1 : number, i2 : number) => <A> (xs : A[]) => {
  let v1 = xs[i1]
  let v2 = xs[i2]
  return R.pipe(
    R.update(i1, v2),
    R.update(i2, v1)
  )(xs)
}

export let shuffle = <A> (xs : A[]) => {
  let counter = xs.length
  while (counter > 0) {
    let index = randomInt(0)(counter)
    counter -= 1
    xs = swap(index, counter)(xs)
  }
  return xs
}

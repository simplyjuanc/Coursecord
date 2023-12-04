export async function getLastResult<T>(promises: Promise<T>[]) {
  if (!promises.length) throw new RangeError("No last result from no promises");
  const results: T[] = [];
  await Promise.all(promises.map(p => p.then(v => {
    results.push(v);
  })
  ));
  return results[results.length - 1];
}

const benchmark: any = require('nodemark');
const plt: any = require('matplotnode');

export const bench: (
  group: string,
  name: string,
  setup: (n: number) => any[],
  ...funcs: Array<(...args: any[]) => void>
) => typeof benchmark = (
  group: string,
  name: string,
  setup: (n: number) => any[],
  ...funcs: Array<(...args: any[]) => void>
): typeof benchmark => {
  const filename: string = `benchmarks/${group}/${name}.png`;
  const xs: number[] = [4, 16, 64, 256, 1024, 4096, 16384, 65536];
  let ys: number[] = [];

  plt.title(name);

  // tslint:disable-next-line: no-console
  console.log(`${group} > ${name}`);

  for (const func of funcs) {
    for (const x of xs) {
      let args: any[] = [];
      const result: typeof benchmark = benchmark(
        (): void => { func(...args); },
        (): void => { args = setup(x); }
      );

      ys.push(result.milliseconds(3));

      // tslint:disable-next-line: no-console
      console.log(`n=${x} ${result}`);
    }

    const src: string = func.toString().replace(/\s/g, '');
    const label: string = src.substring(
      src.lastIndexOf('{') + 1,
      src.lastIndexOf('}')
    );

    plt.plot(xs, ys, `label=${label}`);
    ys = [];
  }

  plt.xlabel('n');
  plt.ylabel('ms');
  plt.xlim(0, xs[xs.length - 1]);
  plt.ylim(0, 1);

  plt.grid(true);
  plt.legend();

  plt.save(filename);
  plt.clf();

  // tslint:disable-next-line: no-console
  console.log(`${filename}`);
};

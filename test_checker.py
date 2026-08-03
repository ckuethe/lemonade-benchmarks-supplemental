#!/usr/bin/env python3

from argparse import ArgumentParser
import json
import re

def get_args():
    ap = ArgumentParser(description="evaluate test matrix, looking for tests that are too easy")
    ap.add_argument('-t', '--threshold', default=100, type=int)
    ap.add_argument('-n', '--sort-numeric', default=False, action='store_true')
    ap.add_argument(nargs=1, dest='filename')
    return ap.parse_args()


def main():
    rgx = re.compile(r'(?P<pass_num>\d+)/(?P<num_tests>\d+) pass.+?(?P<pass_fraction>\d+)% of all models')
    tbl = []
    args = get_args()
    with open(args.filename[0]) as ifd:
        db = json.load(ifd)
        for row in db['matrix_table']:
            scenario = row['scenario']
            d = rgx.search(row['summary'])
            tbl.append((scenario, int(d['pass_num']), int(d['num_tests']), int(d['pass_fraction']), ))

    if args.sort_numeric:
        tbl.sort(key=lambda x:x[-1])
    else:
        tbl.sort(key=lambda x:x[0])

    for x in tbl:
        v = " TOO EASY" if x[-1] >= args.threshold else ""
        print(f"{x[0]:28} {x[1]:2}/{x[2]:2}  {x[3]:3}% {v}")

if __name__ == '__main__':
    main()

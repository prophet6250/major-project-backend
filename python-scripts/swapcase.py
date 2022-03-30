#!/usr/bin/python
import sys

# script will be run from project root, which is ../
with open(f'./temp-files/{sys.argv[1]}') as f:
    line_list = f.readlines()

content = ''
for line in line_list:
    content += line

print(content.swapcase())

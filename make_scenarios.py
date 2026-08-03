#!/usr/bin/env python3

import os
import json

def make_scenario(fn:str)->dict:
    return {
        "name": fn.replace('.', '_'),
        "category": "vision",
        "image_path": fn,
        "messages": [ {"role": "user", "content":"describe in detail what you see"} ],
        "max_tokens": 4096
    }

data = {'scenarios': [] }

for f in sorted(os.listdir()):
    tmp = f.lower().split('.')[-1]
    if tmp not in ['png', 'jpg', 'jpg']:
        continue
    data["scenarios"].append(make_scenario(f))

print(json.dumps(data, indent=2))

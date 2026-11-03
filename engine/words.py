# Usage: python3 engine/words.py <asr.json> <audio-key> <out words.json>
import json, sys
r = json.load(open(sys.argv[1]))[sys.argv[2]]
words = []
for tok, t in r["tokens"]:
    if tok.startswith(" ") or not words: words.append({"w": tok.strip(), "s": t})
    else: words[-1]["w"] += tok
for i, w in enumerate(words):
    w["e"] = round(words[i + 1]["s"] if i + 1 < len(words) else w["s"] + 0.4, 2)
json.dump(words, open(sys.argv[3], "w"), indent=0)
print(len(words), "words")

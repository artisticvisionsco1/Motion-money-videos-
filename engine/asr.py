import sherpa_onnx, soundfile as sf, json, sys, subprocess, numpy as np
M=sys.argv[1]; out=sys.argv[2]; files=sys.argv[3:]
rec=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.int8.onnx",decoder=f"{M}/decoder.int8.onnx",joiner=f"{M}/joiner.int8.onnx",tokens=f"{M}/tokens.txt",model_type="nemo_transducer",num_threads=4)
res={}
for f in files:
    a=subprocess.run(["ffmpeg","-v","error","-i",f,"-ac","1","-ar","16000","-f","f32le","-"],capture_output=True).stdout
    x=np.frombuffer(a,dtype=np.float32)
    # chunk into ~25s windows with 0 overlap at low-energy points
    words=[];text=[];step=16000*25;i=0
    while i<len(x):
        j=min(len(x),i+step)
        if j<len(x):
            w=x[j-16000*3:j]; e=np.convolve(w**2,np.ones(800),'same'); j=j-16000*3+int(np.argmin(e))
        s=rec.create_stream(); s.accept_waveform(16000,x[i:j]); rec.decode_stream(s); r=s.result
        text.append(r.text.strip())
        toks=r.tokens; ts=r.timestamps
        for t,tt in zip(toks,ts): words.append([t,round(tt+i/16000,2)])
        i=j
    res[f]={"text":" ".join(text),"tokens":words}
    print(f, res[f]["text"][:120], flush=True)
json.dump(res,open(out,"w"))

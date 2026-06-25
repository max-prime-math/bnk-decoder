# Record Inspection: Chapter 10.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 12/Chapter 10.bnk`
- Inflated bytes: 643068
- Records: 63
- Inline slots: 294
- Slot classes: variable-ref=186, unknown-object=52, diagram-object=2, math-object=54

## record-1 @ 4628

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | subtract functions
- Counts: strings=275, variables=13, display=9, refs=92, slots=9, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]][[slot]] D. [[slot]][[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]][[slot]]
- C. [[slot]]
- D. [[slot]][[slot]]

Variables:
- a = – 3  rule: `range(-9,9)`
- a1 = –9  rule: `range(-9,9)`
- sign = –  rule: `range(-1,1)`
- opp = +  rule: `range(-1,1)`
- b = – 12  rule: `a+a1`
- dis_sub = 0  rule: `if(opp=1,0,1)`
- dis_add = 1  rule: `if(opp=-1,0,1)`
- subtract = –  rule: `if(opp=-1,1,-1)`
- b1 = + 6  rule: `a-a1`
- add = –  rule: `if(sign*opp=1,1,-1)`
- sub = –  rule: `if(sign*opp=-1,-1,1)`
- dis1 = + 27  rule: `a*a1`
- dis2 = – 27  rule: `-a*a1`

Inline slots:
- #1 variable-ref ref=b value=– 12 offset=6246
  context: Given the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]].
- #2 variable-ref ref=a value=– 3 offset=6258
  context: Given the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]].
- #3 variable-ref ref=a1 value=–9 offset=6362
  context: ven the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]].
- #4 variable-ref ref=sign value=– offset=6374
  context: [[slot]]
- #5 variable-ref ref=opp value=+ offset=6384
  context: [[slot]]
- #6 variable-ref ref=dis2 value=– 27 offset=6396
  context: [[slot]][[slot]]
- #7 variable-ref ref=b value=– 12 offset=6398
  context: [[slot]][[slot]]
- #8 variable-ref ref=dis1 value=+ 27 offset=6408
  context: [[slot]][[slot]]
- #9 variable-ref ref=b1 value=+ 6 offset=6410
  context: [[slot]][[slot]]

## record-2 @ 13000

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | subtract functions | add functions
- Counts: strings=254, variables=9, display=9, refs=79, slots=10, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]]. A. [[slot]][[slot]] C. [[slot]] B. [[slot]][[slot]] D. [[slot]] [[slot]]
```

Choices:
- A. [[slot]][[slot]]
- B. [[slot]][[slot]]
- C. [[slot]]
- D. [[slot]] [[slot]]

Variables:
- a = – 8  rule: `range(-9,9)`
- a1 = –2  rule: `range(-9,9)`
- b = –10  rule: `a+a1`
- b1 = –6  rule: `a-a1`
- opp = +  rule: `range(-1,1)`
- ans = 1  rule: `if(opp=1,1,0)`
- ans1 = 0  rule: `if(opp=-1,1,0)`
- dis1 = 16  rule: `a*a1`
- dis2 = 4  rule: `fracs(a,a1)`

Inline slots:
- #1 variable-ref ref=a value=– 8 offset=14174
  context: Given the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]].
- #2 variable-ref ref=a value=– 8 offset=14186
  context: Given the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]].
- #3 variable-ref ref=a1 value=–2 offset=14290
  context: ven the functions [[slot]] and [[slot]], determine the equation for the combined function [[slot]].
- #4 variable-ref ref=opp value=+ offset=14302
  context: [[slot]][[slot]]
- #5 variable-ref ref=b value=–10 offset=14304
  context: [[slot]][[slot]]
- #6 variable-ref ref=ans1 value=0 offset=14314
  context: [[slot]]
- #7 variable-ref ref=b1 value=–6 offset=14326
  context: [[slot]][[slot]]
- #8 variable-ref ref=ans value=1 offset=14328
  context: [[slot]][[slot]]
- #9 variable-ref ref=dis1 value=16 offset=14338
  context: [[slot]] [[slot]]
- #10 variable-ref ref=b value=–10 offset=14342
  context: [[slot]] [[slot]]

## record-3 @ 21148

- Metadata: Easy | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions
- Counts: strings=262, variables=3, display=9, refs=103, slots=11, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]], determine the simplified equation for the combined function [[slot]]. A. [[slot]], [[slot]] C. [[slot]], [[slot]] B. [[slot]], [[slot]] D. [[slot]], [[slot]]
```

Choices:
- A. [[slot]], [[slot]]
- B. [[slot]], [[slot]]
- C. [[slot]], [[slot]]
- D. [[slot]], [[slot]]

Variables:
- a = – 9  rule: `range(-9,9)`
- a1 = + 9  rule: `-1*a`
- b = – 81  rule: `a*a1`

Inline slots:
- #1 variable-ref ref=b value=– 81 offset=21848
  context: Given the functions [[slot]] and [[slot]], determine the simplified equation for the combined function [[slot]].
- #2 variable-ref ref=b value=– 81 offset=21860
  context: Given the functions [[slot]] and [[slot]], determine the simplified equation for the combined function [[slot]].
- #3 variable-ref ref=a1 value=+ 9 offset=21986
  context: ctions [[slot]] and [[slot]], determine the simplified equation for the combined function [[slot]].
- #4 variable-ref ref=b value=– 81 offset=21998
  context: [[slot]], [[slot]]
- #5 variable-ref ref=b value=– 81 offset=22004
  context: [[slot]], [[slot]]
- #6 variable-ref ref=a1 value=+ 9 offset=22014
  context: [[slot]], [[slot]]
- #7 variable-ref ref=a value=– 9 offset=22020
  context: [[slot]], [[slot]]
- #8 variable-ref ref=a value=– 9 offset=22032
  context: [[slot]], [[slot]]
- #9 variable-ref ref=a1 value=+ 9 offset=22038
  context: [[slot]], [[slot]]
- #10 unknown-object ref=- value=- offset=22048
  context: [[slot]], [[slot]]
- #11 unknown-object ref=- value=- offset=22054
  context: [[slot]], [[slot]]

## record-4 @ 29841

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | subtract functions
- Counts: strings=226, variables=9, display=9, refs=63, slots=7, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], determine an equation for the combined function [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = – 8  rule: `range(-9,9)`
- b = –5  rule: `range(-9,9)`
- sign = –  rule: `range(-1,1)`
- c = + 10  rule: `sign*2*b`
- d = + 17  rule: `a+b^2`
- dis_c = – 10  rule: `-1*c`
- dis1 = + 3  rule: `sign*a+b`
- dis_sign = +  rule: `if(sign=1,-1,1)`
- dis2 = – 13  rule: `dis_sign*a+b`

Inline slots:
- #1 variable-ref ref=c value=+ 10 offset=31263
  context: Given the functions [[slot]] and [[slot]], determine an equation for the combined function [[slot]].
- #2 variable-ref ref=c value=+ 10 offset=31275
  context: Given the functions [[slot]] and [[slot]], determine an equation for the combined function [[slot]].
- #3 variable-ref ref=a value=– 8 offset=31377
  context: iven the functions [[slot]] and [[slot]], determine an equation for the combined function [[slot]].
- #4 variable-ref ref=d value=+ 17 offset=31389
  context: [[slot]]
- #5 variable-ref ref=d value=+ 17 offset=31399
  context: [[slot]]
- #6 variable-ref ref=d value=+ 17 offset=31411
  context: [[slot]]
- #7 variable-ref ref=d value=+ 17 offset=31421
  context: [[slot]]

## record-5 @ 37096

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | inverse function | composite functions
- Counts: strings=443, variables=9, display=9, refs=172, slots=19, visibleChoices=4

```text
Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most likely resembles A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- f = 1  rule: `rand(6)`
- a = 8  rule: `range(3,9)`
- func1a = 1  rule: `if((f=1 and a/2=int(a/2)),1,0)`
- func1b = 0  rule: `if((f=1 and a/2<>int(a/2)),1,0)`
- func2 = 0  rule: `if(f=2,1,0)`
- func3 = 0  rule: `if(f=3,1,0)`
- func4 = 0  rule: `if(f=4,1,0)`
- func5 = 0  rule: `if(f=5,1,0)`
- func6 = 0  rule: `if(f=6,1,0)`

Inline slots:
- #1 variable-ref ref=a value=8 offset=38216
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slo
- #2 variable-ref ref=func1a value=1 offset=38218
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slo
- #3 variable-ref ref=a value=8 offset=38220
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slo
- #4 variable-ref ref=func1b value=0 offset=38222
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the
- #5 variable-ref ref=a value=8 offset=38224
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph o
- #6 variable-ref ref=func2 value=0 offset=38226
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the co
- #7 variable-ref ref=a value=8 offset=38228
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined f
- #8 variable-ref ref=func3 value=0 offset=38240
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slo
- #9 variable-ref ref=a value=8 offset=38242
  context: Given the functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most
- #10 variable-ref ref=func1a value=1 offset=38244
  context: he functions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most likely
- #11 variable-ref ref=a value=8 offset=38246
  context: ions [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most likely resemble
- #12 variable-ref ref=func1b value=0 offset=38248
  context: lot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most likely resembles
- #13 variable-ref ref=a value=8 offset=38250
  context: lot]][[slot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most likely resembles
- #14 variable-ref ref=a value=8 offset=38252
  context: lot]][[slot]][[slot]][[slot]][[slot]] and [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most likely resembles
- #15 variable-ref ref=func1a value=1 offset=38328
  context: lot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], the graph of the combined function [[slot]] most likely resembles
- #16 variable-ref ref=func2 value=0 offset=38382
  context: [[slot]]
- #17 variable-ref ref=func3 value=0 offset=38392
  context: [[slot]]
- #18 variable-ref ref=func4 value=0 offset=38404
  context: [[slot]]
- #19 variable-ref ref=func5 value=0 offset=38414
  context: [[slot]]

## record-6 @ 87383

- Metadata: Difficult | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | graph | subtract functions
- Counts: strings=248, variables=8, display=9, refs=77, slots=7, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- f = 2  rule: `rand(2)`
- func = cos  rule: `if(f=1,"sin","cos")`
- s = ?  rule: `range(-1,1)`
- s1 = –  rule: `range(-1,1)`
- sin_disp = 0  rule: `if((f=1 and s*s1=1),1,0)`
- cos_disp = 0  rule: `if((f=2 and s*s1=1),1,0)`
- sin_disp1 = 0  rule: `if((f=1 and s*s1=-1),1,0)`
- cos_disp1 = 1  rule: `if((f=2 and s*s1=-1),1,0)`

Inline slots:
- #1 variable-ref ref=f value=2 offset=88605
  context: Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles
- #2 variable-ref ref=func value=cos offset=88617
  context: Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles
- #3 variable-ref ref=s value=range(-1,1) offset=88689
  context: Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles
- #4 variable-ref ref=s1 value=– offset=88743
  context: [[slot]]
- #5 variable-ref ref=cos_disp value=0 offset=88753
  context: [[slot]]
- #6 variable-ref ref=cos_disp1 value=1 offset=88765
  context: [[slot]]
- #7 variable-ref ref=sin_disp value=0 offset=88775
  context: [[slot]]

## record-7 @ 130910

- Metadata: Easy | Section 10.2 | RF1 | Products and Quotients of Functions | multiply functions | range
- Counts: strings=165, variables=3, display=9, refs=51, slots=6, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], what is the range of the composite function [[slot]]? A. [[slot]] C. [[slot]] B. cannot be determined D. [[slot]]
```

Choices:
- A. [[slot]]
- B. cannot be determined
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 9  rule: `range(2,9)`
- b = 9  rule: `range(1,9)`
- dis_b = –9  rule: `-1*b`

Inline slots:
- #1 variable-ref ref=a value=9 offset=131464
  context: Given the functions [[slot]] and [[slot]], what is the range of the composite function [[slot]]?
- #2 variable-ref ref=b value=9 offset=131476
  context: Given the functions [[slot]] and [[slot]], what is the range of the composite function [[slot]]?
- #3 variable-ref ref=b value=9 offset=131570
  context: Given the functions [[slot]] and [[slot]], what is the range of the composite function [[slot]]?
- #4 variable-ref ref=b value=9 offset=131582
  context: [[slot]]
- #5 variable-ref ref=a value=9 offset=131592
  context: [[slot]]
- #6 variable-ref ref=b value=9 offset=131652
  context: [[slot]]

## record-8 @ 136717

- Metadata: Difficult | Section 10.3 | RF1 | Composite Functions | composite functions | transformations | graph
- Counts: strings=356, variables=6, display=12, refs=112, slots=18, visibleChoices=5
- Suspicious: slot-without-variable-ref

```text
a_num<>0 and a_denom<>0 and abs(a_num)<abs(a_denom) and abs(b)>1 -1*b – 9 Shown is the graph of [[slot]], where [[slot]] and [[slot]] is a function of the form [[slot]]. [[slot]] What equation represents [[slot]]? A. [[slot]] [[slot]][[slot]] C. [[slot]] [[slot]][[slot]] B. [[slot]] [[slot]][[slot]] D. [[slot]] [[slot]][[slot]]
```

Choices:
- A. [[slot]] [[slot]][[slot]]
- B. [[slot]] [[slot]][[slot]]
- C. [[slot]] [[slot]][[slot]]
- D. [[slot]] [[slot]][[slot]]
- H. d

Variables:
- f = 1  rule: `rand(2)`
- func = sin  rule: `if(f=1,"sin","cos")`
- a_num = –4  rule: `range(-9,9)`
- a_denom = –8  rule: `range(-9,9)`
- a = 1/2  rule: `fracs(a_num,a_denom)`
- b = + 9  rule: `range(-9,9)`

Inline slots:
- #1 variable-ref ref=b value=+ 9 offset=138103
  context: Shown is the graph of [[slot]], where [[slot]] and [[slot]] is a function of the form [[slot]]. [[slot]] What equation
- #2 variable-ref ref=func value=sin offset=138121
  context: Shown is the graph of [[slot]], where [[slot]] and [[slot]] is a function of the form [[slot]]. [[slot]] What equation represents [[sl
- #3 variable-ref ref=b value=+ 9 offset=138133
  context: Shown is the graph of [[slot]], where [[slot]] and [[slot]] is a function of the form [[slot]]. [[slot]] What equation represents [[slot]]?
- #4 variable-ref ref=b value=+ 9 offset=138189
  context: Shown is the graph of [[slot]], where [[slot]] and [[slot]] is a function of the form [[slot]]. [[slot]] What equation represents [[slot]]?
- #5 variable-ref ref=a value=1/2 offset=138197
  context: s the graph of [[slot]], where [[slot]] and [[slot]] is a function of the form [[slot]]. [[slot]] What equation represents [[slot]]?
- #6 variable-ref ref=b value=+ 9 offset=138253
  context: ot]] and [[slot]] is a function of the form [[slot]]. [[slot]] What equation represents [[slot]]?
- #7 variable-ref ref=b value=+ 9 offset=138267
  context: [[slot]] [[slot]][[slot]]
- #8 variable-ref ref=a value=1/2 offset=138271
  context: [[slot]] [[slot]][[slot]]
- #9 unknown-object ref=- value=- offset=138273
  context: [[slot]] [[slot]][[slot]]
- #10 unknown-object ref=- value=- offset=138285
  context: [[slot]] [[slot]][[slot]]
- #11 unknown-object ref=- value=- offset=138289
  context: [[slot]] [[slot]][[slot]]
- #12 unknown-object ref=- value=- offset=138291
  context: [[slot]] [[slot]][[slot]]
- #13 unknown-object ref=- value=- offset=138305
  context: [[slot]] [[slot]][[slot]]
- #14 unknown-object ref=- value=- offset=138309
  context: [[slot]] [[slot]][[slot]]
- #15 unknown-object ref=- value=- offset=138311
  context: [[slot]] [[slot]][[slot]]
- #16 unknown-object ref=- value=- offset=138323
  context: [[slot]] [[slot]][[slot]]
- #17 unknown-object ref=- value=- offset=138327
  context: [[slot]] [[slot]][[slot]]
- #18 unknown-object ref=- value=- offset=138329
  context: [[slot]] [[slot]][[slot]]

## record-9 @ 153656

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | evaluate
- Counts: strings=157, variables=6, display=9, refs=32, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]], what is the value of [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 3 5 8

Variables:
- f = 1  rule: `rand(2)`
- func = sin  rule: `if(f=1,"sin","cos")`
- a = 2  rule: `range(1,10)`
- ans = 1/2  rule: `if(f=1,sqrs(sin(pi)+a),sqrs(cos(pi)+a))`
- dis1 = 1  rule: `if(f=2,sqrs(sin(pi)+a),sqrs(cos(pi)+a))`
- dis2 = 1/3  rule: `sqrs(a+1)`

Inline slots:
- #1 variable-ref ref=func value=sin offset=154578
  context: Given the functions [[slot]] and [[slot]], what is the value of [[slot]]?
- #2 variable-ref ref=a value=2 offset=154590
  context: Given the functions [[slot]] and [[slot]], what is the value of [[slot]]?
- #3 variable-ref ref=ans value=1/2 offset=154638
  context: Given the functions [[slot]] and [[slot]], what is the value of [[slot]]?
- #4 variable-ref ref=dis2 value=1/3 offset=154650
  context: [[slot]]
- #5 variable-ref ref=dis1 value=1 offset=154660
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=154672
  context: [[slot]]
- #7 unknown-object ref=- value=- offset=154682
  context: [[slot]]

## record-10 @ 158915

- Metadata: Difficult | Section 10.2 | RF1 | Products and Quotients of Functions | multiply functions | graph
- Counts: strings=197, variables=5, display=9, refs=58, slots=7, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], the graph of the combined function [[slot]] most likely resembles A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 0.6  rule: `range(.2,1.5,.1)`
- n = 2  rule: `rand(2)`
- b = 0  rule: `if(n=1,1,0)`
- b1 = 1  rule: `if(n=2,1,0)`
- func = cos  rule: `if(n=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=b value=0 offset=159719
  context: Given the functions [[slot]] and [[slot]], the graph of the combined function [[slot]] most likely resembles
- #2 variable-ref ref=a value=0.6 offset=159731
  context: Given the functions [[slot]] and [[slot]], the graph of the combined function [[slot]] most likely resembles
- #3 variable-ref ref=func value=cos offset=159807
  context: Given the functions [[slot]] and [[slot]], the graph of the combined function [[slot]] most likely resembles
- #4 variable-ref ref=b1 value=1 offset=159861
  context: [[slot]]
- #5 variable-ref ref=b value=0 offset=159871
  context: [[slot]]
- #6 variable-ref ref=b value=0 offset=159883
  context: [[slot]]
- #7 variable-ref ref=b1 value=1 offset=159893
  context: [[slot]]

## record-11 @ 187688

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | graph
- Counts: strings=169, variables=3, display=9, refs=44, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- n = 2  rule: `range(1,6)`
- a = 4  rule: `n^2`
- m = 4  rule: `range(1,5)`

Inline slots:
- #1 variable-ref ref=a value=4 offset=188286
  context: Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles
- #2 variable-ref ref=a value=4 offset=188298
  context: Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles
- #3 variable-ref ref=m value=4 offset=188370
  context: Given the functions [[slot]] and [[slot]], a graph of the combined function [[slot]] most likely resembles
- #4 unknown-object ref=- value=- offset=188424
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=188434
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=188446
  context: [[slot]]
- #7 unknown-object ref=- value=- offset=188456
  context: [[slot]]

## record-12 @ 209117

- Metadata: Average | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | graph
- Counts: strings=171, variables=5, display=9, refs=49, slots=5, visibleChoices=4

```text
An equation for the graph shown is most likely [[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 0 2 5 7

Variables:
- a = 4  rule: `range(2,5)`
- f = 1  rule: `range(0,1)`
- func = cos  rule: `if(f=0,"sin","cos")`
- f1 = 0  rule: `if(f=0,1,0)`
- func1 = sin  rule: `if(f=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=f1 value=0 offset=209923
  context: An equation for the graph shown is most likely [[slot]]
- #2 variable-ref ref=f value=1 offset=209933
  context: [[slot]]
- #3 variable-ref ref=a value=4 offset=209943
  context: [[slot]]
- #4 variable-ref ref=func value=cos offset=209955
  context: [[slot]]
- #5 variable-ref ref=a value=4 offset=209965
  context: [[slot]]

## record-13 @ 219812

- Metadata: Difficult | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | graph
- Counts: strings=163, variables=4, display=9, refs=44, slots=5, visibleChoices=4

```text
An equation for the graph shown is most likely [[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 1 2 5 6 7

Variables:
- f = 1  rule: `range(0,1)`
- func = sin  rule: `if(f=1,"sin","cos")`
- f1 = 0  rule: `if(f=1,0,1)`
- func1 = cos  rule: `if(f=0,"sin","cos")`

Inline slots:
- #1 variable-ref ref=f value=1 offset=220562
  context: An equation for the graph shown is most likely [[slot]]
- #2 variable-ref ref=f1 value=0 offset=220572
  context: [[slot]]
- #3 variable-ref ref=func1 value=cos offset=220582
  context: [[slot]]
- #4 variable-ref ref=func value=sin offset=220594
  context: [[slot]]
- #5 variable-ref ref=func1 value=cos offset=220604
  context: [[slot]]

## record-14 @ 230595

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | subtract functions | domain
- Counts: strings=162, variables=5, display=9, refs=47, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]], what is the domain of the combined function [[slot]]? A. cannot be determined C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. cannot be determined
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = + 2  rule: `range(-9,9)`
- b = – 2  rule: `range(-9,9)`
- c = + 7  rule: `range(-9,9)`
- ans = –2  rule: `-1*a`
- dis2 = –9  rule: `ans-c`

Inline slots:
- #1 variable-ref ref=a value=+ 2 offset=231555
  context: Given the functions [[slot]] and [[slot]], what is the domain of the combined function [[slot]]?
- #2 variable-ref ref=b value=– 2 offset=231567
  context: Given the functions [[slot]] and [[slot]], what is the domain of the combined function [[slot]]?
- #3 variable-ref ref=c value=+ 7 offset=231661
  context: Given the functions [[slot]] and [[slot]], what is the domain of the combined function [[slot]]?
- #4 variable-ref ref=ans value=–2 offset=231721
  context: [[slot]]
- #5 variable-ref ref=dis2 value=–9 offset=231733
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=231743
  context: [[slot]]

## record-15 @ 236899

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | multiply functions | domain
- Counts: strings=150, variables=3, display=9, refs=42, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]]. A. [[slot]] C. [[slot]] B. cannot be determined D. [[slot]]
```

Choices:
- A. [[slot]]
- B. cannot be determined
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 8  rule: `range(2,9)`
- b = 7  rule: `range(1,9)`
- dis_b = –7  rule: `-1*b`

Inline slots:
- #1 variable-ref ref=a value=8 offset=237461
  context: Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]].
- #2 variable-ref ref=b value=7 offset=237473
  context: Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]].
- #3 variable-ref ref=dis_b value=–7 offset=237571
  context: Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]].
- #4 variable-ref ref=b value=7 offset=237583
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=237593
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=237653
  context: [[slot]]

## record-16 @ 242449

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | domain
- Counts: strings=176, variables=8, display=9, refs=46, slots=7, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 7  rule: `range(2,9)`
- b = – 3  rule: `x1+x2`
- dis_c = 54  rule: `-1*c`
- c = – 54  rule: `x1*x2`
- x1 = –9  rule: `range(-9,9)`
- x2 = 6  rule: `range(-9,9)`
- ans1 = 9  rule: `-1*x1`
- ans2 = –6  rule: `-1*x2`

Inline slots:
- #1 variable-ref ref=a value=7 offset=243501
  context: Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]].
- #2 variable-ref ref=c value=– 54 offset=243513
  context: Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]].
- #3 variable-ref ref=a value=7 offset=243611
  context: Given the functions [[slot]] and [[slot]], determine the domain of the combined function [[slot]].
- #4 variable-ref ref=a value=7 offset=243623
  context: [[slot]]
- #5 variable-ref ref=b value=– 3 offset=243633
  context: [[slot]]
- #6 variable-ref ref=c value=– 54 offset=243645
  context: [[slot]]
- #7 variable-ref ref=dis_c value=54 offset=243655
  context: [[slot]]

## record-17 @ 249365

- Metadata: Easy | Section 10.3 | RF1 | Composite Functions | composite functions | domain
- Counts: strings=140, variables=3, display=9, refs=37, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]], what is the domain of the composite function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. cannot be determined
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. cannot be determined

Variables:
- a = 5  rule: `range(2,9)`
- b = 4  rule: `range(1,9)`
- dis_b = –4  rule: `-1*b`

Inline slots:
- #1 variable-ref ref=a value=5 offset=249891
  context: Given the functions [[slot]] and [[slot]], what is the domain of the composite function [[slot]]?
- #2 variable-ref ref=b value=4 offset=249903
  context: Given the functions [[slot]] and [[slot]], what is the domain of the composite function [[slot]]?
- #3 variable-ref ref=dis_b value=–4 offset=249999
  context: Given the functions [[slot]] and [[slot]], what is the domain of the composite function [[slot]]?
- #4 variable-ref ref=b value=4 offset=250011
  context: [[slot]]
- #5 variable-ref ref=a value=5 offset=250021
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=250033
  context: [[slot]]

## record-18 @ 254611

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | range
- Counts: strings=164, variables=8, display=9, refs=41, slots=7, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], determine the range of the combined function [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- f = 1  rule: `rand(2)`
- func = sin  rule: `if(f=1,"sin","cos")`
- a = –7  rule: `range(-9,9)`
- b = 7  rule: `range(-9,9)`
- ans1 = 0  rule: `a+abs(b)`
- ans2 = –14  rule: `a-abs(b)`
- dis1 = 7  rule: `abs(b)`
- dis2 = –7  rule: `-1*dis1`

Inline slots:
- #1 variable-ref ref=b value=7 offset=255611
  context: Given the functions [[slot]] and [[slot]], determine the range of the combined function [[slot]].
- #2 variable-ref ref=b value=7 offset=255623
  context: Given the functions [[slot]] and [[slot]], determine the range of the combined function [[slot]].
- #3 variable-ref ref=func value=sin offset=255719
  context: Given the functions [[slot]] and [[slot]], determine the range of the combined function [[slot]].
- #4 variable-ref ref=a value=–7 offset=255731
  context: [[slot]]
- #5 variable-ref ref=a value=–7 offset=255741
  context: [[slot]]
- #6 variable-ref ref=a value=–7 offset=255753
  context: [[slot]]
- #7 variable-ref ref=a value=–7 offset=255763
  context: [[slot]]

## record-19 @ 260487

- Metadata: Average | Section 10.2 | RF1 | Composite Functions | composite functions | notation
- Counts: strings=140, variables=3, display=9, refs=33, slots=7, visibleChoices=4

```text
Given the functions [[slot]] and [[slot]], what is the simplified form of [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 3  rule: `range(1,9)`
- b = – 8  rule: `1-a^2`
- restrict = –3  rule: `-1*a`

Inline slots:
- #1 variable-ref ref=a value=3 offset=261085
  context: Given the functions [[slot]] and [[slot]], what is the simplified form of [[slot]]?
- #2 variable-ref ref=a value=3 offset=261097
  context: Given the functions [[slot]] and [[slot]], what is the simplified form of [[slot]]?
- #3 variable-ref ref=b value=– 8 offset=261165
  context: Given the functions [[slot]] and [[slot]], what is the simplified form of [[slot]]?
- #4 variable-ref ref=a value=3 offset=261177
  context: [[slot]]
- #5 variable-ref ref=b value=– 8 offset=261187
  context: [[slot]]
- #6 variable-ref ref=a value=3 offset=261199
  context: [[slot]]
- #7 variable-ref ref=a value=3 offset=261209
  context: [[slot]]

## record-20 @ 265827

- Metadata: Easy | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | domain | restrictions
- Counts: strings=193, variables=5, display=9, refs=55, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
If [[slot]] and [[slot]], what are the restrictions on the domain for the combined function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] [[slot]]

Variables:
- a = –7  rule: `range(-9,9)`
- b = 5  rule: `range(1,9)`
- c = 9  rule: `range(1,9)`
- ans = 81  rule: `c^2`
- dis1 = 3  rule: `sqrs(c)`

Inline slots:
- #1 variable-ref ref=a value=–7 offset=266571
  context: If [[slot]] and [[slot]], what are the restrictions on the domain for the combined function [[slot]]?
- #2 variable-ref ref=a value=–7 offset=266583
  context: If [[slot]] and [[slot]], what are the restrictions on the domain for the combined function [[slot]]?
- #3 variable-ref ref=b value=5 offset=266721
  context: [[slot]] and [[slot]], what are the restrictions on the domain for the combined function [[slot]]?
- #4 variable-ref ref=c value=9 offset=266733
  context: [[slot]]
- #5 variable-ref ref=ans value=81 offset=266743
  context: [[slot]]
- #6 variable-ref ref=ans value=81 offset=266755
  context: [[slot]]
- #7 variable-ref ref=dis1 value=3 offset=266765
  context: [[slot]] [[slot]]
- #8 unknown-object ref=- value=- offset=266769
  context: [[slot]] [[slot]]

## record-21 @ 272447

- Metadata: Easy | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | domain
- Counts: strings=214, variables=7, display=9, refs=67, slots=7, visibleChoices=4

```text
If [[slot]] and [[slot]], what is the simplified combined function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –3  rule: `range(-9,9)`
- b = 1  rule: `range(1,9)`
- c = 5  rule: `range(1,9)`
- d = + 14  rule: `-(a*c+b)`
- dis1 = 1/5  rule: `sqrs(c)`
- e = 5  rule: `b*c`
- f = 25  rule: `c^2`

Inline slots:
- #1 variable-ref ref=a value=–3 offset=273289
  context: If [[slot]] and [[slot]], what is the simplified combined function [[slot]]?
- #2 variable-ref ref=b value=1 offset=273301
  context: If [[slot]] and [[slot]], what is the simplified combined function [[slot]]?
- #3 variable-ref ref=d value=+ 14 offset=273389
  context: If [[slot]] and [[slot]], what is the simplified combined function [[slot]]?
- #4 variable-ref ref=d value=+ 14 offset=273401
  context: [[slot]]
- #5 variable-ref ref=d value=+ 14 offset=273411
  context: [[slot]]
- #6 variable-ref ref=d value=+ 14 offset=273423
  context: [[slot]]
- #7 variable-ref ref=c value=5 offset=273433
  context: [[slot]]

## record-22 @ 279774

- Metadata: Average | Section 10.1 | RF1 | Sums and Differences of Functions | add functions
- Counts: strings=215, variables=9, display=9, refs=67, slots=7, visibleChoices=4

```text
Given [[slot]] and [[slot]], determine [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 9  rule: `range(2,9)`
- b = 7  rule: `range(2,9)`
- c = 2  rule: `range(2,9)`
- d = 5  rule: `range(2,6)`
- e = 12  rule: `d+b`
- f = 10  rule: `d*c`
- dis1 = 6  rule: `b-1`
- dis2 = 45  rule: `d*a`
- dis3 = 36  rule: `d*b+1`

Inline slots:
- #1 variable-ref ref=a value=9 offset=280798
  context: Given [[slot]] and [[slot]], determine [[slot]].
- #2 variable-ref ref=b value=7 offset=280810
  context: Given [[slot]] and [[slot]], determine [[slot]].
- #3 variable-ref ref=d value=5 offset=280836
  context: Given [[slot]] and [[slot]], determine [[slot]].
- #4 variable-ref ref=d value=5 offset=280848
  context: [[slot]]
- #5 variable-ref ref=d value=5 offset=280858
  context: [[slot]]
- #6 variable-ref ref=d value=5 offset=280870
  context: [[slot]]
- #7 variable-ref ref=c value=2 offset=280880
  context: [[slot]]

## record-23 @ 286385

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | evaluate
- Counts: strings=128, variables=6, display=9, refs=17, slots=6, visibleChoices=4

```text
Given the function [[slot]], determine the value of [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = – 5  rule: `range(-9,9)`
- b = –1  rule: `range(-10,10)`
- init_ans = –4  rule: `b^2+a`
- ans = 11  rule: `(init_ans)^2+a`
- dis = 16  rule: `(init_ans)^2`
- dis2 = –8  rule: `2*init_ans`

Inline slots:
- #1 variable-ref ref=a value=– 5 offset=287317
  context: Given the function [[slot]], determine the value of [[slot]].
- #2 variable-ref ref=b value=–1 offset=287369
  context: Given the function [[slot]], determine the value of [[slot]].
- #3 variable-ref ref=dis2 value=–8 offset=287381
  context: [[slot]]
- #4 variable-ref ref=ans value=11 offset=287391
  context: [[slot]]
- #5 variable-ref ref=dis value=16 offset=287403
  context: [[slot]]
- #6 variable-ref ref=init_ans value=–4 offset=287413
  context: [[slot]]

## record-24 @ 290722

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | transformations | graph
- Counts: strings=192, variables=4, display=9, refs=50, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]] [[slot]][[slot]], which of the following is most likely the graph of [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a_num = 2  rule: `range(-9,9)`
- a_denom = –6  rule: `range(-9,9)`
- a = -1/3  rule: `fracs(a_num,a_denom)`
- b = – 5  rule: `range(-5,5)`

Inline slots:
- #1 variable-ref ref=a value=-1/3 offset=291596
  context: Given the functions [[slot]] and [[slot]] [[slot]][[slot]], which of the following is most likely the graph of [[slot]
- #2 variable-ref ref=a value=-1/3 offset=291608
  context: Given the functions [[slot]] and [[slot]] [[slot]][[slot]], which of the following is most likely the graph of [[slot]]?
- #3 variable-ref ref=a value=-1/3 offset=291612
  context: Given the functions [[slot]] and [[slot]] [[slot]][[slot]], which of the following is most likely the graph of [[slot]]?
- #4 variable-ref ref=b value=– 5 offset=291614
  context: Given the functions [[slot]] and [[slot]] [[slot]][[slot]], which of the following is most likely the graph of [[slot]]?
- #5 diagram-object ref=- value=- offset=291722
  context: [slot]] and [[slot]] [[slot]][[slot]], which of the following is most likely the graph of [[slot]]?
- #6 unknown-object ref=- value=- offset=291734
  context: [[slot]]
- #7 unknown-object ref=- value=- offset=291744
  context: [[slot]]
- #8 unknown-object ref=- value=- offset=291756
  context: [[slot]]
- #9 unknown-object ref=- value=- offset=291766
  context: [[slot]]

## record-25 @ 313138

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | transformations | graph
- Counts: strings=166, variables=1, display=9, refs=47, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the functions [[slot]] and [[slot]], which of the following is most likely the graph of [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = + 4  rule: `range(-4,4)`

Inline slots:
- #1 variable-ref ref=a value=+ 4 offset=313634
  context: Given the functions [[slot]] and [[slot]], which of the following is most likely the graph of [[slot]]?
- #2 variable-ref ref=a value=+ 4 offset=313646
  context: Given the functions [[slot]] and [[slot]], which of the following is most likely the graph of [[slot]]?
- #3 variable-ref ref=a value=+ 4 offset=313754
  context: n the functions [[slot]] and [[slot]], which of the following is most likely the graph of [[slot]]?
- #4 unknown-object ref=- value=- offset=313766
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=313776
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=313788
  context: [[slot]]
- #7 unknown-object ref=- value=- offset=313798
  context: [[slot]]

## record-26 @ 334479

- Metadata: Average | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | graph
- Counts: strings=27, variables=0, display=1, refs=9, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=334705
  context: [[slot]]

## record-27 @ 336136

- Metadata: Average | Section 10.1 | RF1 | Sums and Differences of Functions | subtract functions | graph
- Counts: strings=27, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=336372
  context: [[slot]]

## record-28 @ 337803

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | multiply functions | graph
- Counts: strings=27, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=338043
  context: [[slot]]

## record-29 @ 339473

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | graph
- Counts: strings=26, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=339709
  context: [[slot]]

## record-30 @ 341192

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | graph
- Counts: strings=27, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=341402
  context: [[slot]]

## record-31 @ 342765

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | graph
- Counts: strings=27, variables=0, display=1, refs=9, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=342975
  context: [[slot]]

## record-32 @ 344338

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | add functions
- Counts: strings=90, variables=7, display=1, refs=23, slots=5, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
If [[slot]] is a [[slot]] function with positive coefficients and [[slot]] is a [[slot]] function with positive coefficients, then [[slot]] is a _______________ function.
```

Variables:
- n = 2  rule: `rand(2)`
- opp = 1  rule: `if(n=1,0,1)`
- n1 = 2  rule: `rand(2)`
- n2 = 1  rule: `rand(2)`
- f1 = quadratic  rule: `if(n1=1,"linear","quadratic")`
- f2 = linear  rule: `if(n2=1,"linear","quadratic")`
- ans = quadratic  rule: `if(n1+n2=2,"linear","quadratic")`

Inline slots:
- #1 variable-ref ref=f1 value=quadratic offset=345200
  context: If [[slot]] is a [[slot]] function with positive coefficients and [[slot]] is a [[slot]] function wit
- #2 variable-ref ref=f2 value=linear offset=345214
  context: If [[slot]] is a [[slot]] function with positive coefficients and [[slot]] is a [[slot]] function with positive coe
- #3 variable-ref ref=ans value=quadratic offset=345298
  context: If [[slot]] is a [[slot]] function with positive coefficients and [[slot]] is a [[slot]] function with positive coefficients, then [[slot]] is a _______________ fun
- #4 math-object ref=- value=- offset=345312
  context: If [[slot]] is a [[slot]] function with positive coefficients and [[slot]] is a [[slot]] function with positive coefficients, then [[slot]] is a _______________ function.
- #5 math-object ref=- value=- offset=345400
  context: ositive coefficients and [[slot]] is a [[slot]] function with positive coefficients, then [[slot]] is a _______________ function.

## record-33 @ 348759

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | multiply functions
- Counts: strings=90, variables=9, display=1, refs=22, slots=5, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
If [[slot]] is a [[slot]] function and [[slot]] is a [[slot]] function, then [[slot]] is a _______________ function.
```

Variables:
- n = 1  rule: `rand(2)`
- opp = 0  rule: `if(n=1,0,1)`
- n1 = 1  rule: `rand(2)`
- n2 = 1  rule: `rand(2)`
- f1 = linear  rule: `if(n1=1,"linear","quadratic")`
- f2 = linear  rule: `if(n2=1,"linear","quadratic")`
- linear = ?  rule: `5`
- ans = quadratic  rule: `if(n1+n2=2,"quadratic",if(n1+n2=3,"cubic","quartic"))`
- quadratic = ?  rule: `Q`

Inline slots:
- #1 variable-ref ref=f1 value=linear offset=349677
  context: If [[slot]] is a [[slot]] function and [[slot]] is a [[slot]] function, then [[slot]] is a __________
- #2 variable-ref ref=f2 value=linear offset=349691
  context: If [[slot]] is a [[slot]] function and [[slot]] is a [[slot]] function, then [[slot]] is a _______________ function
- #3 variable-ref ref=ans value=quadratic offset=349721
  context: If [[slot]] is a [[slot]] function and [[slot]] is a [[slot]] function, then [[slot]] is a _______________ function.
- #4 math-object ref=- value=- offset=349735
  context: If [[slot]] is a [[slot]] function and [[slot]] is a [[slot]] function, then [[slot]] is a _______________ function.
- #5 math-object ref=- value=- offset=349769
  context: If [[slot]] is a [[slot]] function and [[slot]] is a [[slot]] function, then [[slot]] is a _______________ function.

## record-34 @ 353127

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | domain
- Counts: strings=125, variables=4, display=2, refs=41, slots=3, visibleChoices=1

```text
abs(a)>1 and abs(b)>1 and b+a<0 If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________.
```

Choices:
- A. If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________.

Variables:
- a = – 4  rule: `range(-9,9)`
- b = – 3  rule: `range(-9,9)`
- c = 7  rule: `-(b+a)`
- domain = 1/7  rule: `sqrs(c)`

Inline slots:
- #1 variable-ref ref=a value=– 4 offset=353749
  context: If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________.
- #2 variable-ref ref=b value=– 3 offset=353761
  context: If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________.
- #3 variable-ref ref=c value=7 offset=353831
  context: If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________.

## record-35 @ 358762

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | domain
- Counts: strings=89, variables=3, display=2, refs=29, slots=3, visibleChoices=1

```text
abs(a)>1 and abs(b)>1 If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________.
```

Choices:
- B. If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________.

Variables:
- a = – 8  rule: `range(-9,9)`
- b = + 4  rule: `range(-9,9)`
- ans = 8  rule: `-1*a`

Inline slots:
- #1 variable-ref ref=a value=– 8 offset=359282
  context: If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________ .
- #2 variable-ref ref=b value=+ 4 offset=359294
  context: If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________ .
- #3 variable-ref ref=ans value=8 offset=359364
  context: If [[slot]] and [[slot]], then the domain of the function [[slot]] is _______________ .

## record-36 @ 362873

- Metadata: Difficult | Section 10.3 | RF1 | Composite Functions | composite functions
- Counts: strings=130, variables=5, display=1, refs=42, slots=4, visibleChoices=0

```text
If [[slot]], and [[slot]], then [[slot]] = _____________ and [[slot]] = _______________.
```

Variables:
- n = 3  rule: `rand(3)`
- ans = tan  rule: `if(n=1,"sin",if(n=2,"cos","tan"))`
- tan = ?  rule: `!`
- func = cot  rule: `if(n=1,"csc",if(n=2,"sec","cot"))`
- a = 7  rule: `range(1,9)`

Inline slots:
- #1 variable-ref ref=a value=7 offset=363461
  context: If [[slot]], and [[slot]], then [[slot]] = _____________ and [[slot]] = _______________.
- #2 variable-ref ref=func value=cot offset=363475
  context: If [[slot]], and [[slot]], then [[slot]] = _____________ and [[slot]] = _______________.
- #3 variable-ref ref=a value=7 offset=363491
  context: If [[slot]], and [[slot]], then [[slot]] = _____________ and [[slot]] = _______________.
- #4 variable-ref ref=ans value=tan offset=363535
  context: If [[slot]], and [[slot]], then [[slot]] = _____________ and [[slot]] = _______________.

## record-37 @ 368106

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | add functions
- Counts: strings=84, variables=0, display=1, refs=31, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=368350
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #2 math-object ref=- value=- offset=368362
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #3 math-object ref=- value=- offset=368440
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].

## record-38 @ 372033

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | subtract functions
- Counts: strings=85, variables=0, display=1, refs=29, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=372287
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #2 math-object ref=- value=- offset=372299
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #3 math-object ref=- value=- offset=372377
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].

## record-39 @ 376076

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | multiply functions
- Counts: strings=85, variables=0, display=1, refs=28, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=376340
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #2 math-object ref=- value=- offset=376352
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #3 math-object ref=- value=- offset=376430
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].

## record-40 @ 380167

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | restrictions
- Counts: strings=92, variables=0, display=1, refs=28, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=380457
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #2 math-object ref=- value=- offset=380469
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
- #3 math-object ref=- value=- offset=380547
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].

## record-41 @ 384776

- Metadata: Difficult | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | graph
- Counts: strings=93, variables=0, display=1, refs=31, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) Graph the functions [[slot]] and [[slot]] on the grid.b) Graph the function [[slot]] on the same grid.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=385052
  context: a) Graph the functions [[slot]] and [[slot]] on the grid. b) Graph the function [[slot]] on the same grid. [[slot]]
- #2 math-object ref=- value=- offset=385064
  context: a) Graph the functions [[slot]] and [[slot]] on the grid. b) Graph the function [[slot]] on the same grid. [[slot]]
- #3 math-object ref=- value=- offset=385138
  context: a) Graph the functions [[slot]] and [[slot]] on the grid. b) Graph the function [[slot]] on the same grid. [[slot]]
- #4 math-object ref=- value=- offset=385178
  context: tions [[slot]] and [[slot]] on the grid. b) Graph the function [[slot]] on the same grid. [[slot]]

## record-42 @ 398547

- Metadata: Average | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | domain
- Counts: strings=59, variables=0, display=1, refs=17, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the domain and range of the function [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=398879
  context: Determine the domain and range of the function [[slot]].

## record-43 @ 401932

- Metadata: Difficult | Section 10.3 | RF1 | Composite Functions | composite functions | evaluate
- Counts: strings=85, variables=0, display=1, refs=26, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine the value of [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=402192
  context: Given the functions [[slot]] and [[slot]], determine the value of [[slot]].
- #2 unknown-object ref=- value=- offset=402204
  context: Given the functions [[slot]] and [[slot]], determine the value of [[slot]].
- #3 unknown-object ref=- value=- offset=402256
  context: Given the functions [[slot]] and [[slot]], determine the value of [[slot]].

## record-44 @ 405964

- Metadata: Difficult | Section 10.2 | RF1 | Products and Quotients of Functions | multiply functions | graph
- Counts: strings=136, variables=5, display=1, refs=11, slots=1, visibleChoices=0

```text
Determine the equation(s) of the vertical asymptote(s) of the function [[slot]].
```

Variables:
- d = ?  rule: `-`
- x = 1  rule: `2`
- y = 8  rule: `!`
- inf = -inf  rule: `sin(x)*(2^(x^2+1))`
- RF1 = divide functions | vertical asymptotes  rule: `Products and Quotients of Functions`

Inline slots:
- #1 variable-ref ref=x value=1 offset=420245
  context: Determine the equation(s) of the vertical asymptote(s) of the function [[slot]].

## record-45 @ 422958

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | evaluate
- Counts: strings=112, variables=0, display=1, refs=32, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], what is the value of [[slot]]?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=423214
  context: Given the functions [[slot]] and [[slot]], what is the value of [[slot]]?
- #2 unknown-object ref=- value=- offset=423226
  context: Given the functions [[slot]] and [[slot]], what is the value of [[slot]]?
- #3 unknown-object ref=- value=- offset=423274
  context: Given the functions [[slot]] and [[slot]], what is the value of [[slot]]?

## record-46 @ 427833

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | evaluate
- Counts: strings=86, variables=0, display=1, refs=28, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=428089
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]] .
- #2 math-object ref=- value=- offset=428101
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]] .
- #3 math-object ref=- value=- offset=428179
  context: Given the functions [[slot]] and [[slot]], determine a simplified equation for [[slot]] .

## record-47 @ 431750

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions
- Counts: strings=86, variables=0, display=1, refs=27, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine the equation for [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=431984
  context: Given the functions [[slot]] and [[slot]], determine the equation for [[slot]].
- #2 math-object ref=- value=- offset=431996
  context: Given the functions [[slot]] and [[slot]], determine the equation for [[slot]].
- #3 math-object ref=- value=- offset=432056
  context: Given the functions [[slot]] and [[slot]], determine the equation for [[slot]].

## record-48 @ 435700

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions
- Counts: strings=89, variables=0, display=1, refs=25, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], what values of x result in [[slot]]?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=435934
  context: Given the functions [[slot]] and [[slot]], what values of x result in [[slot]]?
- #2 unknown-object ref=- value=- offset=435946
  context: Given the functions [[slot]] and [[slot]], what values of x result in [[slot]]?
- #3 unknown-object ref=- value=- offset=436006
  context: Given the functions [[slot]] and [[slot]], what values of x result in [[slot]]?

## record-49 @ 439698

- Metadata: Difficult | Section 10.3 | RF1 | Composite Functions | composite functions
- Counts: strings=78, variables=0, display=1, refs=25, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], determine all possible values of x for which [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=439936
  context: Given the functions [[slot]] and [[slot]], determine all possible values of x for which [[slot]].
- #2 unknown-object ref=- value=- offset=439948
  context: Given the functions [[slot]] and [[slot]], determine all possible values of x for which [[slot]].
- #3 unknown-object ref=- value=- offset=440044
  context: Given the functions [[slot]] and [[slot]], determine all possible values of x for which [[slot]].

## record-50 @ 443580

- Metadata: Difficult | Section 10.2 | RF1 | Products and Quotients of Functions | divide functions | vertical asymptotes | hole
- Counts: strings=99, variables=0, display=1, refs=27, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], graph the function [[slot]]. Label all intercepts and identify any asymptotes and/or points of discontinuity.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=443902
  context: Given the functions [[slot]] and [[slot]], graph the function [[slot]]. Label all intercepts and identify any asymptot
- #2 math-object ref=- value=- offset=443914
  context: Given the functions [[slot]] and [[slot]], graph the function [[slot]]. Label all intercepts and identify any asymptotes and/or poi
- #3 math-object ref=- value=- offset=443958
  context: Given the functions [[slot]] and [[slot]], graph the function [[slot]]. Label all intercepts and identify any asymptotes and/or points of discontinuity. [[slot]
- #4 unknown-object ref=- value=- offset=444126
  context: [slot]]. Label all intercepts and identify any asymptotes and/or points of discontinuity. [[slot]]

## record-51 @ 461150

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | domain | range
- Counts: strings=40, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
What are the domain and range of the function [[slot]], where x is in radians?
```

Inline slots:
- #1 math-object ref=- value=- offset=461470
  context: What are the domain and range of the function [[slot]], where x is in radians?

## record-52 @ 463965

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | domain | range
- Counts: strings=80, variables=0, display=1, refs=23, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given that [[slot]] and [[slot]], what are the domain and range of the function f(g(x))?
```

Inline slots:
- #1 math-object ref=- value=- offset=464215
  context: Given that [[slot]] and [[slot]], what are the domain and range of the function f(g(x))?
- #2 math-object ref=- value=- offset=464227
  context: Given that [[slot]] and [[slot]], what are the domain and range of the function f(g(x))?

## record-53 @ 468054

- Metadata: Easy | Section 10.3 | RF1 | Composite Functions | composite functions
- Counts: strings=67, variables=0, display=1, refs=20, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the equation for the composite function [[slot]] given that [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=468342
  context: Determine the equation for the composite function [[slot]] given that [[slot]].
- #2 math-object ref=- value=- offset=468368
  context: Determine the equation for the composite function [[slot]] given that [[slot]].

## record-54 @ 471401

- Metadata: Average | Section 10.1 | RF1 | Sums and Differences of Functions | subtract functions
- Counts: strings=121, variables=0, display=1, refs=44, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The revenue function for a school group selling n bookmarks is given by [[slot]], and the total cost function is given by [[slot]]. Determine the number of bookmarks that need to be sold for the school group to break even.
```

Inline slots:
- #1 math-object ref=- value=- offset=471765
  context: The revenue function for a school group selling n bookmarks is given by [[slot]], and the total cost function is given by [[slot]]. Determine the number of bookmarks that
- #2 math-object ref=- value=- offset=471851
  context: l group selling n bookmarks is given by [[slot]], and the total cost function is given by [[slot]]. Determine the number of bookmarks that need to be sold for the school group to break eve

## record-55 @ 476868

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | combined function | difference | graph
- Counts: strings=82, variables=0, display=1, refs=24, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]].[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=477162
  context: Given the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]
- #2 math-object ref=- value=- offset=477174
  context: Given the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]
- #3 math-object ref=- value=- offset=477264
  context: Given the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]
- #4 math-object ref=- value=- offset=477270
  context: the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]

## record-56 @ 486977

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | graph | transformations
- Counts: strings=127, variables=0, display=1, refs=30, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given the graphs of the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]].[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=487291
  context: Given the graphs of the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]
- #2 math-object ref=- value=- offset=487303
  context: Given the graphs of the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]
- #3 math-object ref=- value=- offset=487393
  context: graphs of the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]
- #4 math-object ref=- value=- offset=487399
  context: the functions [[slot]] and [[slot]], sketch the graph of the combined function [[slot]]. [[slot]]

## record-57 @ 513566

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | profit function | subtract functions
- Counts: strings=238, variables=0, display=1, refs=85, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The revenue function for a company selling n key chains is given by [[slot]], and the total cost function is given by [[slot]]. Determine the simplified equation for [[slot]], the profit function for the company.
```

Inline slots:
- #1 math-object ref=- value=- offset=513952
  context: The revenue function for a company selling n key chains is given by [[slot]], and the total cost function is given by [[slot]]. Determine the simplified equation for
- #2 math-object ref=- value=- offset=514038
  context: ompany selling n key chains is given by [[slot]], and the total cost function is given by [[slot]]. Determine the simplified equation for [[slot]], the profit function for the company.
- #3 math-object ref=- value=- offset=514120
  context: , and the total cost function is given by [[slot]]. Determine the simplified equation for [[slot]], the profit function for the company.

## record-58 @ 533691

- Metadata: Difficult | Section 10.1 | RF1 | Sums and Differences of Functions | add functions | subtract functions
- Counts: strings=123, variables=0, display=5, refs=50, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Jenny and Jimmy are a married couple who work at the same store. Jimmy s total weekly salary, in dollars, if he sells x items is given by [[slot]], and Jenny s total weekly salary, in dollars, if she sells x items is given by [[slot]].a) Assuming that they sell the same number of items in a week, what is the minimum number of items they have to sell so that Jenny s weekly salary is at least $100 more than Jimmy s?b) Assuming that they sell the same number of items in a week, what is the minimum number of items they each need to sell to make their combined weekly salary greater than $1000?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=534223
  context: s total weekly salary, in dollars, if he sells x items is given by [[slot]], and Jenny
- #2 unknown-object ref=- value=- offset=534385
  context: s total weekly salary, in dollars, if she sells x items is given by [[slot]]. a) Assuming that they sell the same number of items in a week, what is the minimum numbe

## record-59 @ 540374

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | subtract functions
- Counts: strings=105, variables=0, display=1, refs=40, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The revenue function for a company selling n coffee mugs can be modelled by the function [[slot]], and the total cost function can be modelled by the function [[slot]].a) Determine a simplified equation for [[slot]], the profit function for the company.b) How many coffee mugs must be sold to make a profit of $1000?
```

Inline slots:
- #1 math-object ref=- value=- offset=540766
  context: The revenue function for a company selling n coffee mugs can be modelled by the function [[slot]], and the total cost function can be modelled by the function [[slot]]. a) Determine a sim
- #2 math-object ref=- value=- offset=540892
  context: led by the function [[slot]], and the total cost function can be modelled by the function [[slot]]. a) Determine a simplified equation for [[slot]], the profit function for the company. b)
- #3 math-object ref=- value=- offset=540976
  context: function can be modelled by the function [[slot]]. a) Determine a simplified equation for [[slot]], the profit function for the company. b) How many coffee mugs must be sold to make a prof

## record-60 @ 545518

- Metadata: Easy | Section 10.1 | RF1 | Sums and Differences of Functions | subtract functions | graph
- Counts: strings=35, variables=0, display=1, refs=5, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The heights, h, of two balls, in metres, for a horizontal distance of x metres are shown in the graph. [[slot]]What was the difference in height of the two balls when the horizontal distance was 0 m?
```

Inline slots:
- #1 diagram-object ref=- value=- offset=545956
  context: , of two balls, in metres, for a horizontal distance of x metres are shown in the graph. [[slot]] What was the difference in height of the two balls when the horizontal distance was 0 m?

## record-61 @ 553826

- Metadata: Average | Section 10.1 | RF1 | Sums and Differences of Functions | add functions
- Counts: strings=202, variables=0, display=1, refs=54, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The dimensions of a window are shown.[[slot]] a) What function in simplest form represents the area of the entire window?b) If the width, x, of the window is 1.2 m, what is the total area of the window, to the nearest tenth of a square metre?
```

Inline slots:
- #1 math-object ref=- value=- offset=554112
  context: The dimensions of a window are shown. [[slot]] a) What function in simplest form represents the area of the entire window? b) If the wi

## record-62 @ 600153

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | depreciation
- Counts: strings=106, variables=0, display=1, refs=38, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A vehicle depreciates 20% in value in the first year and 10% in each year after the first.a) Write a function, [[slot]], to describe the value of the vehicle after 1 year in terms of the original cost, c.b) Write a function, [[slot]], to describe the value after n years in terms of the original cost, c.c) If the original value of the vehicle is $45 000, what is its value after 5 years?
```

Inline slots:
- #1 math-object ref=- value=- offset=600601
  context: 20% in value in the first year and 10% in each year after the first. a) Write a function, [[slot]], to describe the value of the vehicle after 1 year in terms of the original cost, c. b) W
- #2 math-object ref=- value=- offset=600817
  context: value of the vehicle after 1 year in terms of the original cost, c. b) Write a function, [[slot]], to describe the value after n years in terms of the original cost, c. c) If the original

## record-63 @ 606104

- Metadata: Average | Section 10.3 | RF1 | Composite Functions | composite functions | area of circle
- Counts: strings=247, variables=4, display=1, refs=51, slots=0, visibleChoices=0

```text
For the following question(s), assume that x is in radians, if applicable.
```

Variables:
- r = ?  rule: `2`
- d = ?  rule: `-`
- p = 2  rule: `2`
- radians = ?  rule: `J`

